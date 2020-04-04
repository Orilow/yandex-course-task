const LOAD_POINT_ID = 'loadMore';
const ADVENTURES_LIMIT = 5;

function buildImageSection(adventure, staticBasePath, defaultPictureLink) {
    const imgBox = document.createElement('div');
    imgBox.setAttribute('class', 'adventure-img-box');
    const img = document.createElement('img');
    img.setAttribute('class', 'adventure-img');
    if (adventure.pictureLink) {
        img.setAttribute('src', staticBasePath + adventure.pictureLink);
    } else {
        img.setAttribute('src', staticBasePath + defaultPictureLink);
    }
    imgBox.appendChild(img);

    return imgBox;
}

function buildAdventureHashtagsSection(adventure) {
    const hashtagsSection = document.createElement('section');
    hashtagsSection.setAttribute('class', 'adventure-hashtags');
    for (const hashtag of adventure.hashtags) {
        const hashtag = document.createElement('a');
        hashtag.setAttribute('class', 'hashtag-button');
        hashtag.setAttribute('href', '/hashtag?name=' + hashtag.name);
        hashtag.innerHTML = hashtag.ruName;
        hashtagsSection.appendChild(hashtag);
    }
    return hashtagsSection;
}

function buildAdventureNameSection(adventure, adventuresCounter) {
    const adventureNameSection = document.createElement('section');
    adventureNameSection.setAttribute('class', 'adventure-name');
    const adventureName = document.createElement('a');
    adventureName.innerHTML = adventure.name;
    if (adventuresCounter % ADVENTURES_LIMIT === 0) {
        adventureName.setAttribute('id', LOAD_POINT_ID);
        adventureName.setAttribute('custom-offset', adventuresCounter);
    }
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

function buildAdditionalAdventures(data) {
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

        const adventureList = document.querySelector('.adventure-boxes');
        adventureList.appendChild(newAdventure);
    }
}

function buildErrorNotification() {
    const notification = document.createElement('span');
    notification.innerText = 'Сервер не отвечает... :( Попробуй позже еще раз!';
    const adventureList = document.querySelector('.adventure-boxes');
    adventureList.appendChild(notification);
}

function askDBCreator() {
    let counter = -1;

    async function loadFromDB() {
        counter++;
        if (counter === 0) {
            counter++;
            return;
        }

        const target = document.getElementById(LOAD_POINT_ID);
        const offset = target.getAttribute('custom-offset');
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ page: offset }),
        };

        await fetch('/load-more-adventures', options)
            .then(response => {
                response.json().then(data => {
                    if (data !== '[]') {
                        buildAdditionalAdventures(data);
                    }
                });
            })
            .catch(() => buildErrorNotification());
        window.localObserver.unobserve(target);
        target.removeAttribute('id');
        target.removeAttribute('custom-offset');
    }
    return loadFromDB;
}

function createAdventuresLoadObserver() {
    const options = {
        threshold: 1,
    };
    const askDB = askDBCreator();
    const observer = new IntersectionObserver(askDB, options);
    window.localObserver = observer;
    const target = document.getElementById(LOAD_POINT_ID);

    observer.observe(target);
}

document.addEventListener('DOMContentLoaded', function(event) {
    createAdventuresLoadObserver();
});
