import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UploadFilesComponent} from './uploadFiles.component';

const routes: Routes = [
    {
        path: '',
        component: UploadFilesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadFilesRoutingModule {}
