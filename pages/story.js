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

var globalStoryListing = [];
var globalStoryMap = {};

function loadStoryListing() {
    new Promise(resolve => $.get('stories/resources/story-listing.json', resolve))
        .then(result => {
            globalStoryListing = result.filter(storyMetadata => storyMetadata.is_listed);
            resetTagFilter();
            
            globalStoryMap = {};
            globalStoryListing.forEach(storyMetadata => {
                storyMetadata.upload_date_obj = new Date(storyMetadata.upload_date);
                storyMetadata.tags_set = new Set(storyMetadata.tags);

                globalStoryMap[storyMetadata.id] = storyMetadata;
            });

            globalStoryListing.sort(compareStoriesById);
            globalStoryListing.reverse();
            
            renderStoryListing(globalStoryListing);
        });
}

var isStoryListingFiltered = false;
var filteredStoryListing = [];
var filteredStoryMap = {}
var tagsInFilteredStoryListing = {};

function resetTagFilter() {
    isStoryListingFiltered = false;
    filteredStoryListing = [];
    filteredStoryMap = {};
    tagsInFilteredStoryListing = {};
}

function modifyTagFilter() {
    isStoryListingFiltered = false;
}

function initalizeTagFilter() {
    filteredStoryListing = globalStoryListing.filter((storyMetadata) => [...activeSearchTags].every(tag => storyMetadata.tags_set.has(tag)));
    filteredStoryMap = {};
    filteredStoryListing.forEach(storyMetadata => filteredStoryMap[storyMetadata.id] = storyMetadata);
    tagsInFilteredStoryListing = {};

    isStoryListingFiltered = true;
}

function getFilteredStoryListing() {
    if (!isStoryListingFiltered) {
        initalizeTagFilter();
    }
    return filteredStoryListing;
}

function getFilteredStoryMap() {
    if (!isStoryListingFiltered) {
        initalizeTagFilter();
    }
    return filteredStoryMap;
}

function countTagsInFilteredStoryListing(tag) {
    if (!isStoryListingFiltered || !tagsInFilteredStoryListing.hasOwnProperty(tag)) {
        var storyList = getFilteredStoryListing();
        let count = 0;
        storyList.forEach(storyMetadata => { if (storyMetadata.tags_set.has(tag)) { count++; } });
        tagsInFilteredStoryListing[tag] = count;
    }
    return tagsInFilteredStoryListing[tag];
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

var activeSearchTags = new Set();

function checkTagDisplay() {
    if ($('#search-list-tag-container').children().length > 0) {
        $('#search-tag-container').show();
    } else {
        $('#search-tag-container').hide();
    }
}

function addSearchTag(tagStr) {
    if (activeSearchTags.has(tagStr)) {
        return;
    }
    activeSearchTags.add(tagStr);
    modifyTagFilter();

    var tagElem = $($('.tag-template').html());
    tagElem.text(tagStr);
    tagElem.click((event) => removeSearchTag(event.currentTarget));
    $('#search-list-tag-container').append(tagElem);

    checkTagDisplay();
    renderStoryListing(getFilteredStoryListing());
}

function removeSearchTag(tagElem) {
    var tag = tagElem.innerText;
    activeSearchTags.delete(tag);
    modifyTagFilter();

    $(tagElem).remove();

    checkTagDisplay();
    renderStoryListing(getFilteredStoryListing());
}

$(document).ready(function () {
    checkNavbarOpacity();
    checkBannerImg();
    checkTagDisplay();
    $('.banner-img').removeClass('hidden');
    loadStoryListing();

    splitterRegex = splitter_regex = [
        '\\s',   // Space
        '\\-',   // Dash
        "\\'",   // Single quote
        '\\"',   // Double quote
        '\\,',   // Comma
        '\\.',   // Period
        '\\/',   // Slash
        '\\\\',  // Backslash
        '\\(',   // Open bracket
        '\\)',   // Close bracket
        '\\[',   // Open square bracket
        '\\]',   // Close square bracket
    ];
    tokenSplitter = new RegExp(`[${splitterRegex.join('')}]+`)
    function queryTokenizer(query) {
        var tokenSet = new Set(query.toLowerCase().split(tokenSplitter));
        query.toLowerCase().split(' ').forEach(token => tokenSet.add(token));
        tokenSet.add(query.toLowerCase());
        return [...tokenSet];
    }

    function makeFilteredSource(bloodhound, filterFunction) {
        return (query, syncResults, asyncResults) => {
            bloodhound.search(
                query,
                (results) => syncResults(results.filter(filterFunction)),
                (results) => asyncResults(results.filter(filterFunction))
            );
        };
    }

    $('#search-input').typeahead({
        hint: true,
        minLength: 1
    }, {
        name: 'tag',
        display: 'tag',
        source: makeFilteredSource(new Bloodhound({
            datumTokenizer: (tagObj) => tagObj.relevant_keywords,
            queryTokenizer : queryTokenizer,
            identify: (tagObj) => tagObj.tag,
            sufficient: 100,
            prefetch: {
                url: 'stories/resources/tag_lookup.json',
                cache: false
            },
            sorter: (a, b) => countTagsInFilteredStoryListing(b.tag) - countTagsInFilteredStoryListing(a.tag)
        }), tagObj => !activeSearchTags.has(tagObj.tag) && countTagsInFilteredStoryListing(tagObj.tag) > 0),
        limit: 10,
        templates: {
            header: '<div class="tt-dataset-header">Tag</div>',
            notFound: '<div class="tt-dataset-header">No tags found</div>',
            suggestion: tagObj => {
                return `<div>${tagObj.tag} (${countTagsInFilteredStoryListing(tagObj.tag)})</div>`;
                return activeSearchTags.has(tagObj.tag)
                    ? `<div class="existing-tag">${tagObj.tag}</div>`
                    : `<div>${tagObj.tag} (${countTagsInFilteredStoryListing(tagObj.tag)})</div>`;
            }
        },
        async: false
    }, {
        name: 'story',
        display: 'title',
        source: makeFilteredSource(new Bloodhound({
            datumTokenizer: (storyObj) => storyObj.relevant_keywords,
            queryTokenizer : (query) => queryTokenizer(query.toLowerCase()),
            identify: (storyObj) => storyObj.id,
            sufficient: 100,
            prefetch: {
                url: 'stories/resources/story_lookup.json',
                cache: false
            }
        }), storyObj => getFilteredStoryMap(storyObj.id) !== undefined),
        limit: 5,
        templates: {
            header: '<div class="tt-dataset-header">Story</div>',
            notFound: '<div class="tt-dataset-header">No stories found</div>',
            suggestion: storyObj => {
                return `
                    <div class="tt-suggestion tt-selectable">
                        <span class="story-title">${storyObj.title}</span>
                        <br>
                        <span class="story-tag-list">${globalStoryMap[storyObj.id].tags.join(', ')}</span>
                    </div>
                `;
            }
        },
        async: false
    });
    $('#search-input').parent().addClass('search-container');

    $('#search-input').bind('typeahead:select', (event, selectedElement) => {
        if (selectedElement['entry_type'] == 'tag') {
            addSearchTag(selectedElement['tag'])
            $('#search-input').typeahead('val', '');
        } else if (selectedElement['entry_type'] == 'story') {
            window.open(`/stories/${selectedElement['id']}/read.html`);
        }
    });
});