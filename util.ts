
export function hasStatusCode(resp: Response, code: number): boolean {
    if (resp.status === code) {
        return true
    }
    console.error("Backend request failed with status code: "
        + resp.status + " " + resp.statusText);

    return false;
}