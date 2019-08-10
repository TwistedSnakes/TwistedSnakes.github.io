function beautifyMinutes(minutes) {
    minutes = Math.round(Math.max(1, minutes));
    if (minutes < 30) {
        return {
            'amount': '' + minutes,
            'units': 'minute'
        };
    } else if (minutes < 60) {
        minutes = Math.round(minutes / 5) * 5;
        return {
            'amount': '' + minutes,
            'units': 'minute'
        };
    } else if (minutes < 60 * 24) {
        var hours = minutes / 60;
        hours = Math.round(hours * 10) / 10;
        return {
            'amount': '' + hours,
            'units': 'hour'
        };
    } else if (minutes < 60 * 24 * 365) {
        var days = minutes / 60 / 24;
        days = Math.round(days * 10) / 10;
        return {
            'amount': '' + days,
            'units': 'day'
        };
    } else {
        var years = minutes / 60 / 24 / 365;
        years = Math.round(years * 10) / 10;
        return {
            'amount': '' + years,
            'units': 'year'
        };
    }
}

function wordCountToTime(wordCount) {
    var speedLBound = 250;
    var speedUBound = 400;

    var timeLBound = wordCount / speedUBound;
    var timeUBound = wordCount / speedLBound;

    var beautifiedLBound = beautifyMinutes(timeLBound);
    var beautifiedUBound = beautifyMinutes(timeUBound);

    if (beautifiedLBound.units == beautifiedUBound.units) {
        if (beautifiedLBound.amount == beautifiedUBound.amount) {
            if (parseFloat(beautifiedLBound.amount) <= 1) {
                return `${beautifiedLBound.amount} ${beautifiedLBound.units}`
            } else {
                return `${beautifiedLBound.amount} ${beautifiedLBound.units}s`
            }
        }
        if (parseFloat(beautifiedUBound.amount) <= 1) {
            return `${beautifiedLBound.amount} - ${beautifiedUBound.amount} ${beautifiedLBound.units}`
        } else {
            return `${beautifiedLBound.amount} - ${beautifiedUBound.amount} ${beautifiedLBound.units}s`
        }
    } else {
        var lBoundStr = `${beautifiedLBound.amount} ${beautifiedLBound.units}` +
            (parseFloat(beautifiedLBound.amount) <= 1 ? '' : 's');
        var uBoundStr = `${beautifiedUBound.amount} ${beautifiedUBound.units}` +
            (parseFloat(beautifiedUBound.amount) <= 1 ? '' : 's');
        return `${lBoundStr} - ${uBoundStr}`
    }
}

function compareStoriesById(a, b) {
    var aSplitted = a.id.split('-');
    var bSplitted = b.id.split('-');
    for (var i = 0; i < Math.max(aSplitted.length, bSplitted.length); i++) {
        var aVal = aSplitted[i];
        var bVal = bSplitted[i];
        if (aVal == undefined) {
            return -1;
        } else if (bVal == undefined) {
            return 1;
        }
        var aValSplitted = aVal.replace(/(\d(?=\D))|(\D(?=\d))/g, '$1$2@').split('@');
        var bValSplitted = bVal.replace(/(\d(?=\D))|(\D(?=\d))/g, '$1$2@').split('@');
        for (var j = 0; j < Math.max(aValSplitted.length, bValSplitted.length); j++) {
            var aMiniVal = aValSplitted[j];
            var bMiniVal = bValSplitted[j];
            if (aMiniVal == undefined) {
                return -1;
            } else if (bMiniVal == undefined) {
                return 1;
            }
            if (aMiniVal.match(/^\d+$/) && bMiniVal.match(/^\d+$/)) {
                aMiniVal = parseInt(aMiniVal);
                bMiniVal = parseInt(bMiniVal);
            }
            if (aMiniVal < bMiniVal) {
                return -1;
            } else if (aMiniVal > bMiniVal) {
                return 1
            }
        }
    }
    return 0;
}

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