$(document).ready(() => {
    // Add title to URL
    window.location.replace(`${window.location.toString().split('#')[0]}#${storyMetadata.title.replace(/\'/g, '').replace(/(\W)+/g, '-').replace(/-+$/g, '')}`);
    new Promise(resolve => {
            // Check if is_age_restricted is true
            if (!storyMetadata.is_age_restricted || checkAgeRestriction()) {
                // Allow user to read age-restricted stories if they are of age
                resolve();
            } else {
                $(document).ready(() => {
                    $('body').load(`../resources/age-restricted-page.html`, () => {
                        $('#is-of-age-checkbox').click(evnt => {
                            $('#confirm-button').toggleClass('disabled', !evnt.currentTarget.checked);
                        });
                        $('#confirm-button').click(evnt => {
                            if (!$('#confirm-button').hasClass('disabled')) {
                                setAgeRestriction(true);
                                location.reload();
                            }
                        });
                    });
                });
            }
        })
        .then(() => {
            // Load custom CSS
            loadCustomCSS().then(customCSS => $('head').append(`<style>${customCSS}</style>`)),

            // Load custom HTML
            loadCustomFont().then(customFont => $('head').append(`<link href="${customFont}" rel="stylesheet">`)),

            // Load custom display
            loadCustomHTML().then(customHTML => {
                customHTML.split('\n').filter(str => str.trim().length > 0).forEach(line => {
                    line = line.trim();
                    var matched = line.match('(.*?)\s*=\s*(.*)');
                    if (!matched) {
                        console.log(`Custom HTML "${line}" not recognized.`);
                        return;
                    }
                    var selector = '.' + matched[1];
                    var newHTML = matched[2];

                    $(selector).html(newHTML);
                });
            });

            $('#info-toggle-button').click(() => {
                $('.story-info-scroll-container').css('overflow-y', 'hidden')
                $('.story-info-container')
                    .animate({
                        height: 'toggle'
                    }, {
                        duration: 350,
                        complete: () => $('.story-info-scroll-container').css('overflow-y', 'auto')
                    })
                    .css('overflow', 'visible');
            });

            $('.story-info .story-info-summary, .story-info .story-info-summary-mask').click(() => $('.story-info .story-info-summary-mask').fadeToggle(80));
        });
});