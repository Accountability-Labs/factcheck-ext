import { ApiKey, Backend, apiErrPrefix, storage } from "~constants";

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

export async function apiRequest(
    endpoint: { method: string, path: string },
    body?: object
): Promise<object[] | ApiError> {
    try {
        const apiKey = await storage.get(ApiKey);
        if (apiKey === undefined) {
            return { "error": "You are not logged in." } as unknown as Promise<ApiError>;
        }
        let reqInit = {
            method: endpoint.method,
            headers: {
                "X-Auth-Token": apiKey,
                "Content-Type": "application/json",
            }
        }
        if (body !== undefined) {
            reqInit["body"] = JSON.stringify(body);
        }
        const response = await fetch(Backend + endpoint.path, reqInit);
        const jsonBody = await response.json();
        if ("error" in jsonBody) {
            // Make the error message more descriptive.
            jsonBody.error = apiErrPrefix[endpoint.path] + jsonBody.error;
        }
        return jsonBody;
    } catch (error) {
        console.error("Error talking to backend API: " + error);
        return { "error": "Error talking to backend API." } as unknown as Promise<ApiError>
    }
}