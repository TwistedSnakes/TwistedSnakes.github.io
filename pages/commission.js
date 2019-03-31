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
    $('#content-body .panel-icon').width(size);
    $('#content-body .panel-icon').height(size);
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
    approvedContent.forEach(panelInfo => addPanel(panelInfo, '.content-approved-container'));

    var rejectedContent = [
        { text: 'Underaged characters involved in sexual situations', icon: 'img/commission-content-underage-icon.png' },
        { text: 'Illegal content', icon: 'img/commission-content-prohibited-icon.png' },
        { text: 'Baby furs, ABDL', icon: 'img/commission-content-child-icon.png' },
        { text: 'Pregnancy themes', icon: 'img/commission-content-pregnant-icon.png' },
        { text: 'Scat', icon: 'img/commission-content-poop-icon.png' }
    ];
    rejectedContent.forEach(panelInfo => addPanel(panelInfo, '.content-rejected-container'));
    
}

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

$(document).ready(function() {
    checkNavbarOpacity();
    checkBannerImg();
    checkPricingTabs();

    initContentPanels();
    checkContentPanels();

    $('.banner-img').removeClass('hidden');
});