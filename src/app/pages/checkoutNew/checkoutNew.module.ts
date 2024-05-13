import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {CheckoutNewComponent} from './checkoutNew.component';
import {CreditOrOnlineDialog} from '../paymentMethod/paymentMethod.component';

export const routes = [
    {path: '', component: CheckoutNewComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [
        CheckoutNewComponent,
        CreditOrOnlineDialog

    ],
    providers: [
        DatePipe
    ]
     
//    entryComponents: [CreditOrOnlineDialog]
})
export class CheckoutNewModule {}


