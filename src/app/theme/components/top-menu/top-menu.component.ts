import {Component, OnInit, Injector} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {AppService} from '../../../app.service';
import {Settings, AppSettings} from '../../../app.settings';
import {Router} from '@angular/router';
import {MasterProvider} from '../../../utility/MasterProvider';
import {AuthService} from '../../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {SiUtil} from '../../../utility/SiUtil';
import {LocalService} from '../../../utility/LocalService';

@Component({
    selector: 'app-top-menu',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.scss'],
})
export class TopMenuComponent extends MasterProvider implements OnInit {
    user: any;
    public currencies = ['INR'];
    public currency: any;
    
    public links = [
        {name: 'Account Dashboard', href: 'dashboard', icon: 'dashboard'},
        {name: 'Account Information', href: 'information', icon: 'info'},
        {name: 'Travel Destination', href: 'addresses', icon: 'location_on'},
        {name: 'Order History', href: 'orders', icon: 'add_shopping_cart'},
    ];

    public settings: Settings;
    constructor(public appSettings: AppSettings, public appService: AppService, public translateService: TranslateService, public router: Router, public injector: Injector, public http: HttpClient, public authService: AuthService, public util: SiUtil, private localStorage: LocalService) {
        super(injector, http, authService);
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        this.currency = this.currencies[0];
        this.getUser();
    }
    
    getUser(){
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
            data = data.response;
            console.log("cust listttttttttttttttt");
            console.log(data);
            this.user = data;
        })
    }

    public changeCurrency(currency) {
        this.currency = currency;
    }

    public changeLang(lang: string) {
        this.translateService.use(lang);
    }

    public getLangText(lang) {

        return 'English';

    }

    onLoggedout() {
        this.util.toastLogOutConfirmation().then(data=>{
            if(data){
                localStorage.removeItem('isLoggedin');
                localStorage.clear();
                this.localStorage.clearToken();
                this.router.navigate(['/'])
                    .then(() => {
                        window.location.reload();
                    });
            }
        })
    }

    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}

}
