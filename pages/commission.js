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

function checkPricingTabs() {
    var labels = $('#content-body .info-table-cell-label');
    var contents = $('#content-body .info-table-cell-content');
    var allSameRow = true;
    for (var i = 0; i < labels.length && allSameRow; i++) {
        if ($(labels[i]).offset().top != $(contents[i]).offset().top) {
            allSameRow = false;
        }
    }
    $('#content-body .info-table-cell-content').css('max-width', 1000);
    if ($('#content-body .info-table-cell-label').first().offset().top
            == $('#content-body .info-table-cell-content').first().offset().top) {
        var parentWidth = $('#content-body .info-table-cell-content').parent().innerWidth();
        $('#content-body .info-table-cell-content').css('max-width', parentWidth - 200);
    }
}

function checkContentPanels() {
    var size = Math.min(
        $('#content-body .panel-icon').parent().width() * 0.8,
        150
    );
    $(['#content-body .content-approved-container .panel-icon',
    '#content-body .content-rejected-container .panel-icon'].join(', '))
    .width(size)
    .height(size);
}

function initProgressPanels() {
    function addPanel(panelInfo, panelContainerSelector) {
        var color = ([
            [0, '#D12323'], // red - not going to appear
            [5, '#C9DAEA'], // pale blue
            [10, '#004777'], // dark blue
            [50, '#FFCD70'], // pale yellow
            [90, '#FFA500'], // bright yellow
            [100, '#279270'], // green
        ].filter((colorPair) => colorPair[0] >= panelInfo.progress)[0][1]) || '#279270';
        var newPanel = $($('.progress-panel-template').html());
        newPanel.find('.progress-panel-icon').attr('src', panelInfo.icon)
        newPanel.find('.progress-panel-bar-value')
            .css('width', `${panelInfo.progress}%`)
            .css('background-color', color);
        newPanel.find('.progress-panel-text').html(panelInfo.text);
        newPanel.find('.progress-panel-progress-value').html(`<p>${panelInfo.progressText}</p>`);
        $(`#content-body ${panelContainerSelector}`).append(newPanel);
    }

    var url = 'https://docs.google.com/document/d/1Tv9nr8eINZ1dPQK_TTj7XDRYphcPpQhF6xyMB3QQnRg/export?format=html';
    fetch(url)
    .then((response) => response.status == 200 ? response.text() : '')
    .then((html) => {
        var body = $(html);
        var progressTable = body.toArray().filter((elem) => elem.tagName == 'TABLE')[0];
        
        var progressEntries = [];
        $(progressTable).find('tr').each((_, elem) => {
            var progressEntry = {};
            $(elem).find('td').each((i, val) => {
                if (i == 0) {
                    progressEntry.icon = $(val).find('img').attr('src');
                } else if (i == 1) {
                    progressEntry.progressText = val.innerText;
                    progressEntry.progress = parseFloat(val.innerText.split('%')[0]);
                } else if (i == 2) {
                    progressEntry.text = val.innerText;
                }
            });
            progressEntries.push(progressEntry);
        });

        progressEntries = progressEntries.filter(progressEntry =>
                                                    progressEntry.icon !== undefined &&
                                                    progressEntry.progressText !== "" &&
                                                    !isNaN(progressEntry.progress) &&
                                                    progressEntry.text !== "");

        $('#content-body .project-progress-container').empty();
        if (progressEntries.length > 0) {
            progressEntries.forEach((progressEntry) => {
                addPanel(progressEntry, '.project-progress-container');
            });
        } else {
            $('#content-body .project-progress-container').html($('.progress-panel-empty-template').html());
        }
    });
}

function initContentPanels() {
    function addPanel(panelInfo, panelContainerSelector) {
        var newPanel = $($('.content-panel-template').html());
        var imgMask = `url(${panelInfo.icon})`;
        newPanel.find('.panel-icon').css('-webkit-mask-image', imgMask);
        newPanel.find('.panel-icon').css('mask-image', imgMask);
        newPanel.find('.panel-text').html(panelInfo.text);
        $(`#content-body ${panelContainerSelector}`).append(newPanel);
    }

    var approvedContent = [
        { text: 'Character backstories', icon: 'img/commission-content-lore-icon.png' },
        { text: 'Slice of life', icon: 'img/commission-content-pizza-icon.png' },
        { text: 'Erotica', icon: 'img/commission-content-love-icon.png' },
        { text: 'BDSM themes', icon: 'img/commission-content-triskelion-icon.png' },
        { text: 'Extreme content', icon: 'img/commission-content-extreme-icon.png' },
        { text: 'And more!', icon: 'img/commission-content-more-icon.png' }
    ];
    $('#content-body .content-approved-container').empty();
    approvedContent.forEach(panelInfo => addPanel(panelInfo, '.content-approved-container'));

    var rejectedContent = [
        { text: 'Underaged characters involved in sexual situations', icon: 'img/commission-content-underage-icon.png' },
        { text: 'Illegal content', icon: 'img/commission-content-prohibited-icon.png' },
        { text: 'Baby furs, ABDL', icon: 'img/commission-content-child-icon.png' },
        { text: 'Pregnancy themes', icon: 'img/commission-content-pregnant-icon.png' },
        { text: 'Scat', icon: 'img/commission-content-poop-icon.png' }
    ];
    $('#content-body .content-rejected-container').empty();
    rejectedContent.forEach(panelInfo => addPanel(panelInfo, '.content-rejected-container'));
    
    checkContentPanels();
}

$(document).ready(function() {
    checkNavbarOpacity();
    checkBannerImg();
    checkPricingTabs();

    initProgressPanels();
    initContentPanels();

    $(window).scroll(() => {
        checkNavbarOpacity();
    });
    
    $(window).resize(() => {
        checkNavbarOpacity();
        checkBannerImg();
        checkPricingTabs();
        checkContentPanels();
    });

    $('.banner-img').removeClass('hidden');
});