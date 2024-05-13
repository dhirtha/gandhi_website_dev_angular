import {Component, OnInit, Input, Injector, ViewChild} from '@angular/core';
import {Product} from '../../../app.models';
import {LazyLoadRequest} from '../../../request/LazyLoadRequest';
import {MasterProvider} from '../../../utility/MasterProvider';
import {AuthService} from '../../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {AppService} from '../../../app.service';
import {AppSettings, Settings} from '../../../app.settings';
import {SiUtil} from '../../../utility/SiUtil';
import {LocalService} from '../../../utility/LocalService';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends MasterProvider implements OnInit {

    @ViewChild('sidenav', {static: true}) sidenav: any;
    lazyCriteria: LazyLoadRequest;
    public products: Array<Product> = [];
    public productList: Array<Product> = [];
    public productsss: any;
    
    isSiggnedIn: boolean = false;
    
    public settings: Settings;
    constructor(public injector: Injector, public http: HttpClient, public authService: AuthService, public router: Router, public appSettings: AppSettings, public appService: AppService, public util: SiUtil, private localStorage: LocalService) {
        super(injector, http, authService);
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.isSiggnedIn = false;
        }
        else {
            this.isSiggnedIn = true;
        }
        this.getAllProducts();
    }
    
    goTo(nav){
        
        
        this.sidenav.close();
        this.router.navigate([nav],{ skipLocationChange: true })
    }

    openMegaMenu() {
        let pane = document.getElementsByClassName('cdk-overlay-pane');
        [].forEach.call(pane, function (el) {
            if (el.children.length > 0) {
                if (el.children[0].classList.contains('mega-menu')) {
                    el.classList.add('mega-menu-pane');
                }
            }
        });
    }
    
    logOut() {
        this.util.toastLogOutConfirmation().then(data => {
            if (data) {
                localStorage.removeItem('isLoggedin');
                localStorage.removeItem('sessionUser');
                localStorage.clear();
                this.localStorage.clearToken();
                this.router.navigate(['/'])
                    .then(() => {
                        window.location.reload();
                    });
            }
        })
    }
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
    
    
    public getAllProducts() {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 50;
        this.lazyCriteria.include = ["id","prodName", "websiteProdPriority", "prodHideWebsite"];
        this.lazyCriteria.paramObj = {
            prodHideWebsite : false
        }
        this.lazyCriteria.sortFiled = "websiteProdPriority";
        this.lazyCriteria.sortValue = "asc";
        this.doHttpPost("/api/AdProductController/filterList", this.lazyCriteria, false).subscribe((data: any) => {
            data = data.response;
            this.products = data;
            this.productList = data;
            this.productsss = new MatTableDataSource(<any> data);
        })
//        this.lazyCriteria = new LazyLoadRequest();
//        this.lazyCriteria.pageSize = 50;
//        this.lazyCriteria.in = ["Visiting Card","Leaflet/Pamphlate/Flyer/Brochure","Letterhead","Sticker","Plastic PVC Sticker","Cards Invitation/Wedding/Birthday","Certificate","Doctor File","Brochure","Bookwork","Book Cover","Calendar - Wiro Hanging","Calendar - Table Wiro","Calendar - Patti Tinning","Poster Calendar","Poster","Envelope - Wedding","Envelope - Office"];
//        this.lazyCriteria.inField = "prodName";
//        this.lazyCriteria.include = ["id","prodName"];
//        this.lazyCriteria.paramObj = {
//        }
//        this.doHttpPost("/api/AdProductController/filterList", this.lazyCriteria, false).subscribe((data: any) => {
//            data = data.response;
//            this.products = data;
//            this.productList = data;
//            this.productsss = new MatTableDataSource(<any> data);
//        })
    }
    
    goToProduct(product){
//        if(localStorage.getItem('isLoggedin') == null){
//            this.router.navigate(['/login']);
//        }else{
            this.router.navigate(['/products', product.id, product.prodName])
                .then(() => {
            });
//        }
    }
    
    customerSupport(){
        this.router.navigate(['/contact'])
    }
    
    public remove(product) {
        this.util.toastRemoveConfirmation().then(data=>{
            if(data){
                const index: number = this.appService.Data.cartList.indexOf(product);
                if (index !== -1) {
                    this.appService.Data.cartList.splice(index, 1);

                    console.log(this.appService.Data.cartList[index]);
        //            let prod = [];
        //            prod.push(this.appService.Data.cartList[index]);
                    let obj = {
                        userId: this.getSession().id_mongo,
                        userCartList : this.appService.Data.cartList
                    }
                    console.log(obj);
                    this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data=>{
                        data = data.response;
                        console.log(data);

                        this.appService.Data.totalPrice = 0;
                        this.appService.Data.cartList.forEach(prod=>{
            //                this.Data.totalPrice = this.Data.totalPrice + (product.cartCount * product.rate);
                            this.appService.Data.totalPrice = this.appService.Data.totalPrice + prod.rate;
                        });
                        this.appService.Data.totalCartCount = this.appService.Data.cartList.length;

        //                this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.rate * product.cartCount;
        //                this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
        //                this.appService.resetProductCartCount(product);
                    });

                }
            }
        })
        
    }

    public clear() {
        this.util.toastRemoveConfirmation().then(data=>{
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
                    this.appService.Data.cartList.length = 0;
                    this.appService.Data.totalPrice = 0;
                    this.appService.Data.totalCartCount = 0;
                });
            }
        })
    }


    public changeTheme(theme) {
        this.settings.theme = theme;
    }

    public stopClickPropagate(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }

    public search() {}


//    public scrollToTop() {
//        var scrollDuration = 200;
//        var scrollStep = -window.pageYOffset / (scrollDuration / 20);
//        var scrollInterval = setInterval(() => {
//            if (window.pageYOffset != 0) {
//                window.scrollBy(0, scrollStep);
//            }
//            else {
//                clearInterval(scrollInterval);
//            }
//        }, 10);
//        if (window.innerWidth <= 768) {
//            setTimeout(() => {
//                if (isPlatformBrowser(this.platformId)) {
//                    window.scrollTo(0, 0);
//                }
//            });
//        }
//    }
//    @HostListener('window:scroll', ['$event'])
//    onWindowScroll($event) {
//        ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
//    }
//
//    ngAfterViewInit() {
//        this.router.events.subscribe(event => {
//            if (event instanceof NavigationEnd) {
//                this.sidenav.close();
//            }
//        });
//        this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
//    }
//
//    public closeSubMenus() {
//        if (window.innerWidth < 960) {
//            this.sidenavMenuService.closeAllSubMenus();
//        }
//    }

}
