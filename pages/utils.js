function setFooterMessage() {
    var startYear = 2013;
    var endYear = new Date().getFullYear();
    $('.page-footer-message').html(`© ${startYear}-${endYear} TwistedSnakes`);
}

function updateNavbarCollapse() {
    // Nav bar will minimize based on page resize
    if ($('.navbar-toggler').is(":visible")) {
        $('.nav').addClass('is-collapse');
    } else {
        $('.nav').removeClass('is-collapse');
    }
}

$(window).resize(() => {
    updateNavbarCollapse();
});

$(document).ready(function() {
    setFooterMessage();
    updateNavbarCollapse();
});