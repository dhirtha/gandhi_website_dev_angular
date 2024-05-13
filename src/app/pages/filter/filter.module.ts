import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { FilterComponent } from './filter.component';
import {FilterProvider} from './filter-provider';
import {BrowserModule} from '@angular/platform-browser';

export const routes = [
  { path: '', component: FilterComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [
      CommonModule,
      RouterModule.forChild(routes),
      ReactiveFormsModule,
      SharedModule,
      BrowserModule
    ],
    declarations: [
      FilterComponent
    ],
    providers:[FilterProvider]
})
export class FilterModule { }
