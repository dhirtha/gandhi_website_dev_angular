import {Component, OnInit, Injector, HostListener} from '@angular/core';
import {FormBuilder} from '@angular/forms';
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
import {SiUtil} from '../../utility/SiUtil';
import {FileAttachmentModeComponent} from '../fileAttachmentMode/fileAttachmentMode.component';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-confirm-order',
    templateUrl: './confirm-order.component.html',
    styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent extends MasterProvider implements OnInit {
    total = [];
    lazyCriteria: LazyLoadRequest;
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
    orderData: any;
    displayedColumns: any[] = ['Name', 'UnitPrice', 'Quantity', 'TravelAmount', 'Total', 'QuotationDetails', 'FileUpload'];
    
    deliveryMode: any;
    deliveryAmount: any;
    isSpinner: boolean = false;

    constructor(public appService: AppService, public formBuilder: FormBuilder, public router: Router, public injector: Injector, public http: HttpClient, public authService: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog,  public spinner: NgxSpinnerService, private sanitizer: DomSanitizer, private paymentCredentials: ActivatedRoute,private siutil: SiUtil, private localStorage: LocalService) {
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
        this.webSocketAPI = new WebSocketAPI(new ConfirmOrderComponent(this.appService, this.formBuilder, this.router, this.injector, this.http, this.authService, this.snackBar, this.dialog, this.spinner, this.sanitizer, this.paymentCredentials, this.siutil, this.localStorage), this.injector, this.http, this.authService);
//        this.orderData = JSON.parse(localStorage.getItem('OrderData'));
        this.orderData = this.localStorage.getJsonValue('OrderData');
        this.isSpinner = true;
        setTimeout(async () => {
            this.getUser();
            
            this.appService.Data = this.orderData;
            this.orderTotal = this.orderData.totalOrderAmount;
            this.selectedTotalTravelRate = this.orderData.totalTravelAmount;
            this.totalAmount = this.orderData.totalAmount;
            this.deliveryMode = this.appService.Data.deliveryMode;
            this.deliveryAmount = this.appService.Data.deliveryAmount;
            console.log(this.appService.Data.cartList);
            
            let index = 0;
            this.appService.Data.cartList.forEach(product => {
                let qtyRatio = product.quantity / product.baseQuantity;
                this.total[product.id + index] = product.namune * product.rate * qtyRatio;
                index = index + 1;
            })


            console.log(this.appService.Data);

            this.isAmountPaid = true;
            this.isSpinner = false;
        },4000)
    }
    
    clearCart(){
        console.log(this.appService.Data.cartList);
        let valid = false;
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            if(this.appService.Data.cartList[i].uploadFile.isFileUploaded){
                valid = true;
            }else{
                valid = false;
//                this.snackBar.open('Please Upload JPEG 700 DPI File ', '×', {panelClass: 'error', verticalPosition: 'top', duration: 4000});
                break;
            }
        }
        
        if(valid){
            let obj = {
                userId: this.getSession().id_mongo,
                userCartList: []
            }
            this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                data = data.response;
                console.log(data);
//                localStorage.removeItem("originalCartObj");
//                localStorage.removeItem("OrderData");
//                localStorage.removeItem("updatedCartObj");
                this.localStorage.clearTokenByKey('originalCartObj');
                this.localStorage.clearTokenByKey('OrderData');
                this.localStorage.clearTokenByKey('updatedCartObj');
                this.appService.Data.cartList.length = 0;
                this.appService.Data.totalPrice = 0;
                this.appService.Data.totalCartCount = 0;
                this.router.navigate(['/account/orders']);
            });
        }
        else{
            this.siutil.toastConfirmation_Save("Are you really want to place order without uploading file ?     If Yes then you can attach file from Order History menu.", "").then(data=>{
                if(data){
                    let obj = {
                        userId: this.getSession().id_mongo,
                        userCartList: []
                    }
                    this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                        data = data.response;
                        console.log(data);
//                        localStorage.removeItem("originalCartObj");
//                        localStorage.removeItem("OrderData");
//                        localStorage.removeItem("updatedCartObj");
                        this.localStorage.clearTokenByKey('originalCartObj');
                        this.localStorage.clearTokenByKey('OrderData');
                        this.localStorage.clearTokenByKey('updatedCartObj');
                        this.appService.Data.cartList.length = 0;
                        this.appService.Data.totalPrice = 0;
                        this.appService.Data.totalCartCount = 0;
                        this.snackBar.open('Please Upload JPEG 700 DPI File From Here', '×', {panelClass: 'error', verticalPosition: 'top', duration: 20000});
                        this.router.navigate(['/account/orders']);
                    });
                }
            })
        }
    }
    
    orderPlaced(){
        let obj = {
            userId: this.getSession().id_mongo,
            userCartList: []
        }
        this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
            data = data.response;
            console.log(data);
//            localStorage.removeItem("originalCartObj");
//            localStorage.removeItem("OrderData");
//            localStorage.removeItem("updatedCartObj");
            this.localStorage.clearTokenByKey('originalCartObj');
            this.localStorage.clearTokenByKey('OrderData');
            this.localStorage.clearTokenByKey('updatedCartObj');
            this.appService.Data.cartList.length = 0;
            this.appService.Data.totalPrice = 0;
            this.appService.Data.totalCartCount = 0;
            this.router.navigate(['/account/orders']);
        });
    }

    sendMessage(){
        this.webSocketAPI._send(this.name);
    }

    handleMessage(message){
//        this.orderData = JSON.parse(localStorage.getItem('OrderData'));
        this.orderData = this.localStorage.getJsonValue('OrderData');
        console.log(this.orderData);
        console.log(message);
        this.greeting = message;
        console.log(this.appService.Data.cartList);
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            if (JSON.stringify(this.appService.Data.cartList[i].uploadFile.quotationNo) == this.greeting){
                this.appService.Data.cartList[i].uploadFile.isFileUploaded = true;
            }
        }
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

    public placeOrder() {
        this.clearCart();
    }

    isFileUploaded(obj) {
        console.log(obj.uploadFile.isFileUploaded);
        obj.uploadFile.isFileUploaded = true;
    }

    quotationDetail: string;
    quotationTotalAmountDisplay: string;
    quotationDriveFileName: string;
    uploadFileToDrive(quotationList?) {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            quotationNo: quotationList.quotationNo
        }
        this.doHttpPost("/api/order/list", this.lazyCriteria, true).subscribe((orderNo: any) => {
            orderNo = orderNo.response;
            console.log(orderNo);
            if(orderNo.length != 0){
                let orderObj = orderNo[0];
                if(orderObj.isFileUploaded){
                    this.snackBar.open('File already uploaded', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                    quotationList.isFileUploaded = true;
                    return;
                }
            
                console.log(quotationList);
                this.webSocketAPI._connect(quotationList.quotationNo);
                console.log(quotationList);
                this.spinner.show();
                setTimeout(() => {
                    let customer = orderObj.ordDispatchDateString + " " +this.user.custShopName.replace("&","AND") +" ("+ this.user.userAddress.addCity +")_";
                    let orderType = "";
                    if (orderObj.totalQuotationRateWithGst == orderObj.paidAmt){
                        orderType = "_(FP)"
                    }
                    if (orderObj.paidAmt == 0){
                        orderType = "_(FC)"
                    }
                    if (orderObj.paidAmt < orderObj.totalQuotationRateWithGst && orderObj.paidAmt != 0){
                        orderType = "_(PP)"
                    }
                    
                    this.quotationDetail = " " + quotationList.quotOrderDetails
                    this.quotationTotalAmountDisplay = "\t Total Amount : \t\t\t\t" + quotationList.totalQuotationRateWithGst + "/-"
                    this.quotationDriveFileName = customer + orderObj.orderNo+"_" + quotationList.quotDriveFileName + orderType;

                    let quotationDetail = this.replaceAll(this.quotationDetail, '\n', '%0A')

                    let paramValue = "entry.1203295097=" + "Quotation No : " + quotationList.quotationNo
                        + "%0A%0A"
                        + quotationDetail
                        + "%0A%0A"
        //                + this.quotationTotalAmountDisplay
                        + "&entry.1817197336=" + this.quotationDriveFileName
                    console.log(paramValue);

//                    let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2kjXz6xrZnadwa6JpX9HmDHTeMQzeIJRKRKZ4ebxnvNMEbA/viewform?" + paramValue; //DISHANK DRIVE
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
        })
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
    
    
//    Dear RAVI ADVERTISING Wardha,
//
//    Please click below link to attach file against Quote No.: Q19082135 Dt. 21/08/2021
//    Letterhead Details :- Size : 8.5 X 13 Paper : 80 GSM Excel Bond JK JK Printing : Multicolor-4-Color Single Side Printed
//     
//    5000 Qty.
//
//    Click here to Upload File :
//    https://aaryancards.com/UploadFile?param=VjIwMDgyMTM4
//
//    Note : This link is system generated as per your request and valid for single attachment. 
//    Please don't share this with anyone as we will not be able to identify the person attaching the same. 
//    We will process the order assuming it is attached by you without further identifying the details.
    getFileLink(obj){
        console.log(obj.quotationNo);
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            quotationNo: obj.quotationNo
        }
        this.doHttpPost("/api/order/list", this.lazyCriteria, true).subscribe((orderNo: any) => {
            orderNo = orderNo.response;
            console.log(orderNo);
            if(orderNo.length != 0){
                let orderObj = orderNo[0];
                if(orderObj.isFileUploaded){
                    this.snackBar.open('File already uploaded', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                    obj.isFileUploaded = true;
                    return;
                }
                let whatsAppMessageBody = "Dear *";
                let emailMessageBody = "Dear ";
                let paramsRaw = btoa(obj.quotationNo);
                let driveLink:string = "https://aaryancards.com/UploadFile?param=" + paramsRaw;
        //        let driveLink:string = "http://localhost:4200/UploadFile?param=" + paramsRaw;
                driveLink = driveLink.replace("==","");
                this.lazyCriteria = new LazyLoadRequest();
                this.lazyCriteria.paramObj = {
                    quotationNo: obj.quotationNo
                }
                this.doHttpPost("/api/order/list", this.lazyCriteria, true).subscribe((data: any) => {
                    data = data.response;
                    console.log(data);
                    if(data.length != 0){
                        let orderObj = data[0];
                        whatsAppMessageBody = whatsAppMessageBody + orderObj.quotCustShopName + "* "+ orderObj.quotCustCity + "\n" + "\n" 
                        whatsAppMessageBody = whatsAppMessageBody + "Please click below link to attach file against Quote No.: " + orderObj.quotationNo + " " +
                            "Dt. " + orderObj.stringOrdCrDt.split(" ")[0] + ". " + "\n" +
                            orderObj.quotEnquiry.enqProductName + " Details :- " + orderObj.quotOrderDetails.replace("\n", " ").replace("\n\n"," ") + "\n" + "\n" + 
        //                    + orderObj.quotFinalQty + " Qty." + "\n" +
                            "Click here to Upload File : " + driveLink + "\n" + "\n" +
                            "*Note :* This link is system generated as per your request and valid for single attachment. Please don't share this with anyone as we will not be able to identify the person attaching the same. We will process the order assuming it is attached by you without further identifying the details."

                            let h1 = emailMessageBody = "Dear " + orderObj.quotCustShopName + " " + orderObj.quotCustCity + "\n" + "\n" 
                            let h2 = "Please click below link to attach file against Quote No.: " + orderObj.quotationNo + " " +
                                "Dt. " + orderObj.stringOrdCrDt.split(" ")[0] + ". " + "\n"
                            let h3 = orderObj.quotEnquiry.enqProductName + " Details :- " + orderObj.quotOrderDetails.replace("\n", " ").replace("\n\n"," ") + "\n" + "\n"
                            let h4 = "Click here to Upload File : " + driveLink + "\n" + "\n" 
                            let h5 = "Note : This link is system generated as per your request and valid for single attachment. Please don't share this with anyone as we will not be able to identify the person attaching the same. We will process the order assuming it is attached by you without further identifying the details."


                        emailMessageBody = emailMessageBody + orderObj.quotCustShopName + " " + orderObj.quotCustCity + "\n" + "\n" 
                        emailMessageBody = emailMessageBody + "Please click below link to attach file against Quote No.: " + orderObj.quotationNo + " " +
                            "Dt. " + orderObj.stringOrdCrDt.split(" ")[0] + ". " + "\n" +
                            orderObj.quotEnquiry.enqProductName + " Details :- " + orderObj.quotOrderDetails.replace("\n", " ").replace("\n\n"," ") + "\n" + "\n" + 
        //                    + orderObj.quotFinalQty + " Qty." + "\n" +
                            "Click here to Upload File : " + driveLink + "\n" + "\n" +
                            "Note : This link is system generated as per your request and valid for single attachment. Please don't share this with anyone as we will not be able to identify the person attaching the same. We will process the order assuming it is attached by you without further identifying the details."


                        console.log(whatsAppMessageBody);

                        this.lazyCriteria = new LazyLoadRequest();
                        this.lazyCriteria.paramObj = {
                            id: orderObj.quotCustId
                        }

                        this.doHttpPost('/api/auth/list', this.lazyCriteria, true).subscribe((userLst:any) =>
                        {
                            userLst = userLst.response;
                            console.log(userLst);
                            let obj = {
                                toNo: userLst[0].userMobileNo,
                                whatsAppBody: whatsAppMessageBody,
                                emailBody: "",
                                orderNo: orderObj.orderNo,
                                email: userLst[0].email,
                                custShopName: orderObj.quotCustShopName,
                                h1:h1,
                                h2:h2,
                                h3:h3,
                                h4:h4,
                                h5:h5,
                            }
                            console.log(obj);
                            this.doHttpPost('/api/whatsApp/getFileLink', obj, true).subscribe((responce:any) =>
                            {
                                responce = responce.response;
                                console.log(responce);
                                this.snackBar.open('File Upload link has been sent on your email and whatsapp', '×', {panelClass: 'success', verticalPosition: 'top', duration: 20000});
                            }, error =>
                            {
                                console.log(error);
                            })
                        })


                    }
                })
            }
        })
    }
    
    attachFile(obj){
        
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            quotationNo: obj.quotationNo
        }
        this.doHttpPost("/api/order/list", this.lazyCriteria, true).subscribe((orderNo: any) => {
            orderNo = orderNo.response;
            console.log(orderNo);
            if(orderNo.length != 0){
                let orderObj = orderNo[0];
                if(orderObj.isFileUploaded){
                    this.snackBar.open('File already uploaded', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                    obj.isFileUploaded = true;
                    return;
                }
                let width;
                if(window.innerWidth < 600){
                    width = 90
                }
                else{
                    width = 30
                }
                const dialogRef = this.displayDialogDynamic(FileAttachmentModeComponent,width, 80,"", obj);
                dialogRef.afterClosed().subscribe(result => {
                    if (result == true){
                        obj.isFileUploaded = true;
                    }
                    if (result == false){
                        obj.isFileUploaded = false;
                    }
                })
            }
        })
    }
    
    displayDialogDynamic(component: any, width:any, height:any, mode: string, paramData?: any) {
       
        let dialogBoxSettings = {
            disableClose: true,
            hasBackdrop: true,
            margin: '0 auto',
            width: width+'%',
            height: height+'%',
            data: {formMode: mode, paramObj: paramData || null}
        };

        return this.dialog.open(component, dialogBoxSettings);


    }

}
