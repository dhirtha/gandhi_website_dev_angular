import {Component, OnInit, Injector, ViewChild, ElementRef} from '@angular/core';
import {LazyLoadRequest} from '../../../request/LazyLoadRequest';
import {MasterProvider} from '../../../utility/MasterProvider';
import {AuthService} from '../../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {OrdersListDataSource} from './orders-listDataSource';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {tap} from 'rxjs/internal/operators/tap';
import {merge, fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {FilterBy} from '../../../utility/FilterBy';
import {AppService} from '../../../app.service';
import {DomSanitizer} from '@angular/platform-browser';
import {WebSocketAPI} from '../../../utility/WebSocketAPI';
import {LocalService} from '../../../utility/LocalService';

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent extends MasterProvider implements OnInit {

    user: any;
    name: any;
    greeting: any;
    webSocketAPI: WebSocketAPI;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('input') input: ElementRef;
    selection = new SelectionModel<any>(true, []);

    filterByArray: any[] = [];
    count: any;
    filterHint: string;
    lazyCriteria: LazyLoadRequest;
    
    dataSource: any;
    public dataSource1:OrdersListDataSource
//    displayedColumns: any[] = ['quotationNo', 'stringCrDt', 'orderDetails', 'namune', 'quantity', 'amount'];
    displayedColumns: any[] = ['quotationNo', 'orderDetails', 'quantity', 'amount','amount1','amount2',"payment",'amount3'];
    
    public orders = [
        {number: '#3258', date: 'March 29, 2018', status: 'Completed', total: '$140.00 for 2 items', invoice: true},
        {number: '#3145', date: 'February 14, 2018', status: 'On hold', total: '$255.99 for 1 item', invoice: false},
        {number: '#2972', date: 'January 7, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true},
        {number: '#2971', date: 'January 5, 2018', status: 'Completed', total: '$73.00 for 1 item', invoice: true},
        {number: '#1981', date: 'December 24, 2017', status: 'Pending Payment', total: '$285.00 for 2 items', invoice: false},
        {number: '#1781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false}
    ]
    
   constructor(public router: Router,
        public injector: Injector,
       public authService: AuthService,
       public http: HttpClient,
       public appService: AppService,
       private sanitizer: DomSanitizer,
       private localStorage: LocalService) {
       super(injector, http, authService);
    }

    async ngOnInit() {
        this.getUser();
        this.webSocketAPI = new WebSocketAPI(new OrdersComponent(this.router, this.injector, this.authService, this.http, this.appService, this.sanitizer, this.localStorage),this.injector, this.http, this.authService);
        this.getOrdreLst();
        await this.getGlobalUser();
    }
    
    getUser(){
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
            data = data.response;
            this.user = data;
        })
    }
    
    API_FOR_GET_ORDER_LIST = "/api/quotationEnquiry/list2"
    getOrderList(){
        console.log(this.getSession().uid);
        console.log(this.getSession().id_mongo);
        this.lazyCriteria = new LazyLoadRequest();
//        this.lazyCriteria.include = [];
        this.lazyCriteria.pageSize = 5;
        this.lazyCriteria.paramObj = {
            "quotCustId": this.getSession().id_mongo
        }
        this.doHttpPost(this.API_FOR_GET_ORDER_LIST, this.lazyCriteria, true).subscribe(data=>{
            data = data.response;
            console.log("Order Listtttttttttttttttt");
            console.log(data);
            this.dataSource = data;
        })
    }
    
    async getOrdreLst(){
        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        this.dataSource1 = new OrdersListDataSource(this.injector, this.http, this.authService);
        
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 10;
        this.lazyCriteria.paramObj = {
            quotCustId: this.getSession().id_mongo,
//            "quotStatus":"Order Placed" 
        }
        this.lazyCriteria.sortFiled = "ordcrDt";
        this.lazyCriteria.sortValue = "desc";
        console.log(this.lazyCriteria);
        
        this.dataSource1.loadLazyLst(this.lazyCriteria);
        console.log(this.dataSource1);

        this.count = await  this.dataSource1.loadCount(this.lazyCriteria);
        console.log(this.count);
        
        this.loadFilterValues();   /// load Filter Values 

        console.log(this.dataSource1);
//        this.getOrderList()

    }
    
    
    loadFilterValues() {
        this.filterByArray = [];
        this.filterByArray.push(new FilterBy("Quotation No.", "quotationNo"));
        this.filterByArray.push(new FilterBy("Date & Time", "stringCrDt"));
        this.filterByArray.push(new FilterBy("Order Detail", "quotOrderDetails"));
        this.filterByArray.push(new FilterBy("Quantity", "quotFinalQty"));
        this.defaultFilterBy();
    }
    defaultFilterBy() {
        this.lazyCriteria.filterField = this.filterByArray[0].value   ///// defualt filter By 
        this.filterHint = this.filterByArray[0].key   ///// defualt filter By 
        this.input.nativeElement.value = "";   ///// defualt filter By  
    }
    
    
    ngAfterViewInit() {
        this.paginator.page
            .pipe(
                tap(() => this.loadOprOnPage())
            )
            .subscribe();

        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                tap(() => this.loadOprOnPage())
            )
            .subscribe();


        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(async () => {
                    this.paginator.pageIndex = 0;
                    this.loadOprOnPage();
                    this.count = await this.dataSource1.loadCount(this.lazyCriteria);
                    this.selection.clear();
                })
            )
            .subscribe();
    }
    
    async loadOprOnPage() {
        this.lazyCriteria.pageNumber = this.paginator.pageIndex;
        this.lazyCriteria.pageSize = this.paginator.pageSize;
        this.lazyCriteria.sortValue = this.sort.direction;
        this.lazyCriteria.filterValue = this.input.nativeElement.value.trim();
        this.lazyCriteria.paramObj = {
            "quotCustId": this.getSession().id_mongo,
            "quotStatus":"Order Placed"
        }
        this.lazyCriteria.sortFiled = "ordcrDt";
        this.lazyCriteria.sortValue = "desc";
        this.dataSource1.loadLazyLst(this.lazyCriteria);
//        console.log(this.dataSource1.oprsSubject.value);
        
    }
    
    onFilterClick(filter: FilterBy) {
        this.lazyCriteria.filterField = filter.value;    //// set server site Filter Field
        this.filterHint = filter.key;    //// set fileter hint on web page
        this.input.nativeElement.focus();
    }
    
    connect(){
//        this.webSocketAPI.webSocketAPI._connect();
    }

    disconnect(){
        this.webSocketAPI._disconnect();
    }

    sendMessage(){
        this.webSocketAPI._send(this.name);
    }

    handleMessage(message){
        this.greeting = message;
        console.log(message);
        window.location.reload();
//        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
//            if (JSON.stringify(this.appService.Data.cartList[i].uploadFile.quotationNo) == this.greeting){
//                this.appService.Data.cartList[i].uploadFile.isFileUploaded = true;
//            }
//        }
        this.disconnect();
    }
    
    uploadFile(obj){
        console.log(obj);
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            quotationNo: obj.quotationNo
        }
        this.doHttpPost("/api/order/list", this.lazyCriteria, true).subscribe((data: any) => {
            data = data.response;
            console.log(data);
            if(data.length != 0){
                let orderObj = data[0];
                if(orderObj.isFileUploaded){
                    obj.isFileUploaded = true;
                    this.util.toastError('We Already Got You File');
                    return;
                }
                console.log(obj);
                this.webSocketAPI._connect(obj.quotationNo);
                let customer = obj.ordDispatchDateString + " " +this.logedInUser.custShopName.replace("&","AND") +" ("+ this.logedInUser.userAddress.addCity +")_";
                let orderType = "";
                if (obj.totalQuotationRateWithGst == obj.paidAmt){
                    orderType = "_(FP)"
                }
                if (obj.paidAmt == 0){
                    orderType = "_(FC)"
                }
                if (obj.paidAmt < obj.totalQuotationRateWithGst && obj.paidAmt != 0){
                    orderType = "_(PP)"
                }

                let quotationDetail = " " + obj.quotOrderDetails;

        //        quotationDetail = "FILE UPLOADED WILL BE RECEIVED ONLY WHEN YOU SEE 'FILE UPLOADED SUCCESSFULY'" + "\n" + "NOTE :"+"\n"+" 1. FIRST UPLOAD FILE"+"\n"+" 2. SCROLL AND CLICK SUBMIT BUTTON"+"\n"+" 3. Please DON'T EDIT any text in this form" + "\n\n" + quotationDetail;

                let quotationTotalAmountDisplay = "\t Total Amount : \t\t\t\t" + obj.totalQuotationRateWithGst + "/-";
                let quotationDriveFileName = customer + obj.orderNo+"_" + obj.quotDriveFileName + orderType;

                quotationDetail = this.replaceAll(quotationDetail, '\n', '%0A')

                let paramValue = "entry.1203295097=" + "Quotation No : " + obj.quotationNo
                    + "%0A%0A"
                    + quotationDetail
                    + "%0A%0A"
                    + quotationTotalAmountDisplay
                    + "&entry.1817197336=" + quotationDriveFileName
                console.log(paramValue); 

//                let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd2kjXz6xrZnadwa6JpX9HmDHTeMQzeIJRKRKZ4ebxnvNMEbA/viewform?" + paramValue;   //DISHANK DRIVE
                let uploadDriveUrl = "https://docs.google.com/forms/d/e/1FAIpQLSe5jePZBGlDE2TMuWRXjFVwvUxqttipFUIYfElLdehUhUdXnQ/viewform?" + paramValue;   //KAMLESH DRIVE
        //            this.spinner.hide();
                var left = (screen.width - 700) / 2;
                var top = (screen.height - 650) / 4;
                window.open(uploadDriveUrl, "Upload File",
                    'resizable=yes, width=' + 700
                    + ', height=' + 650 + ', top='
                    + top + ', left=' + left);
            }
        })
        
    }
    
    replaceAll(stringValue: string, search, replace) {
        return stringValue.split(search).join(replace);
    }
    
    
////////    ForPaytmPayment
//    paymentUrl:any;
//    makePayment(obj){
//        console.log(obj);
//        console.log(this.logedInUser);
//        if(obj.orderPayType == "credit"){
//            let balanceAmountPayble = 0;
//            balanceAmountPayble = obj.totalQuotationRateWithGst - obj.paidAmt;
//
//            let mobNo = this.logedInUser.userMobileNo;
//            let startNo = mobNo.slice(0,3);
//            let middleNo = mobNo.slice(3,7);
//            let endNo = mobNo.slice(7,10);
//            mobNo = startNo + "XXXX" + endNo;
//
//            let paymentDetail = {
//                payeeEmail: "dishankgandhi35@gmail.com",
//                payeeName: this.logedInUser.clientId,
//                payeeAmt: balanceAmountPayble,
//                payeePhone: "8605003000",
//                payeeOrderDtl: obj.orderNo,
//                mode: true,
//            }
//            console.log(paymentDetail);
////            this.doHttpPost("/api/InstamojoController/nextPaymentCredit", paymentDetail, false).subscribe((data: any) =>
////            {
////                console.log(data);
////                let uploadDriveUrl = data.paymentOptions.paymentUrl;
////                console.log(data.paymentOptions.paymentUrl);
////                this.paymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.paymentOptions.paymentUrl);
////                this.appService.Data.paymentUrl = this.paymentUrl;
////                this.appService.Data.paymentOrderNo = obj.orderNo;
////                this.appService.Data.totalAmount = balanceAmountPayble;
////                localStorage.setItem('OrderData', JSON.stringify(this.appService.Data));
////                this.router.navigate(['/payment']);
////
////            }, error =>
////            {
////                console.log(error);
////            })
//        }
//        else{
//            let balanceAmountPayble = 0;
//            balanceAmountPayble = obj.totalQuotationRateWithGst - obj.paidAmt;
//
//            let mobNo = this.logedInUser.userMobileNo;
//            let startNo = mobNo.slice(0,3);
//            let middleNo = mobNo.slice(3,7);
//            let endNo = mobNo.slice(7,10);
//            mobNo = startNo + "XXXX" + endNo;
//
//            let paymentDetail = {
//                    payeeEmail: "dishankgandhi35@gmail.com",
//                    payeeName: this.logedInUser.clientId,
//                    payeeAmt: balanceAmountPayble,
//                    payeePhone: "8605003000",
//                    payeeOrderDtl: obj.orderNo,
//                    mode: true
//                }
//            console.log(paymentDetail);
//            localStorage.removeItem("OrderData");
//            
//            localStorage.setItem('OrderData', JSON.stringify(this.appService.Data));
//            window.location.href='http://192.168.2.120:8080/api/paytmPayment/submitPaymentDetail?CUST_ID='+this.logedInUser.clientId +'&TXN_AMOUNT=1&ORDER_ID='+ obj.orderNo;
////            this.doHttpPost("/api/InstamojoController/nextPayment", paymentDetail, false).subscribe((data: any) =>
////            {
////                console.log(data);
////                let uploadDriveUrl = data.paymentOptions.paymentUrl;
////                console.log(data.paymentOptions.paymentUrl);
////                this.paymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.paymentOptions.paymentUrl);
////                this.appService.Data.paymentUrl = this.paymentUrl;
////                this.appService.Data.paymentOrderNo = obj.orderNo;
////                this.appService.Data.totalAmount = balanceAmountPayble;
////                localStorage.setItem('OrderData', JSON.stringify(this.appService.Data));
////                this.router.navigate(['/payment']);
////
////            }, error =>
////            {
////                console.log(error);
////            })
//        }
//        
//        
//    }
    
    
    
    paymentUrl:any;
    makePayment(obj){
        console.log(obj);
        console.log(this.logedInUser);
        if(obj.orderPayType == "credit"){
            let balanceAmountPayble = 0;
            balanceAmountPayble = obj.totalQuotationRateWithGst - obj.paidAmt;

            let mobNo = this.logedInUser.userMobileNo;
            let startNo = mobNo.slice(0,3);
            let middleNo = mobNo.slice(3,7);
            let endNo = mobNo.slice(7,10);
            mobNo = startNo + "XXXX" + endNo;

            let paymentDetail = {
                payeeEmail: this.logedInUser.email,
                payeeName: this.logedInUser.custShopName + ", " + this.logedInUser.userAddress.addCity,
                payeeAmt: balanceAmountPayble,
                payeePhone: "8605003000",
                payeeOrderDtl: obj.orderNo,
                mode: this.isPaymentGTMode,
                quotNo: "Credit_Party"
            }
            console.log(paymentDetail);
            
            this.appService.Data.paymentOrderNo = obj.orderNo;
            this.appService.Data.totalAmount = balanceAmountPayble;
            
            this.doHttpPost("/api/setting/getActivePG", "", true).subscribe((data: any) => {
                data = data.response;
                if(data.activePG == 'PG1'){
                    this.payViaCCAvenue(paymentDetail);
                }else{
                    this.payCreditViaInstaMojo(paymentDetail);
                }
            })
            
        }
        else{
            let balanceAmountPayble = 0;
            balanceAmountPayble = obj.totalQuotationRateWithGst - obj.paidAmt;

            let mobNo = this.logedInUser.userMobileNo;
            let startNo = mobNo.slice(0,3);
            let middleNo = mobNo.slice(3,7);
            let endNo = mobNo.slice(7,10);
            mobNo = startNo + "XXXX" + endNo;

            let paymentDetail = {
                    payeeEmail: this.logedInUser.email,
                    payeeName: this.logedInUser.custShopName + ", " + this.logedInUser.userAddress.addCity,
                    payeeAmt: balanceAmountPayble,
                    payeePhone: "8605003000",
                    payeeOrderDtl: obj.orderNo,
                    mode: this.isPaymentGTMode,
                    quotNo: "Remaining Payment"
                }
            console.log(paymentDetail);
            
            this.appService.Data.paymentOrderNo = obj.orderNo;
            this.appService.Data.totalAmount = balanceAmountPayble;
            
            this.doHttpPost("/api/setting/getActivePG", "", true).subscribe((data: any) => {
                data = data.response;
                if(data.activePG == 'PG1'){
                    this.payViaCCAvenue(paymentDetail);
                }else{
                    this.payViaInstaMojo(paymentDetail);
                }
            })
            
        }
    }
    
    payCreditViaInstaMojo(paymentDetail){
        this.doHttpPost("/api/InstamojoController/nextPaymentCredit", paymentDetail, false).subscribe((data: any) =>
        {
            data = data.response;
            console.log(data);
            let uploadDriveUrl = data.paymentOptions.paymentUrl;
            console.log(data.paymentOptions.paymentUrl);
            this.paymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.paymentOptions.paymentUrl);
            this.appService.Data.paymentUrl = this.paymentUrl;
//            this.appService.Data.paymentOrderNo = obj.orderNo;
//            this.appService.Data.totalAmount = balanceAmountPayble;
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            this.router.navigate(['/payment']);

        }, error =>
        {
            console.log(error);
        })
    }
    payViaInstaMojo(paymentDetail){
        this.doHttpPost("/api/InstamojoController/nextPayment", paymentDetail, false).subscribe((data: any) =>
        {
            data = data.response;
            console.log(data);
            let uploadDriveUrl = data.paymentOptions.paymentUrl;
            console.log(data.paymentOptions.paymentUrl);
            this.paymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.paymentOptions.paymentUrl);
            this.appService.Data.paymentUrl = this.paymentUrl;
//            this.appService.Data.paymentOrderNo = obj.orderNo;
//            this.appService.Data.totalAmount = balanceAmountPayble;
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            this.router.navigate(['/payment']);

        }, error =>
        {
            console.log(error);
        })
    }
    payViaCCAvenue(paymentDetail){
        this.localStorage.setJsonValue('OrderData', this.appService.Data);
        this.doHttpPost("/api/ccAvenue/makePayment", paymentDetail, false).subscribe((data: any) =>{
            data = data.response;
            window.open(data.url+"&encRequest="+data.encRequest+"&access_code="+data.access_code,"_self");
        })
    }
    
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
    

}
