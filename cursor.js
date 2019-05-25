const NBSP_CHAR_CODE = "\u00a0".charCodeAt(0);
const SPACE_CHAR_CODE = "\u0020".charCodeAt(0);

class Cursor {
    constructor(onCompletion) {
        this.onCompletion = onCompletion;
        this.token_units = $(".token-unit");
        console.assert(this.token_units.length > 0, "Cursor cannot have a content-length of 0.");
        this.cursor_idx = 0;
        var first_token_unit = this.tokenUnitAt(0);
        console.assert(first_token_unit.is(".token-unit"), "First token-unit could not be found.");
        this.current_token_unit = first_token_unit;

        this.processKeyDown = this.processKeyDown.bind(this);
        this.canAdvance = this.canAdvance.bind(this);
        this.advance = this.advance.bind(this);
        this.canRetreat = this.canRetreat.bind(this);
        this.retreat = this.retreat.bind(this);
        this.nextTokenUnit = this.nextTokenUnit.bind(this);
        this.tokenUnitAt = this.tokenUnitAt.bind(this);
        this.previousTokenUnit = this.previousTokenUnit.bind(this);
    }

    canAdvance() {
        return this.cursor_idx < this.token_units.length;
    }

    advance() {
        if (this.canAdvance()) {
            this.current_token_unit.removeClass("cursor");
            var next_token_unit = this.nextTokenUnit(this.current_token_unit);
            this.cursor_idx++;
            if (next_token_unit !== null && next_token_unit.is(".token-unit")) {
                this.current_token_unit = next_token_unit;
                this.current_token_unit.addClass("cursor");
            } else {
                this.onCompletion();
            }
        }
    }

    canRetreat() {
        return this.cursor_idx > 0;
    }

    retreat() {
        if (this.canRetreat()) {
            this.current_token_unit.removeClass("cursor");
            var prev_token_unit = this.previousTokenUnit(this.current_token_unit);
            this.cursor_idx--;
            if (prev_token_unit !== null) {
                this.current_token_unit = prev_token_unit;
                this.current_token_unit.addClass("cursor");
            }
        }
    }

    nextTokenUnit(token_unit) {
        if (this.cursor_idx >= this.token_units.length) {
            return null;
        }
        return this.tokenUnitAt(this.cursor_idx+1);
    }

    previousTokenUnit(token_unit) {
        if (this.cursor_idx <= 0) {
            return null;
        }
        return this.tokenUnitAt(this.cursor_idx-1);
    }

    tokenUnitAt(idx) {
        return this.token_units.eq(idx);
    }

    processKeyDown(event) {
        // needed to prevent, for example, a 'space' key from propagating and
        // causing the window to scroll
        event.stopPropagation();
        if (event.key.length !== 1) {
            if (event.key === "Backspace") {
                this.retreat();
            }
            return;
        } else if (event.metaKey || event.ctrlKey) {
            return;
        }
        if (this.canAdvance()) {
            var target_character = this.current_token_unit.text().charCodeAt(0);
            if (target_character === NBSP_CHAR_CODE) {
                target_character = SPACE_CHAR_CODE;
            }
            if (event.key.charCodeAt(0) === target_character) {
                if (this.current_token_unit.hasClass("incorrect")) {
                    this.current_token_unit.removeClass("incorrect");
                    this.current_token_unit.addClass("fixed");
                } else if (!this.current_token_unit.hasClass("fixed")) {
                    this.current_token_unit.addClass("correct");
                }
            } else {
                this.current_token_unit.removeClass("correct");
                this.current_token_unit.removeClass("fixed");
                this.current_token_unit.addClass("incorrect");
            }
            this.advance();
        }
    }
}
