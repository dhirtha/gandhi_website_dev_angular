import {Component, OnInit, Injector, Inject, ViewChild} from '@angular/core';
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
    selector: 'fileAttachmentMode',
    templateUrl: './fileAttachmentMode.component.html',
    styleUrls: ['./fileAttachmentMode.component.scss']
})
export class FileAttachmentModeComponent extends MasterProvider implements OnInit {
    user: any;
    lazyCriteria: LazyLoadRequest;


    constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
        public injector: Injector, public http: HttpClient, public authService: AuthService, @Inject(MAT_DIALOG_DATA) public pageParam: DialogData,public dialog: MatDialogRef<FileAttachmentModeComponent>) {
        super(injector, http, authService);
    }

    ngOnInit() {
        console.log(this.pageParam.paramObj);
        this.getUser();
    }
    
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
    
    getUser() {
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data: any) => {
            data = data.response;
            console.log("cust listttttttttttttttt");
            console.log(data);
            this.user = data;
        })
    }
    
    quotationDetail: string;
    quotationTotalAmountDisplay: string;
    quotationDriveFileName: string;
    uploadFileNow(quotationList?) {
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
                    
//                    this.quotationDetail = "FILE UPLOADED WILL BE RECEIVED ONLY WHEN YOU SEE 'FILE UPLOADED SUCCESSFULY'" + "\n" + "NOTE :"+"\n"+" 1. FIRST UPLOAD FILE"+"\n"+" 2. SCROLL AND CLICK SUBMIT BUTTON"+"\n"+" 3. Please DON'T EDIT any text in this form" + "\n\n" + this.quotationDetail;
                    let quotationDetail = this.replaceAll(this.quotationDetail, '\n', '%0A')

                    let paramValue = "entry.1203295097=" + "Quotation No : " + quotationList.quotationNo
                        + "%0A%0A"
                        + quotationDetail
                        + "%0A%0A"
        //                + this.quotationTotalAmountDisplay
                        + "&entry.1817197336=" + this.quotationDriveFileName
                    console.log(paramValue);

//                    let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2kjXz6xrZnadwa6JpX9HmDHTeMQzeIJRKRKZ4ebxnvNMEbA/viewform?" + paramValue;//DISHANK DRIVE
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

    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}


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

    close() {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            quotationNo: this.pageParam.paramObj.quotationNo
        }
        this.doHttpPost("/api/order/list", this.lazyCriteria, true).subscribe((orderNo: any) => {
            orderNo = orderNo.response;
            console.log(orderNo);
            if(orderNo.length != 0){
                let orderObj = orderNo[0];
//                if(orderObj.isFileUploaded){
                    this.dialog.close(orderObj.isFileUploaded);
//                }
            }
        })
    }
    
        
}
