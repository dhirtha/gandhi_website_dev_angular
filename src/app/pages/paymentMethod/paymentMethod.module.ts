import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {CreditOrOnlineDialog} from './paymentMethod.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
    ],
    declarations:[
        CreditOrOnlineDialog
    ]
})
export class CreditOrOnlineDialogModule {}


