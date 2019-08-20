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
    $('.banner-img').css('height', $('.banner-img').parent().outerHeight());
    $('.banner-img').css('top', 0);
    var leftPos = $('.banner-img').parent().width() * 2 / 3;
    leftPos = Math.max(350, leftPos);
    $('.banner-img').css('left', leftPos);
}

function initSocialPanels() {
    function addPanel(panelInfo, panelContainerSelector) {
        var newPanel = $($('.social-panel-template').html());
        newPanel.find('.panel-icon').attr('src', panelInfo.icon);
        newPanel.find('.panel-name').html(panelInfo.name);

        if (panelInfo.url) {
            newPanel.find('.panel-img-link').attr('href', panelInfo.url);
            newPanel.find('.panel-name-link').attr('href', panelInfo.url);
        }

        if (panelInfo.handle) {
            if (panelInfo.url) {
                newPanel.find('.panel-handle-link').html(panelInfo.handle);
                newPanel.find('.panel-handle-link').attr('href', panelInfo.url);
            } else {
                newPanel.find('.panel-handle').html(panelInfo.handle);
            }
        } else {
            newPanel.find('.panel-handle').hide();
        }

        if (panelInfo.description) {
            newPanel.find('.panel-description').html(panelInfo.description);
        } else {
            newPanel.find('.panel-description').hide();
        }
        $(`#content-body ${panelContainerSelector}`).append(newPanel);
    }

    var socials = [
        { name: `Email`, icon: 'img/social-email.png', handle: 'contact@twistedsnakes.com', description: 'For general enquiries and commission requests.', url: `mailto:contact@twistedsnakes.com?subject=${escape('Enquiry')}&body=${escape('\n\n\nContacted through TwistedSnakes.com')}` },
        { name: 'Telegram', icon: 'img/social-telegram.png', handle: '@TwistedStories', description: 'My telegram channel where you can receive notifications for streams and commission openings.', url: "https://t.me/TwistedStories" },
        { name: 'Fur Affinity', icon: 'img/social-furaffinity.png', handle: 'TwistedSnakes', description: 'My writings are mirrored here.<br>Commission openings will also be announced through my Fur Affinity journals.', url: 'https://www.furaffinity.net/user/twistedsnakes/' },
        { name: 'SoFurry', icon: 'img/social-sofurry.png', handle: 'TwistedSnakes', description: 'My writings are mirrored here.', url: 'https://twistedsnakes.sofurry.com/' },
        { name: 'DeviantArt', icon: 'img/social-deviantart.png', handle: 'TwistedSnakes', description: 'My writings are mirrored here.', url: 'https://www.deviantart.com/twistedsnakes' },
        { name: 'Ko-fi', icon: 'img/social-kofi.png', handle: 'TwistedSnakes', description: 'Tips are not required, but greatly appreciated!', url: 'https://ko-fi.com/twistedsnakes' },
        { name: 'Twitter', icon: 'img/social-twitter.png', handle: '@TwistedSnakes', description: 'I post random things here from time to time.', url: 'https://twitter.com/TwistedSnakes' },
        { name: 'The Bamboo Forest (Discord Server)', icon: 'img/social-bambooforest.png', handle: 'The Bamboo Forest', description: 'A Discord server for chill conversations and daily voice calls (around evening to night time in Singapore timezone).', url: 'https://discord.gg/UAxVZsP' },
        { name: 'Discord', icon: 'img/social-discord.png', handle: 'twistedsnakes#4890', description: 'Add me on Discord!' },
        { name: 'Facebook', icon: 'img/social-facebook.png', handle: 'Gabriel Perry (TwistedSnakes)', description: 'When sending a friend request, leave a message saying you found me from my website. I only accept friend requests from people I know.', url: 'https://www.facebook.com/TwistedSnakes' }
    ];
    socials.forEach(panelInfo => addPanel(panelInfo, '#social-container'));

}

$(document).ready(function() {
    checkNavbarOpacity();
    checkBannerImg();
    initSocialPanels();

    $(window).scroll(() => {
        checkNavbarOpacity();
    });
    
    $(window).resize(() => {
        checkNavbarOpacity();
        checkBannerImg();
    });

    $('.banner-img').removeClass('hidden');
});