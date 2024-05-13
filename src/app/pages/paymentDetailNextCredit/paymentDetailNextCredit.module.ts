import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PaymentDetailNextCreditComponent } from './paymentDetailNextCredit.component';

export const routes = [
  { path: '', component: PaymentDetailNextCreditComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    PaymentDetailNextCreditComponent
  ]
})
export class PaymentDetailNextCreditModule { }
