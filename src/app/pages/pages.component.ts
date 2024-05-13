import {Component, OnInit, HostListener, ViewChild, Inject, PLATFORM_ID, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {Settings, AppSettings} from '../app.settings';
import {AppService} from '../app.service';
import {Category} from '../app.models';
import {SidenavMenuService} from '../theme/components/sidenav-menu/sidenav-menu.service';
import {isPlatformBrowser} from '@angular/common';
import {MasterProvider} from '../utility/MasterProvider';
import {AuthService} from '../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {LocalService} from '../utility/LocalService';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    providers: [SidenavMenuService]
})
export class PagesComponent extends MasterProvider implements OnInit {
    public showBackToTop: boolean = false;
    public categories: Category[];
    public category: Category;
    public sidenavMenuItems: Array<any>;
    @ViewChild('sidenav', {static: true}) sidenav: any;

    isSiggnedIn: boolean = false;

    public settings: Settings;
    constructor(public appSettings: AppSettings,
        public appService: AppService,
        public sidenavMenuService: SidenavMenuService,
        public router: Router,public injector: Injector, public  http: HttpClient, public  authService: AuthService,public snackBar: MatSnackBar,
        @Inject(PLATFORM_ID) private platformId: Object, private localStorage: LocalService) {
        super(injector, http, authService);
        this.settings = this.appSettings.settings;
    }

    async ngOnInit() {
        var location = window.location.href 
        if (location.startsWith("https://www")){
            window.open("https://aaryancards.com","_self");
        }
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.isSiggnedIn = false;
        }
        else {
            await this.getGlobalUser();
        }
            
        setTimeout(() => {
            if (this.localStorage.getJsonValue('isLoggedin') == null) {
                this.isSiggnedIn = false;
            }
            else {
                this.isSiggnedIn = true;
                if (this.logedInUser.custRateLabel==null || typeof this.logedInUser.custRateLabel=="undefined")
                {
                 this.snackBar.open('Your Account Will Be Activated Within 24 hrs.','', { panelClass: 'error', verticalPosition: 'bottom'});

                }else{
    //                this.snackBar.open('Welcome to ','', { panelClass: 'success', verticalPosition: 'bottom'})
                }

            }
    //        this.getCategories();
//            this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
       
//            this.settings.theme = 'green';
            
        },1000);
    }
    

    public getCategories() {
        this.appService.getCategories().subscribe(data => {
            this.categories = data;
            this.category = data[0];
            this.appService.Data.categories = data;
        })
    }

    public changeCategory(event) {
        if (event.target) {
            this.category = this.categories.filter(category => category.name == event.target.innerText)[0];
        }
        if (window.innerWidth < 960) {
            this.stopClickPropagate(event);
        }
    }

    public remove(product) {
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

    public clear() {
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


    public changeTheme(theme) {
        this.settings.theme = theme;
    }

    public stopClickPropagate(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }

    public search() {}


    public scrollToTop() {
        var scrollDuration = 200;
        var scrollStep = -window.pageYOffset / (scrollDuration / 20);
        var scrollInterval = setInterval(() => {
            if (window.pageYOffset != 0) {
                window.scrollBy(0, scrollStep);
            }
            else {
                clearInterval(scrollInterval);
            }
        }, 10);
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                if (isPlatformBrowser(this.platformId)) {
                    window.scrollTo(0, 0);
                }
            });
        }
    }
    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
    }

    ngAfterViewInit() {
//        this.router.events.subscribe(event => {
//            if (event instanceof NavigationEnd) {
//                this.sidenav.close();
//            }
//        });
//        this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
    }

    public closeSubMenus() {
        if (window.innerWidth < 960) {
            this.sidenavMenuService.closeAllSubMenus();
        }
    }
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}

}