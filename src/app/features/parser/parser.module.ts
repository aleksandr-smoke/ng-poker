import { TuiFiles } from "@taiga-ui/kit";
import { TuiButton } from "@taiga-ui/core";
import { NgModule } from '@angular/core';
import { ImportComponent } from './import.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [ImportComponent],
    exports: [ImportComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TuiButton,
        ...TuiFiles,
    ],
    providers: [],
})
export class ParserModule {}
