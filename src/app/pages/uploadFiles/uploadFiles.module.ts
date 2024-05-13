import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {FormsModule} from '@angular/forms';
import {UploadFilesRoutingModule} from './uploadFiles-routing.module';
import {UploadFilesComponent} from './uploadFiles.component';

@NgModule({
    imports: [CommonModule, UploadFilesRoutingModule,FormsModule
        ],
    declarations: [UploadFilesComponent]
})
export class UploadFilesModule {}
