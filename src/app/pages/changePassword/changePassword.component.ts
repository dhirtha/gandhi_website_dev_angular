import {Component, OnInit, Injector, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../utility/auth-service';
import {MasterProvider} from '../../utility/MasterProvider';
import {NgxSpinnerService} from "ngx-spinner";
import {DialogData} from '../../pojos/DialogData';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-changePassword',
    templateUrl: './changePassword.component.html',
    styleUrls: ['./changePassword.component.scss']
})
export class ChangePasswordComponent extends MasterProvider implements OnInit {
    
    constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
        public injector: Injector, public http: HttpClient, public authService: AuthService, @Inject(MAT_DIALOG_DATA) public pageParam: DialogData,public dialog: MatDialogRef<ChangePasswordComponent>) {
        super(injector, http, authService);
    }
    
    ngOnInit() {
        console.log(this.pageParam.paramObj);

    }
       
    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}

    close() {
        this.dialog.close('Failed');
    }
    
    changePassword() {
        this.dialog.close('Success');
    }
    
    
}
