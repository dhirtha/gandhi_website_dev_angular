import { Component, OnInit, Injector, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator } from '../../theme/utils/app-validators';
import {HttpClient} from '@angular/common/http';
import {AuthService, User} from '../../utility/auth-service';
import {ForgotPassProvider} from './forgotPass-provider';
import {LoginRequest} from '../../request/LoginRequest';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import { NgxSpinnerService } from "ngx-spinner";
import {ChangePasswordComponent} from '../changePassword/changePassword.component';
import {MasterBean} from '../../utility/MasterBean';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {DialogData} from '../../pojos/DialogData';
import {LocalService} from '../../utility/LocalService';
import CryptoJS from 'crypto-js';
import {RequestEncryption} from '../../utility/RequestEncryption';

@Component({
  selector: 'app-forgotPass',
  templateUrl: './forgotPass.component.html',
  styleUrls: ['./forgotPass.component.scss']
})
export class ForgotPassComponent extends MasterBean implements OnInit {
      
    loginForm: FormGroup;
    API_FOR_FORGOT_PASSWORD = "/api/auth/forgotPasswordFrmCust";
    siteKey:string = "6LchecIcAAAAANCUqH4G9RVE7A4ssW4ZhOZXmXoc";
    size:any;
    lang:any;
    theme:any;
    type:any;

    constructor(public formBuilder: FormBuilder, public router:Router, 
                public snackBar: MatSnackBar, public spinner: NgxSpinnerService,
                public injector: Injector, public http: HttpClient, public authService: AuthService, 
                public provider: ForgotPassProvider, public dialog: MatDialog, private localStorage: LocalService) 
    {
        super(injector, router, provider);
    }

    
    
        
    ngOnInit(){
        this.loginForm = this.formBuilder.group({
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'recaptcha': ['', Validators.required] 
        });
    }
    
    forgotPassword(){
        if (this.loginForm.controls.email.valid){
            if(this.loginForm.controls.recaptcha.valid){
                this.provider.doHttpPost(this.API_FOR_FORGOT_PASSWORD, this.loginForm.value.email, false).subscribe((data:any) => {
                    data = data.response;
                    this.snackBar.open("You Got New Password on Your E-Mail", '×', { panelClass: 'success', verticalPosition: 'top', duration: 8000 });
                }, error =>
                {
                    let requestEncryption = new RequestEncryption();
                    let response = requestEncryption.decrypt("qaed@#4???xwscwsscawvDQervbe", error.error.response);
                    response = JSON.parse(response);
                    error.error = response;
                    
                    this.spinner.hide();
                    this.snackBar.open(error.error.message, '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
                })
            }else{
                this.snackBar.open('Please, Identify yourself not a robot', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
        }else{
            this.snackBar.open('Please, Enter Valid Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
    }
        
    onNoClick(): void {
    }
    logIn() {
        this.router.navigate(['/login'])
            .then(() => {
        });
    }
    
    handleSuccess(e) {
//        console.log("ReCaptcha", e);
    }
    
  
    public onNewClickedAction(event?): any{}
    public onNewSaveAction(event?): any{}
    public onModifyClickedAction(event?): any{}
    public onUpdateSaveAction(event?): any{}
    public onRemoveClickedAction(event?): any{}
    public onDeleteSaveAction(event?): any{}
    public onViewClickedAction(event?): any{}
    public onUploadClickedAction(event?): any{}
    public formSaveMode(): any{}
    public formUpdateMode(): any{}
    public formDeleteMode(): any{}
    public formViewMode(): any{}
    public formListMod(): any{}
    
    

}




