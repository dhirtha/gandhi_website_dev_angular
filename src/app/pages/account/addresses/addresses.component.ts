import {Component, OnInit, Injector} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {AppService} from '../../../app.service';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {map} from 'rxjs/internal/operators/map';
import {MasterProvider} from '../../../utility/MasterProvider';
import {AuthService} from '../../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {LazyLoadRequest} from '../../../request/LazyLoadRequest';

@Component({
    selector: 'app-addresses',
    templateUrl: './addresses.component.html',
    styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent extends MasterProvider implements OnInit {
    lazyCriteria: LazyLoadRequest;
    billingForm: FormGroup;
    shippingForm: FormGroup;
    countries = [];
    
    custObj:any;
    constructor(public appService: AppService, public formBuilder: FormBuilder, public snackBar: MatSnackBar, public injector: Injector, public  http: HttpClient, public  authService: AuthService) {
        super(injector, http, authService);
    }

    ngOnInit() {
        this.filterStates();
        this.getUser();
        this.countries = this.appService.getCountries();
        this.billingForm = this.formBuilder.group({
            'state': [],
            'city': [],
            'travel': [],
        });
        this.shippingForm = this.formBuilder.group({
            'firstName': ['', Validators.required],
            'lastName': ['', Validators.required],
            'middleName': '',
            'company': '',
            'email': ['', Validators.required],
            'phone': ['', Validators.required],
            'country': ['', Validators.required],
            'city': ['', Validators.required],
            'state': '',
            'zip': ['', Validators.required],
            'address': ['', Validators.required]
        });
    }
    
    getUser(){
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
            data = data.response;
            console.log("cust listttttttttttttttt");
            console.log(data);
            this.custObj = data;
            this.custState = data.userAddress.addState;
            this.custCity = data.userAddress.addCity;
            this.getInitCities(this.custState);
            this.getInitTravelLst(this.custCity);
            if(data.userTravelRates.length != 0){
                this.v_custTravel = data.userTravelRates[0].id;
                if(data.userTravelRates[0].travelPayMode == "Both"){
                    if(data.custTravelDelivery != null){
                        this.paymentMode = data.custTravelDelivery;
                    }else{
                        this.paymentMode = "Paid";
                    }
                }
            }
            if(data.userTravelRates.length == 0){
                this.isByHand = true;
            }
            console.log(data.userTravelRates);
        })
    }
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}

    public onBillingFormSubmit(values: Object): void {
        this.custObj.userAddress.addState = this.custState;
        this.custObj.userAddress.addCity = this.custCity;
//        this.custObj.userTravelRates[0] = this.custTravel;
        if(this.isByHand == true){
            this.custObj.userTravelRates = [];
            this.custObj.custTravelPayMode = "By Hand";
        }
        else{
//            this.custObj.userTravelRates[0] = this.custTravel;
            this.custObj.custTravelPayMode = null;
        }
        console.log(this.custObj);
        this.doHttpPost("/api/auth/saveUserFromCustForm", this.custObj, true).subscribe((data:any)=>{
            data = data.response;
            console.log(data);
            if(data.message=="success"){
                this.snackBar.open('Your travel destination updated successfully!', '×', {panelClass: 'success', verticalPosition: 'top', duration: 3000});
            }
        })
    }

    public onShippingFormSubmit(values: Object): void {
        if (this.shippingForm.valid) {
            this.snackBar.open('Your shipping address information updated successfully!', '×', {panelClass: 'success', verticalPosition: 'top', duration: 3000});
        }
    }
    
    
    stateCtrl = new FormControl();
    filteredState: Observable<string[]>;
    cityCtrl = new FormControl();
    filteredCity: Observable<string[]>;
    custState:any;
    custCity:any;
    custTravel:any;
    v_custTravel:any;
    travelLst:any;
    API_FOR_GET_TRAVEL_RATE = "/api/travelRate/list";
    
    isByHand = false;
    
    states: any[] = [];
    filterStates() {
        this.getStateList().then((list: any[]) => {
            this.states = list;
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
    
    cities: any[] = [];
    filterCities(Obj: any, event: any) 
    {
        if (event.isUserInput)
        {
            this.getCityList(Obj.id).then((list: any[]) => {
                this.cities = list;
                this.custCity = ""
                this.custTravel = "";
                this.travelLst = [];
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
    
    getInitCities(state){
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].name == state){
                this.getCityList(this.states[i].id).then((list: any[]) => {
                    console.log("zzzzzzzzzzzzzz");
                    this.cities = list;
                    this.filteredCity = this.cityCtrl.valueChanges
                    .pipe(
                        startWith(''),
                        map(value => typeof value === 'string' ? value : value),
                        map(name => name ? this._filterCity(name) : this.cities.slice())
                    );
                })
            }
        }
    }
    
    getTravelLst(city, $event)
    {
        if ($event.isUserInput)
        {
            this.custTravel = "";
            this.paymentMode = "";
            this.travelLst = [];
            this.custCity = city;
            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.pageSize = 200;
            this.lazyCriteria.paramObj ={
                "travelDestAdd.addState" : this.custState,
                "travelDestAdd.addCity" : this.custCity
            }
            this.doHttpPost(this.API_FOR_GET_TRAVEL_RATE, this.lazyCriteria, true).subscribe(data=>{
                data = data.response;
                console.log(data);
                this.travelLst = data;
            })
        }
    }
    
    getInitTravelLst(city)
    {
        this.travelLst = [];
        this.custCity = city;
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 200;
        this.lazyCriteria.paramObj ={
            "travelDestAdd.addState" : this.custState,
            "travelDestAdd.addCity" : this.custCity
        }
        this.doHttpPost(this.API_FOR_GET_TRAVEL_RATE, this.lazyCriteria, true).subscribe(data=>{
            data = data.response;
            console.log(data);
            this.travelLst = data;
            if (this.custObj.userTravelRates.length != 0) {
                for (let j = 0; j < this.travelLst.length; j++) {
                    if(this.custObj.userTravelRates[0].id == this.travelLst[j].id){
                        this.custObj.userTravelRates[0] = this.travelLst[j];
                        this.selectedTravelPaymentMode = this.custObj.userTravelRates[0].travelPayMode;
                    }
                }
            }
        })
    }
    
    selectedTravelPaymentMode = "";
    paymentMode = "Paid";
    selectedDeliveryLocation($event, ref){
        if ($event.isUserInput)
        {
            console.log(ref);
            this.custTravel = ref;
            this.custObj.userTravelRates[0] = ref;
            this.selectedTravelPaymentMode = ref.travelPayMode;
            this.isByHand = false;
        }
    }
    
    selectedPaymentMode(result, $event) {
        if ($event.isUserInput) {
            if (result == "ToPay") {
                this.paymentMode = "ToPay";
                this.custObj.custTravelDelivery = "ToPay";
                this.custObj.custTravelPayMode = "ToPay";
            }

            if (result == "Paid") {
                this.paymentMode = "Paid";
                this.custObj.custTravelDelivery = "Paid";
                this.custObj.custTravelPayMode = "Paid";
            }
        }
    }
    
    deliveryByHand(event) {
        if (event.target.checked) {
            this.isByHand = true;
            this.custTravel = [];
            this.v_custTravel = "";
        }
    }

}
