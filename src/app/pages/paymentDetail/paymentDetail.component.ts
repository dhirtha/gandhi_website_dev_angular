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
    selector: 'app-paymentDetail',
    templateUrl: './paymentDetail.component.html',
    styleUrls: ['./paymentDetail.component.scss']
})
export class PaymentDetailComponent extends MasterProvider implements OnInit {
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
//        this.OrderData = JSON.parse(localStorage.getItem('OrderData'));
        this.OrderData = this.localStorage.getJsonValue('OrderData');
        
        setTimeout(async () => {
            this.appService.Data = this.OrderData;
            console.log(this.appService.Data);

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
            if(payment_id == 0 && payment_status == 0 && id == 0 && transaction_id == 0){
                this.isAmountPaid = false;
            }

                if (payment_status == "Failed"){
                    this.snackBar.open('Payment Failed', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
                    let obj = {
                        userId: this.getSession().id_mongo,
                        userCartList: []
                    }
                    this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                        data = data.response;
                        console.log(data);
                        this.appService.Data.cartList.length = 0;
                        this.appService.Data.totalPrice = 0;
                        this.appService.Data.totalCartCount = 0;
                        this.router.navigate(['/home']);
                    });
                    this.isAmountPaid = false;
                }
                else{
                    if (this.appService.Data.paymentMode=="credit")
                    {
                        console.log("pay via Credit Limit");
                        let quotationListObjects = [];
                        for (let i = 0; i < this.appService.Data.quotObj.length; i++) {
                            quotationListObjects.push(this.appService.Data.quotObj[i].quotationNo);
                        }
                        let obj = {
                            quotNos: quotationListObjects,
                            dispatchDate: this.appService.Data.dispatchDate
                        }
                        this.doHttpPost("/api/quotationEnquiry/saveInMainRemoveFrmVirt", obj, true).subscribe((data: any) => {
                            data = data.response;
                            console.log(data);
                            this.doHttpPost("/api/paymentDetail/saveCrditLimitQuote", quotationListObjects, true).subscribe((data: any) => {
                                data = data.response;
                                console.log("save as credit.........................");
                                console.log(data);
                                let obj = {
                                    userId: this.getSession().id_mongo,
                                    userCartList : []
                                }
                                console.log(obj);
                                this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data=>{
                                    data = data.response;
                                    console.log(data);
                                    this.appService.Data.cartList.forEach(product => {
                                        this.appService.resetProductCartCount(product);
                                    });
                                    this.appService.Data.cartList.length = 0;
                                    this.appService.Data.totalPrice = 0;
                                    this.appService.Data.totalCartCount = 0;
                                });
                                this.router.navigate(['/confirmOrder']);
                            })
                        })
                    
                        this.isAmountPaid = true;
                    }
                    else{
                        if (this.appService.Data.paymentMode == "wallet"){
//                            alert("Wallet Payment Success");
                            console.log(this.appService.Data);
                            let quotationListObjects = [];
                            for (let i = 0; i < this.appService.Data.quotObj.length; i++) {
                                quotationListObjects.push(this.appService.Data.quotObj[i].quotationNo);
                            }
                            let obj = {
                                quotNos: quotationListObjects,
                                dispatchDate: this.appService.Data.dispatchDate
                            }
                            this.doHttpPost("/api/quotationEnquiry/saveInMainRemoveFrmVirt", obj, true).subscribe((data: any) => {
                                data = data.response;
                                console.log(data);
                                let walletObj = {};
                                if(this.appService.Data.fullOrPartial == "Partial"){
                                    walletObj = {
                                        quotNos: quotationListObjects, 
                                        paymentStatus: "Partial"
                                    }
                                    
                                }else{
                                    walletObj = {
                                        quotNos: quotationListObjects, 
                                        paymentStatus: "Full"
                                    }
                                }
                                this.doHttpPost("/api/paymentDetail/saveWalletLimit", walletObj, true).subscribe((data: any) => {
                                    data = data.response;
                                    console.log("save as credit.........................");
                                    console.log(data);
                                    let obj = {
                                        userId: this.getSession().id_mongo,
                                        userCartList : []
                                    }
                                    console.log(obj);
                                    this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data=>{
                                        data = data.response;
                                        console.log(data);
                                        this.appService.Data.cartList.forEach(product => {
                                            this.appService.resetProductCartCount(product);
                                        });
                                        this.appService.Data.cartList.length = 0;
                                        this.appService.Data.totalPrice = 0;
                                        this.appService.Data.totalCartCount = 0;
                                    });
                                    this.router.navigate(['/confirmOrder']);
                                })
                            })
                        }
                        else{
                            if (this.appService.Data.paymentMode == "walletPlusCredit"){
                                console.log(this.appService.Data);
                                let quotationListObjects = [];
                                for (let i = 0; i < this.appService.Data.quotObj.length; i++) {
                                    quotationListObjects.push(this.appService.Data.quotObj[i].quotationNo);
                                }
                                let obj = {
                                    quotNos: quotationListObjects,
                                    dispatchDate: this.appService.Data.dispatchDate
                                }
                                this.doHttpPost("/api/quotationEnquiry/saveInMainRemoveFrmVirt", obj, true).subscribe((data: any) => {
                                    data = data.response;
                                    console.log(data);
                                    let walletObj = {};
                                    if(this.appService.Data.fullOrPartial == "Partial"){
                                        walletObj = {
                                            quotNos: quotationListObjects, 
                                            paymentStatus: "Partial",
                                            walletAmount: this.appService.Data.adjustedAmount,
                                            creditAmount: this.appService.Data.paybleAmount
                                        }
                                    }else{
                                        walletObj = {
                                            quotNos: quotationListObjects, 
                                            paymentStatus: "Full",
                                            walletAmount: this.appService.Data.adjustedAmount,
                                            creditAmount: this.appService.Data.paybleAmount
                                        }
                                    }
                                    this.doHttpPost("/api/paymentDetail/saveWalletAndCreditLimit", walletObj, true).subscribe((data: any) => {
                                        data = data.response;
                                        console.log("save as wallet plus credit.........................");
                                        console.log(data);
                                        let obj = {
                                            userId: this.getSession().id_mongo,
                                            userCartList : []
                                        }
                                        console.log(obj);
                                        this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data=>{
                                            data = data.response;
                                            console.log(data);
                                            this.appService.Data.cartList.forEach(product => {
                                                this.appService.resetProductCartCount(product);
                                            });
                                            this.appService.Data.cartList.length = 0;
                                            this.appService.Data.totalPrice = 0;
                                            this.appService.Data.totalCartCount = 0;
                                        });
                                        this.router.navigate(['/confirmOrder']);
                                    })
                                })
                            }
                            
        //*******When Instamojo redirects after payment done on this page*******//
//                            let orderArray = [];
//                            let paymentType = this.OrderData.fullOrPartial;
//                            if(this.appService.Data.orderType == "standard"){
//                                for (let i = 0; i < this.appService.Data.quotObj.length; i++) {
//                                    let obj = {
//                                        paymentTransId: transaction_id,
//                                        paymentMerchentId: payment_id,
//                                        paymentAmt: this.appService.Data.quotObj[i].totalQuotationRateWithGst,
//                                        paymentStatus: payment_status,
//                                        paymentType: paymentType,
//                                        paymentRemark: this.appService.Data.quotObj[i].quotationNo,
//                                        paymentMode: "Live",
//                                    }
//                                    orderArray.push(obj);
//                                }
//                            }
//                            if(this.appService.Data.orderType == "customised"){
//                                for (let i = 0; i < this.appService.Data.quotObj.length; i++) {
//                                    if(paymentType == "Full"){
//                                        let obj = {
//                                            paymentTransId: transaction_id,
//                                            paymentMerchentId: payment_id,
//                                            paymentAmt: this.appService.Data.quotObj[i].totalQuotationRateWithGst,
//                                            paymentStatus: payment_status,
//                                            paymentType: paymentType,
//                                            paymentRemark: this.appService.Data.quotObj[i].quotationNo,
//                                            paymentMode: "Live",
//                                        }
//                                        orderArray.push(obj);
//                                    }
//                                    if(paymentType == "Partial"){
//                                        let obj = {
//                                            paymentTransId: transaction_id,
//                                            paymentMerchentId: payment_id,
//                                            paymentAmt: this.appService.Data.paperAmount,
//                                            paymentStatus: payment_status,
//                                            paymentType: paymentType,
//                                            paymentRemark: this.appService.Data.quotObj[i].quotationNo,
//                                            paymentMode: "Live",
//                                        }
//                                        orderArray.push(obj);
//                                    }
//                                }
//                            }
//                            console.log(orderArray);
//
//                            let quotationListArr = [];
//                            for (let i = 0; i < this.appService.Data.quotObj.length; i++) {
//                                quotationListArr.push(this.appService.Data.quotObj[i].quotationNo);
//                            }
//                            let obj = {
//                                quotNos: quotationListArr,
//                                dispatchDate: this.appService.Data.dispatchDate
//                            }
//                            this.doHttpPost("/api/quotationEnquiry/saveInMainRemoveFrmVirt", obj, true).subscribe((data: any) => {
//                                console.log(data);
//                                this.doHttpPost("/api/paymentDetail/save", orderArray, true).subscribe((data: any) => {
//                                    console.log("paymenttttttttttttttttttttttttttttttttttttttttt");
//                                    console.log(data);
//                                    let obj = {
//                                        userId: this.getSession().id_mongo,
//                                        userCartList : []
//                                    }
//                                    console.log(obj);
//                                    this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data=>{
//                                        console.log(data);
//                                        this.appService.Data.cartList.forEach(product => {
//                                            this.appService.resetProductCartCount(product);
//                                        });
//                                        this.appService.Data.cartList.length = 0;
//                                        this.appService.Data.totalPrice = 0;
//                                        this.appService.Data.totalCartCount = 0;
//                                    });
//                                    this.router.navigate(['/confirmOrder']);
//                                })
//                            })

                        }
                        this.isAmountPaid = true;

                    }
                }
        },1000)
    }

    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}

}
