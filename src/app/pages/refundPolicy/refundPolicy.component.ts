import {Component, OnInit, Injector} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-refundPolicy',
    templateUrl: './refundPolicy.component.html',
    styleUrls: ['./refundPolicy.component.scss']
})
export class RefundPolicyComponent extends MasterProvider implements OnInit {
    
    isAmountPaid: boolean = false;
    
    constructor(public appService: AppService, public formBuilder: FormBuilder, public router: Router, public injector: Injector, public http: HttpClient, public authService: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog,  public spinner: NgxSpinnerService) {
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




