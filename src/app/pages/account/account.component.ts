import {Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {SiUtil} from '../../utility/SiUtil';
import {LocalService} from '../../utility/LocalService';

@Component({
    selector: 'app-account',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
    @ViewChild('sidenav', {static: true}) sidenav: any;
    public sidenavOpen: boolean = true;
    public links = [
        {name: 'Account Dashboard', href: 'dashboard', icon: 'dashboard'},
        {name: 'Account Information', href: 'information', icon: 'info'},
        {name: 'Travel Destination', href: 'addresses', icon: 'location_on'},
        {name: 'Order History', href: 'orders', icon: 'add_shopping_cart'},
        {name: 'Quotation History', href: 'customisedQuotation', icon: 'assessment'},
        //    { name: 'Logout', href: '/login', icon: 'power_settings_new' },    
    ];
    customised = {name: 'Expired Quotation History', href: 'customisedQuotation', icon: 'assessment'};
    signOut = {name: 'Logout', href: '/products', icon: 'power_settings_new'};
    toggle = {name: 'Collapse', href: '#', icon: 'compare_arrows'};
    isLoggedIn: boolean = false;
    
    constructor(public router: Router, public util: SiUtil, private localStorage: LocalService) {}

    ngOnInit() {
        if (window.innerWidth < 960) {
            this.sidenavOpen = false;
        };
        if (this.localStorage.getJsonValue('isLoggedin') == null){
            this.isLoggedIn = true;
            this.router.navigate(['/home']);
        }else{
            this.isLoggedIn = false;
        }
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
    }

    ngAfterViewInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (window.innerWidth < 960) {
                    this.sidenav.close();
                }
            }
        });
    }
    
    expiredQuotation(){
    }

    logOut() {
        this.util.toastLogOutConfirmation().then(data => {
            if (data) {
                localStorage.removeItem('isLoggedin');
                localStorage.removeItem('sessionUser');
                localStorage.clear();
                this.localStorage.clearToken();
                this.localStorage.clearToken();
                this.router.navigate(['/'])
                    .then(() => {
                        window.location.reload();
                    });
            }
        })
    }



    public toggleSidenav() {
        this.sidenav.toggle();
//        console.log(this.sidenav);
    }

}
