import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MobilePaymentDetailComponent } from './mobilePaymentDetail.component';

export const routes = [
  { path: '', component: MobilePaymentDetailComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    MobilePaymentDetailComponent
  ]
})
export class MobilePaymentDetailModule { }
