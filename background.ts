import { normalize, apiRequest } from "~util";
import { api } from "~constants";

export { }

// According to the docs, this:
// > Fires when the active tab in a window changes. Note that the tab's URL may
// > not be set at the time this event fired, but you can listen to onUpdated
// > events so as to be notified when a URL is set.
chrome.tabs.onActivated.addListener(onOpenTab);
chrome.tabs.onUpdated.addListener(onOpenTab);
chrome.runtime.onMessage.addListener(onPopupMessage);
chrome.runtime.onInstalled.addListener(onInstall)

// Use a white font on a red background, for extra emphasis.
chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
chrome.action.setBadgeTextColor({ color: "#FFFFFF" });

let currentUrl = "";

function onInstall(details: chrome.runtime.InstalledDetails) {
    if (details.reason !== chrome.runtime.OnInstalledReason.INSTALL) {
        return;
    }
    chrome.tabs.create({ url: "tabs/register.html" })
}

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

function setIconBadge(notes: Array<Object> | null) {
    let badgeText = "";
    if (notes !== null && notes.length > 0) {
        badgeText = notes.length.toString();
    }
    chrome.action.setBadgeText({ text: badgeText });
}

type ApiError = {
    error: string;
};
type ApiNote = {
    url: string;
    note: string;
}
type ApiNotes = [ApiNote];

function onPopupMessage(request: any, _: any, sendResponse: (response?: ApiNotes | ApiError) => void) {
    switch (request.contentScriptQuery) {
        case "getNotes":
            const maybeNotes = encounteredNotes[currentUrl];
            sendResponse(maybeNotes);
    }
    return true;
}

let encounteredNotes = {};

async function getNotesFor(url: string) {
    console.debug("Retrieving notes for URL: " + url);
    const notes = await apiRequest(api.postNotes, { "url": url, "limit": 5 })
    console.log(notes);
    if (!notes.hasOwnProperty("error")) {
        setIconBadge(notes as Array<Object>);
    }
    encounteredNotes[url] = notes;
}