import {Component, OnInit, Injector, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../utility/auth-service';
import {MasterProvider} from '../../utility/MasterProvider';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {NgxSpinnerService} from "ngx-spinner";
import {DialogData} from '../../pojos/DialogData';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class FilterComponent extends MasterProvider implements OnInit {
    
    lazyCriteria: LazyLoadRequest;
    standProdLst: any[] = [];
    
    unqGsmPaper = [];
    showedUnqSize = [];
    unqSize = [];
    
//    gsmAndPaperColor = "secondary";
//    sizeColor = "warning";
    printSide = [];   
    isSingleSide: boolean = false;    
    isFrontBack: boolean = false;    
    listtt = ["d","g"];
         

    
//    selectedGsm: string="";
//    selectedPaperType: string="";
//    selectedPrintSide: string="";
    
    selectedGsm: any[]= [];
    selectedPaperType: any[]= [];
    selectedPrintSide: any[]= [];
    selectedSize: any[]= [];
    constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
        public injector: Injector, public http: HttpClient, public authService: AuthService, @Inject(MAT_DIALOG_DATA) public pageParam: DialogData,public dialog: MatDialogRef<FilterComponent>) {
        super(injector, http, authService);
    }
    
    async ngOnInit() {
        this.getProductStandardRate();
    }

    getProductStandardRate() {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 500;
        this.lazyCriteria.paramObj = {
            productId: this.pageParam.paramObj.productId
        }
        this.lazyCriteria.include = ["gsm", "gsmId", "paperId", "paperType","size","sizeId","printSide"]
        this.doHttpPost("/api/StandardRate/rateLabelLst", this.lazyCriteria, false).subscribe((productStandardList: any) => {
            productStandardList = productStandardList.response;
            console.log(productStandardList);
            this.standProdLst = productStandardList;
            
            for (let i = 0; i < this.standProdLst.length; i++) {
                if(this.standProdLst[i].printSide == "Single Side"){
                    this.isSingleSide = true;
                }
                if(this.standProdLst[i].printSide == "Front Back"){
                    this.isFrontBack = true;
                }
            }
            if(this.isSingleSide){
                this.printSide = [
                    {name:"Single Side",isPrintSideSelected:false}
                ]
            }
            if(this.isFrontBack){
                this.printSide = [
                    {name:"Single Side",isPrintSideSelected:false},
                    {name:"Front Back",isPrintSideSelected:false}
                ]
            }
            this.unqGsmPaper = this.standProdLst.filter(
                (thing, i, arr) => arr.findIndex(t => t.gsmId === thing.gsmId && t.paperId === thing.paperId) === i
            );
            let unqSize = this.standProdLst.filter(
                (thing, j, arr) => arr.findIndex(t => t.sizeId === thing.sizeId) === j
            );
            console.log(unqSize);
//            console.log(this.unqGsmPaper);
            for (let i = 0; i < this.unqGsmPaper.length; i++) {
                this.unqGsmPaper[i].isGsmPapSelected = false;
            }
            for (let i = 0; i < this.unqSize.length; i++) {
                this.unqSize[i].isSizeSelected = false;
            }
            console.log(this.unqGsmPaper);
            
        }, error => {
            console.log(error);
        })
    }

    cancel() {
        this.dialog.close('cancel');
    }
    
    getSelectedGsm(product){
        console.log(product);
        if(product.isGsmPapSelected){
            product.isGsmPapSelected = false;
            let gsmIndex = this.selectedGsm.indexOf(product.gsmId);
            this.selectedGsm.splice(gsmIndex, 1);
            let paperIndex = this.selectedPaperType.indexOf(product.paperId);
            this.selectedPaperType.splice(paperIndex, 1);
            
            //Removing sizes of selected GSM in array
            let sizes = this.standProdLst.filter(prod => prod.gsmId === product.gsmId && prod.paperId === product.paperId);
            console.log(sizes);
            let obj = sizes.filter(
                (thing, j, arr) => arr.findIndex(t => t.sizeId === thing.sizeId) === j
            );
            for (let i = 0; i < obj.length; i++) {
                let sizeIndex = this.unqSize.indexOf(product.sizeId);
                this.unqSize.splice(sizeIndex, 1);
            }
            
            
            
            this.unqSize = [];
            for(let i = 0; i < this.selectedGsm.length; i++){
                let sizes = this.standProdLst.filter(prod => prod.gsmId === this.selectedGsm[i] && prod.paperId === this.selectedPaperType[i]);
                sizes = sizes.filter(
                    (thing, j, arr) => arr.findIndex(t => t.sizeId === thing.sizeId) === j
                );
                for (let j = 0; j < sizes.length; j++) {
                    this.unqSize.push(sizes[j]);
                }
            }
            this.unqSize = this.unqSize.filter(
                (thing, j, arr) => arr.findIndex(t => t.sizeId === thing.sizeId) === j
            );
        }
        else{
            product.isGsmPapSelected = true;
            this.selectedGsm.push(product.gsmId);
            this.selectedPaperType.push(product.paperId);
            
            //Adding sizes of selected GSM in array
            let sizes = this.standProdLst.filter(prod => prod.gsmId === product.gsmId && prod.paperId === product.paperId);
            sizes = sizes.filter(
                (thing, j, arr) => arr.findIndex(t => t.sizeId === thing.sizeId) === j
            );
            console.log(sizes);
            for (let i = 0; i < sizes.length; i++) {
                this.unqSize.push(sizes[i]);
            }
            
            this.unqSize = this.unqSize.filter(
                (thing, j, arr) => arr.findIndex(t => t.sizeId === thing.sizeId) === j
            );
        }
    }
    
    getSelectedSize(size){
        if(size.isSizeSelected){
            size.isSizeSelected = false;
            let index = this.selectedSize.indexOf(size.sizeId);
            this.selectedSize.splice(index, 1);
        }
        else{
            size.isSizeSelected = true;
            this.selectedSize.push(size.sizeId)
        }
    }
    
    getPrintSide(side){
        if(side.isPrintSideSelected){
            side.isPrintSideSelected = false;
            let index = this.selectedPrintSide.indexOf(side.name);
            this.selectedPrintSide.splice(index, 1);
        }
        else{
            side.isPrintSideSelected = true;
            this.selectedPrintSide.push(side.name)
        }
    }
    
    filter(){
        let obj:any = {}
        if (this.selectedPaperType.length != 0){
            obj.paperId = this.selectedPaperType
        }
        if (this.selectedGsm.length != 0){
            obj.gsmId = this.selectedGsm
        }if (this.selectedSize.length != 0){
            obj.sizeId = this.selectedSize
        }
        if (this.selectedPrintSide.length != 0){
            obj.printSide = this.selectedPrintSide
        }
        
        let message = "Loading...";
        let duration = 2000;
        let spinnerType = "bubbles";
//        this.util.showLoadingWithMessage(message, duration, spinnerType);
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 500;
        this.lazyCriteria.paramObj = {
            productId: this.pageParam.paramObj.productId,
        }
        this.lazyCriteria.multipleInFilter = obj;
        this.lazyCriteria.include = ["id","gsm","gsmId","laminationId","laminationSide","laminationType","namune","paperId","paperType","printSide","printingColor","printingColorId","productId","productName","quantity","rate","size","sizeId","urgentDeliveryDays","urgentRate","deliveryDays","postpress"]
        console.log(this.lazyCriteria);
        this.doHttpPost("/api/StandardRate/rateLabelLstWithMultipleInFilter", this.lazyCriteria, false).subscribe((productStandardList: any) => {
            productStandardList = productStandardList.response;
            console.log(productStandardList);
            obj.result = productStandardList;
//            this.popOverController.dismiss("search",JSON.stringify(obj));
            this.dialog.close(JSON.stringify(obj));
        }, error => {
            console.log(error);
        })
    }
       
    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}

    
}
