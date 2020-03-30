const LOAD_POINT_ID = 'loadMore';
const DEFAULT_ADVENTURES_COUNT = 5;

function buildAdditionalAdventures(data) {
    const staticBasePath = data.staticBasePath;
    const defaultPictureLink = data.defaultPictureLink;
    const adventures = JSON.parse(data.adventures);
    let adventuresCounter = DEFAULT_ADVENTURES_COUNT;
    for (const adventure of adventures) {
        adventuresCounter++;
        const newAdventure = document.createElement('li');
        newAdventure.setAttribute('class', 'adventure-box');

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
        newAdventure.appendChild(imgBox);

        const adventureInfo = document.createElement('section');
        adventureInfo.setAttribute('class', 'adventure-info');
        const adventureNameSection = document.createElement('section');
        adventureNameSection.setAttribute('class', 'adventure-name');
        const adventureName = document.createElement('a');
        adventureName.innerHTML = adventure.name;
        if (adventuresCounter % 5 === 0) {
            adventureName.setAttribute('id', LOAD_POINT_ID);
            adventureName.setAttribute('custom-offset', adventuresCounter);
        }
        adventureName.setAttribute('href', '/scene?id=' + adventure.firstSceneId);

        adventureNameSection.appendChild(adventureName);
        adventureInfo.appendChild(adventureNameSection);

        if (adventure.description) {
            const adventureDescription = document.createElement('section');
            adventureDescription.setAttribute('class', 'adventure-description');
            adventureDescription.innerHTML = adventure.description;
            adventureInfo.appendChild(adventureDescription);
        }

        if (adventure.hashtags) {
            const hashtagsSection = document.createElement('section');
            hashtagsSection.setAttribute('class', 'adventure-hashtags');
            for (const hashtag of adventure.hashtags) {
                const hashtag = document.createElement('a');
                hashtag.setAttribute('class', 'hashtag-button');
                hashtag.setAttribute('href', '/hashtag?name=' + hashtag.name);
                hashtag.innerHTML = hashtag.ruName;
                hashtagsSection.appendChild(hashtag);
            }
            adventureInfo.appendChild(hashtagsSection);
        }

        newAdventure.appendChild(adventureInfo);

        const adventureList = document.querySelector('.adventure-boxes');
        adventureList.appendChild(newAdventure);
    }
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
            body: JSON.stringify({ loadAfterNumber: offset }),
        };

        await fetch('/load-more-adventures', options).then(response => {
            response.json().then(data => {
                if (data !== '[]') {
                    buildAdditionalAdventures(data);
                }
            });
        });
        window.localObserver.unobserve(target);
        target.removeAttribute('id');
        target.removeAttribute('custom-offset');
    }
    return loadFromDB;
}

function loadMoreAdventures() {
    const options = {
        rootMargin: '0px',
        threshold: 0.1,
    };
    const askDB = askDBCreator();
    const observer = new IntersectionObserver(askDB, options);
    window.localObserver = observer;
    const target = document.getElementById(LOAD_POINT_ID);

    observer.observe(target);
}

document.addEventListener('DOMContentLoaded', function(event) {
    loadMoreAdventures();
});
