import { Component, OnInit, Injector, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator } from '../../theme/utils/app-validators';
import {HttpClient} from '@angular/common/http';
import {AuthService, User} from '../../utility/auth-service';
import {LoginProvider} from './login-provider';
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
import {CookieService} from 'ngx-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends MasterBean implements OnInit {
    loginForm: FormGroup;
    lazyCriteria: LazyLoadRequest;
    API_FOR_GST_LST = "/api/gstMst/list"
    API_FOR_GET_RATE_LABEL_LST = "/api/rateLableMst/list";
    hide = true;
    siteKey:string = "6LchecIcAAAAANCUqH4G9RVE7A4ssW4ZhOZXmXoc";
    size:any;
    lang:any;
    theme:any;
    type:any;
    @ViewChild('captchaElem') captchaElem: ElementRef;
      

    constructor(public formBuilder: FormBuilder, public router:Router, 
                public snackBar: MatSnackBar, public spinner: NgxSpinnerService,private cookieService: CookieService,
                public injector: Injector, public http: HttpClient, public authService: AuthService, 
                public provider: LoginProvider, public dialog: MatDialog, private localStorage: LocalService) 
    {
        super(injector, router, provider);
    }

    ngOnInit() {
//        this.http.get("/api/auth/token").subscribe(data=>{
//        })
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.authService.removeSession();
            localStorage.clear();
            this.localStorage.clearToken();
            this.cookieService.removeAll();
        }
        else {
            this.router.navigate(['/home']);
        }
        console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
        this.loginForm = this.formBuilder.group({
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])] ,
          'recaptcha': ['', Validators.required] 
        });
    }
    
    handleSuccess(e) {
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
    
    
    getResponse(){
        let json = {
            reference_no:"111520528129"
        }
        this.provider.doHttpPost("/api/ccAvenue/checkStatus", json, true).subscribe(data=>{
            console.log(data.response);
        })
    }
    
    
    public onLoginFormSubmit():void {
        if (this.loginForm.valid){
            var req = new LoginRequest();
            req.username = this.loginForm.value.email;
            req.password = window.btoa(this.loginForm.value.password);
//            this.loginForm.value.password = window.btoa(this.loginForm.value.password);
            let requestEncryption = new RequestEncryption();
            let str = requestEncryption.encrypt("qaed@#4???xwscwsscawvDQervbe",JSON.stringify(req));
            console.log(str);
            str = str.replace(/\+/g,'p1L2u3S').replace(/\//g,'s1L2a3S4h').replace(/=/g,'e1Q2u3A4l');
            this.provider.doLogin(str).subscribe((data: any) => {
                data = data.response;
                console.log(data);
                if(data.message == "username is incorrect")
                {
                    this.snackBar.open('Username is Incorrect', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
                    return false;
                }

                if(data.message == "Password is wrong")
                {
                    this.snackBar.open('Password is Incorrect', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
                    return false;
                }
                this.provider.doHttpPost("/api/auth/getByEmail", data.email, false).subscribe((result:any)=>{
                    result = result.response;
                    console.log(result);
                    console.log("result");
                    if(result.isDefaultPass){
                        const dialogRef = this.displayDialogDynamic(ChangePasswordComponent,35,35 ,"", data);
                        dialogRef.afterClosed().subscribe(result => {
                            console.log(result);
                            if(result == "Success"){
                                console.log(data);
//                                localStorage.setItem('isLoggedin', 'true');
                                this.localStorage.setJsonValue('isLoggedin', 'true');
                                var userSession: User = {
                                    uid:data.username,
                                    email: data.email,
                                    User_Role: data.roles[0],
                                    id_mongo: data.id,
                                    token: data.accessToken,
                                    token_Type: data.tokenType,
                                    ORG_ID:data.org_id,
                                    OPR_ID:data.opr_id,
                                    app_role_id:data.app_role_id
                                }
                                console.log(userSession);
                                this.authService.setUserDataToSessionNew(userSession);

                                this.router.navigate(['/account/information'])
                                    .then(() => {
            //                        window.location.reload();
                                });
                                this.snackBar.open('Please, Make Sure to Change Your Default Password', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
                            }
                            if(result == "Failed"){
                                console.log(data);
//                                localStorage.setItem('isLoggedin', 'true');
                                this.localStorage.setJsonValue('isLoggedin', 'true');
                                var userSession: User = {
                                    uid:data.username,
                                    email: data.email,
                                    User_Role: data.roles[0],
                                    id_mongo: data.id,
                                    token: data.accessToken,
                                    token_Type: data.tokenType,
                                    ORG_ID:data.org_id,
                                    OPR_ID:data.opr_id,
                                    app_role_id:data.app_role_id
                                }
                                console.log(userSession);
                                this.authService.setUserDataToSessionNew(userSession);

                                this.router.navigate(['/'])
                                    .then(() => {
                                    window.location.reload();
                                });
                                this.snackBar.open('Please, Make Sure to Change Your Default Password', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
                            }
                        })
                    }
                    else{
                        this.localStorage.setJsonValue('isLoggedin', 'true'); 
                        let tokenID = this.localStorage.storageService.secureStorage.encrypt(data.accessToken);
                        var userSession: User = {
                            uid:data.username,
                            email: data.email,
                            User_Role: data.roles[0],
                            id_mongo: data.id,
                            token: data.accessToken,
//                            token: tokenID,
                            token_Type: data.tokenType,
                            ORG_ID:data.org_id,
                            OPR_ID:data.opr_id,
                            app_role_id:data.app_role_id
                        }
                        console.log(userSession);
                        this.authService.setUserDataToSessionNew(userSession);

                        this.router.navigate(['/'])
                            .then(() => {
                            window.location.reload();
                        });
                    }
                })
            }, error =>
            {
                console.log(error);
                this.spinner.hide();
                this.snackBar.open('Please, Enter Correct Username & Password', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
            })
        }
    }

    
    API_FOR_FORGOT_PASSWORD = "/api/auth/forgotPasswordFrmCust";
    newPassword = "";
    forgotPassword(){
        this.router.navigate(['/forgotPassword'])
            .then(() => {
        });
    }
    
    signIn(){
        this.router.navigate(['/sign-in'])
            .then(() => {
            window. location. reload();
        });
    }

}




@Component({
  selector: 'forgot-password-dialog',
  templateUrl: 'forgot-password.html',
})
export class ForgotDialogDialog implements OnInit {

    loginForm: FormGroup;
    API_FOR_FORGOT_PASSWORD = "/api/auth/forgotPasswordFrmCust";
    siteKey:string = "6LchecIcAAAAANCUqH4G9RVE7A4ssW4ZhOZXmXoc";
    size:any;
    lang:any;
    theme:any;
    type:any;
    constructor(
        public dialogRef: MatDialogRef<ForgotDialogDialog>, public snackBar: MatSnackBar,private spinner: NgxSpinnerService,
        @Inject(MAT_DIALOG_DATA) public pageParam: DialogData, public provider: LoginProvider, public formBuilder: FormBuilder) {}
        
    ngOnInit(){
        console.log(this.pageParam.paramObj);
        this.loginForm = this.formBuilder.group({
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'recaptcha': ['', Validators.required] 
        });
        this.loginForm.value.email = this.pageParam.paramObj.email;
    }
    
    forgotPassword(){
        if (this.loginForm.controls.email.valid){
            if(this.loginForm.controls.recaptcha.valid){
                this.provider.doHttpPost(this.API_FOR_FORGOT_PASSWORD, this.loginForm.value.email, false).subscribe((data:any) => {
                    data = data.response;
                    this.snackBar.open("You Got New Password on Your E-Mail", '×', { panelClass: 'success', verticalPosition: 'top', duration: 8000 });
                    this.dialogRef.close();
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
        this.dialogRef.close();
    }
    
    handleSuccess(e) {
//        console.log("ReCaptcha", e);
    }

}
