import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PaymentComponent } from './payment.component';

export const routes = [
  { path: '', component: PaymentComponent, pathMatch: 'full' } 
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    PaymentComponent
  ]
})
export class PaymentModule { }
