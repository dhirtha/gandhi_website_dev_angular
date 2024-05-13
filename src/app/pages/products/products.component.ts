import {Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID, Injector} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ProductDialogComponent} from '../../shared/products-carousel/product-dialog/product-dialog.component';
import {AppService} from '../../app.service';
import {Product} from "../../app.models";
import {Settings, AppSettings} from 'src/app/app.settings';
import {isPlatformBrowser} from '@angular/common';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends MasterProvider implements OnInit {
    lazyCriteria: LazyLoadRequest;
    @ViewChild('sidenav', {static: true}) sidenav: any;
    public sidenavOpen: boolean = true;
    private sub: any;
    public viewType: string = 'grid';
    public viewCol: number = 25;
    public counts = [12, 24, 36];
    public count: any;
    public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
    public sort: any;
    public products: Array<Product> = [];
    public productWithStdRate: Array<Product> = [];
    public productList: Array<Product> = [];
    public productsss: any;
//    public categories: Category[];
//    public brands = [];
//    public priceFrom: number = 750;
//    public priceTo: number = 1599;
//    public colors = [
//        {name: "#5C6BC0", selected: false},
//        {name: "#66BB6A", selected: false},
//        {name: "#EF5350", selected: false},
//        {name: "#BA68C8", selected: false},
//        {name: "#FF4081", selected: false},
//        {name: "#9575CD", selected: false},
//        {name: "#90CAF9", selected: false},
//        {name: "#B2DFDB", selected: false},
//        {name: "#DCE775", selected: false},
//        {name: "#FFD740", selected: false},
//        {name: "#00E676", selected: false},
//        {name: "#FBC02D", selected: false},
//        {name: "#FF7043", selected: false},
//        {name: "#F5F5F5", selected: false},
//        {name: "#696969", selected: false}
//    ];
//    public sizes = [
//        {name: "S", selected: false},
//        {name: "M", selected: false},
//        {name: "L", selected: false},
//        {name: "XL", selected: false},
//        {name: "2XL", selected: false},
//        {name: "32", selected: false},
//        {name: "36", selected: false},
//        {name: "38", selected: false},
//        {name: "46", selected: false},
//        {name: "52", selected: false},
//        {name: "13.3\"", selected: false},
//        {name: "15.4\"", selected: false},
//        {name: "17\"", selected: false},
//        {name: "21\"", selected: false},
//        {name: "23.4\"", selected: false}
//    ];
    public page: any;
    public settings: Settings;
    
    
    displayedColumns1: any[] = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','quantity','rate','process']
    displayedColumns2: any[] = ['paperType','gsm','size','printSide','printingColor','quantity','rate','process']
    displayedColumns3: any[] = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','postpress','quantity','rate','process']
    showLamination: boolean = false;
    showDoctFile: boolean = false;
    dataSource: any;
    dataSource1: any;
    spinner
    isLoggedIn: boolean = false;
    
    
    
    constructor(public appSettings: AppSettings,
        private activatedRoute: ActivatedRoute,
        public appService: AppService,
        public dialog: MatDialog,
        public router: Router,
        public injector: Injector, public http: HttpClient, public authService: AuthService,
        @Inject(PLATFORM_ID) private platformId: Object, private localStorage: LocalService) {
        super(injector, http, authService);
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
       
        this.router.navigate(['/']);
        this.count = this.counts[0];
        this.sort = this.sortings[0];
        this.sub = this.activatedRoute.params.subscribe(params => {
            //console.log(params['name']);
        });
        if (window.innerWidth < 960) {
            this.sidenavOpen = false;
        };
        if (window.innerWidth < 1280) {
            this.viewCol = 33.3;
        };

//        this.getCategories();
//        this.getBrands();
        this.getAllProducts();
        
        if(this.localStorage.getJsonValue('isLoggedin') == null){
            this.isLoggedIn = false;
        }else{
            this.isLoggedIn = true;
        }
    }
    
    
    goToProduct(product){
        if(this.localStorage.getJsonValue('isLoggedin') == null){
            this.router.navigate(['/login']);
        }else{
            this.router.navigate(['/products', product.id, product.prodName])
                .then(() => {
            });
        }
    }

    public getAllProducts() {
//        this.appService.getProducts("featured").subscribe(data => {
//            this.products = data;
//            //for show more product  
//            for (var index = 0; index < 3; index++) {
//                this.products = this.products.concat(this.products);
//            }
//        });
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 8;
        this.lazyCriteria.in = ["Leaflet/Pamphlate/Flyer/Brochure","Letterhead","Sticker","Cards Invitation/Wedding/Birthday","Envelope - Office","Envelope - Wedding","Visiting Card","Doctor File"];
        this.lazyCriteria.inField = "prodName";
        this.lazyCriteria.include = ["id","prodName", "prodAvailability", "prodCategory", "prodDescription", "prodImages"];
        this.lazyCriteria.paramObj = {
        }
        this.doHttpPost("/api/AdProductController/filterList", this.lazyCriteria, false).subscribe((data: any) => {
            data = data.response;
            console.log("Product listtttttttttttttttttttt");
            console.log(data);
            this.products = data;
            this.productList = data;
            this.productsss = new MatTableDataSource(<any> data);
            console.log(this.productsss);
        })
    }
    
    
    public getStandardProductLst(product){
        this.spinner = true;
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 100;
        this.lazyCriteria.paramObj = {
            productId : product.id
        }
        this.lazyCriteria.include = ["id","gsm","gsmId","laminationId","laminationSide","laminationType","namune","paperId","paperType","printSide","printingColor","printingColorId","productId","productName","quantity","rate","size","sizeId","urgentDeliveryDays","urgentRate","deliveryDays","postpress"]
        this.doHttpPost("/api/StandardRate/rateLabelLst", this.lazyCriteria, true).subscribe((data:any)=>{
            data = data.response;
            console.log("Product listtttttttttttttttttttt");
            this.spinner = false;
            this.dataSource1 = data;
            product.prodStdRates = data;
            this.dataSource = new MatTableDataSource(<any> data);
            console.log(this.dataSource.filteredData);
            for (let i = 0; i < this.dataSource.filteredData.length; i++) {
                if(this.dataSource.filteredData[i].productName == "Doctor File"){
                    console.log("ooooooooooooooooooooooooooooo");
                    product.showDoctFile = true;
                    break;
                }
                if(this.dataSource.filteredData[i].laminationSide != "N/A" && this.dataSource.filteredData[i].laminationType != "N/A"){
                    product.showLamination = true;
                    break;
                }
            }
        })
    }
    
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.productsss.filter = filterValue.trim().toLowerCase();
        this.products = this.productsss.filteredData;
    }
    

    public getCategories() {
//        if (this.appService.Data.categories.length == 0) {
//            this.appService.getCategories().subscribe(data => {
//                this.categories = data;
//                this.appService.Data.categories = data;
//            });
//        }
//        else {
//            this.categories = this.appService.Data.categories;
//        }
    }

    public getBrands() {
//        this.brands = this.appService.getBrands();
//        this.brands.forEach(brand => {brand.selected = false});
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
        (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
    }

    public changeCount(count) {
        this.count = count;
        this.getAllProducts();
    }

    public changeSorting(sort) {
        this.sort = sort;
    }

    public changeViewType(viewType, viewCol) {
        this.viewType = viewType;
        this.viewCol = viewCol;
    }

    public openProductDialog(product) {
        console.log("zzzzzzzzzzzzzzzzzzzzzzzz");
        let dialogRef = this.dialog.open(ProductDialogComponent, {
            data: product,
            panelClass: 'product-dialog',
            direction: (this.settings.rtl) ? 'rtl' : 'ltr'
        });
        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.router.navigate(['/products', product.id, product.name]);
            }
        });
    }

    public onPageChanged(event) {
        this.page = event;
        this.getAllProducts();
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo(0, 0);
        }
    }

    public onChangeCategory(event) {
        if (event.target) {
            this.router.navigate(['/products', event.target.innerText.toLowerCase()]);
        }
    }

    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}

}
