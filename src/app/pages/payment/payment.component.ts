import {Component, OnInit, Injector} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AppService} from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss']
})
export class PaymentComponent extends MasterProvider implements OnInit {

    user: any;
    creditLimit = 0;
    availableCreditLimit = 0;
    isAmountPaid: boolean = false;
    paymentFrom: any;

    constructor(public appService: AppService, public formBuilder: FormBuilder, public router: Router, public injector: Injector, public http: HttpClient, public authService: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog, public spinner: NgxSpinnerService, private sanitizer: DomSanitizer, private paymentCredentials: ActivatedRoute, ) {
        super(injector, http, authService);
    }

//        @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
//            console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
//            let result = confirm("Changes you made may not be saved.");
//            if (result) {
//              // Do more processing...
//            }
//            event.returnValue = false; // stay on same page
//        }

    ngOnInit() {
//        paymentFrom
        
        
        let paymentInfo = this.paymentCredentials.queryParams.subscribe(params => {
            this.paymentFrom = params['paymentFrom'] || 0;
        });
        console.log(this.paymentFrom);
        
        console.log(this.appService.Data.paymentUrl);
//        if(this.appService.Data.paymentUrl == ""){
//            this.router.navigate(['/cart']);
//        }
        this.getUser();
    }
    
    paymentAction()
    {
//        var OrderData = JSON.parse(localStorage.getItem('OrderData'));
//        this.appService.Data = OrderData;
//        this.appService.Data.paymentMode="credit";
//        console.log(this.appService.Data);
//        localStorage.removeItem('OrderData');
//        localStorage.setItem('OrderData', JSON.stringify(this.appService.Data));
//        this.router.navigate(['/paymentDetail']);
    }
    
    getUser() {
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data: any) => {
            data = data.response;
            console.log("cust listttttttttttttttt");
            console.log(data);
            this.user = data;
            this.creditLimit = this.user.custCreditLimit;
            console.log(this.user.custCreditLimit);
            console.log(this.user.custCreditLimitUsed);
            this.availableCreditLimit = (this.user.custCreditLimit + this.user.custCreditLimitUsed);
        })
    }


    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}



}




