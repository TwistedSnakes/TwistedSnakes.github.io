function checkNavbarOpacity() {
    if (!$('.navbar-toggler').is(":visible")) {
        var opacity = Math.min(Math.max($(window).scrollTop() / ($('#banner').height() * 0.8), 0), 1);
        opacity = 1 - ((1 - opacity) * 0.95);
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

$(window).scroll(() => {
    checkNavbarOpacity();
});

$(window).resize(() => {
    checkNavbarOpacity();
    checkBannerImg();
});

$(document).ready(function() {
    checkNavbarOpacity();
    checkBannerImg();

    $('.banner-img').removeClass('hidden');
});