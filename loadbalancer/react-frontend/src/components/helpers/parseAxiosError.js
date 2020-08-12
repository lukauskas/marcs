export default function parseAxiosError(error) {
    console.log(error);
    const { code, response } = error;

    if (response !== undefined) {
        const { status } = response;
        return `Error while fetching data: server responded with HTTP ${status}`;
    }
    return `Error while fetching data: ${code}`;
}
