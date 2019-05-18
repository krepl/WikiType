function displayResults() {
    $("body").append('<hr>');
    $("body").append('<h1 id="results">Exercise complete</h1>');
    $("body").append('<h2>Summary</h2>');
    $("body").append('<ul></ul>');

    var accuracy = $('.correct,.fixed').length / $('.token-unit').length * 100;
    var real_accuracy = $('.correct').length / $('.token-unit').length * 100;
    if (isNaN(accuracy)) {
        accuracy = 0;
    }
    if (isNaN(real_accuracy)) {
        real_accuracy = 0;
    }
    accuracy = accuracy.toFixed(2);
    real_accuracy = real_accuracy.toFixed(2);
    $("body ul").append('<li><b>Accuracy</b>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + accuracy + '%</li>');
    $("body ul").append('<li><b>Real accuracy</b>: ' + real_accuracy + '%</li>');

    document.getElementById('results').scrollIntoView({ behavior: "smooth" });
}

// define actions to perform on completion
var onCompletion = () => {
    $("body").off('keydown'); // disable additional input
    displayResults();
};
var cursor = new Cursor(onCompletion);

// NOTE: I believe we need to wrap `cursor.processKeyDown` in another lambda
// because the wrapper lambda captures the Cursor object that we've defined.
//
// Otherwise, `this` does not refer to the Cursor object in the instance
// methods. This is a quirk of how JavaScript defines the `this` keyword.
$("body").keydown((event) => cursor.processKeyDown(event));
