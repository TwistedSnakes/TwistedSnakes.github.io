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

$(document).ready(function () {
    setFooterMessage();
    updateNavbarCollapse();
});

function readUrlParams(urlSearch) {
    return new URLSearchParams(urlSearch || window.location.search);
}

function initializeDropdown(selectContainer) {
    let originalSelectElement = selectContainer.getElementsByTagName('select')[0];
    let selectedIndex = originalSelectElement.selectedIndex;
    let selectOptions = Array.from(originalSelectElement.options).map(option => ({ value: option.getAttribute('value'), text: option.innerHTML }));
    
    function setSelectedIndex(index) {
        selectDisplay.innerHTML = selectOptions[index].text;
        selectContainer.classList.remove('select-active');
        Array.from(selectItemContainer.getElementsByClassName('select-selected')).forEach((elem) => elem.classList.remove('select-selected'));
    }

    function closeSelect() {
        selectContainer.classList.remove('select-active');
    }

    var selectDisplay = document.createElement('div');
    selectDisplay.classList.add('select-display');
    selectDisplay.innerHTML = selectOptions[selectedIndex].text;
    selectContainer.appendChild(selectDisplay);

    var selectItemContainer = document.createElement('div');
    selectItemContainer.classList.add('select-items');
    selectOptions.forEach((option, index) => {
        let { value, text } = option;
        var selectItem = document.createElement("div");
        selectItem.classList.add('select-item');
        selectItem.innerHTML = text;
        selectItem.setAttribute('data-index', index);
        selectItem.addEventListener("click", (e) => {
            e.stopPropagation();

            let selectedIndex = parseInt(e.srcElement.getAttribute('data-index'));
            setSelectedIndex(selectedIndex);
            closeSelect();
            selectItemContainer.children[selectedIndex].classList.add('select-selected');

            // Trigger change event
            originalSelectElement.selectedIndex = selectedIndex;
            originalSelectElement.dispatchEvent(new Event('change'));
        });
        selectItemContainer.appendChild(selectItem);
    });
    selectItemContainer.children[selectedIndex].classList.add('select-selected');
    selectContainer.appendChild(selectItemContainer);

    document.addEventListener('click', closeSelect);
    selectDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        selectContainer.classList.toggle('select-active');
    })
}