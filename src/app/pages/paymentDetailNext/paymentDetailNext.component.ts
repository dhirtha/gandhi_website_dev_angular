import {Component, OnInit, Injector, HostListener} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppService} from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {WebSocketAPI} from '../../utility/WebSocketAPI';
import {NgxSpinnerService} from 'ngx-spinner';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-paymentDetailNext',
    templateUrl: './paymentDetailNext.component.html',
    styleUrls: ['./paymentDetailNext.component.scss']
})
export class PaymentDetailNextComponent extends MasterProvider implements OnInit {
    lazyCriteria: LazyLoadRequest;
    billingForm: FormGroup;
    deliveryForm: FormGroup;
    paymentForm: FormGroup;
    countries = [];
    months = [];
    years = [];
    deliveryMethods = [];
    grandTotal = 0;
    expressCharges = 0;

    orderTotal = 0;
    selectedTotalTravelRate = 0;
    totalAmount = 0;
    user: any;
    
    quotationList: any[]=[];
    
    webSocketAPI: WebSocketAPI;
    greeting: any;
    name: string="Hellooooooooooooooooooooooooooooooooooooo";
    
    API_SAVE_QUOT_FROM_CART = "/api/quotationEnquiry/saveQuotFromCartForMobile";
    isAmountPaid: boolean = false;
    OrderData: any;
    OrderList = [];
    displayedColumns: any[] = ['Name', 'UnitPrice', 'Quantity', 'TravelAmount', 'Total', 'QuotationDetails', 'FileUpload'];
    
    
    
    //For Customised Products.
    isCustomised: boolean = false;
    customisedTravelState: any;
    customisedTravelCity: any;
    customisedTravelWeight: any;
    customisedGst: any;
    isCustomisedByHand:boolean = false;
    v_customisedCustTravel: any;
    travelRateTotal = 0;
    selectCustomisedTravelName:any
    travelAmt = 0;

    constructor(public appService: AppService, public formBuilder: FormBuilder, public router: Router, public injector: Injector, public http: HttpClient, public authService: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog,  public spinner: NgxSpinnerService, private sanitizer: DomSanitizer, private paymentCredentials: ActivatedRoute, private localStorage: LocalService) {
        super(injector, http, authService);
    }
    
    @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
        let result = confirm("Changes you made may not be saved.");
        if (result) {
          // Do more processing...
        }
        event.returnValue = false; // stay on same page
    }

    ngOnInit() {
//        this.webSocketAPI = new WebSocketAPI(new PaymentDetailComponent(this.appService, this.formBuilder, this.router, this.injector, this.http, this.authService, this.snackBar, this.dialog, this.spinner, this.sanitizer, this.paymentCredentials),this.injector, this.http, this.authService);
//        this.OrderData = JSON.parse(localStorage.getItem('OrderData'));
        this.OrderData = this.localStorage.getJsonValue('OrderData');
        
        setTimeout(async () => {
//            this.getUser();

            this.appService.Data = this.OrderData;
            let payment_id;
            let payment_status;
            let id;
            let transaction_id;
            let paymentInfo = this.paymentCredentials.queryParams.subscribe(params => {
                payment_id = params['payment_id'] || 0;
                payment_status = params['payment_status'] || 0;
                id = params['id'] || 0;
                transaction_id = params['transaction_id'] || 0;
            });
            console.log("Payment Id ===  " + payment_id);
            console.log("Payment Status ===  " + payment_status);
            console.log("Id ===  " + id);
            console.log("Transaction Id ===  " + transaction_id);
            console.log(this.appService.Data.paymentOrderNo);
            
            if (payment_status == "Failed"){
                    console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
                    this.snackBar.open('Payment Failed', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
                    this.router.navigate(['/account/orders']);
            }
            else{
                let obj = {
                    paymentTransId: transaction_id,
                    paymentMerchentId: payment_id,
                    paymentAmt: this.appService.Data.totalAmount,
                    paymentStatus: payment_status,
                    paymentType: "Partial",
                    paymentRemark: this.appService.Data.paymentOrderNo,
                    paymentMode: "Live"
                }
                let orderArray = [];
                orderArray.push(obj);
                console.log(orderArray);
                this.doHttpPost("/api/paymentDetail/remainingPayment", orderArray, true).subscribe((data: any) => {
                    data = data.response;
                    console.log("paymenttttttttttttttttttttttttttttttttttttttttt");
                    console.log(data);
                    this.appService.Data.paymentOrderNo = "";
                    this.appService.Data.totalAmount = 0;
                    this.router.navigate(['/account/orders']);
                })
            }
            
        },1000)
    }
    
    
    
    
    
    getUser() {
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data: any) => {
            data = data.response;
            console.log("cust listttttttttttttttt");
            console.log(data);
            this.user = data;
        })
    }


  

    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}


}
