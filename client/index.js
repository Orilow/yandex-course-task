// eslint-disable-next-line @typescript-eslint/no-var-requires
const adventuresBuilder = require('./adventureBuilder.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const loaderBuilder = require('./loaderBuilder.js');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config/adventuresPageConfig.js');

const LOAD_POINT_ID = config.loadPointId;
let currentPage = config.clientStartPage;
let isLoading = false;

function buildErrorNotification() {
    const notification = document.createElement('span');
    notification.innerText = 'Сервер не отвечает... :( Попробуй позже еще раз!';
    const adventureList = document.querySelector('.adventure-boxes');
    adventureList.appendChild(notification);
}

async function loadFromDB(entries, observer) {
    if (isLoading) {
        return;
    }
    const target = document.getElementById(LOAD_POINT_ID);
    isLoading = true;
    loaderBuilder.buildLoader(document.querySelector('.main-container'));
    window.localObserver.unobserve(target);
    target.remove();
    await fetch('/load-more-adventures?page=' + currentPage)
        .then(response => {
            response.json().then(data => {
                if (data.length !== 0) {
                    adventuresBuilder.buildAdventures(data);
                }
            });
            currentPage++;
        })
        .catch(() => buildErrorNotification())
        .finally(() => {
            isLoading = false;
            loaderBuilder.removeLoader();
        });
}

function tryGetMoreAdventures(entries) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            loadFromDB();
        }
    }
}

function createAdventuresLoadObserver() {
    const options = {
        threshold: 1,
    };
    const observer = new IntersectionObserver(tryGetMoreAdventures, options);
    window.localObserver = observer;
    const target = document.getElementById(LOAD_POINT_ID);

    observer.observe(target);
}

window.onload = function() {
    createAdventuresLoadObserver();
};
