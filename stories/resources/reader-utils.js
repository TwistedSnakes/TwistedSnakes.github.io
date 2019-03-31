function getDefaultFonts() {
    return new Promise(resolve => $.get('../resources/default-reader-font.txt', resolve));
}

function getDefaultCSS() {
    return new Promise(resolve => $.get('../resources/default-reader-css.css', resolve));
}

function getDefaultHTML() {
    return new Promise(resolve => $.get('../resources/default-reader-html.txt', resolve));
}

function loadCustomFont() {
    var custom_format = localStorage['reader-font'];
    if (custom_format) {
        return Promise.resolve(custom_format);
    }
    return getDefaultFonts()
    .then(default_format => {
        localStorage['reader-font'] = default_format;
        return default_format;
    });
}

function loadCustomCSS() {
    var custom_format = localStorage['reader-css'];
    if (custom_format) {
        return Promise.resolve(custom_format);
    }
    return getDefaultCSS()
    .then(default_format => {
        localStorage['reader-css'] = default_format;
        return default_format;
    });
}

function loadCustomHTML() {
    var custom_format = localStorage['reader-html'];
    if (custom_format) {
        return Promise.resolve(custom_format);
    }
    return getDefaultHTML()
    .then(default_format => {
        localStorage['reader-html'] = default_format;
        return default_format;
    });
}

function checkAgeRestriction() {
    return localStorage['is-of-age'] == 'true';
}

function setAgeRestriction(isOfAge) {
    localStorage['is-of-age'] = isOfAge ? 'true' : 'false';
}