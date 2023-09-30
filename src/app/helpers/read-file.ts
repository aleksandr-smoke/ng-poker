import { Observable, Subscriber, throwError } from 'rxjs';

export const readTextFile = (blob: Blob): Observable<string> => {
    if (!(blob instanceof Blob)) {
        return throwError(() => new Error('`blob` must be an instance of File or Blob.'));
    }

    return new Observable((observer: Subscriber<string>) => {
        const reader = new FileReader();

        reader.onerror = err => observer.error(err);
        reader.onabort = err => observer.error(err);
        reader.onload = () => {
            if (reader.result && typeof reader.result === 'string')  {
                observer.next(reader.result);
            } else {
                observer.error(new Error('File Reader output is not String type'));
            }
        };
        reader.onloadend = () => observer.complete();

        return reader.readAsText(blob);
    });
};
