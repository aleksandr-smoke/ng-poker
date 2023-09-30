import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TUI_SANITIZER, TuiButtonModule } from "@taiga-ui/core";
import { NgModule } from '@angular/core';
import { ImportComponent } from './import.component';
import { TuiInputFilesModule } from '@taiga-ui/kit';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [ImportComponent],
    exports: [ImportComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TuiInputFilesModule,
        TuiButtonModule,
    ],
    providers: [
        { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    ],
})
export class ParserModule {}
