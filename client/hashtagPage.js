// eslint-disable-next-line @typescript-eslint/no-var-requires
const adventureBuilder = require('./adventureBuilder.js');

function buildAdventuresBoxWithAdventures(data) {
    const mainBox = document.querySelector('.main-container');
    const adventuresBox = document.createElement('ul');
    adventuresBox.setAttribute('class', 'adventure-boxes');
    mainBox.appendChild(adventuresBox);
    adventureBuilder.buildAdventures(data);
}

function buildEmptyAdventuresBox(notification) {
    const mainBox = document.querySelector('.main-container');
    const notificationBox = document.createElement('div');
    notificationBox.innerHTML = notification;
    mainBox.appendChild(notificationBox);
}

async function loadAdventuresByHashtag() {
    const urlParams = new URLSearchParams(window.location.search);
    const hashtagName = urlParams.get('name');
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hashtagName }),
    };

    await fetch('/load-hashtag-adventures', fetchOptions).then(response => {
        response
            .json()
            .then(data => {
                if (data.length !== 0) {
                    buildAdventuresBoxWithAdventures(data);
                } else {
                    buildEmptyAdventuresBox(
                        'Похоже этот Тэг только появился, раз к нему не привязаны приключения! Попробуйте позже!',
                    );
                }
            })
            .catch(err => buildEmptyAdventuresBox('На сервере произошла ошибка! Попробуйте позже.' + err));
    });
}

window.addEventListener('DOMContentLoaded', function(event) {
    loadAdventuresByHashtag();
});
