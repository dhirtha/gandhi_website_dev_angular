import {Component,Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppService} from '../../app.service';
import {tap} from 'rxjs/internal/operators/tap';
import {finalize} from 'rxjs/internal/operators/finalize';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {Router} from '@angular/router';
import {LocalService} from '../../utility/LocalService';



@Component({
  selector: 'onlinPayment-credit-dialog',
  templateUrl: 'paymentMethod.html',
  styleUrls: ['./paymentMethod.component.scss']
})
export class CreditOrOnlineDialog {
    walletAmount: number = 0;
    lazyCriteria: LazyLoadRequest;
    finYear: any;
    OrderData: any;
    availableCreditLimit = 0;
    creditLimit = 0;
    orderAmount = 0;
    isPayOnline: boolean = false;
    total = [];
    isPayFromWallet: boolean = false;
    paybleAmount = 0;
    adjustedAmount = 0;
    fromDate:any;
    
    
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,public snackBar: MatSnackBar,
                public dialogRef: MatDialogRef<CreditOrOnlineDialog>, public appService: AppService, public router: Router, private localStorage: LocalService) {}
    ngOnInit(){
        if(this.localStorage.getJsonValue('isLoggedin') == null){
            this.router.navigate(['/home']);
        }
        console.log(this.data);
        console.log(this.appService.Data);
        console.log(this.appService.Data.cartList);
        let index = 0;
        this.appService.Data.cartList.forEach(product => {
            let qtyRatio = product.quantity / product.baseQuantity;
            this.total[product.id + index] = product.namune * product.rate * qtyRatio;
            index = index + 1;
        })
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            console.log(this.appService.Data.cartList[i].orderDetailsArr.indexOf('Quantity : 1000'));
            let qtyRatio = this.appService.Data.cartList[i].quantity / this.appService.Data.cartList[i].baseQuantity;
            this.total[this.appService.Data.cartList[i].id + index] = this.appService.Data.cartList[i].namune * this.appService.Data.cartList[i].rate * qtyRatio;
            index = index + 1;
        }
        
        this.creditLimit = this.data.user.custCreditLimit;
        this.orderAmount = this.data.orderAmount;
        console.log(this.data.user.custCreditLimit);
        console.log(this.data.user.custCreditLimitUsed);
        this.availableCreditLimit = (this.data.user.custCreditLimit + this.data.user.custCreditLimitUsed);
        console.log(this.availableCreditLimit);
        
//        if(this.data.user.custWalletAmt >= this.orderAmount){
//            this.isPayFromWallet = true;
//        }
        
        this.getWallet();
    }
    
    getWallet(){
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
        this.appService.doHttpPost("/api/common/getCurrentDate", "onlyDate", true).
            pipe(tap(()=>{
            }),finalize(()=>{
                this.lazyCriteria = new LazyLoadRequest();
                this.lazyCriteria.paramObj = {
                    active: true
                }
                this.appService.doHttpPost("/api/finyear/list", this.lazyCriteria, true).
                    pipe(tap(()=>{
                    }),finalize(()=>{
                        console.log("qqqqqqqqqqqqqqqqq");
                        this.getWalletAmount();
                    })).subscribe(data=>{
                        data = data.response;
                        console.log(data);
//                        this.finYear = data[0].finYear;
                        this.finYear = "2021-2022"; //Don't Change this line if you change then you can't get balance of previous years
                })
            })).subscribe(data=>{
                data = data.response;
                console.log(data);
                this.fromDate = data[0];
        })
    }
    
    getWalletAmount(){
        let obj={
            fromDate: this.fromDate,
            finYear: this.finYear,
            sourceId: this.data.user.id,
            orgId: this.appService.getSession().ORG_ID,
            oprId: this.appService.getSession().OPR_ID,
            limit: 0
        }
        console.log(obj);
        this.appService.doHttpPost("/api/voucher/getclb", obj, true).subscribe((data:any)=>{
            data = data.response;
            console.log("Wallet Amount ==================");
            console.log(data);
            if(data.type == "DR"){
                this.walletAmount = 0;
            }
            if(data.type == "CR"){
                this.walletAmount = parseFloat(data.bal);
                this.walletAmount = parseFloat(this.walletAmount.toFixed(2));
            }
            if (this.walletAmount > 0){
                this.isPayFromWallet = true;
            }
        })
    }
    
    isWalletSelected(value){
        this.isPayFromWallet = !this.isPayFromWallet;
    }
    
    creditPayment(){
        if(this.creditLimit == 0){
            this.snackBar.open('You Do Not have Credit.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 4000 });
        }
        if(this.availableCreditLimit <= this.orderAmount){
            this.snackBar.open('Insufficent Credit Limit', '×', { panelClass: 'error', verticalPosition: 'top', duration: 4000 });
            this.isPayOnline = true;
        }
        else{
            let obj = {
                payMode: "Credit Payment"
            }
            this.dialogRef.close(obj);
        }
    }
    
    onlinePayment(){
        let obj = {
            payMode: "Online Payment"
        }
        this.dialogRef.close(obj);
    }
    
    walletPayment(){
        if(this.data.dispatchInfo.amounts.paperAmount != null && this.data.dispatchInfo.amounts.paperAmount != 0){
            this.orderAmount = this.data.dispatchInfo.amounts.paperAmount;
        }
        if (this.orderAmount <= this.walletAmount){
            this.paybleAmount = 0;
            this.adjustedAmount = this.orderAmount;
        }else{
            this.paybleAmount = this.orderAmount - this.walletAmount;
            this.adjustedAmount = this.walletAmount;
            if (this.paybleAmount <= this.availableCreditLimit){
                let obj = {
                    payMode: "Wallet Plus Credit Payment",
                    paybleAmount: parseFloat(this.paybleAmount.toFixed(2)),
                    adjustedAmount: parseFloat(this.adjustedAmount.toFixed(2)),
                    walletAmount: parseFloat(this.walletAmount.toFixed(2))
                }
                this.dialogRef.close(obj);
                return;
            }
        }
        let obj = {
            payMode: "Wallet Payment",
            paybleAmount: parseFloat(this.paybleAmount.toFixed(2)),
            adjustedAmount: parseFloat(this.adjustedAmount.toFixed(2)),
            walletAmount: parseFloat(this.walletAmount.toFixed(2))
        }
        this.dialogRef.close(obj);
    }
    
    close(){
        let obj = {
            payMode: "Close"
        }
        this.dialogRef.close("Close");
    }
}