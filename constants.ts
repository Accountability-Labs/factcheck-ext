export const ApiKey = "api_key";
export const Backend = "https://factcheck.nymity.ch";

// Path and method of our API endpoints.
export const api = {
    postNotes: { method: "POST", path: "/notes" },
    postNote: { method: "POST", path: "/note" },
    postVote: { method: "POST", path: "/vote" },
    postUser: { method: "POST", path: "/user" },
};

// Human-readable error prefixes for each API endpoint.
export const apiErrPrefix = {
    [api.postNotes.path]: "Failed to fetch notes: ",
    [api.postNote.path]: "Failed to post note: ",
    [api.postVote.path]: "Failed to submit vote: ",
    [api.postUser.path]: "Failed to register: ",
};