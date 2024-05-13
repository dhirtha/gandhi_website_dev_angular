import {Component, OnInit, ViewChild, Injector, ElementRef} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import {AppService} from '../../../app.service';
import {Product} from "../../../app.models";
import {ProductZoomComponent} from './product-zoom/product-zoom.component';
import {MasterProvider} from '../../../utility/MasterProvider';
import {AuthService} from '../../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {LazyLoadRequest} from '../../../request/LazyLoadRequest';
import {StandardRate} from '../../../pojos/quotation/StandardRate';
import {AddProductMst} from '../../../pojos/quotation/AddProductMst';
import {MatTableDataSource} from '@angular/material/table';
import {ProductListDataSource} from './product-listDataSource';
import {FilterBy} from '../../../utility/FilterBy';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FilterComponent} from '../../filter/filter.component';
import {MatMenuTrigger} from '@angular/material/menu';
import {LocalService} from '../../../utility/LocalService';
import {RequestEncryption} from '../../../utility/RequestEncryption';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent extends MasterProvider implements OnInit {
    
    standardList = [];
    fullStandardList = [];
    lazyCriteria: LazyLoadRequest;
    dataSource: any;
    displayedColumns: any[] = ['paperType','gsm','size','printSide','printingColor','quantity','delDays','rate','process']
    displayedColumns1: any[] = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','quantity','delDays','rate','process']
    displayedColumns2: any[] = ['paperType','gsm','size','printSide','printingColor','quantity','rate','delDays','process']
    displayedColumns3: any[] = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','postpress','quantity','rate','delDays','process']
    postPressFieldName = "Post Press";
    @ViewChild('zoomViewer', {static: true}) zoomViewer;
    @ViewChild(SwiperDirective, {static: true}) directiveRef: SwiperDirective;
    public config: SwiperConfigInterface = {};
    public product: AddProductMst;
    public image: any;
    public zoomImage: any;
    private sub: any;
    public form: FormGroup;
    public relatedProducts: Array<Product>;
    
    spinner: boolean = false;
    isLoggedIn: boolean = false;
    showLamination: boolean = false;
    showDoctFile: boolean = false;
    
    
    isMobileView: boolean = false;
    productId: any;
    isFilter:boolean = false;
    filterCriteria:any;
    
    @ViewChild('accountMenu') matMenuTrigger: MatMenuTrigger;
    
    constructor(public _dialog: MatDialog,public appService: AppService, private activatedRoute: ActivatedRoute, public dialog: MatDialog, public formBuilder: FormBuilder, public router: Router, public injector: Injector, public http: HttpClient,public authService:AuthService,public snackBar: MatSnackBar, private localStorage: LocalService) 
    {
        super(injector, http, authService);
         
    }

    async ngOnInit() {
        if(window.innerWidth < 1000){
            this.isMobileView = true;
        }
        if (this.localStorage.getJsonValue('isLoggedin') == null){
            this.isLoggedIn = false;
        }else{
            this.isLoggedIn = true;
            this.getGlobalUser();
        }
        setTimeout(async () => {
            this.sub = this.activatedRoute.params.subscribe(params => {
                this.getProductById(params['id']);
                this.getStandardProductLst(params['id']);
                this.productId = params['id'];
            });
        }, 1000)
    }

    ngAfterViewInit1() {
        this.config = {
            observer: false,
            slidesPerView: 4,
            spaceBetween: 10,
            keyboard: true,
            navigation: true,
            pagination: false,
            loop: false,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                480: {
                    slidesPerView: 2
                },
                600: {
                    slidesPerView: 3,
                }
            }
        }
    }

    public getProductById(id) {
        this.doHttpPost("/api/AdProductController/getById", id, false).subscribe((data:any)=>{
            data = data.response;
            console.log(data);
            this.product = data;
            this.image = data.prodImages[0].medium;
            this.zoomImage = data.prodImages[0].large;
            setTimeout(() => {
                this.config.observer = true;
            });
        })
    }
    
    
    public getStandardProductLst(id){
        this.showLamination = false;
        this.showDoctFile = false;
        this.standardList = [];
        this.spinner = true;
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 500;
        this.lazyCriteria.paramObj = {
            productId : id,
        }
        
        if (typeof this.logedInUser != "undefined"){
            this.lazyCriteria.extraParams=[this.logedInUser.custRateLabel, this.logedInUser.id];
        }
        else{
            this.lazyCriteria.extraParams=[null];
        }
        
        this.lazyCriteria.include = ["id","gsm","gsmId","laminationId","laminationSide","laminationType","namune","paperId","paperType","printSide","printingColor","printingColorId","productId","productName","quantity","rate","size","sizeId","urgentDeliveryDays","urgentRate","deliveryDays","postpress","standardRateLable","postPressRate"]
        console.log(this.lazyCriteria);
        this.doHttpPost("/api/StandardRate/rateLabelLst2", this.lazyCriteria, false).subscribe((data:any)=>{
            data = data.response;
            this.spinner = false;
            this.standardList = data;
            this.fullStandardList = data;
            console.log(this.standardList);
            this.dataSource = new MatTableDataSource(<any> data);
            
            for (let i = 0; i < this.dataSource.filteredData.length; i++) {
                if(this.dataSource.filteredData[i].productName == "Doctor File"){
                    this.postPressFieldName = "Punching Type & Clip";
                }
                if(this.dataSource.filteredData[i].productName == "Book Cover"){
                    this.postPressFieldName = "Creasing";
                }
                if(this.dataSource.filteredData[i].productName == "Brochure"){
                    this.postPressFieldName = "Folding & Creasing";
                }
                if(this.dataSource.filteredData[i].productName == "Calendar - Patti Tinning" || this.dataSource.filteredData[i].productName == "Poster Calendar"){
                    this.postPressFieldName = "Sheeter & Patti Colour";
                }
                if(this.dataSource.filteredData[i].productName == "Calendar - Wiro Hanging" || this.dataSource.filteredData[i].productName == "Calendar - Table Wiro"){
                    this.postPressFieldName = "Sheeter & Wiro Colour";
                }
                if(this.dataSource.filteredData[i].productName == "Doctor File" || this.dataSource.filteredData[i].productName == "Calendar - Table Wiro" || this.dataSource.filteredData[i].productName == "Book Cover" || this.dataSource.filteredData[i].productName == "Brochure"){
                    this.showDoctFile = true;
                    this.displayedColumns = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','postpress','quantity','delDays','rate','process']
                    break;
                }
                if(this.dataSource.filteredData[i].laminationSide != "N/A" && this.dataSource.filteredData[i].laminationType != "N/A"){
                    this.displayedColumns = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','quantity','rate','delDays','process'];
                    this.showLamination = true;
                    break;
                }
                if(this.dataSource.filteredData[i].productName == "Calendar - Patti Tinning" || this.dataSource.filteredData[i].productName == "Poster Calendar" || this.dataSource.filteredData[i].productName == "Calendar - Wiro Hanging"){
                    this.showDoctFile = true;
                    this.displayedColumns = ['paperType','gsm','size','printSide','printingColor','postpress','quantity','delDays','rate','process']
                    break;
                }
                if(this.dataSource.filteredData[i].productName == "Bookwork"){
                    this.showDoctFile = true;
                    this.displayedColumns = ['detail','quantity','delDays','rate','process']
                    break;
                }
            }
//            this.matMenuTrigger.openMenu();
        })
    }
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    } 
    
    productDataSource: any;
    public productDataSource1:ProductListDataSource
//    displayedColumns: any[] = ['quotationNo', 'stringCrDt', 'orderDetails', 'quantity', 'amount', 'process'];
    count:any;
    filterByArray: any[] = [];
    filterHint: string;
    @ViewChild('quotInput') quotInput: ElementRef;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<any>(true, []);
    customisedQuotation = [];
    async getCustomizedQuotation(productId){
        if (this.localStorage.getJsonValue('isLoggedin') != null){
            this.productDataSource1 = new ProductListDataSource(this.injector, this.http, this.authService);

            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.pageSize = 10;
            this.lazyCriteria.paramObj = {
                "quotCustId": this.getSession().id_mongo,
                "quotEnquiry.enqProductId": productId
            }
            this.lazyCriteria.sortFiled = "crDt";
            this.lazyCriteria.sortValue = "desc";
//            this.lazyCriteria.fromDt = new Date("01-05-2021");
//            this.lazyCriteria.toDt = new Date("01-05-2021");
            this.productDataSource1.loadLazyLst(this.lazyCriteria);
            console.log(this.productDataSource1);
            
            this.customisedQuotation = this.productDataSource1.oprsSubject.value;
            
            this.count = await  this.productDataSource1.loadCount(this.lazyCriteria);
            
//            if(this.customisedQuotation.length > 0 ){
                this.loadFilterValues();   /// load Filter Values 
//            }
        }
        else{
            this.snackBar.open('Please, Sign In Yourself to see Rate', '×', { panelClass: 'error', verticalPosition: 'top', duration: 8000 });
        }

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
        this.quotInput.nativeElement.value = "";   ///// defualt filter By  
    }
    
    
    ngAfterViewInit() {
        this.config = {
            observer: false,
            slidesPerView: 4,
            spaceBetween: 10,
            keyboard: true,
            navigation: true,
            pagination: false,
            loop: false,
            preloadImages: false,
            lazy: true,
            breakpoints: {
                480: {
                    slidesPerView: 2
                },
                600: {
                    slidesPerView: 3,
                }
            }
        }
//        if (localStorage.getItem('isLoggedin') != null){
//            this.paginator.page
//                .pipe(
//                    tap(() => this.loadOprOnPage())
//                )
//                .subscribe();
//
//            this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
//
//            merge(this.sort.sortChange, this.paginator.page)
//                .pipe(
//                    tap(() => this.loadOprOnPage())
//                )
//                .subscribe();
//
//
//            fromEvent(this.quotInput.nativeElement, 'keyup')
//                .pipe(
//                    debounceTime(150),
//                    distinctUntilChanged(),
//                    tap(async () => {
//                        this.paginator.pageIndex = 0;
//                        this.loadOprOnPage();
//                        this.count = await this.productDataSource1.loadCount(this.lazyCriteria);
//                        this.selection.clear();
//                    })
//                )
//                .subscribe();
//        }
    }
    
    async loadOprOnPage() {
        this.lazyCriteria.pageNumber = this.paginator.pageIndex;
        this.lazyCriteria.pageSize = this.paginator.pageSize;
        this.lazyCriteria.sortValue = this.sort.direction;
        this.lazyCriteria.filterValue = this.quotInput.nativeElement.value.trim();
        this.lazyCriteria.sortFiled = "crDt";
        this.lazyCriteria.sortValue = "desc";
        this.productDataSource1.loadLazyLst(this.lazyCriteria);
        
    }
    
    onFilterClick(filter: FilterBy) {
        this.lazyCriteria.filterField = filter.value;    //// set server site Filter Field
        this.filterHint = filter.key;    //// set fileter hint on web page
        this.quotInput.nativeElement.focus();
    }
    

    public getRelatedProducts() {
        this.appService.getProducts('related').subscribe(data => {
            this.relatedProducts = data;
        })
    }

    public selectImage(image) {
            this.image = image.medium;
            this.zoomImage = image.large;
//        console.log(image);
//        this.image = image;
//        this.zoomImage = image;
    }

    public onMouseMove(e) {
        if (window.innerWidth >= 1280) {
            var image, offsetX, offsetY, x, y, zoomer;
            image = e.currentTarget;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
            x = offsetX / image.offsetWidth * 100;
            y = offsetY / image.offsetHeight * 100;
            zoomer = this.zoomViewer.nativeElement.children[0];
            if (zoomer) {
                zoomer.style.backgroundPosition = x + '% ' + y + '%';
                zoomer.style.display = "block";
                zoomer.style.height = image.height + 'px';
                zoomer.style.width = image.width + 'px';
            }
        }
    }

    public onMouseLeave(event) {
        this.zoomViewer.nativeElement.children[0].style.display = "none";
    }

    public openZoomViewer() {
        this.dialog.open(ProductZoomComponent, {
            data: this.zoomImage,
            panelClass: 'zoom-dialog'
        });
    }

    ngOnDestroy() {
//        this.sub.unsubscribe();
    }

    public onSubmit(values: Object): void {
        if (this.form.valid) {
            //email sent
        }
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
        if(valid){
            let stndRate = new StandardRate();
            stndRate.id = obj.id;
            stndRate.ids = obj.quotationNo;
            stndRate.productName = obj.quotEnquiry.enqProductName;
            stndRate.productId = obj.quotEnquiry.enqProductId;
            if(obj.quotPreferdTravel.travelPayMode == "ToPay"){
                stndRate.rate = obj.totalQuotationRateWithGst;
            }
            else{
                stndRate.rate = obj.totalQuotationRateWithGst - obj.quotPreferdTravel.quotTravelAmount;
            }
            stndRate.quantity = obj.quotFinalQty;
            stndRate.namune = 1;
            stndRate.deliveryDays = "0";
            stndRate.urgentDeliveryDays = "0";
            stndRate.urgentRate = 1;
            if(obj.quotPreferdTravel.travelPayMode == "ToPay"){
                stndRate.travelRate = 0;
            }
            else{
                stndRate.travelRate = obj.quotPreferdTravel.quotTravelAmount;
            }
            stndRate.orderDetailsArr = obj.orderDetailsArr;
            console.log(stndRate);
            this.appService.addToCart(stndRate);


//            this.total = [];
//            this.grandTotal = 0;
//            this.cartItemCount = [];
//            this.cartItemCountTotal = 0;
            this.appService.Data.totalPrice = 0;
            this.appService.Data.cartList.forEach(product => {
//                this.total[product.id] = product.namune * product.rate;
//                this.grandTotal += product.namune * product.rate;
//                this.appService.Data.totalPrice = this.appService.Data.totalPrice + product.rate;
//                this.cartItemCount[product.id] = product.cartCount;
//                this.cartItemCountTotal += product.cartCount;
            })
        } else{
            this.snackBar.open('Already added in Cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        }
    }
    
    buyQuot(obj){
        console.log(obj);
        let valid = true;
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            if (this.appService.Data.cartList[i].ids != null){
                if (this.appService.Data.cartList[i].ids == obj.quotationNo){
                    valid = false;
                }
            }
        }
        if(valid){
            let stndRate = new StandardRate();
            stndRate.id = obj.id;
            stndRate.ids = obj.quotationNo;
            stndRate.productName = obj.quotEnquiry.enqProductName;
            stndRate.productId = obj.quotEnquiry.enqProductId;
            if(obj.quotPreferdTravel.travelPayMode == "ToPay"){
                stndRate.rate = obj.totalQuotationRateWithGst;
            }
            else{
                stndRate.rate = obj.totalQuotationRateWithGst - obj.quotPreferdTravel.quotTravelAmount;
            }
            stndRate.quantity = obj.quotFinalQty;
            stndRate.namune = 1;
            stndRate.deliveryDays = "0";
            stndRate.urgentDeliveryDays = "0";
            stndRate.urgentRate = 1;
            if(obj.quotPreferdTravel.travelPayMode == "ToPay"){
                stndRate.travelRate = 0;
            }
            else{
                stndRate.travelRate = obj.quotPreferdTravel.quotTravelAmount;
            }
            stndRate.orderDetailsArr = obj.orderDetailsArr;
            console.log(stndRate);
            this.appService.addToCart(stndRate);


//            this.total = [];
//            this.grandTotal = 0;
//            this.cartItemCount = [];
//            this.cartItemCountTotal = 0;
            this.appService.Data.totalPrice = 0;
            this.appService.Data.cartList.forEach(product => {
//                this.total[product.id] = product.namune * product.rate;
//                this.grandTotal += product.namune * product.rate;
//                this.appService.Data.totalPrice = this.appService.Data.totalPrice + product.rate;
//                this.cartItemCount[product.id] = product.cartCount;
//                this.cartItemCountTotal += product.cartCount;
            })
            this.router.navigate(['/cart']);
        } else{
            this.snackBar.open('Already added in Cart', '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
        }
    }
    
    
    
    async filter(event){
        let paramData = {
            productId : this.productId,
            isFilter : this.isFilter,
            filterCriteria : this.filterCriteria
        }
        
        let dialogBoxSettings = {
            disableClose: true,
            hasBackdrop: true,
            margin: '0 auto',
            width: '80%',
            height: '80%',
            data: {formMode: "SAVE", paramObj: paramData || null}
        };
        

        const dialogRef = this._dialog.open(FilterComponent, dialogBoxSettings)
        dialogRef.afterClosed().subscribe((results:any)=>{
            console.log(results);
            if(results.data == "search"){
                this.isFilter = true;
                this.filterCriteria = JSON.parse(results.role);
//                this.productItemLst = this.filterCriteria.result;
            }
        })
    }
    standProdLst: any[] = [];
    
    unqGsmPaper = [];
    showedUnqSize = [];
    unqSize = [];
    
    printSide = [];   
    isSingleSide: boolean = false;    
    isFrontBack: boolean = false;    
    
    selectedGsm: any[]= [];
    selectedPaperType: any[]= [];
    selectedPrintSide: any[]= [];
    selectedSize: any[]= [];
    
    
    getProductStandardRate() {
            this.selectedGsm = [];
            this.selectedPaperType = [];
            this.selectedPrintSide = [];
            this.selectedSize = [];
            this.printSide = [];   
            this.isSingleSide = false;
            this.isFrontBack = false;
            this.standProdLst = this.fullStandardList;
            
            for (let i = 0; i < this.standProdLst.length; i++) {
                if(this.standProdLst[i].printSide == "Single Side"){
                    this.isSingleSide = true;
                }
                if(this.standProdLst[i].printSide == "Front Back"){
                    this.isFrontBack = true;
                }
            }
            if(this.isSingleSide){
                this.printSide.push({name:"Single Side",isPrintSideSelected:false})
            }
            if(this.isFrontBack){
                this.printSide.push({name:"Front Back",isPrintSideSelected:false})
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
    
    filter1(){
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
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 500;
        this.lazyCriteria.paramObj = {
            productId: this.productId,
        }
        if (typeof this.logedInUser != "undefined"){
            this.lazyCriteria.extraParams=[this.logedInUser.custRateLabel, this.logedInUser.id];
        }
        else{
            this.lazyCriteria.extraParams=[null];
        }
        this.lazyCriteria.multipleInFilter = obj;
        this.lazyCriteria.include = ["id","gsm","gsmId","laminationId","laminationSide","laminationType","namune","paperId","paperType","printSide","printingColor","printingColorId","productId","productName","quantity","rate","size","sizeId","urgentDeliveryDays","urgentRate","deliveryDays","postpress","standardRateLable","postPressRate"]
        console.log(this.lazyCriteria);
        this.doHttpPost("/api/StandardRate/rateLabelLstWithMultipleInFilter", this.lazyCriteria, false).subscribe((data: any) => {
            data = data.response;
            console.log("Filtered Listtttttttttttttttttttttttttttttttttttttttttttttttttttttt");
            console.log(data);
            this.standardList = data;
            console.log(this.standardList);
            this.dataSource = new MatTableDataSource(<any> data);
//            obj.result = productStandardList;
//            this.popOverController.dismiss("search",JSON.stringify(obj));
        }, error => {
            console.log(error);
        })
    }
    
    reset(){
        this.standProdLst = this.fullStandardList;
        this.standardList = this.fullStandardList;;
        console.log(this.standardList);
        this.dataSource = new MatTableDataSource(<any> this.fullStandardList);
    }
    
    
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
}