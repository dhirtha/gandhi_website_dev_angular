import {Component, OnInit, Injector, Inject, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {AuthService, User} from '../../utility/auth-service';
import {MasterProvider} from '../../utility/MasterProvider';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {NgxSpinnerService} from "ngx-spinner";
import {DialogData} from '../../pojos/DialogData';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'ngOtpInput',
    templateUrl: './otp-verification.component.html',
    styleUrls: ['./otp-verification.component.scss']
})
export class OtpVerificationComponent extends MasterProvider implements OnInit {
    lazyCriteria: LazyLoadRequest;
    API_FOR_MOBILE_VERIFICATION = "/api/auth/verifyMob";
    API_FOR_EMAIL_VERIFICATION = "/api/email/verifyEmail";
    isOtpFor = "";
    time:any;
    isResendOtp:boolean = false;


    constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
        public injector: Injector, public http: HttpClient, public authService: AuthService, @Inject(MAT_DIALOG_DATA) public pageParam: DialogData,public dialog: MatDialogRef<OtpVerificationComponent>) {
        super(injector, http, authService);
    }

    ngOnInit() {
        console.log(this.pageParam.paramObj);
        this.isOtpFor = this.pageParam.paramObj.otpFor
        this.timer1(1);
    }
    timer1(minute) {
        // let minute = 1;
        let seconds: number = minute * 60;
        let textSec: any = "0";
        let statSec: number = 60;

        const prefix = minute < 10 ? "0" : "";

        const timer = setInterval(() => {
            seconds--;
            if (statSec != 0) statSec--;
            else statSec = 59;

            if (statSec < 10) {
                textSec = "0" + statSec;
            } else textSec = statSec;

            this.time = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

            if (seconds == 0) {
                console.log("finished");
                clearInterval(timer);
                this.isResendOtp = true;
            }
        }, 1000);
    }


    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}


    otp: string;
    showOtpComponent = true;
    @ViewChild('ngOtpInput', {static: false}) ngOtpInput: any;
    config = {
        allowNumbersOnly: true,
        length: 4,
        isPasswordInput: false,
        disableAutoFocus: false,
        placeholder: '',
        inputStyles: {
            'width': '40px',
            'height': '40px'
        }
    };

    onOtpChange(otp) {
        console.log(otp);
        this.otp = otp;
        if (this.otp == this.pageParam.paramObj.otp){
            this.dialog.close('Success');
        }
    }
    
    close() {
        this.dialog.close('Failed');
    }
    
    verifyEmail(){
        this.doHttpPost(this.API_FOR_EMAIL_VERIFICATION, this.pageParam.paramObj.customerObj, false).subscribe((data:any) => {
            data = data.response;
            this.timer1(1);
            this.isResendOtp = false;
            console.log(data);
            this.pageParam.paramObj.otp = data.message;
        })
    }
    
    verifyMobile(){
        this.doHttpPost(this.API_FOR_MOBILE_VERIFICATION, parseFloat(this.pageParam.paramObj.customerObj.userMobileNo), false).subscribe((data:any) => {
            data = data.response;
            this.timer1(1);
            this.isResendOtp = false;
            console.log(data);
            this.pageParam.paramObj.otp = data;
        })
    }
    
        
}
