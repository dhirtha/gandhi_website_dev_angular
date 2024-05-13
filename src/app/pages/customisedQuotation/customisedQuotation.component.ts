import {Component, OnInit, Injector, ViewChild, ElementRef} from '@angular/core';
import {Data, AppService} from '../../app.service';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {StandardRate} from '../../pojos/quotation/StandardRate';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {CustomisedQuotationListDataSource} from './customisedQuotation-listDataSource';
import {FilterBy} from '../../utility/FilterBy';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {tap} from 'rxjs/internal/operators/tap';
import {merge, fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/internal/operators/debounceTime';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {SiUtil} from '../../utility/SiUtil';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-customisedQuotation',
    templateUrl: './customisedQuotation.component.html',
    styleUrls: ['./customisedQuotation.component.scss']
})
export class CustomisedQuotationComponent extends MasterProvider implements OnInit {
    count: any;
    lazyCriteria: LazyLoadRequest;
    total = [];
    grandTotal = 0;
    cartItemCount = [];
    cartItemCountTotal = 0;
    
    listOfNonExpQuot:any
    listOfNonExpQuots = [];
    displayedColumns: any[] = ['quotationNo',  'orderDetails', 'quantity', 'enqProdDeleveryDays', 'deliveryThrough', 'amount', 'add'];
    
    listOfExpQuot:any
    displayedColumnsExp: any[] = ['quotationNo', 'orderDetails', 'quantity', 'enqProdDeleveryDays', 'deliveryThrough', 'amount'];
    filterByArray: any[] = [];
    filterHint: string;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('input') input: ElementRef;
    selection = new SelectionModel<any>(true, []);
    
    isShowPreviousQuotation = false;
    
    constructor(public appService: AppService, public injector: Injector, public  http: HttpClient, public  authService: AuthService, public snackBar: MatSnackBar, public router: Router, public util: SiUtil, private localStorage: LocalService) {
        super(injector, http, authService);
    }
    
    getQuote(evt)
    {
        if(evt===null)
        {
               this.getListOfNonExpQuot();
        }
        else if(evt.index==0)
        {
               this.getListOfNonExpQuot();
        }else if(evt.index==1)
        {
            this.getExpQuotationLst();
        }
        
        console.log(evt.index);
    }

    ngOnInit() {
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.snackBar.open('Please, Login In Yourself to see Customised Quotation', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
            this.router.navigate(['/login']);
        }
        else {
            setTimeout( async () => {
                this.appService.Data.cartList.forEach(product => {
                    this.total[product.id] = product.namune * product.rate;
                    this.grandTotal += product.namune * product.rate;
                    this.cartItemCount[product.id] = product.cartCount;
                    this.cartItemCountTotal += product.cartCount;
                })
                console.log(this.appService.Data.cartList);
            }, 1000); 
//            this.getQuote(null);
            this.getListOfNonExpQuot();
        }
        
    }
    
    async getExpQuotationLst(){
        
        this.listOfExpQuot = new CustomisedQuotationListDataSource(this.injector, this.http, this.authService);
        
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 10;
        this.lazyCriteria.paramObj = {
            "quotCustId": this.getSession().id_mongo
        }
        this.lazyCriteria.sortFiled = "crDt";
        this.lazyCriteria.sortValue = "desc";
        
        this.listOfExpQuot.loadLazyLst(this.lazyCriteria);
        console.log(this.listOfExpQuot);
        setTimeout(()=>{
            for (let i = 0; i < this.listOfExpQuot.oprsSubject._value.length; i++) {
                let ts = this.listOfExpQuot.oprsSubject._value[i].stringExpDt.split(" ")[1];
                var hours = ts.split(":")[0]
                var minutes = ts.split(":")[1]
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? ''+minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                this.listOfExpQuot.oprsSubject._value[i].stringExpDt.split(" ")[1] = strTime;
                this.listOfExpQuot.oprsSubject._value[i].stringExpDt = this.listOfExpQuot.oprsSubject._value[i].stringExpDt.split(" ")[0] + "$" + strTime;
            }
            this.ngAfterViewInit()
        },1000)

        this.count = await  this.listOfExpQuot.loadCount(this.lazyCriteria);
        console.log(this.count);
        
//        if (this.listOfExpQuot.oprsSubject.value.length > 0){
            this.loadFilterValues();   /// load Filter Values 
//        }

        console.log(this.listOfExpQuot);
//        this.getOrderList()

    }
    loadFilterValues() {
        this.filterByArray = [];
//        this.filterByArray.push(new FilterBy("Quotation No.", "quotationNo"));
        this.filterByArray.push(new FilterBy("Product Name", "quotEnquiry.enqProductName"));
        this.filterByArray.push(new FilterBy("Created Date & Time", "stringCrDt"));
        this.filterByArray.push(new FilterBy("Order Detail", "quotOrderDetails"));
        this.filterByArray.push(new FilterBy("Expired Date & Time", "stringExpDt"));
        this.filterByArray.push(new FilterBy("Quantity", "quotFinalQty"));
        this.defaultFilterBy();
    }
    defaultFilterBy() {
        this.lazyCriteria.filterField = this.filterByArray[0].value   ///// defualt filter By 
        this.filterHint = this.filterByArray[0].key   ///// defualt filter By 
        this.input.nativeElement.value = "";   ///// defualt filter By  
    }
    
    
    ngAfterViewInit() {
//        if (this.listOfExpQuot.oprsSubject.value.length > 0){
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
                        this.count = await this.listOfExpQuot.loadCount(this.lazyCriteria);
                        this.selection.clear();
                    })
                )
                .subscribe();
//        }
    }
    
    async loadOprOnPage() {
//        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageNumber = this.paginator.pageIndex;
        this.lazyCriteria.pageSize = this.paginator.pageSize;
        this.lazyCriteria.sortValue = this.sort.direction;
        this.lazyCriteria.filterValue = this.input.nativeElement.value.trim();
        this.lazyCriteria.paramObj = {
            "quotCustId": this.getSession().id_mongo
        }
        this.lazyCriteria.sortFiled = "crDt";
        this.lazyCriteria.sortValue = "desc";
        this.listOfExpQuot.loadLazyLst(this.lazyCriteria);
        console.log(this.lazyCriteria);
        setTimeout(()=>{
            console.log(this.listOfExpQuot.oprsSubject._value);
            for (let i = 0; i < this.listOfExpQuot.oprsSubject._value.length; i++) {
                let ts = this.listOfExpQuot.oprsSubject._value[i].stringExpDt.split(" ")[1];
                var hours = ts.split(":")[0]
                var minutes = ts.split(":")[1]
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? ''+minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                this.listOfExpQuot.oprsSubject._value[i].stringExpDt.split(" ")[1] = strTime;
                this.listOfExpQuot.oprsSubject._value[i].stringExpDt = this.listOfExpQuot.oprsSubject._value[i].stringExpDt.split(" ")[0] + "$" + strTime;
            }
//                console.log(this.listOfExpQuot.oprsSubject._value);
//            this.ngAfterViewInit()
        },2000)
//        console.log(this.listOfExpQuot);
    }
    
    onFilterClick(filter: FilterBy) {
        this.lazyCriteria.filterField = filter.value;    //// set server site Filter Field
        this.filterHint = filter.key;    //// set fileter hint on web page
        this.input.nativeElement.focus();
    }


    public updateCart(value) {
        if (value) {
            this.total[value.productId] = value.total;
            this.cartItemCount[value.productId] = value.soldQuantity;
            this.grandTotal = 0;
            this.total.forEach(price => {
                this.grandTotal += price;
            });
            this.cartItemCountTotal = 0;
            this.cartItemCount.forEach(count => {
                this.cartItemCountTotal += count;
            });

            this.appService.Data.totalPrice = this.grandTotal;
            this.appService.Data.totalCartCount = this.cartItemCountTotal;

            this.appService.Data.cartList.forEach(product => {
                this.cartItemCount.forEach((count, index) => {
                    if (product.id == index + "") {
                        product.cartCount = count;
                    }
                });
            });

        }
    }

    public remove(product) {
        const index: number = this.appService.Data.cartList.indexOf(product);
        if (index !== -1) {
            this.appService.Data.cartList.splice(index, 1);
            this.grandTotal = this.grandTotal - this.total[product.id];
            this.appService.Data.totalPrice = this.grandTotal;
            this.total.forEach(val => {
                if (val == this.total[product.id]) {
                    this.total[product.id] = 0;
                }
            });
            let obj = {
                userId: this.getSession().id_mongo,
                userCartList : this.appService.Data.cartList
            }
            console.log(obj);
            this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data=>{
                data = data.response;
                console.log(data);
            });

            this.cartItemCountTotal = this.cartItemCountTotal - this.cartItemCount[product.id];
            this.appService.Data.totalCartCount = this.cartItemCountTotal;
            this.cartItemCount.forEach(val => {
                if (val == this.cartItemCount[product.id]) {
                    this.cartItemCount[product.id] = 0;
                }
            });
            this.appService.resetProductCartCount(product);
        }
    }

    public clear() {
//        this.appService.Data.cartList.forEach(product => {
//            this.appService.resetProductCartCount(product);
//        });
//        this.appService.Data.cartList.length = 0;
//        this.appService.Data.totalPrice = 0;
//        this.appService.Data.totalCartCount = 0;
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
    }
    
    
    decrement(product){
        if(product.namune == 1){}
        else{
            product.namune = product.namune - 1;
//            product.quantity = this.qty * product.namune;
//            product.rate = this.rate * product.namune;
            console.log(product.namune);
            console.log(this.rate);
            console.log(this.total[product.id]);
            this.total[product.id] = this.rate * product.namune; 
            this.grandTotal = 0;
            this.appService.Data.cartList.forEach(product => {
                this.grandTotal += product.rate * product.namune;
                this.grandTotal = this.grandTotal;
                this.appService.Data.totalPrice = this.grandTotal;
            });
        }
    }
    qty:any;
    rate:any;
    increment(product){
        if(product.namune == 1){
            this.qty = product.quantity;
            this.rate = product.rate;
        }
        product.namune = product.namune + 1;
//        product.quantity = this.qty * product.namune;
//        product.rate = this.rate * product.namune;
        this.total[product.id] = this.rate * product.namune;
        this.grandTotal = 0;
        this.appService.Data.cartList.forEach(product => {
            this.grandTotal += product.rate * product.namune;
            this.grandTotal = this.grandTotal;
            this.appService.Data.totalPrice = this.grandTotal;
        });
    }

    showPreviousQuotation(){
        this.isShowPreviousQuotation = !this.isShowPreviousQuotation;
    }
    
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
    
    getListOfNonExpQuot(){
        this.doHttpPost("/api/quotationEnquiry/listOfNonExpQuot", this.getSession().email, true).subscribe((data:any)=>{
            data = data.response;
            console.log("Quotation listtttttttttttttttttttt");
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let ts = data[i].stringExpDt.split(" ")[1];
                var hours = ts.split(":")[0]
                var minutes = ts.split(":")[1]
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? ''+minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
                data[i].stringExpDt.split(" ")[1] = strTime;
                data[i].stringExpDt = data[i].stringExpDt.split(" ")[0] + "$" + strTime;
            }
            this.listOfNonExpQuots = data;
//            this.listOfNonExpQuot = data;
            this.listOfNonExpQuot = new MatTableDataSource(<any> data);
        })
    }
    
//    const timeString = '18:00:00'
//// Append any date. Use your birthday.
//const timeString12hr = new Date('1970-01-01T' + timeString + 'Z')
//  .toLocaleTimeString({},
//    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
//  );
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.listOfNonExpQuot.filter = filterValue.trim().toLowerCase();
    } 
    
    applyFilterExp(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.listOfExpQuot.filter = filterValue.trim().toLowerCase();
    } 
    
    addQuotToCart(obj){
        console.log(obj);
        let valid = true;
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            if (this.appService.Data.cartList[i].ids != null){
                if (this.appService.Data.cartList[i].ids == obj.quotationNo){
                    valid = false;
                }
            }
        }
        if (typeof this.appService.Data.cartList[0] != "undefined"){
            if(this.appService.Data.cartList[0].ids == null){
//                this.snackBar.open('Please, Add Only Standard Product', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
                this.util.toastInfo("Information","You cannot add Standard and Customised Products at the same time. Click OK to remove the existing item in cart and add this new one.")
                return false;
            }
            if(this.appService.Data.cartList[0].ids != null){
//                this.snackBar.open('You can proceed only with one customised quotation at a time.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
                this.util.toastInfo("Information","You can proceed only with one customised quotation at a time.")
                return false;
            }
        }
        if(valid){
            let stndRate = new StandardRate();
            stndRate.id = obj.id;
            stndRate.ids = obj.quotationNo;
            stndRate.productName = obj.quotEnquiry.enqProductName;
            stndRate.productId = obj.quotEnquiry.enqProductId;
            stndRate.rate = obj.totalQuotationRateWithGst;
            stndRate.quantity = parseFloat(obj.quotFinalQty);
            stndRate.baseQuantity = parseFloat(obj.quotFinalQty);
            stndRate.namune = 1;
            stndRate.deliveryDays = "0";
            stndRate.urgentDeliveryDays = "0";
            stndRate.urgentRate = 1;
            stndRate.travelRate = obj.quotPreferdTravel.quotTravelAmount;
            stndRate.orderDetailsArr = obj.orderDetailsArr;
            console.log(stndRate);
//            this.appService.Data.cartList.push(stndRate);
            this.appService.addToCart(stndRate);
//            stndRate = null;


            this.total = [];
            this.grandTotal = 0;
            this.cartItemCount = [];
            this.cartItemCountTotal = 0;
            this.appService.Data.totalPrice = 0;
            this.appService.Data.cartList.forEach(product => {
                this.total[product.id] = product.namune * product.rate;
                this.grandTotal += product.namune * product.rate;
                this.appService.Data.totalPrice = this.appService.Data.totalPrice + product.rate;
                this.cartItemCount[product.id] = product.cartCount;
                this.cartItemCountTotal += product.cartCount;
            })
//            let message, status;
//            message = 'The product ' + obj.quotEnquiry.enqProductName + ' has been added to cart.'; 
//            status = 'success';          
//            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
        } else{
            this.snackBar.open('Already added in Cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        }
    }
    
    buyQuot(productObj){
        console.log(productObj);
        let valid = true;
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            if (this.appService.Data.cartList[i].ids != null){
                if (this.appService.Data.cartList[i].ids == productObj.quotationNo){
                    valid = false;
                }
            }
        }
        if (typeof this.appService.Data.cartList[0] != "undefined"){
            if(this.appService.Data.cartList[0].ids == null){
//                this.snackBar.open('Please, Add Only Standard Product', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
//                this.util.toastInfo("Information","You can add either standard or customised products to the cart. But not both at a time");
                this.util.toastConfirmation_Save("You cannot add Standard and Customised Products at the same time. Click OK to remove the existing item in cart and add this new one.", "info").then(data=>{
                    if(data){
                        let obj = {
                            userId: this.appService.getSession().id_mongo,
                            userCartList: []
                        }
                        this.appService.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                            data = data.response;
                            console.log(data);
//                            localStorage.removeItem("originalCartObj");
//                            localStorage.removeItem("OrderData");
//                            localStorage.removeItem("updatedCartObj");
                            this.localStorage.clearTokenByKey('originalCartObj');
                            this.localStorage.clearTokenByKey('OrderData');
                            this.localStorage.clearTokenByKey('updatedCartObj');
                            this.appService.Data.cartList.length = 0;
                            this.appService.Data.totalPrice = 0;
                            this.appService.Data.totalCartCount = 0;
                            this.addToCart(valid,productObj);
                            this.router.navigate(['/cart']);
                        });
                    }
                })
//                return false;
            }else{
                if(this.appService.Data.cartList[0].ids != null){
//                    this.snackBar.open('You can proceed only with one customised quotation at a time.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
                    this.util.toastInfo("Information","You can proceed only with one customised quotation at a time.")
                    return false;
                }
                this.addToCart(valid,productObj);
            }
            
        }else{
            this.addToCart(valid,productObj);
        }
        
    }
    
    addToCart(valid,obj){
        if(valid){
            let stndRate = new StandardRate();
            stndRate.id = obj.id;
            stndRate.ids = obj.quotationNo;
            stndRate.productName = obj.quotEnquiry.enqProductName;
            stndRate.productId = obj.quotEnquiry.enqProductId;
//            if(obj.quotPreferdTravel.travelPayMode == "ToPay"){
                stndRate.rate = obj.totalQuotationRateWithGst;
//            }
//            else{
//                stndRate.rate = obj.totalQuotationRateWithGst - obj.quotPreferdTravel.quotTravelAmount;
//            }
            stndRate.quantity = parseFloat(obj.quotFinalQty);
            stndRate.baseQuantity = parseFloat(obj.quotFinalQty);
            stndRate.namune = 1;
            stndRate.deliveryDays = "0";
            stndRate.urgentDeliveryDays = "0";
            stndRate.urgentRate = 1;
//            if(obj.quotPreferdTravel.travelPayMode == "ToPay"){
//                stndRate.travelRate = 0;
//            }
//            else{
                stndRate.travelRate = obj.quotPreferdTravel.quotTravelAmount;
//            }
            stndRate.orderDetailsArr = obj.orderDetailsArr;
            console.log(stndRate);
//            this.appService.Data.cartList.push(stndRate);
            this.appService.addToCart(stndRate);
//            stndRate = null;


            this.total = [];
            this.grandTotal = 0;
            this.cartItemCount = [];
            this.cartItemCountTotal = 0;
            this.appService.Data.totalPrice = 0;
            this.appService.Data.cartList.forEach(product => {
                this.total[product.id] = product.namune * product.rate;
                this.grandTotal += product.namune * product.rate;
                this.appService.Data.totalPrice = this.appService.Data.totalPrice + product.rate;
                this.cartItemCount[product.id] = product.cartCount;
                this.cartItemCountTotal += product.cartCount;
            })
//            let message, status;
//            message = 'The product ' + obj.quotEnquiry.enqProductName + ' has been added to cart.'; 
//            status = 'success';          
//            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
            this.router.navigate(['/cart']);
        } 
        else{
            this.snackBar.open('Already added in Cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        }
    }

}
