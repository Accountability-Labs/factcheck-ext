import { Storage } from "@plasmohq/storage"
import { ApiKey, Backend } from "~constants";

const storage = new Storage()

export function fmtTime(dateTime: string): string {
    let parsedDateTime = new Date(Date.parse(dateTime));
    return parsedDateTime.toDateString();
}

export function normalize(site: string): string {
    return site.replace(/\/+$/, "");
}

export type ApiError = {
    error: string;
};

export async function apiRequest(method: string, path: string, body?: object): Promise<object[] | ApiError> {
    try {
        let reqInit = {
            method: method,
            headers: {
                "X-Auth-Token": await storage.get(ApiKey),
                "Content-Type": "application/json",
            }
        }
        if (body !== undefined) {
            reqInit["body"] = JSON.stringify(body);
        }
        const response = await fetch(Backend + path, reqInit);
        if ("error" in response) {
            response.error = "Backend reports \"" + response.error + "\".";
        }
        return response.json();
    } catch (error) {
        console.error("Error talking to backend API: " + error);
        return { "error": "Error talking to backend API." } as unknown as Promise<ApiError>
    }
}