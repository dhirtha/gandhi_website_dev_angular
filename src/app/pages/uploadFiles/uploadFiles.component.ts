import {Component, OnInit, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {MasterBean} from '../../utility/MasterBean';
import {MasterProvider} from '../../utility/MasterProvider';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-uploadFiles',
    templateUrl: './uploadFiles.component.html',
    styleUrls: ['./uploadFiles.component.scss'],
//    animations: [routerTransition()]
})
export class UploadFilesComponent extends MasterBean implements OnInit {
    quotationTotalAmountDisplay: string;
    quotationDriveFileName: string;
    loading: boolean = false;
//    API_FOR_QUOTATION_OBJ = "/api/quotationEnquiry/list2";
    API_FOR_QUOTATION_OBJ = "/api/order/list";
    quotationDetail: string;
    customer: string = "";
    quotationDetailLstLength: number = 0;
    quotObj: any;
    
    constructor(public router: Router,
        public injector: Injector,
        public provider: MasterProvider,public snackBar: MatSnackBar) {
        super(injector, router, provider);
    }
    
   


    ngOnInit() {
        this.getQuotationDetail();
    }
    
    getUrlVar() {
        var location = window.location.href //window.location.href.split('#');
        var paramsEncoded = location.split('=')[1];
        var paramsDecoded = atob(paramsEncoded);
        console.log(paramsDecoded);
        return paramsDecoded+"";
    }
    
    getQuotationDetail()
    {
        let fromDt = new Date();
        let toDt = new Date().setDate(new Date().getDate() + 15);
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            quotationNo: this.getUrlVar()
        }
        this.lazyCriteria.fromDt = fromDt;
        this.lazyCriteria.toDt = toDt;
        this.lazyCriteria.dateField = "expDt";
        this.provider.doHttpPost(this.API_FOR_QUOTATION_OBJ, this.lazyCriteria, false).subscribe((list: any) =>
        {
            list = list.response;
            this.quotationDetailLstLength = list.length;
            if (list.length != 0)
            {
                this.quotObj = list[0];
                console.log(this.quotObj);
                if(list[0].quotCustShopName != null){
                    this.customer = list[0].ordDispatchDateString + " " +this.customer + list[0].quotCustShopName +" "
                }
                if(list[0].quotCustCity != null){
                    this.customer = this.customer + "(" +list[0].quotCustCity +")_"
                }
                
                let orderType = "";
                if (list[0].totalQuotationRateWithGst == list[0].paidAmt){
                    orderType = "_(FP)"
                }
                if (list[0].paidAmt == 0){
                    orderType = "_(FC)"
                }
                if (list[0].paidAmt < list[0].totalQuotationRateWithGst && list[0].paidAmt != 0){
                    orderType = "_(PP)"
                }
                
                this.quotationDetail = " " + list[0].quotOrderDetails
                this.quotationTotalAmountDisplay = "\t Total Amount : \t\t\t\t" + list[0].totalQuotationRateWithGst + "/-"
                this.quotationDriveFileName = this.customer + list[0].orderNo + list[0].quotDriveFileName + orderType;                
                console.log(this.quotationDetail);
            }
        })
    }
    
    public formSaveMode() {
        
    }
    public formUpdateMode() {
        
    }
    public formDeleteMode() {
        
    }
    public formViewMode() {
        
    }
    public formListMod() {
        
    }

    public onNewClickedAction(event?) {
        
    }

    public onNewSaveAction(event?) {
        
    }
    public onModifyClickedAction(event?) {
        
    }
    public onUpdateSaveAction(event?) {
        
    }
    public onRemoveClickedAction(event?) {
        
    }
    public onDeleteSaveAction(event?) {
        
    }
    public onViewClickedAction(event?) {
        
    }
    public onUploadClickedAction(event?) {
        
    }
    public onClearClickedAction() {
        
    }
    
    makePayment() 
    {
    }

    uploadFileToDrive() 
    {
        if(!this.quotObj.isFileUploaded){
            let quotationDetail = this.replaceAll(this.quotationDetail, '\n', '%0A')
            let paramValue = "entry.1203295097=" + "Quotation No : " + this.getUrlVar() 
                + "%0A%0A" 
                + quotationDetail
                + "%0A%0A" 
//                + this.quotationTotalAmountDisplay
                + "&entry.1817197336=" + this.quotationDriveFileName.replace("&","AND")

//            let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2kjXz6xrZnadwa6JpX9HmDHTeMQzeIJRKRKZ4ebxnvNMEbA/viewform?" + paramValue;//DISHANK DRIVE
            let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe5jePZBGlDE2TMuWRXjFVwvUxqttipFUIYfElLdehUhUdXnQ/viewform?" + paramValue;//KAMLESH DRIVE
            window.open(uploadDriveUrl, "_self")
        }
        else{
            this.snackBar.open('Already File Uploaded', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
        }
    }
    
    replaceAll(stringValue: string, search, replace) 
    {
        return stringValue.split(search).join(replace);
    }


}
