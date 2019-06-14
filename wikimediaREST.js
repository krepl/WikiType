const WIKI_DOMAIN = "https://en.wikipedia.org";
const WIKI_BASE_URL = WIKI_DOMAIN + "/api/rest_v1";

class Page {
    constructor(title) {
        this.title = title;
        this.getJSONSummary = this.getJSONSummary.bind(this);
    }

    getJSONSummary(callback) {
        $.getJSON(WIKI_BASE_URL + "/page/summary/" + this.title, callback);
    }

    static getJSONRandomSummary(callback) {
        $.getJSON(WIKI_BASE_URL + "/page/random/summary", callback);
    }
}
