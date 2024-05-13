import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import {HttpClient} from '@angular/common/http';
import {AuthService, User} from '../../utility/auth-service';
import {SignInProvider} from './sign-in-provider';
import {LoginRequest} from '../../request/LoginRequest';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {map} from 'rxjs/internal/operators/map';
import {Customer} from '../../pojos/quotation/customer_1';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import { NgxSpinnerService } from "ngx-spinner";
import {MasterBean} from '../../utility/MasterBean';
import {OtpVerificationComponent} from '../otp-verification/otp-verification.component';
import {LocalService} from '../../utility/LocalService';
import {RequestEncryption} from '../../utility/RequestEncryption';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent extends MasterBean implements OnInit {
    rateLabelLst: any;
    gstLst: any;
    loginForm: FormGroup;
    registerForm: FormGroup;
    lazyCriteria: LazyLoadRequest;
    API_FOR_GST_LST = "/api/gstMst/list"
    API_FOR_GET_RATE_LABEL_LST = "/api/rateLableMst/list";

    customer:Customer
    states:any;
    cities:any;
    custState:any;
    custCity:any;

    constructor(public formBuilder: FormBuilder, public router:Router, public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
                public injector: Injector, public http: HttpClient, public authService: AuthService, public provider: SignInProvider, private localStorage: LocalService) 
    {
        super(injector, router, provider);
        this.customer = new Customer();
    }

    ngOnInit() {
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
        }
        else {
            this.router.navigate(['/home']);
        }
        this.loginForm = this.formBuilder.group({
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])] 
        });
        
        this.registerForm = this.formBuilder.group({
          'shopName': ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z0-9 ]+')])],
          'state': ['', Validators.compose([Validators.required])],
          'city': ['', Validators.compose([Validators.required])],
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'emailotp': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
          'mobileNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(10)])],
          'mobileotp': ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(4)])],
          'password': ['', Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')],
          'confirmPassword': ['', Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]
        },{validator: matchingPasswords('password', 'confirmPassword')});
          this.filterStates();
          this.getApplyGSTLst();
//          this.getRateLabelLst();
    }
    
    otp: string;
    showOtpComponent = true;
    @ViewChild('ngOtpInput', { static: false}) ngOtpInput: any;
    config = {
      allowNumbersOnly: false,
      length: 5,
      isPasswordInput: false,
      disableAutoFocus: false,
      placeholder: '',
      inputStyles: {
        'width': '50px',
        'height': '50px'
      }
    };
    onOtpChange(otp) {
      this.otp = otp;
    }
    
    emailOtp: string;
    showEmailOtpComponent = false;
    @ViewChild('ngEmailOtpInput', { static: false}) ngEmailOtpInput: any;
    configEmail = {
        allowNumbersOnly: true,
        length: 4,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            'width': '50px',
            'height': '50px'
        }
    };
    onEmailOtpChange(otp) {
      this.emailOtp = otp;
        this.emailVerification();
    }
    
    mobileOtp: string;
    showMobileOtpComponent = false;
    @ViewChild('ngMobileOtpInput', { static: false}) ngMobileOtpInput: any;
    configMobile = {
        allowNumbersOnly: true,
        length: 4,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            'width': '50px',
            'height': '50px'
        }
    };
    onMobileOtpChange(otp) {
      this.mobileOtp = otp;
        this.mobileVerification();
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
    
    public onLoginFormSubmit():void {
//        if (this.loginForm.valid) {
//            console.log(this.loginForm.value.password);
//            console.log(this.loginForm.value.email);
//            var req = new LoginRequest();
//            req.username = this.loginForm.value.email;
//            req.password = window.btoa(this.loginForm.value.password);
//            this.loginForm.value.password = window.btoa(this.loginForm.value.password);
            
            var req = new LoginRequest();
            req.username = this.loginForm.value.email;
            req.password = window.btoa(this.loginForm.value.password);
            this.loginForm.value.password = window.btoa(this.loginForm.value.password);
            let requestEncryption = new RequestEncryption();
            let str = requestEncryption.encrypt("qaed@#4???xwscwsscawvDQervbe",JSON.stringify(req));
            
            this.provider.doLogin(str).subscribe((data: any) => {
                data = data.response;
                console.log(data);
//                localStorage.setItem('isLoggedin', 'true');
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
            }, error =>
            {
                console.log(error);
                this.spinner.hide();
                this.snackBar.open('Please, Enter Correct Username & Password', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
            })
//        }
    }
    
    checkValidCity(){
        console.log("cccccccccccccccccccccccc");
        return new Promise((resolve, reject) => {
            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.paramObj = {
                name : this.custCity
            }
            this.provider.doHttpPost("/api/json/lazyCityList", this.lazyCriteria, true).subscribe(data=>{
                data = data.response;
                console.log(data);
                if(data.length == 0){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })
        })
    }
    checkValidState(){
        console.log("ttttttttttttttt");
        return new Promise((resolve, reject) => {
            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.paramObj = {
                name : this.custState
            }
            this.provider.doHttpPost("/api/json/lazyStateList", this.lazyCriteria, true).subscribe(data=>{
                data = data.response;
                console.log(data);
                if(data.length == 0){
                    resolve(false);
                }else{
                    resolve(true);
                }
            })
        })
    }

    public async onRegisterFormSubmit():Promise<void> {
        console.log(this.registerForm.value);
        console.log(this.custState);
        console.log(this.custCity);
        
        let stateStatus = await this.checkValidState();
        let cityStatus = await this.checkValidCity();
        
        if (!stateStatus){
            this.snackBar.open('Please Select Valid State form droup down only', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            return;
        }
        if (!cityStatus){
            this.snackBar.open('Please Select Valid City form droup down only', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            return;
        }
        
        if(this.registerForm.controls.shopName.status == "INVALID"){
            this.snackBar.open('Invalid Firm Name', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            return;
        }
        if(this.registerForm.controls.email.status == "INVALID"){
            this.snackBar.open('Invalid Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            return;
        }
        if (typeof this.custState != "undefined" && typeof this.custCity != "undefined"){
            if(this.isMobileVerified && this.isEmailVerified){
                if(this.isMobileVerified){
                    if(this.isEmailVerified){
                        this.saveCustomer();
                    }else{
                        this.snackBar.open('Please, Verify Your Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                        this.isVerifyEmail = true;
                    }
                }else{
                    this.snackBar.open('Please, Verify Your Mobile', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                    this.isVerifyMobile = true;
                }
            }
            else{
                this.snackBar.open('Please, Verify Your Email & Mobile', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
        }else{
            this.snackBar.open('Please, Fill all data', '×', { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
        }
    }
  
    API_FOR_SAVE_CUSTOMER = "/api/auth/signup";
    saveCustomer(){
        if(this.registerForm.value.shopName != "" && this.registerForm.value.mobileNo != "" && this.registerForm.value.mobileNo != "" && this.registerForm.value.password != "" && this.registerForm.value.confirmPassword != ""){
            this.customer.custShopName = this.registerForm.value.shopName;
            this.customer.userAddress.addState = this.custState;
            this.customer.userAddress.addCity = this.custCity;
            this.customer.roles = ["ROLE_END_USER"];
            this.customer.userType = "customer";
            this.customer.orgId = "1";
            this.customer.oprId = "0";
            this.customer.custGstType = this.gstLst[0];
            this.customer.custRateLabel = null;
            this.customer.appRoleId = "ROL68";
            this.customer.username = this.customer.email;
            this.customer.password = window.btoa(this.registerForm.value.password);
            this.customer.mobileVerified = true;
            this.customer.emailVerified = true;

            
            let requestEncryption = new RequestEncryption();
            this.customer.password = requestEncryption.encrypt("qaed@#4???xwscwsscawvDQervbe",this.customer.password);
            this.customer.email = requestEncryption.encrypt("qaed@#4???xwscwsscawvDQervbe",this.customer.email);
            
            console.log(this.customer);
            this.provider.doHttpPost(this.API_FOR_SAVE_CUSTOMER, this.customer, false)
            .subscribe(data => 
            {
                data = data.response;
                this.snackBar.open('Your Registration Has Been Successful', '×', { panelClass: 'success', verticalPosition: 'top', duration: 6000 });
                this.loginForm.value.email = this.customer.username;
                this.loginForm.value.password = this.registerForm.value.password;
                this.onLoginFormSubmit();
            })
        }
        else{
            this.snackBar.open('Please, Fill all data', '×', { panelClass: 'error', verticalPosition: 'top', duration: 7000 });
        }
    }
    
    getApplyGSTLst()
    {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            gstName: "Gst on product"
        }
        this.provider.doHttpPost(this.API_FOR_GST_LST, this.lazyCriteria, false).subscribe((list: any) =>
        {
            list = list.response;
            this.gstLst = list;
            console.log(this.gstLst);
        })
    }
    
    getRateLabelLst()
    {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 100;              
        this.lazyCriteria.paramObj = {
            id: "60d58ebc1d4c6d4695fb85c1",
//            defunct: false,
//            rlName: "Regular Rates"
        }
        this.provider.doHttpPost(this.API_FOR_GET_RATE_LABEL_LST, this.lazyCriteria, false).subscribe((rateLabelLst: any) =>
        {
            rateLabelLst = rateLabelLst.response;
//            if (rateLabelLst.length != 0)
//            {
                this.rateLabelLst = rateLabelLst;
                console.log(this.rateLabelLst);
//            }
        })
    }
  
  
  
    stateCtrl = new FormControl();
    filteredState: Observable<string[]>;
    cityCtrl = new FormControl();
    filteredCity: Observable<string[]>;
    
    filterStates() {
        this.provider.getStateList().then((list: any[]) => {
            this.states = list;
            console.log(list);
            this.filteredState = this.stateCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => typeof value === 'string' ? value : value),
                    map(name => name ? this._filterState(name) : this.states.slice())
                );
        }).catch(error => {
            console.log(error);
        })
    }
    
    private _filterState(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.states.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    filterCities(Obj,$event) {
        if($event.isUserInput){
//            this.customer.userAddress.addCity = ""
//            this.customer.userAddress.addState = Obj.name;
            this.provider.getCityList(Obj.id).then((list: any[]) => {
                this.cities = list;
                this.filteredCity = this.cityCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(value => typeof value === 'string' ? value : value),
                        map(name => name ? this._filterCity(name) : this.cities.slice())
                    );
            }).catch(error => {
                console.log(error);
            })
        }
    }
    private _filterCity(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.cities.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
    
    
    API_FOR_MOBILE_VERIFICATION = "/api/auth/verifyMob";
    API_FOR_EMAIL_VERIFICATION = "/api/email/verifyEmail";
    mobileOTP: number;
    mobOtp: number;
    emailOTP: number;
    emilOtp: number;
    isVerifyMobile: boolean = true;
    isVerifyEmail: boolean = true;
    endMobileOtpTime:any;
    endEmailOtpTime:any;
    isResendMobileOtp: boolean = false;
    isResendEmailOtp: boolean = false;
    isMobileVerified: boolean = false;
    isEmailVerified: boolean = false;
    isEmailSpinner: boolean = false;
    
    incorrectMobileOtp: boolean = false;
    mobileVerification(){
        if (this.mobileOtp.length == 4){
            this.registerForm.value.mobileotp = this.mobileOtp;
            if (this.registerForm.value.mobileotp+"" != this.mobOtp+""){
                this.incorrectMobileOtp = true;
                this.snackBar.open('Incorrect Mobile OTP', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
            if(this.registerForm.value.mobileotp == ""){
                this.snackBar.open('Please, Enter Mobile OTP', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
            if(this.registerForm.value.mobileotp+"" == this.mobOtp+""){
                this.isMobileVerified = true;
                this.isVerifyMobile = false;
                this.isResendMobileOtp = false;
                this.snackBar.open('Your Mobile Is Verified', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            }
            if(this.registerForm.value.mobileNo == ""){
                this.snackBar.open('Please, Enter Mobile No.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
        }
    }
    
    verifyMobile(){
        this.customer.userMobileNo = this.registerForm.value.mobileNo;
        if (this.customer.userMobileNo != ""){
            this.customer.userMobileNo = this.customer.userMobileNo.trim();
            if (this.customer.userMobileNo.length != 10){
                this.snackBar.open('Please, Enter 10 digit Number', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                return false;
            }
            console.log(this.customer.userMobileNo);
            this.provider.doHttpPost(this.API_FOR_MOBILE_VERIFICATION, parseFloat(this.customer.userMobileNo), false).subscribe((data:any) => {
                data = data.response;
                this.showMobileOtpComponent = true;
                if(data == 1){
                    this.snackBar.open('This Mobile no. already exist', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                    return;
                }
                console.log(data);
                this.isVerifyMobile = false;
//                this.mobOtpTimer();
                this.mobOtp = data;
//                this.mobileVerification();
                this.endMobileOtpTime = new Date().getTime() + 10*60000;
                let obj = {
                    otp :  this.mobOtp,
                    customerObj : this.customer,
                    otpFor : "Mobile"
                }
                let width;
                if(window.innerWidth < 600){
                    width = 90
                }
                else{
                    width = 30
                }
                const dialogRef = this.displayDialogDynamic(OtpVerificationComponent,width, 65,"", obj);
                dialogRef.afterClosed().subscribe(result => {
                    if(result == "Success"){
                        this.isMobileVerified = true;
                        this.isVerifyMobile = false;
                        this.isResendMobileOtp = false;
                        this.snackBar.open('Your Mobile Is Verified', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
                    }
                    if(result == "Failed"){
                        this.isVerifyMobile = true;
                        this.isResendMobileOtp = false;
                        this.snackBar.open('Please, Verify Your Mobile', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                    }
                })
            })
        }
        else{
            this.snackBar.open('Please, Enter Mobile No.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
    }
    
    incorrectEmailOtp: boolean = false;
    emailVerification(){
        if (this.emailOtp.length == 4){
            this.registerForm.value.emailotp = this.emailOtp;
            if (this.registerForm.value.emailotp != this.emilOtp){
                this.incorrectEmailOtp = true;
                this.snackBar.open('Incorrect Email OTP', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
            if(this.registerForm.value.emailotp == ""){
                this.snackBar.open('Please, Enter Email OTP', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
            if(this.registerForm.value.emailotp == this.emilOtp){
                this.isEmailVerified = true;
                this.isVerifyEmail = false;
                this.isResendEmailOtp = false;
                this.snackBar.open('Your Email Is Verified', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            }
            if(this.registerForm.value.email == ""){
                this.snackBar.open('Please, Enter Your Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
        }
    }
    
    verifyEmail(){
        this.customer.email = this.registerForm.value.email;
        
        if (this.registerForm.controls.email.status == "INVALID"){
            this.snackBar.open('Invalid Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            return;
        }
        
        if (this.customer.email != ""){
            let validMail = this.customer.email.split('@');
            if (validMail.length == 2){
                this.showEmailOtpComponent = true;
//                this.emailOtpTimer();
                this.endEmailOtpTime = new Date().getTime() + 10*60000;
                this.isVerifyEmail = false;
                this.isEmailSpinner = true;
                this.customer.email = this.customer.email.trim();
                this.provider.doHttpPost(this.API_FOR_EMAIL_VERIFICATION, this.customer, false).subscribe((data:any) => {
                    data = data.response;
                    console.log(data);
                    if(data.message == "Email is already in use"){
//                        this.util.toastError("Email is already in use, Please Provide another Email.");
                        this.snackBar.open('Email is already in use, Please Provide another Email.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 6000 });
                        this.customer.email = "";
                        this.isVerifyEmail = true;
                        this.isEmailSpinner = false;
                    }else{
                        this.isEmailSpinner = false;
                        this.emilOtp = +data.message;
//                        this.emialVerification();
                        let obj = {
                            otp :  this.emilOtp,
                            customerObj : this.customer,
                            otpFor : "Email"
                        }
                        let width;
                        if(window.innerWidth < 600){
                            width = 90
                        }
                        else{
                            width = 30
                        }
                        const dialogRef = this.displayDialogDynamic(OtpVerificationComponent,width,65 ,"SAVE", obj);
                        dialogRef.afterClosed().subscribe(result => {
                            console.log("resulttttttttttttttttttttttt");
                            console.log(result);
                            if(result == "Success"){
                                this.isEmailVerified = true;
                                this.isVerifyEmail = false;
                                this.isResendEmailOtp = false;
                                this.snackBar.open('Your Email Is Verified', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
                            }
                            if(result == "Failed"){
                                this.isVerifyEmail = true;
                                this.isResendEmailOtp = false;
                                this.snackBar.open('Please, Verify Your Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
                            }
                        })
                    }
                })
            }else{
                this.snackBar.open('Invalid Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
            }
        }
        else{
            this.snackBar.open('Please, Enter Your Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }    
    }
    
    selectedMobileNo(){
        if (this.isMobileVerified){
        }else{
            this.mobOtp = 0;
            this.isVerifyMobile = true;
        }
    }
   
    selectedEmailNo(){
        if(this.isEmailVerified){
        }
        else{
            this.emilOtp = 0;
            this.isVerifyEmail = true;
        }
    }
    
    mobSeconds:number;
    mobMinutes:number;
    mobTimer = ms => new Promise(res => setTimeout(res, ms))
    async mobOtpTimer(){
        for (let j = 9; j >= 0; j--) {
            this.mobMinutes = j;
            for (let i = 59; i >= 0; i--) {
                this.mobSeconds = i;
                await this.mobTimer(1000); 
            }
        }
        this.isVerifyMobile = true;
        this.mobOtp = +"";
    }
    
    emailSeconds:number;
    emailMinutes:number;
    emailTimer = ms => new Promise(res => setTimeout(res, ms))
    async emailOtpTimer(){
        for (let j = 9; j >= 0; j--) {
            this.emailMinutes = j;
            for (let i = 59; i >= 0; i--) {
                this.emailSeconds = i;
                await this.emailTimer(1000); 
            }
        }
        this.isVerifyEmail = true;
        this.emilOtp = +"";
    }
    
    API_FOR_FORGOT_PASSWORD = "/api/auth/forgotPasswordFrmCust";
    newPassword = "";
    forgotPassword(){
        if (this.loginForm.controls.email.valid){
            this.provider.doHttpPost(this.API_FOR_FORGOT_PASSWORD, this.loginForm.value.email, false).subscribe((data:any) => {
                data = data.response;
                console.log(data);
                this.snackBar.open("You Got New Password on Your E-Mail", '×', { panelClass: 'success', verticalPosition: 'top', duration: 8000 });
            }, error =>
            {
//                console.log(error);
                let requestEncryption = new RequestEncryption();
                let response = requestEncryption.decrypt("qaed@#4???xwscwsscawvDQervbe", error.error.response);
                response = JSON.parse(response);
                error.error = response;
                
                this.spinner.hide();
                this.snackBar.open(error.error.message, '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
            })
        }else{
            this.snackBar.open('Please, Enter Valid Email', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
        }
    }

}
