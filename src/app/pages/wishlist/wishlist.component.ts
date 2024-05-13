import {Component, OnInit, Injector} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppService} from '../../app.service';
import {StandardRate} from '../../pojos/quotation/StandardRate';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {SiUtil} from '../../utility/SiUtil';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent extends MasterProvider implements OnInit {
    public quantity: number = 1;
    displayedColumns: any[] = ['Name', 'Price', 'orderDetails', 'quantity', 'Namune', 'Total'];
    isEmptyWishlist: boolean = false;
    
    constructor(public appService: AppService, public snackBar: MatSnackBar, public injector: Injector, public http: HttpClient, public authService: AuthService, public util: SiUtil) {
        super(injector, http, authService);
    }

    ngOnInit() {
        this.appService.Data.cartList.forEach(cartProduct => {
            this.appService.Data.wishList.forEach(product => {
                if (cartProduct.id == product.id) {
                    product.cartCount = cartProduct.cartCount;
                }
            });
        });
        setTimeout(()=>{
            console.log(this.appService.Data.wishList);
            if (this.appService.Data.wishList.length == 0){
                this.isEmptyWishlist = true;
            }
        },2000)
        console.log(this.appService.Data.wishList);
//        for (let i = 0; i < this.appService.Data.wishList.length; i++) {
//            let map = new Map<string, string>(); 
//            for (let j = 0; j < this.appService.Data.wishList[i].orderDetailsArr.length; j++) {
//                let arr = this.appService.Data.wishList[i].orderDetailsArr[j].split(":");
//                if (arr[0] == "" || arr[0] == "" || arr[1] == "" || arr[1] == "" || typeof arr[0] == "undefined" || typeof arr[1] == "undefined"){
//                    arr[0] = "";
//                    arr[1] = "";
//                }
//                arr[1] = arr[1].replace("-FB", "");
//                map.set(arr[0],arr[1]);
//            }
//            this.appService.Data.wishList[i].orderDetailsArr = map;
//        }
    }
    
    asIsOrder(a, b) {
        return 1;
    }
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}

    public remove(product: StandardRate) {
        this.util.toastConfirmation_Save("Are you sure you want to remove this product from your favourite list ?","").then(data=>{
            if(data){
                const index: number = this.appService.Data.wishList.indexOf(product);
                if (index !== -1) {
                    this.appService.Data.wishList.splice(index, 1);
                    let obj = {
                        userId: this.getSession().id_mongo,
                        userWishlist: this.appService.Data.wishList
                    }
                    console.log(obj);
                    this.doHttpPost("/api/auth/removeWishlistFrmUser", obj, true).subscribe(data => {
                        data = data.response;
                        console.log(data);      
                        this.ngOnInit();
                    });
                }
            }
        })
    }

    public clear() {
        this.appService.Data.wishList.length = 0;
        let obj = {
            userId: this.getSession().id_mongo,
            userWishlist: []
        }
        console.log(obj);
        this.doHttpPost("/api/auth/removeWishlistFrmUser", obj, true).subscribe(data => {
            data = data.response;
            console.log(data);
            this.appService.Data.wishList.length = 0;
        });
    }

    public getQuantity(val) {
        this.quantity = val.soldQuantity;
    }

    public addToCart(product: StandardRate) {
        let currentProduct = this.appService.Data.cartList.filter(item => item.id == product.id + "")[0];
        if (currentProduct) {
            
            if (typeof this.appService.Data.cartList[0] != "undefined"){
                if(this.appService.Data.cartList[0].ids != null){
                    this.snackBar.open('Please, First Proceed Customised Quotation', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                    return false;
                }
            }
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
//            if ((currentProduct.cartCount + this.quantity) <= product.availibilityCount) {
//                product.cartCount = currentProduct.cartCount + this.quantity;
//            }
//            else {
//                this.snackBar.open('Please go to CART to change the required quantity', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
//                return false;
//            }
        }
        else {
            product.cartCount = this.quantity;
        }
        if (typeof this.appService.Data.cartList[0] != "undefined"){
            if(this.appService.Data.cartList[0].ids != null){
                this.snackBar.open('Please, First Proceed Customised Quotation', '×', {panelClass: 'error', verticalPosition: 'top', duration: 5000});
                return false;
            }
        }
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

}