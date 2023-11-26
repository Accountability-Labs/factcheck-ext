import { Storage } from "@plasmohq/storage";

export const storage = new Storage()

export const ApiKey = "api_key";
export const Backend = "https://factcheck.nymity.ch";

// Path and method of our API endpoints.
export const api = {
    postNotes: { method: "POST", path: "/notes" },
    postNote: { method: "POST", path: "/note" },
    postVote: { method: "POST", path: "/vote" },
    signupUser: { method: "POST", path: "/signup" },
    signinUser: { method: "POST", path: "/signin" },
};

// Human-readable error prefixes for each API endpoint.
export const apiErrPrefix = {
    [api.postNotes.path]: "Failed to fetch notes: ",
    [api.postNote.path]: "Failed to post note: ",
    [api.postVote.path]: "Failed to submit vote: ",
    [api.signupUser.path]: "Failed to sign up: ",
    [api.signinUser.path]: "Failed to sign in: ",
};