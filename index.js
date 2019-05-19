const LINE_WIDTH = 45;
const ARTICLE_LENGTH = 340;

function tokenize(str) {
    // This regular expression uses a positive lookbehind to split on
    // whitespace without consuming the whitespace, i.e. trailing whitespace is
    // maintained in the resulting elements.
    return str.split(/(?<=[ \t\n\r]+)/g);
}

function tokenToTokenElement(token) {
    return "<span class='token'>" +
        Array.prototype.map.call(token, (tu) =>
            "<span class='token-unit'>" + tu + "</span>"
        ).join("") +
        "</span>";
}

function tokenElementsToLine(elems) {
    return "<span class='line'>" + elems + "</span>";
}

function appendLineToArticleContent(line) {
    $("#article-content").append("<span class='line'>" + line + "</span>");
}

function setArticleTitle(title, url) {
    $("title").text(title + " - WikiType");
    if (url !== undefined) {
        title = "<a href='" + url + "'>" + title + "</a>";
    }
    var article_title = $("#article-title");
    article_title.empty();
    article_title.append(title);
}

function displayResults() {
    $("body").append("<hr>");
    $("body").append("<h1 id='results'>Exercise complete</h1>");
    $("body").append("<h2>Summary</h2>");
    $("body").append("<ul></ul>");

    var accuracy = $(".correct,.fixed").length / $(".token-unit").length * 100;
    var real_accuracy = $(".correct").length / $(".token-unit").length * 100;
    if (isNaN(accuracy)) {
        accuracy = 0;
    }
    if (isNaN(real_accuracy)) {
        real_accuracy = 0;
    }
    accuracy = accuracy.toFixed(2);
    real_accuracy = real_accuracy.toFixed(2);
    $("body ul").append("<li><b>Accuracy</b>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + accuracy + '%</li>');
    $("body ul").append("<li><b>Real accuracy</b>: " + real_accuracy + "%</li>");

    document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function initializeExercise(title, url) {
    // define actions to perform on completion
    var onCompletion = () => {
        $("#article-content").off("keydown"); // disable additional input
        displayResults();
    };
    var cursor = new Cursor(onCompletion);

    // NOTE: I believe we need to wrap `cursor.processKeyDown` in another lambda
    // because the wrapper lambda captures the Cursor object that we've defined.
    //
    // Otherwise, `this` does not refer to the Cursor object in the instance
    // methods. This is a quirk of how JavaScript defines the `this` keyword.
    $("#article-content").keydown((event) => {
        cursor.processKeyDown(event);
        if (event.key === " ") {
            // don't scroll the page when a space is entered
            return false;
        }
    });

    setArticleTitle(title, url);
}

function initializeExerciseFromJSON(data) {
    if (data.type === "disambiguation") {
        // TODO
        console.log("Disambiguation:");
        console.log(data);
    }

    // clear any existing article content
    $("#article-content").empty();

    // take the first roughly ARTICLE_LENGTH characters worth of sentences from
    // the article data
    console.assert(data.extract.length > 0, "Article content fetched has length 0.");
    var extract = data.extract.split(/(?<=[.] )/g);
    var num_sentences = 1;
    var article_length = extract[0].length;
    for (; num_sentences < extract.length && article_length < ARTICLE_LENGTH; num_sentences++) {
        article_length += extract[num_sentences].length;
    }
    var tokens = tokenize(extract.slice(0, num_sentences).join("").trim());

    var curr_line = tokenToTokenElement(tokens[0]);
    var curr_line_width = tokens[0].length;
    for (var i = 1; i < tokens.length; i++) {
        if (curr_line_width + tokens[i].length < LINE_WIDTH) {
            // We haven't exceeded the maximum line width. Append a new token
            // to the current line.
            curr_line += tokenToTokenElement(tokens[i]);
            curr_line_width += tokens[i].length;
        } else {
            appendLineToArticleContent(curr_line);
            curr_line = tokenToTokenElement(tokens[i]);
            curr_line_width = tokens[i].length;
        }
    }
    appendLineToArticleContent(curr_line);

    initializeExercise(data.titles.display, data.content_urls.desktop.page);
}

// load a sample extract and convert it into an exercise
Page.getJSONRandomSummary((data) => initializeExerciseFromJSON(data));

$("#requested-article").keyup((event) => {
    if (event.key === "Enter") {
        var requested_article = $("#requested-article").val();
        (new Page(requested_article)).getJSONSummary((data) => initializeExerciseFromJSON(data));
        $("#article-content").focus();
    }
});

$("#article-content").focus();
