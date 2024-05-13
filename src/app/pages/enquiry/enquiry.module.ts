import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { EnquiryComponent } from './enquiry.component';
import {EnquiryProvider} from './enquiry-provider';

export const routes = [
  { path: '', component: EnquiryComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    EnquiryComponent
  ],
    providers:[EnquiryProvider]
})
export class EnquiryModule { }
