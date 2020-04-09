function buildLoader(parentElement) {
    const loaderBox = document.createElement('div');
    loaderBox.setAttribute('class', 'loader-container');
    const loader = document.createElement('div');
    loader.setAttribute('class', 'loader');
    loaderBox.appendChild(loader);
    parentElement.appendChild(loaderBox);
}

function removeLoader() {
    const loaderElem = document.querySelector('.loader-container');
    loaderElem.remove();
}

module.exports = {
    buildLoader,
    removeLoader,
};
