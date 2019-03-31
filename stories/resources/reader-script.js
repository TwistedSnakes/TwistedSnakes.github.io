function loadStoryInfo(storyMetadata) {
    var storyInfoHTML = [];
    storyInfoHTML.push(`<p class="story-info-title">${storyMetadata.title}</p>`);

    // Credit Container
    storyInfoHTML.push('<div class="story-credit-container">');
    if (storyMetadata.authors.length > 0) {
        storyInfoHTML.push(`<p class="story-info-authors">${storyMetadata.authors.join(', ')}</p>`);
    }
    if (storyMetadata.commissioners.length > 0) {
        storyInfoHTML.push(`<p class="story-info-commissioners">${storyMetadata.commissioners.join(', ')}</p>`);
    }
    if (storyMetadata.illustrators.length > 0) {
        storyInfoHTML.push(`<p class="story-info-illustrators">${storyMetadata.illustrators.join(', ')}</p>`);
    }
    storyInfoHTML.push('</div>');

    // Teaser Container
    storyInfoHTML.push(`<p class="story-info-teaser">${storyMetadata.teaser.replace(/\n/g, '<br>')}</p>`);

    // Summary Container
    storyInfoHTML.push(`<div class="story-info-summary-container">`);
    storyInfoHTML.push(`<p class="story-info-summary">${storyMetadata.summary.replace(/\n/g, '<br>')}</p>`);
    storyInfoHTML.push(`<div class="story-info-summary-mask"><p class="story-info-summary-blurred">${storyMetadata.summary.replace(/\n/g, '<br>')}</p></div>`);
    storyInfoHTML.push(`</div>`);

    // Tags Container
    storyInfoHTML.push(`<div class="story-info-tags-container"><ul>${storyMetadata.display_tags.map(tag => `<li class="story-info-tag">${tag}</li>`).join('')}</ul></div>`);

    // Misc Info Container
    storyInfoHTML.push('<div class="story-misc-container">');
    storyInfoHTML.push(`<p class="story-info-word-count">${storyMetadata.word_count}</p>`);
    /*
        // Apparently mobile phones don't do getUTCDate/Month/FullYear well.
        var uploadedDate = new Date(storyMetadata.upload_date);
        var uploadDateStr = uploadedDate.getUTCDate()
                            + (
                                { 11: 'th', 12: 'th', 13: 'th' }[uploadedDate.getUTCDate()]
                                || ['th', 'st', 'nd', 'rd', 'th'][Math.min(uploadedDate.getUTCDate() % 10, 4)]
                            )
                            + ' '
                            + 'JanFebMarAprMayJunJulAugSepOctNovDec'.substr(uploadedDate.getUTCMonth() * 3, 3)
                            + ' '
                            + uploadedDate.getUTCFullYear();
        storyInfoHTML.push(`<p class="story-info-upload-date">${uploadDateStr}</p>`);
    */

    var [uploadYear, uploadMonth, uploadDay] = storyMetadata.upload_date.substr(0, 10).split('-').map(i => parseInt(i));
    var uploadDateStr = uploadDay +
        ({
            11: 'th',
            12: 'th',
            13: 'th'
        } [uploadDay] || ['th', 'st', 'nd', 'rd', 'th'][Math.min(uploadDay % 10, 4)]) +
        ' ' +
        '___JanFebMarAprMayJunJulAugSepOctNovDec'.substr(uploadMonth * 3, 3) +
        ' ' +
        uploadYear;
    storyInfoHTML.push(`<p class="story-info-upload-date">${uploadDateStr}</p>`);
    storyInfoHTML.push('</div>');

    $('.story-info').html(storyInfoHTML.join('\n'));
    $('.story-info .story-info-summary, .story-info .story-info-summary-mask').click(() => $('.story-info .story-info-summary-mask').fadeToggle(80));
}

$(document).ready(() => {
    loadStoryInfo(storyMetadata);

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
        .then(() =>
            Promise.all([
                // Load custom CSS
                loadCustomCSS().then(customCSS => $('head').append(`<style>${customCSS}</style>`)),
                // Load custom HTML
                loadCustomFont().then(customFont => $('head').append(`<link href="${customFont}" rel="stylesheet">`)),
                // Load story
                new Promise(resolve => $(document).ready(() => {
                    $('#story-form').load('story.html', resolve);
                }))
            ])
        )
        .then(() => {
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
        });
});