import {Component, OnInit, Injector} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {emailValidator, matchingPasswords} from '../../../theme/utils/app-validators';
import {MasterProvider} from '../../../utility/MasterProvider';
import {AuthService} from '../../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {LazyLoadRequest} from '../../../request/LazyLoadRequest';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/internal/operators/startWith';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LocalService} from '../../../utility/LocalService';
import {RequestEncryption} from '../../../utility/RequestEncryption';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-information',
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.scss']
})
export class InformationComponent extends MasterProvider implements OnInit {
    lazyCriteria: LazyLoadRequest;
    infoForm: FormGroup;
    passwordForm: FormGroup;
    phaseTwoForm: FormGroup;
    hideConfirmPass = true;
    hideNewPass = true;
    hideNewPass1 = true;
    referenceLst = ["Other Client",
                    "Online Website",
                    "Google",
                    "Facebook",
                    "Twitter",
                    "Instagram",
                    "Hording Board",
                    "Pamphlets",
                    "Parcel in Travels",
                    "Sticker",
                    ];
    weekDay = ["No",
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
                ];
    natureOfWorkLst = ['Offset Printing',
                        'Rota Printing', 
                        'Designing',
                        'Screen Printing',
                        'Data Entry', 
                        'Typing',
                        'Scanning',
                        'Colour Printout', 
                        'Xerox', 
                        'Flex Printing',
                        'Other'];
    natureOfWork = new FormControl();
    typeOfWorkLst = ["Leaflets/Pamphlets/Handbill", 
                    "Letterhead",
                    "Poster",
                    "Cards Invitation, Wedding, Birthday",
                    "Doctor File",
                    "Certificate",
                    "Sticker",
                    "Plastic PVC Sticker",
                    "Tag/Label",
                    "Special Job Printing",
                    "Book Cover",
                    "Foam Sheet",
                    "Foam-Label",
                    "Book Work/Kitab/Brochure",
                    "Calender",
                    "Envelope-Office",
                    "Envelope-Wedding",
                    "Other",];
    typeOfWork = new FormControl();
    travelList:any;
    
    customerObj:any;
    custState:any;
    custCity:any;
                
    constructor(public formBuilder: FormBuilder, public snackBar: MatSnackBar, public injector: Injector, public  http: HttpClient, public  authService: AuthService, public router: Router, private localStorage: LocalService, private spinner: NgxSpinnerService) {
        super(injector, http, authService);   
    }

    ngOnInit() {
        console.log(this.getSession());
        this.getTravelList();
        this.filterStates();
        this.infoForm = this.formBuilder.group({
            'firmName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'firstName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'lastName': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'email': ['', Validators.compose([Validators.required, emailValidator])],
            'pincode': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(6)])],
            'buildingNo': [],
            'area': [],
            'landmark': [],
            'state': [],
            'city': [],
            'gstNo': ['', Validators.pattern("^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$")],
        });

        this.passwordForm = this.formBuilder.group({
            'currentPassword': ['', Validators.required],
            'newPassword': ['', Validators.required],
            'confirmNewPassword': ['', Validators.required]
        }, {validator: matchingPasswords('newPassword', 'confirmNewPassword')});

        this.phaseTwoForm = this.formBuilder.group({
            'clientCategory': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'referenceBy': [],
            'clientDOB': ['', Validators.compose([Validators.required])],
            'clientNickName': [],
            'weeklyHoliday': [],
            'fromWorkingHours': [],
            'toWorkingHours': [],
            'natureOfWork': [],
            'typeOfWork': [],
            'machinaries': [],
            'travelList': ['', Validators.compose([Validators.required])],
            
            'materialPacking': [],
            'whatsAppNumber': [],
            'designersNumber': [],
            'ownerNumber': [],
            'accountsDeptNumber': [],
            'alternateNumber': [],
            'landlineNumber': [],
            'accountsEmailID': ['',Validators.compose([emailValidator])],
            'designerEmailID': ['',Validators.compose([emailValidator])],
            'alternateEmailID': ['',Validators.compose([emailValidator])],
            'panNoOfOwner': ['', Validators.pattern("^[A-Za-z]{5}[0-9]{4}[A-Za-z]$")],
            'aadharNoOfOwner': ['', Validators.pattern("^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$")],
            'smswhatspplevel': [],
        });



    }
    
    getTravelList(){
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
            data = data.response;
            console.log("cust listttttttttttttttt");
            console.log(data);
            this.customerObj = data;
            this.infoForm.value.email = this.customerObj.email;
            this.getInitCities(this.customerObj.userAddress.addState);
            this.custState = this.customerObj.userAddress.addState;
            this.custCity = this.customerObj.userAddress.addCity;
            console.log(this.infoForm);
            
            
            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.paramObj = {
                "travelDestAdd.addState": data.userAddress.addState,
                "travelDestAdd.addCity": data.userAddress.addCity
            }
            this.doHttpPost(this.API_FOR_GET_TRAVEL_RATE, this.lazyCriteria, true).subscribe((travelLst: any) =>
            {
                travelLst = travelLst.response;
                console.log("travel lsttttttttttttttttt");
                console.log(travelLst);
                this.travelList = travelLst;
            })
        })
    }
    API_FOR_GET_TRAVEL_RATE = "/api/travelRate/list";
    

    public onInfoFormSubmit(values: Object): void {
        if (this.infoForm.valid) {
            this.infoForm.value.state = this.custState;
            this.infoForm.value.city = this.custCity;
            console.log(this.infoForm.value);
            this.customerObj.userAddress.addState = this.custState;
            this.customerObj.userAddress.addCity = this.custCity;
            console.log(this.customerObj);
            this.doHttpPost("/api/auth/saveUserFromCustForm", this.customerObj, true).subscribe((data:any)=>{
                data = data.response;
                console.log(data);
                if(data.message=="success"){
                    this.snackBar.open('Your account information updated successfully!', '×', {panelClass: 'success', verticalPosition: 'top', duration: 3000});
                }
            })
        }
    }
API_FOR_CHANGE_PASSWORD = "/api/auth/passwordResetByUser" 
    public onPasswordFormSubmit(values: Object): void {
        console.log(this.passwordForm);
        console.log(this.passwordForm.controls.currentPassword.status);
        console.log(this.passwordForm.controls.newPassword.status);
        console.log(this.passwordForm.controls.confirmNewPassword.status);
        if (this.passwordForm.valid) {
            if (this.passwordForm.value.currentPassword == this.passwordForm.value.confirmNewPassword){
                this.snackBar.open("New password can't same as old password", '×', {panelClass: 'error', verticalPosition: 'top', duration: 3000});
                return;
            }
            var oldPass = window.btoa(this.passwordForm.value.currentPassword);
            var reqJsonSting = {
                uid: this.getSession().id_mongo,
                newPass: this.passwordForm.value.newPassword,
                oldPass: oldPass,
                isDefaultPass: false
            }
            console.log(reqJsonSting);
            this.doHttpPost("/api/auth/passwordResetByUser", JSON.stringify(reqJsonSting), true).subscribe((responce: any) =>
            {
                responce = responce.response;
                this.snackBar.open(responce.message, '×', {panelClass: 'success', verticalPosition: 'top', duration: 3000});
                localStorage.removeItem('isLoggedin');
                localStorage.clear();
                this.localStorage.clearToken();
                this.router.navigate(['/login']);
                this.snackBar.open('Password Change Successfully.', '×', {panelClass: 'success', verticalPosition: 'top', duration: 3000});
            }, error =>
            {
                let requestEncryption = new RequestEncryption();
                let response = requestEncryption.decrypt("qaed@#4???xwscwsscawvDQervbe", error.error.response);
                response = JSON.parse(response);
                error.error = response;
                
                this.spinner.hide();
                this.snackBar.open(error.error.message, '×', {panelClass: 'error', verticalPosition: 'top', duration: 3000});
            })
            
            
            
            
            
//            console.log(this.passwordForm.value);
//            this.snackBar.open('Your password changed successfully!', '×', {panelClass: 'success', verticalPosition: 'top', duration: 3000});
        }
    }

    public onPhaseTwoFormSubmit(values: Object): void {
        if (this.phaseTwoForm.valid) {
            this.phaseTwoForm.value.natureOfWork = this.natureOfWork.value
            this.phaseTwoForm.value.typeOfWork = this.typeOfWork.value
            console.log(this.phaseTwoForm.value);
            this.snackBar.open('Your account information updated 1111111!', '×', {panelClass: 'success', verticalPosition: 'top', duration: 3000});
        }
    }
    
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
    
    keyboardKeyPress(event: any) 
    {
        const pattern = /[0-9\+\-\.\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) 
        {
            event.preventDefault();
        }
    }
    
    aadharValidation(event: any) 
    {
        let trimmed = event.target.value.replace(/\s+/g, '');
        if (trimmed.length > 16) {
          trimmed = trimmed.substr(0, 16);
        }
        let numbers = [];
        for (let i = 0; i < trimmed.length; i += 4) {
          numbers.push(trimmed.substr(i, 4));
        }
        event.target.value = numbers.join(' ');
    }
    
    
    
    
    
    
    
    
    stateCtrl = new FormControl();
    filteredState: Observable<string[]>;
    cityCtrl = new FormControl();
    filteredCity: Observable<string[]>;
    
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
                this.custCity = ""
                this.customerObj.custGstNo = "";
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
    
    getInitCities(state){
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].name == state){
                this.getCityList(this.states[i].id).then((list: any[]) => {
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
    
    
    
}
