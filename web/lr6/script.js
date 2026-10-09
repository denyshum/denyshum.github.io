// ==============================
// DOM
// ==============================
const tabsContainer = document.querySelector('#tabs');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const topLeft = document.querySelector('#top-left');
const topRight = document.querySelector('#top-right');
const bottomRight = document.querySelector('#bottom-right');
const bottomLeft = document.querySelector('#bottom-left');
const topLeftValue = document.querySelector('#top-left-value');
const topRightValue = document.querySelector('#top-right-value');
const bottomRightValue = document.querySelector('#bottom-right-value');
const bottomLeftValue = document.querySelector('#bottom-left-value');
const fontSize = document.querySelector('#font-size');
const fontSizeValue = document.querySelector('#font-size-value');
const textAlign = document.querySelector('#text-align');
const preview = document.querySelector('#preview');
const previewButton = document.querySelector('#preview-button');
const coordinates = document.querySelector('#coordinates');
const cssCode = document.querySelector('#css-code');
const copyButton = document.querySelector('#copy-button');
const copyMessage = document.querySelector('#copy-message');
const presetForm = document.querySelector('#preset-form');
const presetName = document.querySelector('#preset-name');
const presetError = document.querySelector('#preset-error');
const scrollTopButton = document.querySelector('#scroll-top');

// ==============================
// CSS CODE
// ==============================
function updateCSS() {
    const radius = `${topLeft.value}px ${topRight.value}px ${bottomRight.value}px ${bottomLeft.value}px`;

    cssCode.value = [
        `border-radius: ${radius};`,
        `font-size: ${fontSize.value}px;`,
        `text-align: ${textAlign.value};`
    ].join('\n');
}

// ==============================
// TABS
// ==============================
function hideTabs() {
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    tabContents.forEach(tabContent => {
        tabContent.classList.remove('active');
    });
}

function showTab(tabName) {
    const tab = document.querySelector(`[data-tab="${tabName}"]`);
    const tabContent = document.querySelector(`[data-content="${tabName}"]`);

    tab.classList.add('active');
    tabContent.classList.add('active');
}

tabsContainer.addEventListener('click', (event) => {
    if (!event.target.classList.contains('tab')) {
        return;
    }

    console.log(event.type);
    console.log(event.target);
    console.log(event.currentTarget);

    const tabName = event.target.dataset.tab;
    hideTabs();
    showTab(tabName);
});

// ==============================
// BORDER RADIUS
// ==============================
function generateBorderRadius() {
    topLeftValue.textContent = `${topLeft.value} px`;
    topRightValue.textContent = `${topRight.value} px`;
    bottomLeftValue.textContent = `${bottomLeft.value} px`;
    bottomRightValue.textContent = `${bottomRight.value} px`;

    preview.style.borderRadius = `${topLeft.value}px ${topRight.value}px ${bottomRight.value}px ${bottomLeft.value}px`;
    updateCSS();
}

topLeft.addEventListener('input', generateBorderRadius);
topRight.addEventListener('input', generateBorderRadius);
bottomLeft.addEventListener('input', generateBorderRadius);
bottomRight.addEventListener('input', generateBorderRadius);

// ==============================
// FONT SIZE
// ==============================
function generateFontSize() {
    fontSizeValue.textContent = `${fontSize.value} px`;
    preview.style.fontSize = `${fontSize.value}px`;
    
    updateCSS();
}

fontSize.addEventListener('input', generateFontSize);

// ==============================
// TEXT ALIGN
// ==============================
function generateTextAlign() {
    preview.style.textAlign = textAlign.value;
    
    updateCSS();
}

textAlign.addEventListener('change', generateTextAlign);

// ==============================
// COPY
// ==============================
function copyCSS() {
    navigator.clipboard.writeText(cssCode.value)
        .then(() => {
            copyMessage.textContent = 'CSS-код скопійовано';
        })
        .catch(() => {
            copyMessage.textContent = 'Не вдалося скопіювати';
        });
}

copyButton.addEventListener('click', copyCSS);

// ==============================
// FORM
// ==============================
function validatePresetName() {
    if (presetName.value.trim() === '') {
        presetName.classList.add('error');
        presetError.textContent = 'Введіть назву пресета';
        return false;
    }

    presetName.classList.remove('error');
    presetError.textContent = '';
    return true;
}

function handlePresetSubmit(event) {
    event.preventDefault();

    if (!validatePresetName()) {
        return;
    }

    console.log(`Пресет: ${presetName.value.trim()}`);
    console.log(cssCode.value);
}

presetName.addEventListener('focus', () => {
   presetName.classList.add('focused'); 
});

presetName.addEventListener('blur', () => {
    presetName.classList.remove('focused');
    validatePresetName();
});

presetForm.addEventListener('submit', handlePresetSubmit);

// ==============================
// KEYBOARD
// ==============================
function handleKeyDown(event) {
    if (event.key !== 'Escape') {
        return;
    }

    topLeft.value = 0;
    topRight.value = 0;
    bottomLeft.value = 0;
    bottomRight.value = 0;

    fontSize.value = 16;
    textAlign.value = 'left';

    generateBorderRadius();
    generateFontSize();
    generateTextAlign();
}

document.addEventListener('keydown', handleKeyDown);

// ==============================
// SCROLL
// ==============================
function handleScroll() {
    if (window.scrollY > 300) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==============================
// PREVIEW
// ==============================
preview.addEventListener('click', () => {
    console.log("Preview click");
});

previewButton.addEventListener('click', (event)=> {
    event.stopPropagation();
    console.log('Button click');
});

preview.addEventListener('mouseover', () => {
    preview.classList.add('hovered');
});

preview.addEventListener('mouseout', () => {
    preview.classList.remove('hovered');
});

preview.addEventListener('mousemove', (event) => {
    coordinates.textContent = `X: ${event.clientX}; Y: ${event.clientY}`;
    console.log(`pageX: ${event.pageX}; pageY: ${event.pageY}`);
});

// ==============================
// INIT
// ==============================
generateBorderRadius();
generateFontSize();
generateTextAlign();