const FLAG_TEAMS = "TEAMS";
const FLAG_SLACK = "SLACK";

document.getElementById("copyUrlToTeamsButton").addEventListener("click", (e) => {copyCurrentTabUrlToClipboard(FLAG_TEAMS)});
document.getElementById("copyUrlToSlackButton").addEventListener("click", (e) => {copyCurrentTabUrlToClipboard(FLAG_SLACK)});

function copyCurrentTabUrlToClipboard(outputPreference) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {

        const currentTabUrl = tabs[0].url;
        const currentTabTitle = tabs[0].title;
        const currentTabTitleFriendly = currentTabTitle.split('|')[0].trim();

        const hyperlink = (() => {
            if(outputPreference == FLAG_TEAMS) {
                return `<a href="${currentTabUrl}">${currentTabTitleFriendly}</a>`;
            }
    
            if(outputPreference == FLAG_SLACK) {
                return `<${currentTabUrl}|${currentTabTitleFriendly}>`;
            }
        })();

        copyToClipboard(hyperlink, function(success) {
            if (success) {
                var customMessage = "Hyperlink copied to clipboard: " + currentTabTitleFriendly;
                console.log(customMessage);
            } else {
                console.error('Error copying hyperlink to clipboard');
            }
        });
    });
}

function copyToClipboard(html, callback) {

    const blobHtml = new Blob([html], { type: "text/html" });
    const blobText = new Blob([html], { type: "text/plain" });
    const item = [new ClipboardItem({
        ["text/plain"]: blobText,
        ["text/html"]: blobHtml,
    })];

    if (navigator.clipboard && navigator.clipboard.write) {
        console.log("Writing to clipboard - " + html);
        navigator.clipboard.write(item)
            .then(function() {
                console.log("Executing Callback");
                callback(true);
            })
            .catch(function(error) {
                console.error('Error copying to clipboard:', error);
                callback(false);
            });

    } else {
        console.error('Clipboard access not available');
        callback(false);
    }
}
