import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {ConfirmationComponent} from './confirmation.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations:[
        ConfirmationComponent
    ]
})
export class ConfirmationDialogModule {}


