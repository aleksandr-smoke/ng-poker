import { FormControl } from '@angular/forms';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tuiIsPresent } from '@taiga-ui/cdk';
import { Observable, Subject, of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';
import { readTextFile } from '../../helpers/read-file';
import { createFileObject } from '../../helpers/create-file-object';
import { parseHistory } from './parse-history';
import { PokerHand } from '../../models/poker-hand/poker-hand';

@Component({
    selector: 'app-import-hands',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportComponent implements OnInit {
    @Output() parsed = new EventEmitter<PokerHand[]>();

    public fileControl = new FormControl();
    public selectedFile$ = this.fileControl.valueChanges.pipe(
        filter(tuiIsPresent),
        switchMap((file: File) => this.readFile(file)),
    );
    public rejectedFile$ = new Subject<File | null>();
    public textReaded$ = new Subject<string>();

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    public ngOnInit() {
        createFileObject('assets/examples/hands/holdem-1.txt', 'holdem-1.txt', 'text/plain')
            .then((file: File) => this.fileControl.setValue(file));
    }

    public removeFile(): void {
        this.fileControl.setValue(null);
    }

    private readFile(file: File): Observable<File | null> {
        return readTextFile(file as File).pipe(
            tap((output: string) => {
                this.textReaded$.next(output);
                const parsedHands: PokerHand[] = parseHistory(output);

                this.parsed.emit(parsedHands);
                this.rejectedFile$.next(null);
            }),
            map(() => file),
            catchError(error => {
                console.error(error);
                this.rejectedFile$.next(file);
                this.parsed.emit([]);

                return of(null);
            }),
        );
    }
}
