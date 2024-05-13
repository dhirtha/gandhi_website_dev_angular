import {Component, OnInit, Injector} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
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

@Component({
    selector: 'app-mobilePaymentDetail',
    templateUrl: './mobilePaymentDetail.component.html',
    styleUrls: ['./mobilePaymentDetail.component.scss']
})
export class MobilePaymentDetailComponent extends MasterProvider implements OnInit {
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

    constructor(public appService: AppService, public formBuilder: FormBuilder, public router: Router, public injector: Injector, public http: HttpClient, public authService: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog,  public spinner: NgxSpinnerService, private sanitizer: DomSanitizer, private paymentCredentials: ActivatedRoute,) {
        super(injector, http, authService);
    }
    

    ngOnInit() {
        
        setTimeout(async () => {
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
            alert("Payment Id ===  " + payment_id);
            alert("Payment Status ===  " + payment_status);
            alert("Id ===  " + id);
            alert("Transaction Id ===  " + transaction_id);
                         window.location.href = "https://aaryancards.com";
//            if(payment_id == 0 && payment_status == 0 && id == 0 && transaction_id == 0){
//                this.isAmountPaid = false;
//            }
//                if (payment_status == "Failed"){
//                    this.isAmountPaid = false;
//                }
//                else{
//                    let orderArray = []
//                    let obj = {
//                        paymentTransId: transaction_id,
//                        paymentMerchentId: payment_id,
//                        paymentAmt: this.appService.Data.paperAmount,
//                        paymentStatus: payment_status,
//                        paymentType: paymentType,
//                        paymentRemark: this.appService.Data.quotObj[i].quotationNo,
//                        paymentMode: "Live",
//                    }
//                    orderArray.push(obj);
//                    this.doHttpPost("/api/paymentDetail/save", orderArray, true).subscribe((data: any) => {
//                        console.log("paymenttttttttttttttttttttttttttttttttttttttttt");
//                        console.log(data);
//                    })

//                } 
        },10000)
    }
    
    
    
    connect(){
//        this.webSocketAPI.webSocketAPI._connect();
    }


    sendMessage(){
        this.webSocketAPI._send(this.name);
    }

    handleMessage(message){
        console.log(message);
        this.greeting = message;
        console.log(this.appService.Data.cartList);
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            if (JSON.stringify(this.appService.Data.cartList[i].uploadFile.quotationNo) == this.greeting){
                this.appService.Data.cartList[i].uploadFile.isFileUploaded = true;
            }
        }
        console.log(this.OrderList);
        this.webSocketAPI._disconnect();
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

    asIsOrder(a, b) {
        return 1;
    }
    getKeys(map){
        if(map != null){
            return Array.from(map.keys());
        }
        else{
            return "";
        }
    }
    getValue(map){
        if(map != null){
            return Array.from(map.values());
        }
        else{
            return "";
        }
    }

    public placeOrder(stepper: MatStepper) {
        console.log(this.appService.Data.cartList);
//        let valid = false;
        console.log(this.OrderList);
//        this.doHttpPost("/api/quotationEnquiry/fileUploadQuotes", this.quotationList, true).subscribe((list: any) => {
//            for (let i = 0; i < this.appService.Data.cartList.length; i++) {
//                this.appService.Data.cartList[i].uploadFile.isFileUploaded = list[i];
//            }
//            
//            
//            console.log(this.appService.Data.cartList);
        let quotationListArr = [];
        for (let i = 0; i < this.OrderList.length; i++) {
            quotationListArr.push(this.OrderList[i].uploadFile.quotationNo);
        }
            
//            for (let i = 0; i < this.appService.Data.cartList.length; i++) {
////                this.appService.Data.cartList[i].uploadFile.isFileUploaded = list[i];
//                if(this.appService.Data.cartList[i].uploadFile.isFileUploaded){
//                    valid = true;
//                }else{
//                    valid = false;
//                    this.snackBar.open('Please Upload JPEG 700 DPI File ', '×', {panelClass: 'error', verticalPosition: 'top', duration: 4000});
//                    break;
//                }
//            }
//            
//            if(valid){
                this.doHttpPost("/api/quotationEnquiry/saveInMainRemoveFrmVirt", quotationListArr, true).subscribe((data: any) => {
                    data = data.response;
                    if (data.message) {
                        this.snackBar.open('Your Order Placed Successfully', '×', {panelClass: 'success', verticalPosition: 'top', duration: 6000});
//                        this.horizontalStepper._steps.forEach(step => step.editable = false);
//                        this.verticalStepper._steps.forEach(step => step.editable = false);
                        console.log(this.appService.Data.cartList);

                        let obj = {
                            userId: this.getSession().id_mongo,
                            userCartList: []
                        }
                        this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                            console.log(data);
                            localStorage.clear();
                            this.appService.Data.cartList.length = 0;
                            this.appService.Data.totalPrice = 0;
                            this.appService.Data.totalCartCount = 0;
                        });
                        stepper.next();
                    }
                })
//            }
//        })

    }

    isFileUploaded(obj) {
        console.log(obj.uploadFile.isFileUploaded);
        obj.uploadFile.isFileUploaded = true;
    }

    quotationDetail: string;
    quotationTotalAmountDisplay: string;
    quotationDriveFileName: string;
    uploadFileToDrive(quotationList?) {
        console.log(quotationList);
        this.webSocketAPI._connect(quotationList.quotationNo);
        console.log(quotationList);
        this.spinner.show();
        setTimeout(() => {
            let customer = this.user.custShopName.replace("&","AND") +" ("+ this.user.userAddress.addCity +")_";
            
            this.quotationDetail = " " + quotationList.quotOrderDetails
            this.quotationTotalAmountDisplay = "\t Total Amount : \t\t\t\t" + quotationList.totalQuotationRateWithGst + "/-"
            this.quotationDriveFileName = customer + quotationList.quotationNo+"_" + quotationList.quotDriveFileName

            let quotationDetail = this.replaceAll(this.quotationDetail, '\n', '%0A')

            let paramValue = "entry.1203295097=" + "Quotation No : " + quotationList.quotationNo
                + "%0A%0A"
                + quotationDetail
                + "%0A%0A"
                + this.quotationTotalAmountDisplay
                + "&entry.1817197336=" + this.quotationDriveFileName
            console.log(paramValue);
            
//            let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2kjXz6xrZnadwa6JpX9HmDHTeMQzeIJRKRKZ4ebxnvNMEbA/viewform?" + paramValue;//DISHANK DRIVE
            let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe5jePZBGlDE2TMuWRXjFVwvUxqttipFUIYfElLdehUhUdXnQ/viewform?" + paramValue;//KAMLESH DRIVE
            this.spinner.hide();
            var left = (screen.width - 700) / 2;
            var top = (screen.height - 650) / 4;
            window.open(uploadDriveUrl, "Upload File",
                'resizable=yes, width=' + 700
                + ', height=' + 650 + ', top='
                + top + ', left=' + left);
        }, 3000);
            
        
            
    }

    replaceAll(stringValue: string, search, replace) {
        return stringValue.split(search).join(replace);
    }

    selectedTravel(travel, $event) {
        if ($event.isUserInput) {

        }
    }
    
    roundOfWith(value: number, roundOfBy: number) 
    { 
        if (value % roundOfBy == 0) 
        { 
            return (Math.floor(value / roundOfBy)) * roundOfBy;
        } else 
        { 
            return ((Math.floor(value / roundOfBy)) * roundOfBy) + roundOfBy;
        } 
    }
    

}
