import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { upiPaymentTestComponent } from './upiPaymentTest.component';

export const routes = [
  { path: '', component: upiPaymentTestComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    upiPaymentTestComponent
  ]
})
export class UpiPaymentTestModule { }
