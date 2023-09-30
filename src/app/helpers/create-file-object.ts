export function createFileObject(path: string, name: string, type: string): Promise<File> {
    return fetch(path).then(
        (response: Response) =>
            response.blob().then((blob: Blob) => new File([blob], name, { type })),
    );
}
