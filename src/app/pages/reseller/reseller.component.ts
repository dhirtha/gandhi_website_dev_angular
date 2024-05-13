import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator} from '../../theme/utils/app-validators';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../utility/auth-service';
import {MasterProvider} from '../../utility/MasterProvider';
import {ResellerProvider} from './reseller-provider';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {map} from 'rxjs/internal/operators/map';
import {Customer} from '../../pojos/quotation/customer_1';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-reseller',
  templateUrl: './reseller.component.html',
  styleUrls: ['./reseller.component.scss']
})
export class ResellerComponent extends MasterProvider implements OnInit {
    rateLabelLst: any;
    gstLst: any;
    loginForm: FormGroup;
    registerForm: FormGroup;
    lazyCriteria: LazyLoadRequest;
    API_FOR_GST_LST = "/api/gstMst/list"
    API_FOR_GET_RATE_LABEL_LST = "/api/rateLableMst/list";

    customer:Customer
    states:any;
    cities:any;
    custState:any;
    custCity:any;

    constructor(public formBuilder: FormBuilder, public router:Router, public snackBar: MatSnackBar, private spinner: NgxSpinnerService,
                public injector: Injector, public http: HttpClient, public authService: AuthService, private provider: ResellerProvider) 
    {
        super(injector, http, authService);
        this.customer = new Customer();
    }

    ngOnInit() {
         this.registerForm = this.formBuilder.group({
          'shopName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
          'state': ['', Validators.compose([Validators.required])],
          'city': ['', Validators.compose([Validators.required])],
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'mobileNo': ['', Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(12)])],
          'pincode': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
          'message': ['', Validators.required]
        });
          this.filterStates();
    }
  
    public  save(obj: any){}
    public  update(obj: any){}
    public  findById(objId: any){}
    public  findAll(){}
    public  deleteById(obj: any){}
    public  defunctById(obj: any){}
    

    public onRegisterFormSubmit():void {
        this.registerForm.value.state = this.custState;
        this.registerForm.value.city = this.custCity;
        console.log(this.registerForm.value);
    }
  
  
    stateCtrl = new FormControl();
    filteredState: Observable<string[]>;
    cityCtrl = new FormControl();
    filteredCity: Observable<string[]>;
    
    filterStates() {
        this.provider.getStateList().then((list: any[]) => {
            this.states = list;
            console.log(list);
            this.filteredState = this.stateCtrl.valueChanges
                .pipe(
                    startWith(''),
                    map(value => typeof value === 'string' ? value : value),
                    map(name => name ? this._filterState(name) : this.states.slice())
                );
        }).catch(error => {
            console.log(error);
        })
    }
    
    private _filterState(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.states.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }

    filterCities(Obj,$event) {
        if($event.isUserInput){
            this.custCity = "";
            this.provider.getCityList(Obj.id).then((list: any[]) => {
                this.cities = list;
                this.filteredCity = this.cityCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(value => typeof value === 'string' ? value : value),
                        map(name => name ? this._filterCity(name) : this.cities.slice())
                    );
            }).catch(error => {
                console.log(error);
            })
        }
    }
    private _filterCity(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.cities.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
    

}
