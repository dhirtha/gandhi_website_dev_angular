import {isPlatformBrowser} from '@angular/common';
import {Component, Inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Settings, AppSettings} from './app.settings';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import {LocalService} from './utility/LocalService';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    loading: boolean = false;
    public settings: Settings;
    isUnderMaintenance: boolean = false;
    timer = ms => new Promise(res => setTimeout(res, ms))
    isTokenValid: boolean = true;
    
    
    idleState = 'Not started.';
    timedOut = false; 
    lastPing?: Date = null;
    title = 'angular-idle-timeout';
    
    
    constructor(public appSettings: AppSettings,
        public router: Router,private localStorage: LocalService,
        private idle: Idle, private keepalive: Keepalive,
        @Inject(PLATFORM_ID) private platformId: Object,
        public translate: TranslateService, public http: HttpClient) 
    {
        this.settings = this.appSettings.settings;
        translate.addLangs(['en', 'de', 'fr', 'ru', 'tr']);
        translate.setDefaultLang('en');
        translate.use('en');
//        this.getSecuredAuthToken();
        
        
        
        this.inactiveTimeOut();
    }
    
    inactiveTimeOut(){
        // sets an idle timeout of 30 min, for testing purposes.
//        15 min == 900 sec.
//        30 min == 1800 sec.
//        60 min == 3600 sec.
        this.idle.setIdle(900);
        // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
        this.idle.setTimeout(10);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        this.idle.onIdleEnd.subscribe(() => {
            this.idleState = 'No longer idle.'
            console.log(this.idleState);
            this.reset();
        });

        this.idle.onTimeout.subscribe(() => {
            this.idleState = 'Timed out!';
            this.timedOut = true;
            console.log(this.idleState);
            localStorage.removeItem('isLoggedin');
            localStorage.clear();
            this.router.navigate(['/login']);
        });

        this.idle.onIdleStart.subscribe(() => {
            this.idleState = 'You\'ve gone idle!'
            console.log(this.idleState);
//            this.childModal.show();
        });

        this.idle.onTimeoutWarning.subscribe((countdown) => {
            this.idleState = 'You will time out in ' + countdown + ' seconds!'
//            alert('You will time out in ' + countdown + ' seconds!');
            console.log(this.idleState);
        });

        // sets the ping interval to 15 seconds
        this.keepalive.interval(15);

        this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

        this.reset();
    }
    
    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    ngOnInit() {
    }
    
    async getSecuredAuthToken()
    {
//        while(true)
//        {
//            this.http.get("/api/auth/token").subscribe(data=>{
//                this.isTokenValid = true;
//            })
////            await this.timer(3000000); 
//            await this.timer(60000); 
//        }
    }

    ngAfterViewInit() {
    }
}
