// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../config/adventuresPageConfig.js');
const ADVENTURES_LIMIT = config.limit;
const LOAD_POINT_ID = config.loadPointId;

function buildImageSection(adventure, staticBasePath, defaultPictureLink) {
    const imgBox = document.createElement('div');
    imgBox.setAttribute('class', 'adventure-img-box');
    const img = document.createElement('img');
    img.setAttribute('class', 'adventure-img');
    img.setAttribute('src', staticBasePath + (adventure.pictureLink || defaultPictureLink));
    imgBox.appendChild(img);

    return imgBox;
}

function buildAdventureHashtagsSection(adventure) {
    const hashtagsSection = document.createElement('section');
    hashtagsSection.setAttribute('class', 'adventure-hashtags');
    for (const hashtag of adventure.hashtags) {
        const hashtagElem = document.createElement('a');
        hashtagElem.setAttribute('class', 'hashtag-button');
        hashtagElem.setAttribute('href', '/hashtag?name=' + hashtag.name);
        hashtagElem.innerHTML = hashtag.ruName;
        hashtagsSection.appendChild(hashtagElem);
    }
    return hashtagsSection;
}

function buildAdventureNameSection(adventure, adventuresCounter) {
    const adventureNameSection = document.createElement('section');
    adventureNameSection.setAttribute('class', 'adventure-name');
    const adventureName = document.createElement('a');
    adventureName.innerHTML = adventure.name;
    adventureName.setAttribute('href', '/scene?id=' + adventure.firstSceneId);

    adventureNameSection.appendChild(adventureName);
    return adventureNameSection;
}

function buildAdventureInfoSection(adventure, adventuresCounter) {
    const adventureInfo = document.createElement('section');
    adventureInfo.setAttribute('class', 'adventure-info');
    const adventureNameSection = buildAdventureNameSection(adventure, adventuresCounter);
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

function buildAdventures(data) {
    const staticBasePath = data.staticBasePath;
    const defaultPictureLink = data.defaultPictureLink;
    const adventures = data.adventures;
    let adventuresCounter = ADVENTURES_LIMIT;
    for (const adventure of adventures) {
        adventuresCounter++;
        const newAdventure = document.createElement('li');
        newAdventure.setAttribute('class', 'adventure-box');

        const imgBox = buildImageSection(adventure, staticBasePath, defaultPictureLink);
        newAdventure.appendChild(imgBox);

        const adventureInfo = buildAdventureInfoSection(adventure, adventuresCounter);
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
}

module.exports = {
    buildAdventures,
};
