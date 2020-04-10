const adventuresBuilder = require('./adventureBuilder.js');
const loaderBuilder = require('./loaderBuilder.js');
const config = require('../config/adventuresPageConfig.js');

const LOAD_POINT_ID = config.loadPointId;
let currentPage = config.clientStartPage;
let isLoading = false;

function buildAdventuresBoxWithAdventures(data, hashtagEventFunc) {
    const mainBox = document.querySelector('.main-container');
    const adventuresBox = document.createElement('ul');
    adventuresBox.setAttribute('class', 'adventure-boxes');
    mainBox.appendChild(adventuresBox);
    adventuresBuilder.buildAdventures(data, hashtagEventFunc);
}

function rebuildMainBoxForHashtagPage(hashtagRuName) {
    document.querySelector('.main-container').remove();
    const mainBox = document.createElement('div');
    mainBox.setAttribute('class', 'main-container');
    const hashtagBox = document.createElement('div');
    hashtagBox.setAttribute('class', 'searching-hashtag');
    hashtagBox.innerHTML = hashtagRuName;
    mainBox.appendChild(hashtagBox);
    document.body.appendChild(mainBox);
}

async function loadAdventuresByHashtag() {
    rebuildMainBoxForHashtagPage(this.hashtagRuName);
    loaderBuilder.buildLoader(document.querySelector('.main-container'));

    await fetch('/hashtag?name=' + this.hashtagName)
        .then(response => {
            response
                .json()
                .then(data => {
                    if (data.length !== 0) {
                        buildAdventuresBoxWithAdventures(data, loadAdventuresByHashtag);
                        window.history.pushState(
                            Object.assign(data, { hashtagRuName: this.hashtagRuName, pageType: 'hashtag' }),
                            '',
                            '/hashtag?name=' + this.hashtagName,
                        );
                    } else {
                        adventuresBuilder.buildEmptyAdventuresBox(
                            'Похоже этот Тэг только появился, раз к нему не привязаны приключения! Попробуйте позже!',
                        );
                    }
                })
                .catch(err =>
                    adventuresBuilder.buildEmptyAdventuresBox(
                        'Что-то странное пришло от сервера, не могу корректно прочитать...' + err,
                    ),
                );
        })
        .catch(() => adventuresBuilder.buildEmptyAdventuresBox('На сервере произошла ошибка! Попробуйте позже.'))
        .finally(() => loaderBuilder.removeLoader());
}

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
                    adventuresBuilder.buildAdventures(data, loadAdventuresByHashtag);
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
    window.history.pushState({}, '', '/');
    createAdventuresLoadObserver();
};

function setHashtagListener() {
    const hashtagElems = document.querySelectorAll('.hashtag-button');
    for (const el of hashtagElems) {
        el.onclick = loadAdventuresByHashtag.bind({
            hashtagName: el.getAttribute('hashtag-name'),
            hashtagRuName: el.innerHTML,
        });
    }
}

document.addEventListener('DOMContentLoaded', setHashtagListener);
window.addEventListener('popstate', function(e) {
    const data = e.state;
    if (data !== null) {
        if (data.pageType) {
            rebuildMainBoxForHashtagPage(data.hashtagRuName);
            buildAdventuresBoxWithAdventures(data, loadAdventuresByHashtag);
        } else {
            window.location.replace('/');
        }
    }
});
