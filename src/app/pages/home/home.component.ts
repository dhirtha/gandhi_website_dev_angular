import {Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID} from '@angular/core';
import {AppService} from '../../app.service';
import {Product, Category} from "../../app.models";
import {HomeProvider} from './home.provider';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {Router, ActivatedRoute} from '@angular/router';
import {Settings} from '../../app.settings';
import {MatTableDataSource} from '@angular/material/table';
import {isPlatformBrowser} from '@angular/common';
import {ProductDialogComponent} from '../../shared/products-carousel/product-dialog/product-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../utility/auth-service';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [HomeProvider],
})
export class HomeComponent implements OnInit {

    lazyCriteria: LazyLoadRequest;
    public slides = [
        {title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/others/Home 1.jpg'},
        {title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/others/Home 2.jpg'},
//        {title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner3.jpg'},
//        {title: 'Summer collection', subtitle: 'New Arrivals On Sale', image: 'assets/images/carousel/banner4.jpg'},
//        {title: 'The biggest sale', subtitle: 'Special for today', image: 'assets/images/carousel/banner5.jpg'}
    ];

    public brands = [];
    public banners = [];
    public featuredProducts: Array<Product>;
    public onSaleProducts: Array<Product>;
    public topRatedProducts: Array<Product>;
    public newArrivalsProducts: Array<Product>;

    spinner: boolean = false;
    
    isLoggedIn: boolean = false;
    lightblue = "white"


    constructor(public appService: AppService, public provider: HomeProvider, public router: Router, public authService: AuthService,
                private activatedRoute: ActivatedRoute,public dialog: MatDialog,@Inject(PLATFORM_ID) private platformId: Object, private localStorage: LocalService) {}

    ngOnInit() {
        this.router.navigate(['/']);
        if(this.localStorage.getJsonValue('isLoggedin') == null){
            this.isLoggedIn = true;
            this.authService.removeSession();
        }else{
            this.isLoggedIn = false;
            console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
        }
        //    this.getBanners();
        //    this.getProducts("featured");
        //    this.getBrands();
//        this.router.navigate(['/products'])
//        .then(() => {
//            window.location.reload();
//        });
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
    }

    public onLinkClick(e) {
        this.getProducts(e.tab.textLabel.toLowerCase());
    }
    
    public getProducts(type) {
        this.spinner = true;
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 7;
        this.lazyCriteria.include = ["prodName", "prodAvailability", "prodCategory", "prodDescription", "prodImages", "prodDescription"];
        this.lazyCriteria.paramObj = {
        }
        this.provider.doHttpPost("/api/AdProductController/list", this.lazyCriteria, false).subscribe((data: any) => {
            data = data.response;
            console.log("Product listtttttttttttttttttttt");
            console.log(data);
            this.spinner = false;
            this.featuredProducts = data;
        })
    }

    public getBanners() {
        this.appService.getBanners().subscribe(data => {
            this.banners = data;
        })
    }

    public getBrands() {
        this.brands = this.appService.getBrands();
    }
    
    @ViewChild('sidenav', {static: true}) sidenav: any;
    public sidenavOpen: boolean = true;
    private sub: any;
    public viewType: string = 'grid';
    public viewCol: number = 15;
    public counts = [12, 24, 36];
    public count: any;
    public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
    public sort: any;
    public products: Array<Product> = [];
    public productWithStdRate: Array<Product> = [];
    public productList: Array<Product> = [];
    public productsss: any;
    public categories: Category[];
    public priceFrom: number = 750;
    public priceTo: number = 1599;
    public colors = [
        {name: "#5C6BC0", selected: false},
        {name: "#66BB6A", selected: false},
        {name: "#EF5350", selected: false},
        {name: "#BA68C8", selected: false},
        {name: "#FF4081", selected: false},
        {name: "#9575CD", selected: false},
        {name: "#90CAF9", selected: false},
        {name: "#B2DFDB", selected: false},
        {name: "#DCE775", selected: false},
        {name: "#FFD740", selected: false},
        {name: "#00E676", selected: false},
        {name: "#FBC02D", selected: false},
        {name: "#FF7043", selected: false},
        {name: "#F5F5F5", selected: false},
        {name: "#696969", selected: false}
    ];
    public sizes = [
        {name: "S", selected: false},
        {name: "M", selected: false},
        {name: "L", selected: false},
        {name: "XL", selected: false},
        {name: "2XL", selected: false},
        {name: "32", selected: false},
        {name: "36", selected: false},
        {name: "38", selected: false},
        {name: "46", selected: false},
        {name: "52", selected: false},
        {name: "13.3\"", selected: false},
        {name: "15.4\"", selected: false},
        {name: "17\"", selected: false},
        {name: "21\"", selected: false},
        {name: "23.4\"", selected: false}
    ];
    public page: any;
    public settings: Settings;
    
    
    displayedColumns1: any[] = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','quantity','rate','process']
    displayedColumns2: any[] = ['paperType','gsm','size','printSide','printingColor','quantity','rate','process']
    displayedColumns3: any[] = ['paperType','gsm','size','printSide','printingColor','laminationSide','laminationType','postpress','quantity','rate','process']
    showLamination: boolean = false;
    showDoctFile: boolean = false;
    dataSource: any;
    dataSource1: any;
    
    goToProduct(product?){
        this.router.navigate(['/products', product.id, product.prodName])
            .then(() => {
        });
    }
    goToCustomised(){
        this.router.navigate(['/customisedQuotation'])
            .then(() => {
        });
    }

    public getAllProducts() {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 50;
        this.lazyCriteria.include = ["id","prodName", "prodAvailability", "prodCategory", "prodDescription", "prodImages", "websiteProdPriority", "prodHideWebsite"];
        this.lazyCriteria.paramObj = {
            prodHideWebsite : false
        }
        this.lazyCriteria.sortFiled = "websiteProdPriority";
        this.lazyCriteria.sortValue = "asc";
        this.provider.doHttpPost("/api/AdProductController/filterList", this.lazyCriteria, false).subscribe((data: any) => {
            data = data.response;
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].prodImages.length; j++) {
                    data[i].prodImages[j].ex_small = data[i].prodImages[j].ex_small.replace("resources.aaryancards.com","colorgandhiimages.s3.ap-south-1.amazonaws.com");
                    data[i].prodImages[j].large = data[i].prodImages[j].large.replace("resources.aaryancards.com","colorgandhiimages.s3.ap-south-1.amazonaws.com");
                    data[i].prodImages[j].medium = data[i].prodImages[j].medium.replace("resources.aaryancards.com","colorgandhiimages.s3.ap-south-1.amazonaws.com");
                    data[i].prodImages[j].small = data[i].prodImages[j].small.replace("resources.aaryancards.com","colorgandhiimages.s3.ap-south-1.amazonaws.com");
                }
            }
            console.log(data);
            this.products = data;
            this.productList = data;
            this.productsss = new MatTableDataSource(<any> data);
        })
//        this.lazyCriteria = new LazyLoadRequest();
//        this.lazyCriteria.pageSize = 50;
//        this.lazyCriteria.in = ["Visiting Card","Leaflet/Pamphlate/Flyer/Brochure","Letterhead","Sticker","Plastic PVC Sticker","Cards Invitation/Wedding/Birthday","Certificate","Doctor File","Brochure","Bookwork","Book Cover","Calendar - Wiro Hanging","Calendar - Table Wiro","Calendar - Patti Tinning","Poster Calendar","Poster","Envelope - Wedding","Envelope - Office"];
//        this.lazyCriteria.inField = "prodName";
//        this.lazyCriteria.include = ["id","prodName", "prodAvailability", "prodCategory", "prodDescription", "prodImages"];
//        this.lazyCriteria.paramObj = {
//        }
//        this.provider.doHttpPost("/api/AdProductController/filterList", this.lazyCriteria, false).subscribe((data: any) => {
//            data = data.response;
//            this.products = data;
//            this.productList = data;
//            this.productsss = new MatTableDataSource(<any> data);
//        })
    }
    
    public getStandardProductLst(product){
        this.spinner = true;
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 100;
        this.lazyCriteria.paramObj = {
            productId : product.id
        }
        this.lazyCriteria.include = ["id","gsm","gsmId","laminationId","laminationSide","laminationType","namune","paperId","paperType","printSide","printingColor","printingColorId","productId","productName","quantity","rate","size","sizeId","urgentDeliveryDays","urgentRate","deliveryDays","postpress"]
        this.provider.doHttpPost("/api/StandardRate/rateLabelLst", this.lazyCriteria, false).subscribe((data:any)=>{
            data = data.response;
//            console.log("Product listtttttttttttttttttttt");
            this.spinner = false;
            this.dataSource1 = data;
            product.prodStdRates = data;
            this.dataSource = new MatTableDataSource(<any> data);
//            console.log(this.dataSource.filteredData);
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
        if (this.appService.Data.categories.length == 0) {
            this.appService.getCategories().subscribe(data => {
                this.categories = data;
                this.appService.Data.categories = data;
            });
        }
        else {
            this.categories = this.appService.Data.categories;
        }
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
//        console.log("zzzzzzzzzzzzzzzzzzzzzzzz");
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
    
    
    

}
