import { normalize, hasStatusCode } from "./util";

export { }

// According to the docs, this:
// > Fires when the active tab in a window changes. Note that the tab's URL may
// > not be set at the time this event fired, but you can listen to onUpdated
// > events so as to be notified when a URL is set.
chrome.tabs.onActivated.addListener(onOpenTab);
chrome.tabs.onUpdated.addListener(onOpenTab);
chrome.runtime.onMessage.addListener(onPopupMessage);

// Use a white font on a red background, for extra emphasis.
chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
chrome.action.setBadgeTextColor({ color: "#FFFFFF" });

let currentUrl = "";

function onOpenTab(_: any) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        // The URL can be undefined, like on a new tab page.
        if (url === undefined) {
            return;
        }
        getNotesFor(normalize(url));
        currentUrl = normalize(url);
    });
}

function setIconBadge(notes: object[] | null) {
    let badgeText = "";
    if (notes !== null) {
        badgeText = notes.length.toString();
    }
    chrome.action.setBadgeText({ text: badgeText });
}

function onPopupMessage(request: any, _: any, sendResponse: (response?: any) => void) {
    switch (request.contentScriptQuery) {
        case "getNotes":
            let maybeNotes = encounteredNotes[currentUrl];
            if (maybeNotes !== undefined && maybeNotes !== null) {
                console.log("Sending " + maybeNotes.length + " notes to popup.");
                sendResponse(maybeNotes);
            } else {
                sendResponse(null);
            }
    }
    return true;
}

let encounteredNotes = {};

async function getNotesFor(url: string) {
    console.log("Getting notes for " + url);
    let response: Response;
    try {
        response = await fetch("http://localhost:8080/notes", {
            method: "POST",
            headers: {
                "X-Auth-Token": "fae6cfd76dac8fc948996a0d8e8ca4e2fb3eadb9fda27b946a64fd45f09bfc36",
            },
            body: JSON.stringify({
                url: url,
                limit: 10,
            }),
        });
    } catch (error) {
        console.error("Error retrieving notes from backend: " + error);
        console.error(error);
        return;
    }
    if (!hasStatusCode(response, 200)) {
        return
    }

    const notes = await response.json();
    setIconBadge(notes);
    encounteredNotes[url] = notes;
}