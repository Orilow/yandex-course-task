const adventureBuilder = require('./adventureBuilder.js');
const loaderBuilder = require('./loaderBuilder.js');

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
    loaderBuilder.buildLoader(document.querySelector('.main-container'));

    await fetch('/load-hashtag-adventures?name=' + hashtagName)
        .then(response => {
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
                .catch(() =>
                    buildEmptyAdventuresBox('Что-то странное пришло от сервера, не могу корректно прочитать...'),
                );
        })
        .catch(() => buildEmptyAdventuresBox('На сервере произошла ошибка! Попробуйте позже.'))
        .finally(() => loaderBuilder.removeLoader());
}

window.addEventListener('DOMContentLoaded', function(event) {
    loadAdventuresByHashtag();
});
