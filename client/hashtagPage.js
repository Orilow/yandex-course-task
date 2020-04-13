const adventuresBuilder = require('./adventureBuilder.js');

window.addEventListener('popstate', function(e) {
    const data = e.state;
    if (data !== null) {
        if (data.pageType) {
            if (data.withJSON) {
                adventuresBuilder.rebuildMainBoxForHashtagPage(data.hashtagRuName);
                adventuresBuilder.buildAdventuresBoxWithAdventures(data, adventuresBuilder.loadAdventuresByHashtag);
            }
        } else {
            window.location.reload(true);
        }
    }
});
