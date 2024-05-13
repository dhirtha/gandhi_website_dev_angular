import {Component, OnInit, Injector} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AppService} from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-termsOfUse',
    templateUrl: './termsOfUse.component.html',
    styleUrls: ['./termsOfUse.component.scss']
})
export class TermsOfUseComponent extends MasterProvider implements OnInit {
    
    isAmountPaid: boolean = false;
    
    constructor(public appService: AppService, public formBuilder: FormBuilder, public router: Router, public injector: Injector, public http: HttpClient, public authService: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog,  public spinner: NgxSpinnerService, private sanitizer: DomSanitizer, private paymentCredentials: ActivatedRoute,) {
        super(injector, http, authService);
    }
    
//    @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
//        let result = confirm("Changes you made may not be saved.");
//        if (result) {
//          // Do more processing...
//        }
//        event.returnValue = false; // stay on same page
//    }

    ngOnInit() {
        
    }
    
    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}

    

}




