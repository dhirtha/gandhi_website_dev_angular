import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Data, AppService} from '../../app.service';
import {Product} from '../../app.models';
import {Router} from '@angular/router';
import {StandardRate} from '../../pojos/quotation/StandardRate';
import {SiUtil} from '../../utility/SiUtil';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
    @Input() product: Product;
    @Input() type: string;
    @Output() onOpenProductDialog: EventEmitter<any> = new EventEmitter();
    @Output() onQuantityChange: EventEmitter<any> = new EventEmitter<any>();
    public count: number = 1;
    public align = 'center center';
    constructor(public appService: AppService, public snackBar: MatSnackBar, private router: Router, private util: SiUtil, private localStorage: LocalService) {}

    ngOnInit() {
        if (this.product) {
            if (this.product.cartCount > 0) {
                this.count = this.product.cartCount;
            }
        }
        this.layoutAlign();
    }

    public layoutAlign() {
        if (this.type == 'all') {
            this.align = 'space-between center';
        }
        else if (this.type == 'wish') {
            this.align = 'start center';
        }
        else {
            this.align = 'center center';
        }
    }



    public increment(count) {
        if (this.count < this.product.availibilityCount) {
            this.count++;
            let obj = {
                productId: this.product.id,
                soldQuantity: this.count,
                total: this.count * this.product.newPrice
            }
            this.changeQuantity(obj);
        }
        else {
            this.snackBar.open('You can not choose more items than available. In stock ' + this.count + ' items.', '×', {panelClass: 'error', verticalPosition: 'top', duration: 3000});
        }
    }

    public decrement(count) {
        if (this.count > 1) {
            this.count--;
            let obj = {
                productId: this.product.id,
                soldQuantity: this.count,
                total: this.count * this.product.newPrice
            }
            this.changeQuantity(obj);
        }
    }

    public addToCompare(product: StandardRate) {
        console.log("Add To Compare=======================");
        console.log(product);
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.router.navigate(['/login']);
        } else {
            this.appService.addToCompare(product);
        }
    }

    public addToWishList(product: any) {
        console.log("Add To Wish List=======================");
        console.log(product);
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.router.navigate(['/login']);
        } else {
            if (typeof product.productName != "undefined"){
                let arr = [];
                arr.push("Size : "+product.size)
                arr.push("Paper : "+product.gsm+" "+product.paperType)
                arr.push("Printing : "+product.printingColor+" "+product.printSide+" Printed")
                if (product.laminationSide != "N/A" && product.laminationType != "N/A"){
                    arr.push("Lamination : "+product.laminationSide+" "+product.laminationType+" Lam")
                }
                arr.push("Quantity : "+product.quantity)
                if (product.postpress != null){
                    arr.push("Post Press : "+product.postpress)
                }
                product.orderDetailsArr = arr;
                console.log(arr);
                this.appService.addToWishList(product);
            }
            else{
                let stndRate = new StandardRate();
                stndRate.id = product.id;
                stndRate.ids = product.quotationNo;
                stndRate.productId = product.quotEnquiry.enqProductId;
                stndRate.productName = product.quotEnquiry.enqProductName;
                if(product.quotPreferdTravel.travelPayMode == "ToPay"){
                    stndRate.rate = product.totalQuotationRateWithGst;
                }
                else{
                    stndRate.rate = product.totalQuotationRateWithGst - product.quotPreferdTravel.quotTravelAmount;
                }
                stndRate.quantity = product.quotFinalQty;
                stndRate.namune = 1;
                stndRate.deliveryDays = "0";
                stndRate.urgentDeliveryDays = "0";
                stndRate.urgentRate = 1;
                if (product.quotPreferdTravel.travelPayMode == "ToPay"){
                    stndRate.travelRate = 0;
                }
                else{
                    stndRate.travelRate = product.quotPreferdTravel.quotTravelAmount;
                }
                stndRate.orderDetailsArr = product.orderDetailsArr;
                console.log(stndRate);
                this.appService.addToWishList(stndRate);
            }
        }
    }

    public addToCart(product: any) {
        console.log("Add To Cart=======================");
        console.log(product);
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.router.navigate(['/login']);
        } else {
            console.log(product);
            if (typeof this.appService.Data.cartList[0] != "undefined"){
                if(this.appService.Data.cartList[0].ids != null){
//                    this.snackBar.open('Please, First Proceed Customised Quotation', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                    this.util.toastConfirmation_Save("You have already added customised product in your cart. Do you want to clear it and add standard product", "info").then(data=>{
                        if(data){
                            let obj = {
                                userId: this.appService.getSession().id_mongo,
                                userCartList: []
                            }
                            this.appService.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                                data = data.response;
                                console.log(data);
//                                localStorage.removeItem("originalCartObj");
//                                localStorage.removeItem("OrderData");
//                                localStorage.removeItem("updatedCartObj");
                                this.localStorage.clearTokenByKey('originalCartObj');
                                this.localStorage.clearTokenByKey('OrderData');
                                this.localStorage.clearTokenByKey('updatedCartObj');
                                this.appService.Data.cartList.length = 0;
                                this.appService.Data.totalPrice = 0;
                                this.appService.Data.totalCartCount = 0;
                                this.addStandOrCustToCart(product);
                            });
                        }
                    })
//                    return false;
                }
                else{
                    if (this.appService.Data.cartList.length != 0){
                        if (product.productName == "Bookwork"){
                            this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                            return false;
                        }
                        if (this.appService.Data.cartList[0].productName == "Bookwork"){
                            this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                            return false;
                        }
                    }
                    this.addStandOrCustToCart(product);
                }
            }
            else{
                if (this.appService.Data.cartList.length != 0){
                    if (product.productName == "Bookwork"){
                        this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                        return false;
                    }
                    if (this.appService.Data.cartList[0].productName == "Bookwork"){
                        this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                        return false;
                    }
                }
                this.addStandOrCustToCart(product);
            }
        }
    }
    
    addStandOrCustToCart(product){
        let currentProduct = this.appService.Data.cartList.filter(item => item.id == product.id)[0];
        if (typeof product.productName != "undefined"){
            let arr = []; 
            if(product.productName != "Bookwork"){
                arr.push("Size : "+product.size)
                arr.push("Paper : "+product.gsm+" "+product.paperType)
                arr.push("Printing : "+product.printingColor+" "+product.printSide+" Printed")
                if (product.laminationSide != "N/A" && product.laminationType != "N/A"){
                    arr.push("Lamination : "+product.laminationSide+" "+product.laminationType+" Lam")
                }
                arr.push("Quantity : "+product.quantity)
                if (product.postpress != null){
                    arr.push("Post Press : "+product.postpress)
                }
            }
            else{
                arr = product.printSide.split("\n");
            }
            product.orderDetailsArr = arr;
            console.log(arr);
            this.appService.addToCart(product);
        }
        else{
            let stndRate = new StandardRate();
            stndRate.id = product.id;
            stndRate.ids = product.quotationNo;
            stndRate.productId = product.quotEnquiry.enqProductId;
            stndRate.productName = product.quotEnquiry.enqProductName;
            if(product.quotPreferdTravel.travelPayMode == "ToPay"){
                stndRate.rate = product.totalQuotationRateWithGst;
            }
            else{
                stndRate.rate = product.totalQuotationRateWithGst - product.quotPreferdTravel.quotTravelAmount;
            }
            stndRate.quantity = product.quotFinalQty;
            stndRate.namune = 1;
            stndRate.deliveryDays = "0";
            stndRate.urgentDeliveryDays = "0";
            stndRate.urgentRate = 1;
            if (product.quotPreferdTravel.travelPayMode == "ToPay"){
                stndRate.travelRate = 0;
            }
            else{
                stndRate.travelRate = product.quotPreferdTravel.quotTravelAmount;
            }
            stndRate.orderDetailsArr = product.orderDetailsArr;
            console.log(stndRate);
            this.appService.addToCart(stndRate);
//                this.appService.Data.cartList.push(stndRate);
//                this.appService.Data.totalPrice = 0;
//                this.appService.Data.cartList.forEach(product => {
//                    this.appService.Data.totalPrice = this.appService.Data.totalPrice + product.rate;
//                })
        }
    }
    
    public buy(product: any) {
        console.log("Add To Cart=======================");
        console.log(product);
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.router.navigate(['/login']);
        } else {
            console.log(product);
            if (typeof this.appService.Data.cartList[0] != "undefined"){
                if(this.appService.Data.cartList[0].ids != null){
//                    this.snackBar.open('Please, First Proceed Customised Quotation', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                    this.util.toastConfirmation_Save("You have already added customised product in your cart. Do you want to clear it and add standard product", "info").then(data=>{
                        if(data){
                            let obj = {
                                userId: this.appService.getSession().id_mongo,
                                userCartList: []
                            }
                            this.appService.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                                data = data.response;
                                console.log(data);
//                                localStorage.removeItem("originalCartObj");
//                                localStorage.removeItem("OrderData");
//                                localStorage.removeItem("updatedCartObj");
                                this.localStorage.clearTokenByKey('originalCartObj');
                                this.localStorage.clearTokenByKey('OrderData');
                                this.localStorage.clearTokenByKey('updatedCartObj');
                                this.appService.Data.cartList.length = 0;
                                this.appService.Data.totalPrice = 0;
                                this.appService.Data.totalCartCount = 0;
                                this.addStandOrCustToCart(product);
                                this.router.navigate(['/cart']);
                            });
                        }
                    })
//                    return false;
                }
                else{
                    if (this.appService.Data.cartList.length != 0){
                        if (product.productName == "Bookwork"){
                            this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                            return false;
                        }
                        if (this.appService.Data.cartList[0].productName == "Bookwork"){
                            this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                            return false;
                        }
                    }
                    this.addStandOrCustToCart(product);
                    this.router.navigate(['/cart']);
                }
            }
            else{
                if (this.appService.Data.cartList.length != 0){
                    if (product.productName == "Bookwork"){
                        this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                        return false;
                    }
                    if (this.appService.Data.cartList[0].productName == "Bookwork"){
                        this.snackBar.open('Please, First Proceed Cart Item', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                        return false;
                    }
                }
                this.addStandOrCustToCart(product);
                this.router.navigate(['/cart']);
            }
        }
    }

    public openProductDialog(event) {
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.router.navigate(['/login']);
        } else {
            this.onOpenProductDialog.emit(event);
        }
    }

    public changeQuantity(value) {
        this.onQuantityChange.emit(value);
    }

}
