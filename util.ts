
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

export async function postNote(url: string, note: string): Promise<boolean> {
    let response: Response;
    try {
        response = await fetch("http://localhost:8080/note", {
            method: "POST",
            headers: {
                "X-Auth-Token": "fae6cfd76dac8fc948996a0d8e8ca4e2fb3eadb9fda27b946a64fd45f09bfc36",
            },
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