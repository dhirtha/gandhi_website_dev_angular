import {Component, OnInit, Injector, OnDestroy} from '@angular/core';
import {AppService} from '../../app.service';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SiUtil} from '../../utility/SiUtil';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {ConfirmationComponent} from '../fullPartialConfirmation/confirmation.component';
import {MatDialog} from '@angular/material/dialog';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent extends MasterProvider implements OnInit, OnDestroy {
    availableCreditLimit: any;
    creditLimit: any;
    total = [];
    grandTotal = 0;
    cartItemCount = [];
    cartItemCountTotal = 0;
    
    listOfNonExpQuot:any
    displayedColumns: any[] = ['Name', 'Price', 'orderDetails', 'quantity', 'Namune', 'Total', 'clear'];
    
    isShowPreviousQuotation = false;
    isLoading: boolean = true;
    
    iscartEmpty:boolean = false;
    originalCartObj = [];
    
    isCustomised:boolean = false;
    isBreakWhile:boolean = false;
    
    
    constructor(public appService: AppService, public injector: Injector, public  http: HttpClient, public  authService: AuthService, public snackBar: MatSnackBar, public util: SiUtil,public router: Router,private datePipe: DatePipe, public dialog: MatDialog, private localStorage: LocalService) {
        super(injector, http, authService);
    }

    ngOnInit() {
        if(this.localStorage.getJsonValue('isLoggedin') == null){
            this.router.navigate(['/home']);
        }
        setTimeout( async () => {
            let index = 0;
            this.appService.Data.cartList.forEach(product => {
                let qtyRatio = product.quantity / product.baseQuantity;
                this.total[product.id + index] = product.namune * product.rate * qtyRatio;
                this.grandTotal += product.namune * product.rate * qtyRatio;
                this.cartItemCount[product.id] = product.cartCount;
                this.cartItemCountTotal += product.cartCount;
                index = index + 1;
            })
            console.log(this.appService.Data.cartList);
            this.isLoading = false;
            this.localStorage.setJsonValue('originalCartObj', this.appService.Data.cartList);
            this.originalCartObj = this.localStorage.getJsonValue('originalCartObj');

            console.log(this.originalCartObj);

            if(this.appService.Data.cartList.length == 0){
                this.iscartEmpty = true;
            }
            if (typeof this.appService.Data.cartList[0] != "undefined"){
                if (this.appService.Data.cartList[0].ids != null){
                    this.isCustomised = true;
                }
            }
            
            
            while (this.originalCartObj.length == 0 && !this.isBreakWhile){
                this.localStorage.setJsonValue('originalCartObj', this.appService.Data.cartList);
                this.originalCartObj = this.localStorage.getJsonValue('originalCartObj');
                await this.timer(1000); 
            }    
            
        }, 2500);
    }
    
    ngOnDestroy(){
        this.isBreakWhile = true;
    }
    
    asIsOrder(a, b) {
        return 1;
    }

    public remove(product) {
        this.util.toastConfirmation_Save("Are you sure you want to remove this item from cart ?","").then(data=>{
            if(data){
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
                        window.location.reload();
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
        })
    }
    
    decrementQty(product, index){
        if (this.originalCartObj.filter(item=>item.id == product.id)[0]){ 
            let item = this.originalCartObj.filter(item=>item.id == product.id)[0];
            if(product.quantity == item.quantity){
                product.rate = item.rate;
                this.total[product.id+index] = product.rate * product.namune; 
                this.grandTotal = 0;
                this.appService.Data.cartList.forEach(product => {
                    let qtyRatio = product.quantity / product.baseQuantity;
                    this.grandTotal += product.rate * product.namune * qtyRatio;
                    this.grandTotal = this.grandTotal;
                    this.appService.Data.totalPrice = this.grandTotal;
                });
            }
            else{
                product.quantity = product.quantity - item.quantity;
//                product.rate = product.rate - item.rate;
                let qtyRatio = product.quantity / item.quantity;
                this.total[product.id+index] = product.rate * qtyRatio * product.namune;
                this.grandTotal = 0;
                this.appService.Data.cartList.forEach(product => {
                    let qtyRatio = product.quantity / product.baseQuantity;
                    this.grandTotal += product.rate * product.namune * qtyRatio;
                    this.grandTotal = this.grandTotal;
                    this.appService.Data.totalPrice = this.grandTotal;
                });
            }
        }
    }
    
    incrementQty(product, index){
        if (this.originalCartObj.filter(item=>item.id == product.id)[0]){ 
            let item = this.originalCartObj.filter(item=>item.id == product.id)[0];
            product.quantity = product.quantity + item.quantity;
            
            let qtyRatio = product.quantity / item.quantity;
            this.total[product.id+index] = product.rate * qtyRatio * product.namune;
            this.grandTotal = 0;
            this.appService.Data.cartList.forEach(product => {
                let qtyRatio = product.quantity / product.baseQuantity;
                this.grandTotal += product.rate * product.namune * qtyRatio;
                this.grandTotal = this.grandTotal;
                this.appService.Data.totalPrice = this.grandTotal;
            });
        }
    }
    
    decrement(product, index){
        if (this.originalCartObj.filter(item=>item.id == product.id)[0]){ 
            let item = this.originalCartObj.filter(item=>item.id == product.id)[0];
            if(product.namune == 1){
                product.namune = 1;
                let qtyRatio = product.quantity / item.quantity;
                this.total[product.id+index] = product.rate * qtyRatio * product.namune;
                this.grandTotal = 0;
                this.appService.Data.cartList.forEach(product => {
                    let qtyRatio = product.quantity / product.baseQuantity;
                    this.grandTotal += product.rate * product.namune * qtyRatio;
                    this.grandTotal = this.grandTotal;
                    this.appService.Data.totalPrice = this.grandTotal;
                });
            }
            else{
                product.namune = product.namune - 1;
                let qtyRatio = product.quantity / item.quantity;
                this.total[product.id+index] = product.rate * qtyRatio * product.namune;
                this.grandTotal = 0;
                this.appService.Data.cartList.forEach(product => {
                    let qtyRatio = product.quantity / product.baseQuantity;
                    this.grandTotal += product.rate * product.namune * qtyRatio;
                    this.grandTotal = this.grandTotal;
                    this.appService.Data.totalPrice = this.grandTotal;
                });
            }
        }
    }
    
    increment(product, index){
        if (this.originalCartObj.filter(item=>item.id == product.id)[0]){ 
            let item = this.originalCartObj.filter(item=>item.id == product.id)[0];
            product.namune = product.namune + 1;
            let qtyRatio = product.quantity / item.quantity;
            this.total[product.id+index] = product.rate * qtyRatio * product.namune;
            this.grandTotal = 0;
            this.appService.Data.cartList.forEach(product => {
                let qtyRatio = product.quantity / product.baseQuantity;
                this.grandTotal += product.rate * product.namune * qtyRatio;
                this.grandTotal = this.grandTotal;
                this.appService.Data.totalPrice = this.grandTotal;
            });
        }
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
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.listOfNonExpQuot.filter = filterValue.trim().toLowerCase();
    } 
    
    public clear() {
        this.util.toastConfirmation_Save("Are you sure you want to clear cart ?","").then(data=>{
            if(data){
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
                    window.location.reload();
                    this.appService.Data.cartList.length = 0;
                    this.appService.Data.totalPrice = 0;
                    this.appService.Data.totalCartCount = 0;
                });
            }
        })
    }
    
    goToCheckout(){
        let data = this.appService.Data.cartList;
        let index = 0;
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
                    if (data[i].namune > 1){
                        arr.push("Quantity : " + data[i].quantity + " X " + data[i].namune)
                    }else{
                        arr.push("Quantity : "+data[i].quantity)
                    }
                    if (data[i].postpress != null){
                        arr.push("Post Press : "+data[i].postpress)
                    }
                }
                else{
                    arr = data[i].printSide.split("\n");
                }
                this.appService.Data.cartList[i].orderDetailsArr = arr;
                index = index + 1; 
            }
        }
        console.log(this.total);
        this.localStorage.setJsonValue('updatedCartObj', this.appService.Data);
        
        this.originalCartObj = this.localStorage.getJsonValue('originalCartObj');
        
        if(data[0].ids != null){
            this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
                data = data.response;
                this.logedInUser = data;
                this.creditLimit = this.logedInUser.custCreditLimit;
                this.availableCreditLimit = (this.logedInUser.custCreditLimit + this.logedInUser.custCreditLimitUsed);
                if(this.creditLimit == 0 || this.availableCreditLimit <= this.grandTotal){
                    const dialogRef =  this.dialog.open(ConfirmationComponent, {
                        data: {
                            orderObj: data[0],
                        },
                        height: '300px',
                        width: '600px',
                        disableClose: true
                    });

                    dialogRef.afterClosed().subscribe(result => {
                        console.log(result);
                        let obj = {
                            paymentType: result
                        }
                        if (result == "Full"){
                            this.router.navigate(['/checkout'], {queryParams:obj});
                        }
                        if (result == "Partial"){
                            this.router.navigate(['/checkout'], {queryParams:obj});
                        }
                    })
                }
                else{
                    this.router.navigate(['/checkout']);
                }
            })
        }else{
            this.router.navigate(['/checkout']);
        }
    }

}


    