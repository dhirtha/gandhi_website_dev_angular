import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmOrderComponent } from './confirm-order.component';
import {FileAttachmentModeModule} from '../fileAttachmentMode/fileAttachmentMode.module';

export const routes = [
  { path: '', component: ConfirmOrderComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    ConfirmOrderComponent
  ]
})
export class ConfirmOrderModule { }
