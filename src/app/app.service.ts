import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, Product } from './app.models';
import { environment } from 'src/environments/environment';  
import {MasterProvider} from './utility/MasterProvider';
import {AuthService} from './utility/auth-service';
import {StandardRate} from './pojos/quotation/StandardRate';
import {LazyLoadRequest} from './request/LazyLoadRequest';

export class Data {
    constructor(public categories: Category[],
                public compareList: StandardRate[],
                public wishList: StandardRate[],
                public cartList: StandardRate[],
                public totalPrice: number,
                public quotObj: any,
                public totalAmount: number,
                public totalTravelAmount: number,
                public totalOrderAmount: number,
                public paymentUrl: string,
                public paymentOrderNo: string,
                public orderType: string,
                public fullOrPartial: string,
                public paperAmount: number,
                public totalCartCount: number,
                public deliveryMode: string,
                public deliveryAmount: number,
                public paymentMode: string,
                public dispatchDate: string,
                public paybleAmount: number,
                public adjustedAmount: number,
                public walletAmount: number,
                ) { }
}

@Injectable()
export class AppService extends MasterProvider{
    lazyCriteria: LazyLoadRequest;
    public Data = new Data(
        [], // categories
        [], // compareList
        [],  // wishList
        [],  // cartList
        null,  // cartList
        null, //totalPrice,
        0, //totalamount
        0, //travelamount
        0, //orderAmount
        "", //paymenturl
        "", //paymenturl
        "", //paymenturl
        "", //paymenturl
        0, //paymenturl
        0, //totalCartCount
        "", //totalCartCount
        0, //totalCartCount
        "Online", //paymentMode
        "", //dispatchDate
        0, //paybleAmount
        0, //adjustedAmount
        0, //walletAmount
    )
    
    public url = environment.url + '/assets/data/'; 

    constructor(public http:HttpClient, public snackBar: MatSnackBar, public injector: Injector, public authService:AuthService) 
    {
        super(injector, http, authService);
//        this.lazyCriteria = new LazyLoadRequest();
//        this.lazyCriteria.pageSize = 100;
//        this.lazyCriteria.paramObj = {
//            id : this.getSession().id_mongo
//        }
//        this.lazyCriteria.include = ["id","gsm","gsmId","laminationId","laminationSide","laminationType","namune","paperId","paperType","printSide","printingColor","printingColorId","productId","productName","quantity","rate","size","sizeId","urgentDeliveryDays","urgentRate","deliveryDays"]
//        console.log(this.lazyCriteria);
        setTimeout(() => {
            if (typeof this.getSession() !="undefined"){
                this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
                    data = data.response;
                    console.log(data.custRateLabel);
                    let obj = {
                        userId: this.getSession().id_mongo,
                        rateLabelId: data.custRateLabel
                    }
                    console.log(obj);
                    if(data.custRateLabel != null){
                        this.doHttpPost("/api/auth/getUserCart2", obj, true).subscribe((data:any)=>{
                            data = data.response;
                            console.log(data);
                            for (let i = 0; i < data.length; i++) {
                                if(data[i].ids == null){
                                    let arr = []; 
                                    if(data[i].productName != "Bookwork"){
                                        arr.push("Size : "+data[i].size)
                                        arr.push("Paper : "+data[i].gsm+" "+data[i].paperType)
                                        arr.push("Printing : "+data[i].printingColor+" "+data[i].printSide+" Printed")
                                        if (data[i].laminationSide != "N/A" && data[i].laminationType != "N/A"){
                                            arr.push("Lamination : "+data[i].laminationSide+" "+data[i].laminationType+" Lam")
                                        }
                                        arr.push("Quantity : "+data[i].quantity)
                                        if (data[i].postpress != null){
                                            arr.push("Post Press : "+data[i].postpress)
                                        }
                                    }
                                    else{
                                        arr = data[i].printSide.split("\n");
                                    }
                                    data[i].orderDetailsArr = arr;
                                }
                            }
                            this.Data.cartList = data;
                            this.Data.totalCartCount = data.length;
                            this.Data.cartList.forEach(product=>{
                //                this.Data.totalPrice = this.Data.totalPrice + (product.cartCount * product.rate);
                                this.Data.totalPrice = this.Data.totalPrice + product.rate;
                            });
                            this.doHttpPost("/api/auth/getUserWishlist2", obj, true).subscribe((data:any)=>{
                                data = data.response;
                                console.log(data);
                                for (let i = 0; i < data.length; i++) {
                                    if(data[i].ids == null){
                                        let arr = []; 
                                        if(data[i].productName != "Bookwork"){
                                            arr.push("Size : "+data[i].size)
                                            arr.push("Paper : "+data[i].gsm+" "+data[i].paperType)
                                            arr.push("Printing : "+data[i].printingColor+" "+data[i].printSide+" Printed")
                                            if (data[i].laminationSide != "N/A" && data[i].laminationType != "N/A"){
                                                arr.push("Lamination : "+data[i].laminationSide+" "+data[i].laminationType+" Lam")
                                            }
                                            arr.push("Quantity : "+data[i].quantity)
                                            if (data[i].postpress != null){
                                                arr.push("Post Press : "+data[i].postpress)
                                            }
                                        }
                                        else{
                                            arr = data[i].printSide.split("\n");
                                        }
                                        data[i].orderDetailsArr = arr;
                                    }
                                }
                                this.Data.wishList = data;
                            })
                        })
                    }
                })
            }
        }, 500);
    }
    
    public getCategories(): Observable<Category[]>{
        return this.http.get<Category[]>(this.url + 'categories.json');
    }
   
    public getProducts(type): Observable<Product[]>{        
        return this.http.get<Product[]>(this.url + type + '-products.json');
    }

    public getProductById(id): Observable<any>{
//        return this.http.get<Product>(this.url + 'product-' + id + '.json');
        return this.http.post<any>(this.globalServerPath+"/api/AdProductController/getById", id);
    }
    
    public geStandardtProductById(id): Observable<any>{
        return this.http.post<any>(this.globalServerPath+"/api/StandardRate/getById", id);
    }

    public getBanners(): Observable<any[]>{
        return this.http.get<any[]>(this.url + 'banners.json');
    }

    public addToCompare(product:StandardRate){
        let message, status;
        if(this.Data.compareList.filter(item=>item.id == product.id)[0]){
            message = 'The product ' + product.productName + ' already added to comparison list.'; 
            status = 'error';     
        }
        else{
            this.Data.compareList.push(product);
            message = 'The product ' + product.productName + ' has been added to comparison list.'; 
            status = 'success';  
        }
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
    }

    public addToWishList(product:StandardRate){
        let message, status;
        if(this.Data.wishList.filter(item=>item.id == product.id)[0]){
            message = 'The product ' + product.productName + ' already added to wish list.'; 
            status = 'error';     
            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
        }
        else{
            this.Data.wishList.push(product);
            
            let prod = [];
            prod.push(product);
            let obj = {
                userId: this.getSession().id_mongo,
                userWishlist : prod
            }
            console.log(obj);
            this.doHttpPost("/api/StandardRate/saveToUserWishlist", obj, true).subscribe(data=>{
                data = data.response;
                console.log(data);
                message = 'The product ' + product.productName + ' has been added to FAVOURITE LIST (Add to favourite only if you are regularly wish to buy the same product).'; 
                status = 'success';  
                this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
            });
        }
    } 

    public addToCart(product:StandardRate){
        let message, status;        
       
        this.Data.totalPrice = null;
        this.Data.totalCartCount = null;

//        if(this.Data.cartList.filter(item=>item.id == product.id)[0]){ 
//            let item = this.Data.cartList.filter(item=>item.id == product.id)[0];
//            item.cartCount = product.cartCount;  
//        }
//        else{           
            this.Data.cartList.push(product);
            let prod = [];
            prod.push(product);
            let obj = {
                userId: this.getSession().id_mongo,
                userCartList : prod
            }
            console.log(obj);
            this.doHttpPost("/api/StandardRate/saveToUserCart", obj, true).subscribe(data=>{
                data = data.response;
                console.log(data);
                this.Data.cartList.forEach(product=>{
                    this.Data.totalPrice = this.Data.totalPrice + product.rate;
                });
                this.Data.totalCartCount = this.Data.cartList.length;
                message = 'The product ' + product.productName + ' has been added to cart.'; 
                status = 'success';          
                this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
            });
            console.log(this.Data.cartList);
//        }        

    }

    public resetProductCartCount(product:StandardRate){
        product.cartCount = 0;
        let compareProduct = this.Data.compareList.filter(item=>item.id == product.id)[0];
        if(compareProduct){
            compareProduct.cartCount = 0;
        };
        let wishProduct = this.Data.wishList.filter(item=>item.id == product.id)[0];
        if(wishProduct){
            wishProduct.cartCount = 0;
        }; 
    }

    public getBrands(){
        return [  
            { name: 'aloha', image: 'assets/images/brands/aloha.png' },
            { name: 'dream', image: 'assets/images/brands/dream.png' },  
            { name: 'congrats', image: 'assets/images/brands/congrats.png' },
            { name: 'best', image: 'assets/images/brands/best.png' },
            { name: 'original', image: 'assets/images/brands/original.png' },
            { name: 'retro', image: 'assets/images/brands/retro.png' },
            { name: 'king', image: 'assets/images/brands/king.png' },
            { name: 'love', image: 'assets/images/brands/love.png' },
            { name: 'the', image: 'assets/images/brands/the.png' },
            { name: 'easter', image: 'assets/images/brands/easter.png' },
            { name: 'with', image: 'assets/images/brands/with.png' },
            { name: 'special', image: 'assets/images/brands/special.png' },
            { name: 'bravo', image: 'assets/images/brands/bravo.png' }
        ];
    }

    public getCountries(){
        return [ 
            {name: 'India', code: 'IN'}
        ]
    }

    public getMonths(){
        return [
            { value: '01', name: 'January' },
            { value: '02', name: 'February' },
            { value: '03', name: 'March' },
            { value: '04', name: 'April' },
            { value: '05', name: 'May' },
            { value: '06', name: 'June' },
            { value: '07', name: 'July' },
            { value: '08', name: 'August' },
            { value: '09', name: 'September' },
            { value: '10', name: 'October' },
            { value: '11', name: 'November' },
            { value: '12', name: 'December' }
        ]
    }

    public getYears(){
        return ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030" ]
    }

//    public getDeliveryMethods(){
//        return [
//            { value: 'standard', name: 'Standard Delivery', desc: '0.00 / Delivery in 5 to 7 business Days' },
//            { value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days' }
//        ]
//    }
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}

} 



//import { Injectable, Injector } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Observable } from 'rxjs';
//import { MatSnackBar } from '@angular/material/snack-bar';
//import { Category, Product } from './app.models';
//import { environment } from 'src/environments/environment';  
//import {MasterProvider} from './utility/MasterProvider';
//import {AuthService} from './utility/auth-service';
//
//export class Data {
//    constructor(public categories: Category[],
//                public compareList: Product[],
//                public wishList: Product[],
//                public cartList: Product[],
//                public totalPrice: number,
//                public totalCartCount: number) { }
//}
//
//@Injectable()
//export class AppService extends MasterProvider{
//    public Data = new Data(
//        [], // categories
//        [], // compareList
//        [],  // wishList
//        [],  // cartList
//        null, //totalPrice,
//        0 //totalCartCount
//    )
//    
//    public url = environment.url + '/assets/data/'; 
//
//    constructor(public http:HttpClient, public snackBar: MatSnackBar, public injector: Injector, public authService:AuthService) 
//    {
//        super(injector, http, authService);
//    }
//    
//    public getCategories(): Observable<Category[]>{
//        return this.http.get<Category[]>(this.url + 'categories.json');
//    }
//   
//    public getProducts(type): Observable<Product[]>{        
//        return this.http.get<Product[]>(this.url + type + '-products.json');
//    }
//
//    public getProductById(id): Observable<any>{
////        return this.http.get<Product>(this.url + 'product-' + id + '.json');
//        return this.http.post<any>(this.globalServerPath+"/api/AdProductController/getById", id);
//    }
//    
//    public geStandardtProductById(id): Observable<any>{
//        return this.http.post<any>(this.globalServerPath+"/api/StandardRate/getById", id);
//    }
//
//    public getBanners(): Observable<any[]>{
//        return this.http.get<any[]>(this.url + 'banners.json');
//    }
//
//    public addToCompare(product:Product){
//        let message, status;
//        if(this.Data.compareList.filter(item=>item.id == product.id)[0]){
//            message = 'The product ' + product.name + ' already added to comparison list.'; 
//            status = 'error';     
//        }
//        else{
//            this.Data.compareList.push(product);
//            message = 'The product ' + product.name + ' has been added to comparison list.'; 
//            status = 'success';  
//        }
//        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
//    }
//
//    public addToWishList(product:Product){
//        let message, status;
//        if(this.Data.wishList.filter(item=>item.id == product.id)[0]){
//            message = 'The product ' + product.name + ' already added to wish list.'; 
//            status = 'error';     
//        }
//        else{
//            this.Data.wishList.push(product);
//            message = 'The product ' + product.name + ' has been added to wish list.'; 
//            status = 'success';  
//        }
//        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
//    } 
//
//    public addToCart(product:Product){
//        let message, status;        
//       
//        this.Data.totalPrice = null;
//        this.Data.totalCartCount = null;
//
//        if(this.Data.cartList.filter(item=>item.id == product.id)[0]){ 
//            let item = this.Data.cartList.filter(item=>item.id == product.id)[0];
//            item.cartCount = product.cartCount;  
//        }
//        else{           
//            this.Data.cartList.push(product);
//        }        
//        this.Data.cartList.forEach(product=>{
//            this.Data.totalPrice = this.Data.totalPrice + (product.cartCount * product.newPrice);
//            this.Data.totalCartCount = this.Data.totalCartCount + product.cartCount;
//        });
//
//        message = 'The product ' + product.name + ' has been added to cart.'; 
//        status = 'success';          
//        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'top', duration: 3000 });
//    }
//
//    public resetProductCartCount(product:Product){
//        product.cartCount = 0;
//        let compareProduct = this.Data.compareList.filter(item=>item.id == product.id)[0];
//        if(compareProduct){
//            compareProduct.cartCount = 0;
//        };
//        let wishProduct = this.Data.wishList.filter(item=>item.id == product.id)[0];
//        if(wishProduct){
//            wishProduct.cartCount = 0;
//        }; 
//    }
//
//    public getBrands(){
//        return [  
//            { name: 'aloha', image: 'assets/images/brands/aloha.png' },
//            { name: 'dream', image: 'assets/images/brands/dream.png' },  
//            { name: 'congrats', image: 'assets/images/brands/congrats.png' },
//            { name: 'best', image: 'assets/images/brands/best.png' },
//            { name: 'original', image: 'assets/images/brands/original.png' },
//            { name: 'retro', image: 'assets/images/brands/retro.png' },
//            { name: 'king', image: 'assets/images/brands/king.png' },
//            { name: 'love', image: 'assets/images/brands/love.png' },
//            { name: 'the', image: 'assets/images/brands/the.png' },
//            { name: 'easter', image: 'assets/images/brands/easter.png' },
//            { name: 'with', image: 'assets/images/brands/with.png' },
//            { name: 'special', image: 'assets/images/brands/special.png' },
//            { name: 'bravo', image: 'assets/images/brands/bravo.png' }
//        ];
//    }
//
//    public getCountries(){
//        return [ 
//            {name: 'India', code: 'IN'}
//        ]
//    }
//
//    public getMonths(){
//        return [
//            { value: '01', name: 'January' },
//            { value: '02', name: 'February' },
//            { value: '03', name: 'March' },
//            { value: '04', name: 'April' },
//            { value: '05', name: 'May' },
//            { value: '06', name: 'June' },
//            { value: '07', name: 'July' },
//            { value: '08', name: 'August' },
//            { value: '09', name: 'September' },
//            { value: '10', name: 'October' },
//            { value: '11', name: 'November' },
//            { value: '12', name: 'December' }
//        ]
//    }
//
//    public getYears(){
//        return ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030" ]
//    }
//
//    public getDeliveryMethods(){
//        return [
//            { value: 'free', name: 'Free Delivery', desc: '$0.00 / Delivery in 7 to 14 business Days' },
//            { value: 'standard', name: 'Standard Delivery', desc: '$7.99 / Delivery in 5 to 7 business Days' },
//            { value: 'express', name: 'Express Delivery', desc: '$29.99 / Delivery in 1 business Days' }
//        ]
//    }
//    
//    public save(obj: any){}
//    public update(obj: any){}
//    public findById(objId: any){}
//    public findAll(){}
//    public deleteById(obj: any){}
//    public defunctById(obj: any){}
//
//} 