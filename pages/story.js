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

let allStorySorters = [
    { text: 'Sequence (Ascending)', comparer: compareStoriesById },
    { text: 'Sequence (Descending)', comparer: (a, b) => compareStoriesById(b, a) },
    { text: 'Title (Ascending)', comparer: (a, b) => a.title.localeCompare(b.title) },
    { text: 'Title (Descending)', comparer: (a, b) =>  b.title.localeCompare(a.title) },
    { text: 'Word count (Ascending)', comparer: (a, b) => a.word_count - b.word_count },
    { text: 'Word count (Descending)', comparer: (a, b) => b.word_count - a.word_count },
    { text: 'Upload date (Ascending)', comparer: (a, b) => a.upload_date_obj.getTime() - b.upload_date_obj.getTime() },
    { text: 'Upload date (Descending)', comparer: (a, b) => b.upload_date_obj.getTime() - a.upload_date_obj.getTime() },
];

class StoryFilterManager {
    constructor(allStoryMetadata) {
        if (allStoryMetadata === undefined) {
            allStoryMetadata = [];
        }
        this.allStoryMetadata = JSON.parse(JSON.stringify(allStoryMetadata)); // deep copy
        this.allStoryMap = {};
        this.allStoryMetadata.forEach((storyMetadata) => {
            storyMetadata.upload_date_obj = new Date(storyMetadata.upload_date);
            storyMetadata.tags_set = new Set(storyMetadata.tags);

            this.allStoryMap[storyMetadata.id] = storyMetadata;
        });

        this.isFiltersUpdated = false;
        this.filteredStoryMetadata = [];
        this.filteredStoryMap = {}
        this.filteredTagCount = {};

        this.storyComparer = () => 0;

        this.filterTags = new Set();
    }

    getStoryMetadata(storyId) {
        if (this.allStoryMap[storyId] === undefined) {
            return undefined;
        }
        let clonedMetadata = Object.assign({}, this.allStoryMap[storyId]);
        // Remove custom data
        delete clonedMetadata.upload_date_obj;
        delete clonedMetadata.tags_set;
        return JSON.parse(JSON.stringify(clonedMetadata));
    }

    getStories() {
        if (!this.isFilterValid()) {
            this.updateFilter();
        }
        return this.filteredStoryMetadata.slice(0);
    }

    isStoryListed(storyId) {
        return this.filteredStoryMap[storyId] !== undefined;
    }

    countTagInStories(tag) {
        if (!this.isFilterValid() || !this.filteredTagCount.hasOwnProperty(tag)) {
            let count = 0;
            this.getStories().forEach(storyMetadata => { if (storyMetadata.tags_set.has(tag)) { count++; } });
            this.filteredTagCount[tag] = count;
        }
        return this.filteredTagCount[tag];
    }

    invalidateFilter() {
        this.isFiltersUpdated = false;
    }

    isFilterValid() {
        return this.isFiltersUpdated;
    }

    updateFilter() {
        this.filteredStoryMetadata = this.allStoryMetadata.filter((storyMetadata) => [...this.filterTags].every(tag => storyMetadata.tags_set.has(tag)));
        this.filteredStoryMetadata.sort()
        
        this.filteredStoryMap = {};
        this.filteredStoryMetadata.forEach(storyMetadata => this.filteredStoryMap[storyMetadata.id] = storyMetadata);
        this.filteredTagCount = {};
    
        this.isFiltersUpdated = true;
    }

    addFilterTag(tag) {
        if (this.filterTags.has(tag)) {
            return false;
        }
        this.invalidateFilter();
        this.filterTags.add(tag);
        return true;
    }

    removefilterTag(tag) {
        if (!this.filterTags.has(tag)) {
            return false;
        }
        this.invalidateFilter();
        this.filterTags.delete(tag);
        return true;
    }
    
    isFilteredTag(tag) {
        return this.filterTags.has(tag);
    }

    setStoryComparer(comparer) {
        this.storyComparer = comparer;
        this.allStoryMetadata.sort(comparer);
        this.filteredStoryMetadata.sort(comparer);
    }
}

var storyStorage = new StoryFilterManager(); // placeholder

function loadStoryListing() {
    new Promise(resolve => $.get('stories/resources/story-listing.json', resolve))
        .then(allStoryMetadata => {
            storyStorage = new StoryFilterManager(allStoryMetadata);
            storyStorage.setStoryComparer(allStorySorters[$('#sort-select select').get(0).selectedIndex].comparer);
            renderStoryListing();
        });
}

function renderStoryListing() {
    $('#story-listing-panel').empty();
    let storyList = storyStorage.getStories();
    if (storyList.length === 0) {
        $('#story-sort-container').hide();
        $('#story-listing-panel').append($('.no-stories-listed-template').html());
        return;
    }
    $('#story-sort-container').show();
    storyList.forEach(storyMetadata => {
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

function checkTagDisplay() {
    if ($('#search-list-tag-container').children().length > 0) {
        $('#search-tag-container').show();
    } else {
        $('#search-tag-container').hide();
    }
}

function addSearchTag(tagStr) {
    if (storyStorage.isFilteredTag(tagStr)) {
        return;
    }
    storyStorage.addFilterTag(tagStr);

    var tagElem = $($('.tag-template').html());
    tagElem.text(tagStr);
    tagElem.click((event) => removeSearchTag(event.currentTarget));
    $('#search-list-tag-container').append(tagElem);

    checkTagDisplay();
    renderStoryListing();
}

function removeSearchTag(tagElem) {
    if (!storyStorage.isFilteredTag(tagElem.innerText)) {
        return;
    }
    var tag = tagElem.innerText;
    storyStorage.removefilterTag(tag);

    $(tagElem).remove();

    checkTagDisplay();
    renderStoryListing();
}

function initializeTagSearch(thumbprint) {
    let splitterRegex = splitter_regex = [
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
                url: 'stories/resources/tag-lookup.json',
                thumbprint,
                cache: !!thumbprint
            },
            sorter: (a, b) => storyStorage.countTagInStories(b.tag) - storyStorage.countTagInStories(a.tag)
        }), tagObj => !storyStorage.isFilteredTag(tagObj.tag) && storyStorage.countTagInStories(tagObj.tag) > 0),
        limit: 10,
        templates: {
            header: '<div class="tt-dataset-header">Tag</div>',
            notFound: '<div class="tt-dataset-header">No tags found</div>',
            suggestion: tagObj => `<div>${tagObj.tag} (${storyStorage.countTagInStories(tagObj.tag)})</div>`
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
                url: 'stories/resources/story-lookup.json',
                thumbprint,
                cache: !!thumbprint
            }
        }), storyObj => storyStorage.isStoryListed(storyObj.id)),
        limit: 5,
        templates: {
            header: '<div class="tt-dataset-header">Story</div>',
            notFound: '<div class="tt-dataset-header">No stories found</div>',
            suggestion: storyObj => {
                return `
                    <div class="tt-suggestion tt-selectable">
                        <span class="story-title">${storyObj.title}</span>
                        <br>
                        <span class="story-tag-list">${storyStorage.getStoryMetadata(storyObj.id).tags.join(', ')}</span>
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
}

$(document).ready(function () {
    checkNavbarOpacity();
    checkBannerImg();
    checkTagDisplay();
    loadStoryListing();

    $(window).scroll(() => {
        checkNavbarOpacity();
    });
    
    $(window).resize(() => {
        checkNavbarOpacity();
        checkBannerImg();
    });

    $('.banner-img').removeClass('hidden');

    $('#sort-select select').empty();
    allStorySorters.forEach((option) => {
        $('#sort-select select').append($(`<option>${option.text}</option>`))
    })
    $('#sort-select select').get(0).selectedIndex = 1;
    $('.select-container').each((_, selectContainer) => initializeDropdown(selectContainer));
    $('.select-container select').change((event) => {
        let selectedIndex = event.currentTarget.selectedIndex;
        storyStorage.setStoryComparer(allStorySorters[selectedIndex].comparer);
        renderStoryListing();
    });

    fetch('stories/resources/lookup-hash.txt')
    .then((response) => response.status == 200 ? response.text() : undefined)
    .then(initializeTagSearch);
});