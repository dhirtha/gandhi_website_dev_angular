import {Component, OnInit, Injector, Inject} from '@angular/core';
import {AppService} from '../../app.service';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SiUtil} from '../../utility/SiUtil';
import {Router} from '@angular/router';
import {DatePipe} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent extends MasterProvider implements OnInit {
    
    paperAmount = 0; 
    fullAmount = 0;
    lazyCriteria: LazyLoadRequest;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ConfirmationComponent>,public appService: AppService, public injector: Injector, public  http: HttpClient, public  authService: AuthService, public snackBar: MatSnackBar, public util: SiUtil,public router: Router,private datePipe: DatePipe) {
        super(injector, http, authService);
    }

    ngOnInit() {
        console.log(this.data);
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            "quotationNo": this.appService.Data.cartList[0].ids
        }
        this.doHttpPost("/api/quotationEnquiry/list2", this.lazyCriteria, false).subscribe((quotObj: any) =>
        {
            quotObj = quotObj.response;
            console.log("Quotation Obj ===============");
            console.log(quotObj);
            this.paperAmount = quotObj[0].quotPaperAmt;
            this.fullAmount = quotObj[0].totalQuotationRateWithGst;
            if (this.paperAmount > 1000)
            {
                this.paperAmount = this.roundOfWith(this.paperAmount, 50);
            }
            else
            {
                this.paperAmount = this.roundOfWith(this.paperAmount, 10);
            }
            quotObj[0].quotPaperAmt = this.paperAmount;
            this.doHttpPost("/api/quotationEnquiry/updateQuotation", quotObj[0], false).subscribe((quotObj: any[]) =>
            {
                
            })
            console.log(this.paperAmount);
            console.log(this.fullAmount);
        })
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
    
    paymentType(payType){
        if(payType == "Full"){
            this.dialogRef.close("Full");
        }
        if(payType == "Partial"){
            this.dialogRef.close("Partial");
        }
    }
    
    close(){
        this.dialogRef.close("Close");
    }
    
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
    
    

}
