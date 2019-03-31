function checkNavbarOpacity() {
    if (!$('.navbar-toggler').is(":visible")) {
        var opacity = Math.min(Math.max($(window).scrollTop() / ($('#banner').height() * 0.8), 0), 1);
        opacity = 1 - ((1 - opacity) * 0.15);
        opacity = opacity * opacity;
        $('.nav').css('background-color', `rgba(255, 255, 255, ${opacity})`);
    } else {
        $('.nav').css('background-color', `rgba(255, 255, 255, 1)`);
    }
}

function checkBannerImg() {
    $('#content-body .banner-img').css('height', $('.banner-img').parent().outerHeight());
    $('#content-body .banner-img').css('top', 0);
    var leftPos = $('.banner-img').parent().width() * 2 / 3;
    leftPos = Math.max(350, leftPos);
    $('#content-body .banner-img').css('left', leftPos);
}

$(window).scroll(() => {
    checkNavbarOpacity();
});

$(window).resize(() => {
    checkNavbarOpacity();
    checkBannerImg();
});

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

var globalStoryListing;

function loadStoryListing() {
    new Promise(resolve => $.get('stories/resources/story-listing.json', resolve))
    .then(result => {
        globalStoryListing = result.filter(storyMetadata => storyMetadata.is_listed);
        renderStoryListing(result);
    });
}

function renderStoryListing(storyListing) {
    $('#story-listing-panel').empty();
    if (storyListing.length == 0) {
        $('#story-listing-panel').append($('.no-stories-listed-template').html());
        return;
    }
    storyListing.forEach(storyMetadata => {
        var storyPanelId = `panel-${storyMetadata.id}`
        var storyPanel = $($('.story-panel-template').html());
        storyPanel.attr('id', storyPanelId);
        storyPanel.find('.story-title-text').html(storyMetadata.title);
        storyPanel.find('.story-title-link').attr('href', `/stories/${storyMetadata.id}/read.html`);
        storyPanel.find('.story-teaser-text').html(storyMetadata.teaser);
        var displayTagsStr = storyMetadata.display_tags.join(', ');
        storyPanel.find('.story-tags-text').html(displayTagsStr);
        storyPanel.find('.story-wordcount-text').html(`${storyMetadata.word_count}&nbsp;&nbsp;(${wordCountToTime(storyMetadata.word_count)} reading time)`);
        storyPanel.find('.story-tags, .story-wordcount').click(event => $(event.currentTarget).toggleClass('ellipsis-overflow'));

        $('#story-listing-panel').append(storyPanel);
    });
}

$(document).ready(function() {
    checkNavbarOpacity();
    checkBannerImg();

    $('.banner-img').removeClass('hidden');
    loadStoryListing();
});