const config = require('../config/adventuresPageConfig.js');
const loaderBuilder = require('./loaderBuilder.js');
const ADVENTURES_LIMIT = config.limit;
const LOAD_POINT_ID = config.loadPointId;

function buildEmptyAdventuresBox(notification) {
    const mainBox = document.querySelector('.main-container');
    const notificationBox = document.createElement('div');
    notificationBox.innerHTML = notification;
    mainBox.appendChild(notificationBox);
}

function addHashtagListener(func) {
    const hashtagElems = document.querySelectorAll('.hashtag-button');
    for (const el of hashtagElems) {
        el.onclick = function(event) {
            event.preventDefault();
            const currentHistoryState = history.state;
            history.replaceState(
                Object.assign(currentHistoryState, { withJSON: true, prevUrl: window.location.href }),
                '',
                window.location,
            );
            const context = {
                hashtagName: el.getAttribute('hashtag-name'),
                hashtagRuName: el.innerHTML,
            };
            console.log(func);
            func.call(context);
        };
    }
}

function buildImageSection(adventure, staticBasePath, defaultPictureLink) {
    const imgBox = document.createElement('div');
    imgBox.setAttribute('class', 'adventure-img-box');
    const img = document.createElement('img');
    img.setAttribute('class', 'adventure-img');
    img.setAttribute('src', staticBasePath + (adventure.pictureLink || defaultPictureLink));
    imgBox.appendChild(img);

    return imgBox;
}

function buildAdventureHashtagsSection(adventure, hashtagFunc) {
    const hashtagsSection = document.createElement('section');
    hashtagsSection.setAttribute('class', 'adventure-hashtags');
    for (const hashtag of adventure.hashtags) {
        const hashtagElem = document.createElement('a');
        hashtagElem.setAttribute('class', 'hashtag-button');
        hashtagElem.setAttribute('hashtag-name', hashtag.name);
        hashtagElem.setAttribute('href', '/hashtag?name=' + hashtag.name);
        hashtagElem.innerHTML = hashtag.ruName;
        hashtagsSection.appendChild(hashtagElem);
    }
    return hashtagsSection;
}

function buildAdventureNameSection(adventure) {
    const adventureNameSection = document.createElement('section');
    adventureNameSection.setAttribute('class', 'adventure-name');
    const adventureName = document.createElement('a');
    adventureName.innerHTML = adventure.name;
    adventureName.setAttribute('href', '/scene?id=' + adventure.firstSceneId);

    adventureNameSection.appendChild(adventureName);
    return adventureNameSection;
}

function buildAdventureInfoSection(adventure) {
    const adventureInfo = document.createElement('section');
    adventureInfo.setAttribute('class', 'adventure-info');
    const adventureNameSection = buildAdventureNameSection(adventure);
    adventureInfo.appendChild(adventureNameSection);

    if (adventure.description) {
        const adventureDescription = document.createElement('section');
        adventureDescription.setAttribute('class', 'adventure-description');
        adventureDescription.innerHTML = adventure.description;
        adventureInfo.appendChild(adventureDescription);
    }

    if (adventure.hashtags.length > 0) {
        const hashtagsSection = buildAdventureHashtagsSection(adventure);
        adventureInfo.appendChild(hashtagsSection);
    }

    return adventureInfo;
}

function buildAdventures(data, hashtagEventFunc) {
    const { staticBasePath, defaultPictureLink, adventures } = data;
    let adventuresCounter = ADVENTURES_LIMIT;
    for (const adventure of adventures) {
        adventuresCounter++;
        const newAdventure = document.createElement('li');
        newAdventure.setAttribute('class', 'adventure-box');

        const imgBox = buildImageSection(adventure, staticBasePath, defaultPictureLink);
        newAdventure.appendChild(imgBox);

        const adventureInfo = buildAdventureInfoSection(adventure);
        newAdventure.appendChild(adventureInfo);

        if (adventuresCounter % ADVENTURES_LIMIT === 0) {
            const observeredDiv = document.createElement('div');
            observeredDiv.setAttribute('id', LOAD_POINT_ID);
            newAdventure.appendChild(observeredDiv);
            window.localObserver.observe(observeredDiv);
        }

        const adventureList = document.querySelector('.adventure-boxes');
        adventureList.appendChild(newAdventure);
    }
    addHashtagListener(hashtagEventFunc);
}

function buildAdventuresBoxWithAdventures(data, hashtagEventFunc) {
    const mainBox = document.querySelector('.main-container');
    const adventuresBox = document.createElement('ul');
    adventuresBox.setAttribute('class', 'adventure-boxes');
    mainBox.appendChild(adventuresBox);
    buildAdventures(data, hashtagEventFunc);
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

    await fetch('/load-hashtag-adventures?name=' + this.hashtagName)
        .then(response => response.json())
        .then(data => {
            if (data.length !== 0) {
                buildAdventuresBoxWithAdventures(data, loadAdventuresByHashtag);
                window.history.pushState(
                    Object.assign(data, { hashtagRuName: this.hashtagRuName, pageType: 'hashtag' }),
                    '',
                    '/hashtag?name=' + this.hashtagName,
                );
            } else {
                buildEmptyAdventuresBox(
                    'Похоже этот Тэг только появился, раз к нему не привязаны приключения! Попробуйте позже!',
                );
            }
        })
        .catch(error => buildEmptyAdventuresBox('Ах, произошла ошибка! Передайте разработчикам сайта это: ' + error))
        .finally(() => loaderBuilder.removeLoader());
}

module.exports = {
    addHashtagListener,
    buildAdventures,
    buildAdventuresBoxWithAdventures,
    buildEmptyAdventuresBox,
    loadAdventuresByHashtag,
    rebuildMainBoxForHashtagPage,
};
