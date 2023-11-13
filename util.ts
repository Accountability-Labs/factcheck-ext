import { Storage } from "@plasmohq/storage"
import { ApiKey } from "~constants";

const storage = new Storage()

export function fmtTime(dateTime: string): string {
    let parsedDateTime = new Date(Date.parse(dateTime));
    return parsedDateTime.toDateString();
}

export function hasStatusCode(resp: Response, code: number): boolean {
    if (resp.status === code) {
        return true
    }
    console.error("Backend request failed with status code: "
        + resp.status + " " + resp.statusText);

    return false;
}

export function normalize(site: string): string {
    return site.replace(/\/+$/, "");
}

export async function makeReq(method: string, endpoint: string, note_id: number, vote: number): Promise<boolean> {
    let response: Response;
    try {
        response = await fetch(endpoint, {
            method: method,
            headers: {
                "X-Auth-Token": "fae6cfd76dac8fc948996a0d8e8ca4e2fb3eadb9fda27b946a64fd45f09bfc36",
            },
            body: JSON.stringify({
                note_id: note_id,
                vote: vote,
            }),
        });
    } catch (error) {
        console.error("Error posting vote to backend: " + error);
    }

    if (hasStatusCode(response, 200)) {
        console.log("Successfully posted vote to backend.");
        return true;
    }
    return false;
}

export async function registerUser(form: FormData): Promise<string> {
    let response: Response;
    try {
        response = await fetch("http://localhost:8080/user", {
            method: "POST",
            body: JSON.stringify(Object.fromEntries(form)),
        });
    } catch (error) {
        console.error("Error registering user with backend: " + error);
    }

    if (hasStatusCode(response, 201)) {
        console.log("Successfully registered user with backend.");
        console.log(response);
        return response.json();
    }
    return "";
}

export async function postRating(note_id: number, vote: number): Promise<boolean> {
    let response: Response;
    try {
        response = await fetch("http://localhost:8080/vote", {
            method: "POST",
            headers: {
                "X-Auth-Token": "fae6cfd76dac8fc948996a0d8e8ca4e2fb3eadb9fda27b946a64fd45f09bfc36",
            },
            body: JSON.stringify({
                note_id: note_id,
                vote: vote,
            }),
        });
    } catch (error) {
        console.error("Error posting vote to backend: " + error);
    }

    if (hasStatusCode(response, 200)) {
        console.log("Successfully posted vote to backend.");
        return true;
    }
    return false;
}

async function getHeaders(): Promise<Headers> {
    const h = {
        "X-Auth-Token": await storage.get(ApiKey),
    }
    return new Headers(h);
}

export async function postNote(url: string, note: string): Promise<boolean> {
    let response: Response;
    try {
        response = await fetch("http://localhost:8080/note", {
            method: "POST",
            headers: await getHeaders(),
            body: JSON.stringify({
                url: normalize(url),
                note: note,
            }),
        });
    } catch (error) {
        console.error("Error posting note to backend: " + error);
    }

    if (hasStatusCode(response, 201)) {
        console.log("Successfully posted note to backend.");
        return true;
    }
    return false;
}