import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CustomisedQuotationComponent } from './customisedQuotation.component';

export const routes = [
  { path: '', component: CustomisedQuotationComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    CustomisedQuotationComponent
  ]
})
export class CustomisedQuotationModule { }
