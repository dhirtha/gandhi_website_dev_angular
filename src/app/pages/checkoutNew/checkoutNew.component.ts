import {Component, OnInit, ViewChild, Injector} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {AppService} from '../../app.service';
import {Router, ActivatedRoute} from '@angular/router';
import {MasterProvider} from '../../utility/MasterProvider';
import {AuthService} from '../../utility/auth-service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {startWith} from 'rxjs/operators';
import {map} from 'rxjs/internal/operators/map';
import {LazyLoadRequest} from '../../request/LazyLoadRequest';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';
import {WebSocketAPI} from '../../utility/WebSocketAPI';
import {NgxSpinnerService} from 'ngx-spinner';
import {TravelMstNew} from '../../pojos/travel-rateNew';
import {CreditOrOnlineDialog} from '../paymentMethod/paymentMethod.component';
import {DatePipe} from '@angular/common';
import {SiUtil} from '../../utility/SiUtil';
import {CustomerMst} from '../../pojos/customer';
import {LocalService} from '../../utility/LocalService';
import {CookieService} from 'ngx-cookie';

@Component({
    selector: 'app-checkoutNew',
    templateUrl: './checkoutNew.component.html',
    styleUrls: ['./checkoutNew.component.scss']
})
export class CheckoutNewComponent extends MasterProvider implements OnInit {
    isCreditCustomer: boolean = false;;
    defDelMode: any;
    lazyCriteria: LazyLoadRequest;
    @ViewChild('horizontalStepper', {static: true}) horizontalStepper: MatStepper;
    @ViewChild('verticalStepper', {static: true}) verticalStepper: MatStepper;
    billingForm: FormGroup;
    deliveryForm: FormGroup;
    paymentForm: FormGroup;
    countries = [];
    months = [];
    years = [];
    deliveryMethods = [];
    grandTotal = 0;
    expressCharges = 0;

    orderTotal = 0;
    totalAmount = 0;
    user: CustomerMst;
    
    quotationList: any[]=[];
    
    webSocketAPI: WebSocketAPI;
    greeting: any;
    name: string="Hellooooooooooooooooooooooooooooooooooooo";
    
    API_SAVE_QUOT_FROM_CART = "/api/quotationEnquiry/saveQuotFromCartForMobile";
    isAmountPaid: boolean = false;
    fullOrPartial = "Full";
    paperAmount = 0;
    paymentType = "Full";
    
    
    
    //For Customised Products.
    isCustomised: boolean = false;
    customisedTravelState: any;
    customisedTravelCity: any;
    customisedTravelWeight: any;
    customisedGst: any;
    isCustomisedByHand:boolean = false;
    v_customisedCustTravel: any;
    travelRateTotal = 0;
    selectCustomisedTravelName:any
    travelAmt = 0;
    
    standardDelDate:any;
    expressDelDate:any;
    deliveryDate:any;
    customisedDelDate:any;
    standardDeliveryMethodss = [];
    
    productDeliveryDays = 0;
    
    
    selectedTotalTravelRate: number = 0;
    selectedTravelRateKg: number = 0;

    selectedTravelPaymentMode = "";
    paymentMode = "";
    preferedTravel: TravelMstNew = new TravelMstNew();

    constructor(public appService: AppService, public formBuilder: FormBuilder,
                public router: Router, public injector: Injector, public http: HttpClient, 
                public authService: AuthService, public snackBar: MatSnackBar, public dialog: MatDialog, 
                public spinner: NgxSpinnerService, private sanitizer: DomSanitizer, 
                private paymentCredentials: ActivatedRoute, public util: SiUtil,private datePipe: DatePipe,
                private localStorage: LocalService) {
        super(injector, http, authService);
    }
    
    ngOnInit() {
        if(this.localStorage.getJsonValue('isLoggedin') == null){
            this.router.navigate(['/home']);
        }
        this.expressCharges = 0;
        console.log(this.appService.Data.cartList);
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            this.appService.Data.cartList[i].pasteType = null;
            this.appService.Data.cartList[i].uploadFile = null;
        }
        setTimeout(()=>{
            this.appService.Data = this.localStorage.getJsonValue('updatedCartObj');
            console.log(this.appService.Data);
            for (let i = 0; i < this.appService.Data.cartList.length; i++) {
                if (this.appService.Data.cartList[i].ids == null){
                    if (this.appService.Data.cartList[i].travelRate != null) {
                        this.appService.Data.cartList[i].travelRate = null;
                    }
                }
            }
            
            this.getCust();


            if (this.appService.Data.cartList.length == 0) {
            }
            else {
                this.filterStates();
                if(this.appService.Data.cartList[0].ids != null){
                    this.isCustomised = true;
                    this.setDefaultCustomisedTravel();
                    this.getPartialPayment();
                }else{
                    this.appService.Data.cartList.forEach(product => {
                        let qtyRatio = product.quantity / product.baseQuantity;
                        this.grandTotal += product.namune * product.rate * qtyRatio;
                        console.log(this.grandTotal);
                        
                        this.orderTotal = this.grandTotal;
                        this.totalAmount = this.grandTotal;
                    });
                    let originalCartObj = this.localStorage.getJsonValue('originalCartObj');
                    console.log(originalCartObj);
                    for (let i = 0; i < originalCartObj.length; i++) {
                        this.expressCharges = this.expressCharges + (originalCartObj[i].urgentRate - originalCartObj[i].rate);
                    }
                    console.log(this.appService.Data.cartList);
                    console.log(this.expressCharges);
                    this.getUser();

                }

                this.webSocketAPI = new WebSocketAPI(new CheckoutNewComponent(this.appService, this.formBuilder, this.router, this.injector, this.http, this.authService, this.snackBar, this.dialog, this.spinner, this.sanitizer, this.paymentCredentials, this.util, this.datePipe, this.localStorage),this.injector, this.http, this.authService);





                this.countries = this.appService.getCountries();
                this.months = this.appService.getMonths();
                this.years = this.appService.getYears();
                this.deliveryMethods = this.getDeliveryMethods();
                this.billingForm = this.formBuilder.group({
                    deliveryMethod: [this.deliveryMethods[0], Validators.required],
                    travel: [],

                });
                this.paymentForm = this.formBuilder.group({
                    cardHolderName: ['', Validators.required],
                    cardNumber: ['', Validators.required],
                    expiredMonth: ['', Validators.required],
                    expiredYear: ['', Validators.required],
                    cvv: ['', Validators.required]
                });
            }

        },1000)

    }
    
    getCust() {
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data: any) => {
            data = data.response;
            console.log("cust listttttttttttttttt");
            console.log(data);
            this.user = data;
            if(this.user.custCreditLimit > 0){
                this.isCreditCustomer = true;
            }
        })
    }
    
    getCustomisedDeliveryDays() {
        this.doHttpPost("/api/common/getCurrentDate", "onlyTime", false).subscribe((data: any) => {
            data = data.response;
            console.log(data);
            data = data[0];
            console.log(data.split(":")[0]);
            if (data.split(":")[0] <= 18) {
                console.log("Aaj ki Date Calculate Karna hai");

                this.doHttpPost("/api/common/getCurrentDate", "onlyDate", false).subscribe((data: any) => {
                    data = data.response;
                    data = data[0];
                    console.log(data);
                    let arr = []
                    for (let i = 0; i < this.productDeliveryDays; i++) {
                        let date = new Date(data);
                        arr.push(date.setDate(date.getDate() + i));
                    }
                    let dateArray = [];
                    for (let i = 0; i < arr.length; i++) {
                        let short = this.datePipe.transform(arr[i], "dd/MM/yyyy");
                        dateArray.push(short);
                    }
                    let obj = {
                        dates: dateArray
                    }
                    console.log(obj);
                    this.doHttpPost("/api/paymentDetail/getDates", obj, false).subscribe((data: any) => {
                        data = data.response;
                        console.log(data);
                        if (data.length != 0) {
                            this.customisedDelDate = data[data.length - 1];
                            console.log("ooooooooooooooooooooooooooooooooooooooooooooooooo");
                            console.log(this.customisedDelDate);
                        }
                    })
                })
            }
            else {
                console.log("Kal ki Date Se Calculate Karna Hai");

                this.doHttpPost("/api/common/getCurrentDate", "onlyDate", false).subscribe((data: any) => {
                    data = data.response;
                    console.log("old");
                    console.log(data);
                    data = data[0];
                    let date = new Date(data);
                    data = this.datePipe.transform(date.setDate(date.getDate() + 1), "yyyy/MM/dd");
                    console.log("new");
                    console.log(data);
                    let arr = []
                    for (let i = 0; i < this.productDeliveryDays; i++) {
                        let date = new Date(data);
                        arr.push(date.setDate(date.getDate() + i));
                    }
                    let dateArray = [];
                    for (let i = 0; i < arr.length; i++) {
                        let short = this.datePipe.transform(arr[i], "dd/MM/yyyy");
                        dateArray.push(short);
                    }
                    let obj = {
                        dates: dateArray
                    }
                    console.log(obj);
                    this.doHttpPost("/api/paymentDetail/getDates", obj, false).subscribe((data: any) => {
                        data = data.response;
                        console.log(data);
                        if (data.length != 0) {
                            this.customisedDelDate = data[data.length - 1];
                            console.log("ooooooooooooooooooooooooooooooooooooooooooooooooo");
                            console.log(this.customisedDelDate);
                        }
                    })
                })
            }
        })
    }
    
    setDefaultCustomisedTravel(){
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            "quotationNo": this.appService.Data.cartList[0].ids
        }
        this.doHttpPost("/api/quotationEnquiry/list2", this.lazyCriteria, false).subscribe((quotObj: any) =>
        {
            quotObj = quotObj.response;
            console.log("Quotation Obj ===============");
            console.log(quotObj);
//            For Getting Estimated Date of customised quotations
            this.lazyCriteria.paramObj = {
                id: quotObj[0].quotEnquiry.enqProductId
            }
            this.doHttpPost("/api/AdProductController/list", this.lazyCriteria, false).subscribe((product: any) =>
            {
                product = product.response;
                console.log("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
                console.log(product[0].prodDeleveryDays); 
                this.productDeliveryDays = parseFloat(product[0].prodDeleveryDays);
                if(quotObj[0].quotEnquiry.enqProdDeleveryDays != null){
                    if(quotObj[0].quotEnquiry.enqProdDeleveryDays > 0){
                        this.productDeliveryDays = parseFloat(quotObj[0].quotEnquiry.enqProdDeleveryDays);
                    }
                }
                console.log(this.productDeliveryDays);
                this.getCustomisedDeliveryDays();
            })
            this.orderTotal = quotObj[0].totalQuatationRate;
            this.grandTotal = quotObj[0].totalQuatationRate;
            this.customisedGst = quotObj[0].quotGstPerc;
            let travelId = quotObj[0].quotPreferdTravel.id;
            this.customisedTravelWeight = quotObj[0].quotPreferdTravel.quotTotalWeight;
            
            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.pageSize = 200;
            this.lazyCriteria.paramObj = {
                "id": travelId,
            }
            this.doHttpPost(this.API_FOR_GET_TRAVEL_RATE, this.lazyCriteria, false).subscribe((travelLst: any) => 
            {
                travelLst = travelLst.response;
                console.log(travelLst);
                if(travelLst.length != 0){
                    this.isCustomisedByHand = false;
                    this.selectCustomisedTravelName = travelLst[0].travelName;
                    let state = travelLst[0].travelDestAdd.addState;
                    let city = travelLst[0].travelDestAdd.addCity;
                    this.custState = travelLst[0].travelDestAdd.addState;
                    this.custCity = travelLst[0].travelDestAdd.addCity;
                    this.selectedCustomisedTravelPaymentMode = travelLst[0].travelPayMode;
                    this.getInitCustomisedTravelLst(state, city, travelLst[0], quotObj[0]);
                    this.getCustomisedInitCities(quotObj[0].quotCustState);
                }
                else{
                    this.isCustomisedByHand = true;
                    this.getCustomisedInitCities(quotObj[0].quotCustState);
                    this.custState = quotObj[0].quotCustState;
                    this.custCity = quotObj[0].quotCustCity;
                    let event = {
                        isUserInput: true
                    }
                    this.getTravelLst(this.custCity, event);
                    this.totalAmount = this.grandTotal;
                    console.log(this.totalAmount);
                    this.totalAmount = this.totalAmount + parseFloat((this.totalAmount * (this.customisedGst / 100)).toString());
                    if (this.totalAmount > 1000)
                    {
                        this.totalAmount = this.roundOfWith(this.totalAmount, 50);
                    }
                    else
                    {
                        this.totalAmount = this.roundOfWith(this.totalAmount, 10);
                    }
                    console.log(this.totalAmount);
                    this.orderTotal = this.totalAmount;
                }
            })
            let paymentType;
            let paymentInfo = this.paymentCredentials.queryParams.subscribe(params => {
                paymentType = params['paymentType'] || 0;
            });
            console.log("payment_Type ===  " + paymentType);
            if(paymentType == "Full"){
                this.fullOrPartial =  paymentType;
                this.paymentType = paymentType;
            }
            if(paymentType == "Partial"){
                this.fullOrPartial =  paymentType;
                this.paymentType = paymentType;
            }
        })
    }
    
    getCustomisedInitCities(state) {
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].name == state) {
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
    
    
    travelCustomisedLst = [];
    selectedCustomisedTravelPaymentMode: any;
    customisedPaymentMode: any;
    
    
    defaultPayMode:any;
    getInitCustomisedTravelLst(travelState, travelCity, selectedTravel, quotObj)
    {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 200;
        this.lazyCriteria.paramObj = {
            "travelDestAdd.addState": travelState,
            "travelDestAdd.addCity": travelCity
        }
        this.doHttpPost(this.API_FOR_GET_TRAVEL_RATE, this.lazyCriteria, false).subscribe((travelLst: any) => 
        {
            travelLst = travelLst.response;
            console.log(travelLst);
            this.travelCustomisedLst = travelLst;
            this.v_customisedCustTravel = selectedTravel.id;
            this.selectCustomisedTravelName = selectedTravel.travelName;
            this.selectedCustomisedTravelPaymentMode = selectedTravel.travelPayMode;
            this.customisedPaymentMode = quotObj.quotPreferdTravel.travelPayMode;
            this.defaultPayMode = quotObj.quotPreferdTravel.travelPayMode;
            if(quotObj.quotPreferdTravel.quotTravelAmount == 0){
                this.calculateTravelAmount(selectedTravel);
                quotObj.quotPreferdTravel.quotTravelAmount = this.travelAmt;
                console.log(this.travelAmt);
            }
            if(this.defaultPayMode == "Paid" || this.defaultPayMode == "paid"){
                this.totalAmount = this.grandTotal + quotObj.quotPreferdTravel.quotTravelAmount;
                this.travelRateTotal = quotObj.quotPreferdTravel.quotTravelAmount;
                this.selectedTotalTravelRate = this.travelRateTotal;
                this.totalAmount = this.totalAmount + parseFloat((this.totalAmount * (quotObj.quotGstPerc / 100)).toString());
                if (this.totalAmount > 1000)
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 50);
                }
                else
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 10);
                }
                console.log(this.totalAmount);
                this.orderTotal = this.totalAmount - quotObj.quotPreferdTravel.quotTravelAmount;
                console.log(this.travelRateTotal);
            }
            if(this.defaultPayMode == "ToPay" || this.defaultPayMode == "Topay"){
                console.log("ffffffffffffff");
                this.travelRateTotal = quotObj.quotPreferdTravel.quotTravelAmount;
                this.selectedTotalTravelRate = 0;
                this.totalAmount = this.grandTotal;
                this.totalAmount = this.totalAmount + parseFloat((this.totalAmount * (quotObj.quotGstPerc / 100)).toString());
                if (this.totalAmount > 1000)
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 50);
                }
                else
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 10);
                };
                this.orderTotal = this.totalAmount;
                console.log(this.travelRateTotal);
            }
            console.log(this.selectedTotalTravelRate);
        })
    }
    
    
    calculateTravelAmount(travelObj){
        
            let totalTravelWeight = this.customisedTravelWeight;

            this.isCustomisedByHand = false;
            this.selectCustomisedTravelName = travelObj.travelName;
            console.log(totalTravelWeight);
            console.log(travelObj);

            this.travelRateTotal = 0;
            do {
                if (totalTravelWeight > 30)
                {
                    this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_20_30kg;
                    totalTravelWeight = Math.round((Math.round(totalTravelWeight)) - 30)
                }
            } while (totalTravelWeight > 30)
            if (0 <= totalTravelWeight && totalTravelWeight < 5)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_1_5kg;
            }
            if (5 <= totalTravelWeight && totalTravelWeight < 10)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_5_10kg;
            }
            if (10 <= totalTravelWeight && totalTravelWeight < 20)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_10_20kg;
            }
            if (20 <= totalTravelWeight && totalTravelWeight < 30)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_20_30kg;
            }
            this.travelAmt = parseFloat(this.travelRateTotal.toFixed(2)); 
            console.log(this.travelAmt);
    }
    
    
    selectedCustomisedDeliveryLocation(i, $event, travelObj){
        if ($event.isUserInput) {
            let totalTravelWeight = this.customisedTravelWeight;

            this.isCustomisedByHand = false;
            this.selectCustomisedTravelName = travelObj.travelName;
            console.log(totalTravelWeight);
            console.log(travelObj);

            this.travelRateTotal = 0;
            do {
                if (totalTravelWeight > 30)
                {
                    this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_20_30kg;
                    totalTravelWeight = Math.round((Math.round(totalTravelWeight)) - 30)
                }
            } while (totalTravelWeight > 30)
            if (0 <= totalTravelWeight && totalTravelWeight < 5)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_1_5kg;
            }
            if (5 <= totalTravelWeight && totalTravelWeight < 10)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_5_10kg;
            }
            if (10 <= totalTravelWeight && totalTravelWeight < 20)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_10_20kg;
            }
            if (20 <= totalTravelWeight && totalTravelWeight < 30)
            {
                this.travelRateTotal = this.travelRateTotal + travelObj.travelRate_20_30kg;
            }
            this.travelRateTotal = parseFloat(this.travelRateTotal.toFixed(2));

            this.selectedTotalTravelRate = this.travelRateTotal;
            console.log(this.travelRateTotal);
            this.selectedCustomisedTravelPaymentMode = travelObj.travelPayMode;
            

            this.totalAmount = this.grandTotal + this.selectedTotalTravelRate;
            this.totalAmount = this.totalAmount + parseFloat((this.totalAmount * (this.customisedGst / 100)).toString());
            if (this.totalAmount > 1000)
            {
                this.totalAmount = this.roundOfWith(this.totalAmount, 50);
            }
            else
            {
                this.totalAmount = this.roundOfWith(this.totalAmount, 10);
            }
            this.orderTotal = this.totalAmount - this.selectedTotalTravelRate;
            
            if(this.selectedCustomisedTravelPaymentMode == "Both" || this.selectedCustomisedTravelPaymentMode == "both"){
                let event = {
                    isUserInput: true
                }
                console.log("pppppppppppppppppp");
                this.customisedPaymentMode = "Paid"
                this.selectedCustomisedPaymentMode(this.customisedPaymentMode,event);
            }
            
            //This Line Solve issue when customer gets ToPay Quotation and then at time of order he change travel eg. Baba Travel default Paid then in order report it shows ToPay. 
            if(this.selectedCustomisedTravelPaymentMode == "Paid" || this.selectedCustomisedTravelPaymentMode == "paid"){
                this.customisedPaymentMode = "Paid"
            }
        }
    }
    
    selectedCustomisedPaymentMode(result, $event){
        if ($event.isUserInput) {
            console.log(result);
            if (result == "ToPay") {
                console.log("topayyyyyyyyyyyyyyyyyyyyyyyy");
                this.totalAmount = this.grandTotal;
                this.customisedPaymentMode = "ToPay";
                this.payMode = "ToPay";
                this.selectedTotalTravelRate = 0;
                this.totalAmount = this.totalAmount + parseFloat((this.totalAmount * (this.customisedGst / 100)).toString());
                if (this.totalAmount > 1000)
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 50);
                }
                else
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 10);
                }
                this.orderTotal = this.totalAmount;
            }

            if (result == "Paid") {
                console.log("paidddddddddddddddddddddddddddddddd");
                this.selectedTotalTravelRate = this.travelRateTotal;
                this.customisedPaymentMode = "Paid";
                this.payMode = "Paid";
                this.totalAmount = this.grandTotal + this.selectedTotalTravelRate;
                this.totalAmount = this.totalAmount + parseFloat((this.totalAmount * (this.customisedGst / 100)).toString());
                if (this.totalAmount > 1000)
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 50);
                }
                else
                {
                    this.totalAmount = this.roundOfWith(this.totalAmount, 10);
                }
                this.orderTotal = this.totalAmount - this.selectedTotalTravelRate;
                this.payMode = "Paid";
            }
        }
    }
    
    
    getUser() {
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data: any) => {
            data = data.response;
            this.user = data;
            this.custState = this.user.userAddress.addState;
            this.custCity = this.user.userAddress.addCity;
            let event = {isUserInput: true}
            setTimeout(async () => {
                this.getInitCities(this.custState);
                this.getTravelLst(this.custCity, event);
            }, 1000);
        })
    }


    displayedColumns: any[] = ['Name', 'UnitPrice', 'Quantity', 'TravelAmount', 'Total', 'QuotationDetails', 'FileUpload'];
    public getDeliveryMethods() {
        let stdDelDay = 0;
        let expDelDay = 0;
        for (let i = 1; i < this.appService.Data.cartList.length; i++) {
            if (parseFloat(this.appService.Data.cartList[i - 1].deliveryDays) > parseInt(this.appService.Data.cartList[i].deliveryDays)) {
                stdDelDay = parseFloat(this.appService.Data.cartList[i - 1].deliveryDays);
                if (stdDelDay < parseFloat(this.appService.Data.cartList[i - 1].deliveryDays)) {
                    stdDelDay = parseFloat(this.appService.Data.cartList[i - 1].deliveryDays);
                }
            } else {
                if (stdDelDay < parseFloat(this.appService.Data.cartList[i].deliveryDays)) {
                    stdDelDay = parseFloat(this.appService.Data.cartList[i].deliveryDays);
                }
            }
            if (parseFloat(this.appService.Data.cartList[i - 1].urgentDeliveryDays) > parseInt(this.appService.Data.cartList[i].urgentDeliveryDays)) {
                if (expDelDay < parseFloat(this.appService.Data.cartList[i - 1].urgentDeliveryDays)) {
                    expDelDay = parseFloat(this.appService.Data.cartList[i - 1].urgentDeliveryDays);
                }
            } else {
                if (expDelDay < parseFloat(this.appService.Data.cartList[i].urgentDeliveryDays)) {
                    expDelDay = parseFloat(this.appService.Data.cartList[i].urgentDeliveryDays);
                }
            }
        }
        if (this.appService.Data.cartList.length == 1) {
            stdDelDay = parseFloat(this.appService.Data.cartList[0].deliveryDays);
            expDelDay = parseFloat(this.appService.Data.cartList[0].urgentDeliveryDays);
        }
        
        // For Standard Delivery Date
        this.doHttpPost("/api/common/getCurrentDate", "onlyTime", false).subscribe((data: any) => {
            data = data.response;
            console.log(data);
            data = data[0];
            console.log(data.split(":")[0]);
            if (data.split(":")[0] <= 18) {
                console.log("Aaj ki Date Calculate Karna hai");

                this.doHttpPost("/api/common/getCurrentDate", "onlyDate", false).subscribe((data: any) => {
                    data = data.response;
                    data = data[0];
                    console.log(data);
                    let arr = []
                    for (let i = 0; i < stdDelDay; i++) {
                        let date = new Date(data);
                        arr.push(date.setDate(date.getDate() + i));
                    }
                    let dateArray = [];
                    for (let i = 0; i < arr.length; i++) {
                        let short = this.datePipe.transform(arr[i], "dd/MM/yyyy");
                        dateArray.push(short);
                    }
                    let obj = {
                        dates: dateArray
                    }
                    console.log(obj);
                    this.doHttpPost("/api/paymentDetail/getDates", obj, false).subscribe((data: any) => {
                        data = data.response;
                        console.log(data);
                        if (data.length != 0) {
                            this.standardDelDate = data[data.length - 1];
                            console.log(this.standardDelDate);
                            this.standardDeliveryMethodss[0] = {value: 'standard', name: 'Standard Delivery', desc: '0.00 / Dispatch ', dispatchDt: this.standardDelDate}
                            this.defDelMode = this.standardDeliveryMethodss[0];
                            this.billingForm.value.deliveryMethod = this.standardDeliveryMethodss[0];
                        }
                    })
                })
            }
            else {
                console.log("Kal ki Date Se Calculate Karna Hai");

                this.doHttpPost("/api/common/getCurrentDate", "onlyDate", false).subscribe((data: any) => {
                    data = data.response;
                    console.log("old");
                    console.log(data);
                    data = data[0];
                    let date = new Date(data);
                    data = this.datePipe.transform(date.setDate(date.getDate() + 1), "yyyy/MM/dd");
                    console.log("new");
                    console.log(data);
                    let arr = []
                    for (let i = 0; i < stdDelDay; i++) {
                        let date = new Date(data);
                        arr.push(date.setDate(date.getDate() + i));
                    }
                    let dateArray = [];
                    for (let i = 0; i < arr.length; i++) {
                        let short = this.datePipe.transform(arr[i], "dd/MM/yyyy");
                        dateArray.push(short);
                    }
                    let obj = {
                        dates: dateArray
                    }
                    console.log(obj);
                    this.doHttpPost("/api/paymentDetail/getDates", obj, false).subscribe((data: any) => {
                        data = data.response;
                        console.log(data);
                        if (data.length != 0) {
                            this.standardDelDate = data[data.length - 1];
                            console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq");
                            console.log(this.standardDelDate);
                            this.standardDeliveryMethodss[0] = {value: 'standard', name: 'Standard Delivery', desc: '0.00 / Dispatch ', dispatchDt: this.standardDelDate}
                            this.defDelMode = this.standardDeliveryMethodss[0];
                            this.billingForm.value.deliveryMethod = this.standardDeliveryMethodss[0];
                        }
                    })
                })
            }
        })
        // For Express Delivery Date
        this.doHttpPost("/api/common/getCurrentDate", "onlyTime", false).subscribe((data: any) => {
            data = data.response;
            console.log(data);
            data = data[0];
            console.log(data.split(":")[0]);
            if (data.split(":")[0] <= 18) {
                console.log("Aaj ki Date Calculate Karna hai");

                this.doHttpPost("/api/common/getCurrentDate", "onlyDate", false).subscribe((data: any) => {
                    data = data.response;
                    data = data[0];
                    console.log(data);
                    let arr = []
                    for (let i = 0; i < expDelDay; i++) {
                        let date = new Date(data);
                        arr.push(date.setDate(date.getDate() + i));
                    }
                    let dateArray = [];
                    for (let i = 0; i < arr.length; i++) {
                        let short = this.datePipe.transform(arr[i], "dd/MM/yyyy");
                        dateArray.push(short);
                    }
                    let obj = {
                        dates: dateArray
                    }
                    console.log(obj);
                    this.doHttpPost("/api/paymentDetail/getDates", obj, false).subscribe((data: any) => {
                        data = data.response;
                        console.log(data);
                        if (data.length != 0) {
                            this.expressDelDate = data[data.length - 1];
                            console.log(this.expressDelDate);
                            this.standardDeliveryMethodss[1] = {value: 'express', name: 'Express Delivery', desc: this.expressCharges + '₹ / Dispatch ', dispatchDt: this.expressDelDate}
                        }
                    })
                })
            }
            else {
                console.log("Kal ki Date Se Calculate Karna Hai");

                this.doHttpPost("/api/common/getCurrentDate", "onlyDate", false).subscribe((data: any) => {
                    data = data.response;
                    console.log("old");
                    console.log(data);
                    data = data[0];
                    let date = new Date(data);
                    data = this.datePipe.transform(date.setDate(date.getDate() + 1), "yyyy/MM/dd");
                    console.log("new");
                    console.log(data);
                    let arr = []
                    for (let i = 0; i < expDelDay; i++) {
                        let date = new Date(data);
                        arr.push(date.setDate(date.getDate() + i));
                    }
                    let dateArray = [];
                    for (let i = 0; i < arr.length; i++) {
                        let short = this.datePipe.transform(arr[i], "dd/MM/yyyy");
                        dateArray.push(short);
                    }
                    let obj = {
                        dates: dateArray
                    }
                    console.log(obj);
                    this.doHttpPost("/api/paymentDetail/getDates", obj, false).subscribe((data: any) => {
                        data = data.response;
                        console.log(data);
                        if (data.length != 0) {
                            this.expressDelDate = data[data.length - 1];
                            console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
                            console.log(this.expressDelDate);
                            this.standardDeliveryMethodss[1] = {value: 'express', name: 'Express Delivery', desc: this.expressCharges + '₹ / Dispatch ', dispatchDt: this.expressDelDate}
                        }
                    })
                })
            }
        })
//        return [
//            {value: 'standard', name: 'Standard Delivery', desc: '0.00 / Dispatch ' },
//            {value: 'express', name: 'Express Delivery', desc: this.expressCharges + '₹ / Dispatch '}
//        ]
        return this.standardDeliveryMethodss
    }

    deliveryType: any;
    deliveryMode = "Standard Delivery";
    deliveryAmount = 0;
    deliveryMethod(Obj) {
        console.log(this.expressCharges);
        console.log(this.grandTotal);
        this.deliveryType = Obj.value;
        if (this.deliveryType == "express") {
            this.util.toastIAccept().then(data=>{
                console.log(this.selectedTotalTravelRate);
                this.deliveryType = "Express";
                this.deliveryMode = "Express Delivery";
                this.deliveryAmount = this.expressCharges;
                this.totalAmount = this.grandTotal + this.expressCharges + this.selectedTotalTravelRate;
                if (this.payMode == "ToPay") {
                    this.totalAmount = this.expressCharges + this.grandTotal;
//                    this.totalAmount = this.totalAmount + this.expressCharges;
                    
                }
            })
        }
        else {
                console.log(this.selectedTotalTravelRate);
            this.deliveryType = null;
            this.deliveryMode = "Standard Delivery";
            this.deliveryAmount = 0;
            this.totalAmount = this.grandTotal + this.selectedTotalTravelRate;
            if (this.payMode == "ToPay") {
                this.totalAmount = this.grandTotal;
            }
        }
    }

    public save(obj: any) {}
    public update(obj: any) {}
    public findById(objId: any) {}
    public findAll() {}
    public deleteById(obj: any) {}
    public defunctById(obj: any) {}


    stateCtrl = new FormControl();
    filteredState: Observable<string[]>;
    cityCtrl = new FormControl();
    filteredCity: Observable<string[]>;
    custState: any;
    custCity: any;
    custTravel: any;
    v_custTravel: any;
    travelLst: any;
    API_FOR_GET_TRAVEL_RATE = "/api/travelRate/list";

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
    filterCities(Obj: any, event: any) {
        if (event.isUserInput) {
            this.getCityList(Obj.id).then((list: any[]) => {
                this.cities = list;
                this.custCity = ""
                this.custTravel = "";
                this.travelLst = [];
                this.selectedTravelPaymentMode = "";
                this.totalAmount = this.grandTotal;
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

    getInitCities(state) {
        for (let i = 0; i < this.states.length; i++) {
            if (this.states[i].name == state) {
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

    count = 1;
    getTravelLst(city, $event) {
        if ($event.isUserInput) {
            this.custTravel = "";
            this.travelLst = [];
            this.selectedTravelPaymentMode = "";
            this.totalAmount = this.grandTotal;
            this.custCity = city;
            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.pageSize = 200;
            this.lazyCriteria.paramObj = {
                "travelDestAdd.addState": this.custState,
                "travelDestAdd.addCity": this.custCity
            }
            this.doHttpPost(this.API_FOR_GET_TRAVEL_RATE, this.lazyCriteria, true).subscribe((data:any) => {
                data = data.response;
                console.log(data);
                this.travelLst = data;
                this.travelCustomisedLst = data;
                if (typeof this.user != "undefined"){
                    if (this.user.userTravelRates.length != 0) {
                        for (let j = 0; j < this.travelLst.length; j++) {
                            if(this.user.userTravelRates[0].id == this.travelLst[j].id){
                                this.user.userTravelRates[0] = this.travelLst[j];
                            }
                        }
                    }
                    console.log(this.user);
                    //Whenever user have by default any travel in his object then below code works
                    if (this.user.userTravelRates.length != 0) {
                        let event = {isUserInput:true}
                        this.v_custTravel = this.user.userTravelRates[0].id;
                        this.selectedTravelPaymentMode = this.user.userTravelRates[0].custTravelPayMode;
//                        this.initSelectedDeliveryLocation(this.user.userTravelRates[0]);
                        this.selectedDeliveryLocation(this.user.userTravelRates[0], event);
                    }
                    if(this.user.custTravelPayMode == "By Hand" && this.count==1){
                        this.isByHand = true;
                        this.paymentMode = "By Hand";
                        this.count = 2;
                    }
                    if(this.user.custTravelPayMode == "ToPay" || this.user.custTravelPayMode == "Topay"){
                        this.isByHand = false;
                        this.paymentMode = "ToPay";
                    }
                    if(this.user.custTravelPayMode == "Paid"){
                        this.isByHand = false;
                        this.paymentMode = "Paid";
                    }
                }
            })
        }
    }

    
    getEnvelopeOpenSize(length: string, breadth: string) {
        let envelopeSize: any;
        return new Promise((resolve, reject) => {
            this.lazyCriteria = new LazyLoadRequest();
            this.lazyCriteria.paramObj = {
                prodSizeL: parseFloat(length),
                prodSizeB: parseFloat(breadth)
            }
            this.doHttpPost("/api/envelope/list", this.lazyCriteria, true).forEach((envelopeSizeList: any) => {
                envelopeSizeList = envelopeSizeList.response;
                if (envelopeSizeList.length != 0) {
                    resolve(envelopeSizeList[0].envelopeOpenSizeL + "X" + envelopeSizeList[0].envelopeOpenSizeB);
                }
                else {
                    resolve(length + "X" + breadth);
                }
            })
        })
    }


    


    selectedDeliveryLocation(obj, event) {
        console.log(event);
        console.log(obj);
        console.log("###################################################################################################################################################################################################################################################################################");
        if (event.isUserInput) {
            console.log(obj);
            console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            this.custTravel = obj;
            this.isByHand = false;
            this.selectedTravelPaymentMode = obj.travelPayMode;
            this.preferedTravel.id = obj.id;
            this.preferedTravel.travelName = obj.travelName;
            
            console.log(this.selectedTravelPaymentMode);
            if (this.selectedTravelPaymentMode == "Paid" || this.selectedTravelPaymentMode == "paid") {
                this.paymentMode = "Paid";
                this.payMode = "Paid";
            }
            if (this.selectedTravelPaymentMode == "ToPay" || this.selectedTravelPaymentMode == "Topay") {
                this.totalAmount = this.grandTotal;
                this.selectedTotalTravelRate = 0;
                this.paymentMode = "ToPay";
                this.payMode = "ToPay";
                if (this.deliveryType == "express" || this.deliveryType == "Express") {
                    this.totalAmount = this.expressCharges + this.totalAmount;
                }
                return false;
            }
            if (obj.travelPayMode == "Paid" || obj.travelPayMode == "paid") {
                this.paymentMode = obj.travelPayMode;
                this.payMode = obj.travelPayMode;
            }
            if (this.selectedTravelPaymentMode == "Both" || this.selectedTravelPaymentMode == "both") {
                this.paymentMode = this.user.custTravelPayMode;
                this.payMode = this.user.custTravelPayMode;
                console.log(this.user);
            }
            if (obj.travelPayMode == "ToPay" || obj.travelPayMode == "Topay") {
                this.paymentMode = obj.travelPayMode;
                this.payMode = obj.travelPayMode;
                return false;
            }
                        
            this.selectedTravelRate(obj);
        }
    }

    travelRateKg = [];
    async selectedTravelRate(travelObj) {
        this.travelRateKg = [];
        this.selectedTravelRateKg = 0;
        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            console.log(this.appService.Data.cartList[i]);
            if (this.appService.Data.cartList[i].ids == null) {
                if (this.appService.Data.cartList[i].productName != "Bookwork"){
                    this.grandTotal = 0;
//                    this.expressCharges = 0;
                    this.appService.Data.cartList.forEach(product => {
                        let qtyRatio = product.quantity / product.baseQuantity;
                        this.grandTotal += product.namune * product.rate * qtyRatio;
//                        this.grandTotal += product.namune * product.rate;
                        console.log(this.grandTotal);
                        this.totalAmount = this.grandTotal;
                    });

                    console.log(this.appService.Data.cartList);
                    let length = 0;
                    let breadth = 0;
                    if(this.appService.Data.cartList[i].productName == "Envelope - Office" || this.appService.Data.cartList[i].productName == "Envelope - Wedding"){
                        let envelopeOpenSize: any = await this.getEnvelopeOpenSize(this.appService.Data.cartList[i].size.split("X")[0].toString(), this.appService.Data.cartList[i].size.split("X")[1].toString())
                        length = parseFloat(envelopeOpenSize.split("X")[0]);
                        breadth = parseFloat(envelopeOpenSize.split("X")[1]);
                    }else{
                        length = parseFloat(this.appService.Data.cartList[i].size.split("X")[0]);
                        breadth = parseFloat(this.appService.Data.cartList[i].size.split("X")[1]);
                    }
                    let gsm = parseFloat(this.appService.Data.cartList[i].gsm);
                    let quantity = parseFloat(this.appService.Data.cartList[i].quantity.toString());
                    let namune = parseFloat(this.appService.Data.cartList[i].namune.toString());
                    
                    let sheeter = 1;
                    if(this.appService.Data.cartList[i].productName == "Calendar - Patti Tinning" || this.appService.Data.cartList[i].productName == "Calendar - Wiro Hanging" || this.appService.Data.cartList[i].productName == "Calendar - Table Wiro"){
                        if(this.appService.Data.cartList[i].postpress != null){
                            var matches = this.appService.Data.cartList[i].postpress.match(/\d+/g);
                            if (matches != null) {
                                sheeter = this.extractNumbersFromString(this.appService.Data.cartList[i].postpress);
                            }
                        }
                    }
                    
                    this.selectedTravelRateKg = this.selectedTravelRateKg + (((((length * breadth * gsm) / 3100) / 500) * quantity) * namune * sheeter);
                    let weight = Math.round((((((length * breadth * gsm) / 3100) / 500) * quantity) * namune * sheeter));
                    if (weight == 0){
                        this.travelRateKg.push(1)
                    }else{
                        this.travelRateKg.push(weight)
                    }
                    console.log(Math.round((((((length * breadth * gsm) / 3100) / 500) * quantity) * namune * sheeter)));
                }
                else{
                    this.selectedTravelRateKg = parseFloat(this.appService.Data.cartList[i].postpress);
                    this.travelRateKg.push(this.selectedTravelRateKg);
                }
            }
            else{
                this.travelRateKg.push(0);
            }
        }
        this.selectedTravelRateKg = (Math.round(this.selectedTravelRateKg) + 1);
        console.log(this.selectedTravelRateKg);
        this.selectedApplyTravelRate(travelObj);
    }

    selectedApplyTravelRate(travelObj) {
        console.log(this.travelRateKg);

        let totalTravelWeight = 0;

        for (let i = 0; i < this.travelRateKg.length; i++) {
            totalTravelWeight = totalTravelWeight + this.travelRateKg[i];
        }

        console.log(totalTravelWeight);

        let travelRateTotal = 0;
        do {
            if (totalTravelWeight > 30) {
                travelRateTotal = travelRateTotal + travelObj.travelRate_20_30kg;
                totalTravelWeight = Math.round((Math.round(totalTravelWeight)) - 30)
            }
        } while (totalTravelWeight > 30)
        if (0 <= totalTravelWeight && totalTravelWeight < 5) {
            travelRateTotal = travelRateTotal + travelObj.travelRate_1_5kg;
        }
        if (5 <= totalTravelWeight && totalTravelWeight < 10) {
            travelRateTotal = travelRateTotal + travelObj.travelRate_5_10kg;
        }
        if (10 <= totalTravelWeight && totalTravelWeight < 20) {
            travelRateTotal = travelRateTotal + travelObj.travelRate_10_20kg;
        }
        if (20 <= totalTravelWeight && totalTravelWeight <= 30) {
            travelRateTotal = travelRateTotal + travelObj.travelRate_20_30kg;
        }
        travelRateTotal = parseFloat(travelRateTotal.toFixed(2));

        console.log(travelRateTotal);
        
        this.selectedTotalTravelRate = travelRateTotal;

        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
            if (this.appService.Data.cartList[i].travelRate != null) {
                this.selectedTotalTravelRate = this.selectedTotalTravelRate + this.appService.Data.cartList[i].travelRate;
            }
        }
        console.log(this.travelCharges);
        
        this.travelCharges = this.selectedTotalTravelRate;


        this.totalAmount = this.grandTotal + this.selectedTotalTravelRate;
        
        if (this.payMode == "ToPay" || this.payMode == "Topay") {
            this.totalAmount = this.grandTotal;
            this.selectedTotalTravelRate = 0;
        }

        if (this.deliveryType == "express" || this.deliveryType == "Express") {
            this.totalAmount = this.expressCharges + this.totalAmount;
        }
        
        
        console.log(this.selectedTotalTravelRate);

    }
    payMode = "";
    travelCharges = 0;
    selectedPaymentMode(result, $event) {
        if ($event.isUserInput) {
            console.log(result);
            if (result == "ToPay") {
                //                this.travelCharges = this.selectedTotalTravelRate;
                this.totalAmount = this.grandTotal;
                this.paymentMode = "ToPay";
                this.payMode = "ToPay";
                if (this.deliveryType == "Express") {
//                    this.totalAmount = this.expressCharges;
                    this.totalAmount = this.totalAmount + this.expressCharges;
                }
                this.selectedTotalTravelRate = 0;

            }

            if (result == "Paid") {
                this.selectedTotalTravelRate = this.travelCharges;
                this.totalAmount = this.grandTotal + this.selectedTotalTravelRate;
                this.paymentMode = "Paid";
                this.payMode = "Paid";
                if (this.deliveryType == "Express") {
//                    this.totalAmount = this.expressCharges + this.selectedTotalTravelRate;
                    this.totalAmount = this.expressCharges + this.totalAmount;
                }
            }
        }
    }
    isByHand = false;
    deliveryByHand(event,valid?) {
        if (event.target.checked) {
            this.isByHand = true;
            this.custTravel = "";
            this.v_custTravel = "";
            this.selectedTravelPaymentMode = "";
            this.selectedTotalTravelRate = 0;
            this.paymentMode = "By Hand";
            console.log(this.appService.Data.cartList);

            this.grandTotal = 0;
//            this.expressCharges = 0;
            this.appService.Data.cartList.forEach(product => {
                let qtyRatio = product.quantity / product.baseQuantity;
                this.grandTotal += product.namune * product.rate * qtyRatio;
                this.totalAmount = this.grandTotal;
            });


            if (this.deliveryMode == "Express Delivery") {
                this.totalAmount = this.grandTotal + this.expressCharges;
            }

        }
    }


    
//    initSelectedDeliveryLocation(Obj) {
//        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//        console.log(Obj);
//        this.preferedTravel.id = Obj.id;
//        this.preferedTravel.travelName = Obj.travelName;
//        this.custTravel = Obj;
//        this.isByHand = false;
//        this.selectedTravelPaymentMode = Obj.travelPayMode;
//        if (this.selectedTravelPaymentMode == "Paid" || this.selectedTravelPaymentMode == "paid") {
//            this.paymentMode = "Paid";
//        }
//        if (this.selectedTravelPaymentMode == "ToPay" || this.selectedTravelPaymentMode == "Topay") {
//            this.paymentMode = "ToPay";
//            return false;
//        }
//        if (Obj.travelPayMode == "ToPay" || Obj.travelPayMode == "Topay") {
//            this.paymentMode = Obj.travelPayMode;
//            return false;
//        }
//        if (this.selectedTravelPaymentMode == "Both" || this.selectedTravelPaymentMode == "both") {
//            if(this.user.custTravelDelivery != null){
//                this.paymentMode = this.user.custTravelDelivery;
//            }else{
//                this.paymentMode = "Paid";
//            }
//        }
//        this.preferedTravel.id = Obj.id;
//        this.preferedTravel.travelName = Obj.travelName;
//        console.log(this.preferedTravel);
//        this.initSelectedTravelRate(Obj);
//    }
//
//    async initSelectedTravelRate(Obj) {
//        this.travelRateKg = [];
//        this.selectedTravelRateKg = 0;
//        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
//            console.log(this.appService.Data.cartList[i]);
//            if (this.appService.Data.cartList[i].ids == null) {
//                if (this.appService.Data.cartList[i].productName != "Bookwork"){
//                    this.grandTotal = 0;
//                    this.appService.Data.cartList.forEach(product => {
//                        let qtyRatio = product.quantity / product.baseQuantity;
//                        this.grandTotal += product.namune * product.rate * qtyRatio;
//                        console.log(this.grandTotal);
//                        this.totalAmount = this.grandTotal;
//                    });
//
//                    console.log(this.appService.Data.cartList);
//                    let length = 0;
//                    let breadth = 0;
//                    if(this.appService.Data.cartList[i].productName == "Envelope - Office" || this.appService.Data.cartList[i].productName == "Envelope - Wedding"){
//                        let envelopeOpenSize: any = await this.getEnvelopeOpenSize(this.appService.Data.cartList[i].size.split("X")[0].toString(), this.appService.Data.cartList[i].size.split("X")[1].toString())
//                        length = parseFloat(envelopeOpenSize.split("X")[0]);
//                        breadth = parseFloat(envelopeOpenSize.split("X")[1]);
//                    }else{
//                        length = parseFloat(this.appService.Data.cartList[i].size.split("X")[0]);
//                        breadth = parseFloat(this.appService.Data.cartList[i].size.split("X")[1]);
//                    }
//                    let gsm = parseFloat(this.appService.Data.cartList[i].gsm);
//                    let quantity = parseFloat(this.appService.Data.cartList[i].quantity.toString());
//                    let namune = parseFloat(this.appService.Data.cartList[i].namune.toString());
//                    let sheeter = 1;
//                    if(this.appService.Data.cartList[i].productName == "Calendar - Patti Tinning" || this.appService.Data.cartList[i].productName == "Calendar - Wiro Hanging" || this.appService.Data.cartList[i].productName == "Calendar - Table Wiro"){
//                        if(this.appService.Data.cartList[i].postpress != null){
//                            var matches = this.appService.Data.cartList[i].postpress.match(/\d+/g);
//                            if (matches != null) {
//                                sheeter = this.extractNumbersFromString(this.appService.Data.cartList[i].postpress);
//                            }
//                        }
//                    }
//                    this.selectedTravelRateKg = this.selectedTravelRateKg + (((((length * breadth * gsm) / 3100) / 500) * quantity) * namune * sheeter);
//                    let weight = Math.round((((((length * breadth * gsm) / 3100) / 500) * quantity) * namune * sheeter));
//                    if (weight == 0){
//                        this.travelRateKg.push(1)
//                    }else{
//                        this.travelRateKg.push(weight)
//                    }
//                    
//                }
//                else{
//                    this.selectedTravelRateKg = parseFloat(this.appService.Data.cartList[i].postpress);
//                    this.travelRateKg.push(this.selectedTravelRateKg);
//                }
//            }
//            else{
//                this.travelRateKg.push(0);
//            }
//        }
//        if (this.appService.Data.cartList[0].ids == null) {
//            this.selectedTravelRateKg = (Math.round(this.selectedTravelRateKg) + 1);
//            this.initSelectedApplyTravelRate(Obj);
//        }
//    }
//
//    initSelectedApplyTravelRate(Obj) {
//
//        let totalTravelWeight = 0;
//
//        for (let i = 0; i < this.travelRateKg.length; i++) {
//            totalTravelWeight = totalTravelWeight + this.travelRateKg[i];
//        }
//
//        console.log(totalTravelWeight);
//
//        let travelRateTotal = 0;
//        do {
//            if (totalTravelWeight > 30) {
//                travelRateTotal = travelRateTotal + Obj.travelRate_20_30kg;
//                totalTravelWeight = Math.round((Math.round(totalTravelWeight)) - 30)
//            }
//        } while (totalTravelWeight > 30)
//        if (0 <= totalTravelWeight && totalTravelWeight < 5) {
//            travelRateTotal = travelRateTotal + Obj.travelRate_1_5kg;
//        }
//        if (5 <= totalTravelWeight && totalTravelWeight < 10) {
//            travelRateTotal = travelRateTotal + Obj.travelRate_5_10kg;
//        }
//        if (10 <= totalTravelWeight && totalTravelWeight < 20) {
//            travelRateTotal = travelRateTotal + Obj.travelRate_10_20kg;
//        }
//        if (20 <= totalTravelWeight && totalTravelWeight <= 30) {
//            travelRateTotal = travelRateTotal + Obj.travelRate_20_30kg;
//        }
//        travelRateTotal = parseFloat(travelRateTotal.toFixed(2));
//
//        console.log(travelRateTotal);
//
//        this.selectedTotalTravelRate = travelRateTotal;
//
//        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
//            if (this.appService.Data.cartList[i].ids != null) {
//                this.selectedTotalTravelRate = this.selectedTotalTravelRate + this.appService.Data.cartList[i].travelRate;
//            }
//        }
//        
//        this.travelCharges = this.selectedTotalTravelRate;
//
//        
//        this.totalAmount = this.grandTotal + this.selectedTotalTravelRate;
//        console.log(this.totalAmount);
//
//        if (this.deliveryType == "express" || this.deliveryType == "Express") {
//            this.totalAmount = this.expressCharges + this.selectedTotalTravelRate;
//        }
//
//        console.log(this.selectedTotalTravelRate);
//        console.log(this.paymentMode);
//        if (this.selectedTravelPaymentMode == "Both" || this.selectedTravelPaymentMode == "both") {
//            this.initSelectedPaymentMode(this.paymentMode);
//        }
//
//    }
//
//
//    initSelectedPaymentMode(result) {
//        console.log(result);
//        if (result == "ToPay") {
//            this.totalAmount = this.grandTotal;
//            this.paymentMode = "ToPay";
//            this.payMode = "ToPay";
//            if (this.deliveryType == "Express") {
////                this.totalAmount = this.expressCharges;
//                this.totalAmount = this.grandTotal + this.expressCharges;
//            }
//            this.selectedTotalTravelRate = 0;
//
//        }
//
//        if (result == "Paid") {
//            this.selectedTotalTravelRate = this.travelCharges;
//            this.totalAmount = this.grandTotal + this.selectedTotalTravelRate;
//            this.paymentMode = "Paid";
//            this.payMode = "Paid";
//            if (this.deliveryType == "Express") {
//                this.totalAmount = this.grandTotal + this.selectedTotalTravelRate + this.expressCharges;
//            }
//        }
//    }
    
    saveQuotation() {
        console.log(this.customisedDelDate);
        let dispatchInfo:any = {}
        let amounts:any = {}
        amounts.orderTotal = this.orderTotal;
        if(!this.isCustomised){
            amounts.deliveryAmount = this.deliveryAmount;
        }else{
            amounts.deliveryAmount = null;
        }
        if(this.fullOrPartial == "Partial"){
            amounts.paperAmount = this.paperAmount; 
        }else{
            amounts.paperAmount = null; 
        }
        amounts.selectedTotalTravelRate = this.selectedTotalTravelRate;
        amounts.totalAmount = this.totalAmount;
        
        
        
        
        let byHand: boolean = false;
        if (!this.isCustomised){
            
            
            
            console.log(this.isByHand);
            if(this.deliveryMode == "Standard Delivery"){
                if(typeof this.standardDelDate == "undefined" || this.standardDelDate == null || this.standardDelDate == ""){
                    window.location.reload();
                    return;
                }
                this.deliveryDate = this.standardDelDate;
            }
            if(this.deliveryMode == "Express Delivery"){
                if (this.expressCharges == 0 ){
                    window.location.reload();
                    return;
                }
                if (typeof this.expressDelDate == "undefined" || this.expressDelDate == null || this.expressDelDate == ""){
                    window.location.reload();
                    return;
                }
                this.deliveryDate = this.expressDelDate;
            }
            if (this.isByHand){
                dispatchInfo = {
                    byHand: this.isByHand,
                    estDelDate: this.deliveryDate,
                    amounts: amounts
                }
            }
            else{
                if(this.paymentMode == "By Hand"){
                    if(!this.isByHand){
                        this.util.toastError("Please Select Travel");
                        return false;
                    }
                }
                this.preferedTravel.travelPayMode = this.paymentMode;
                dispatchInfo = {
                    byHand: byHand,
                    travel: this.preferedTravel,
                    deliveryMethod: this.deliveryMode,
                    deliveryCharges: this.deliveryAmount,
                    state: this.custState,
                    city: this.custCity,
                    estDelDate: this.deliveryDate,
                    amounts: amounts
                }
            }
            dispatchInfo.productType = "standard";
        }
        if (this.isCustomised){
            if (typeof this.customisedDelDate == "undefined" || this.customisedDelDate == null || this.customisedDelDate == ""){
                window.location.reload();
                return;
            }
            this.deliveryDate = this.customisedDelDate;
            if (this.isCustomisedByHand){
                dispatchInfo = {
                    byHand: this.isCustomisedByHand,
                    amounts: amounts,
                    estDelDate: this.customisedDelDate
                }
            }
            else{
                if(this.customisedPaymentMode == "By Hand" || this.v_customisedCustTravel == ""){
                    if(!this.isCustomisedByHand || this.v_customisedCustTravel == ""){
                        this.util.toastError("Please Select Travel");
                        return false;
                    }
                }
                this.preferedTravel.id = this.v_customisedCustTravel;
                this.preferedTravel.travelName = this.selectCustomisedTravelName;
                this.preferedTravel.travelPayMode = this.customisedPaymentMode;
                dispatchInfo = {
                    byHand: byHand,
                    travel: this.preferedTravel,
                    state: this.custState,
                    city: this.custCity,
                    amounts: amounts,
                    estDelDate: this.customisedDelDate
                }
            }
            dispatchInfo.productType = "customised";
        }
        
        const dialogRef =  this.dialog.open(CreditOrOnlineDialog, {
            data: {
                user: this.user,
                orderAmount: this.totalAmount,
                dispatchInfo: dispatchInfo
            },
            height: '600px',
            width: '380px',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
            if(result.payMode == "Close"){
            }
            else{
                this.appService.Data.deliveryMode = this.deliveryMode;
                this.appService.Data.deliveryAmount = this.deliveryAmount;
                console.log(this.appService.Data.cartList);
                console.log(this.travelRateKg);
                if (this.appService.Data.cartList.length != 0) {
                    let travelRateArray = [];
                    if (!this.isCustomised){
                        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
                            if (this.appService.Data.cartList[i].travelRate != null) {
                                this.selectedTotalTravelRate = this.selectedTotalTravelRate - this.appService.Data.cartList[i].travelRate;
                            }
                        }
                        console.log(this.selectedTotalTravelRate);
                            let totalTravelWeight = 0;
                            for (let j = 0; j < this.travelRateKg.length; j++) {
                                totalTravelWeight = totalTravelWeight + this.travelRateKg[j];
                            }
                        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
                            let travelAmt = 0;
                            if (this.appService.Data.cartList[i].travelRate != null) {
                                travelRateArray.push(Math.round(this.appService.Data.cartList[i].travelRate));
                            }
                            else{
                                if (typeof this.selectedTotalTravelRate != "undefined" && typeof totalTravelWeight != "undefined" && typeof this.travelRateKg[i] != "undefined"){
                                    travelAmt = this.selectedTotalTravelRate / totalTravelWeight * this.travelRateKg[i];
                                }
                                console.log(travelAmt);
                                if (travelAmt != 0){
                                    travelRateArray.push(Math.round(travelAmt));
                                }
                            }
                        }
                        console.log(travelRateArray);
                        if (this.paymentMode == "By Hand" || this.paymentMode == "ToPay" || this.isByHand) {
                            travelRateArray = null;
                            this.selectedTotalTravelRate = 0;
                        }
                        this.preferedTravel.travelPayMode = this.paymentMode;
                        if (this.paymentMode == "By Hand" || this.isByHand) {
                            travelRateArray = null;
                            this.selectedTotalTravelRate = 0;
                            this.preferedTravel = null;
                            this.preferedTravel = new TravelMstNew();
                            this.preferedTravel.travelPayMode = "By Hand";
                        }
                        for (let i = 0; i < this.appService.Data.cartList.length; i++) {
                            if (this.appService.Data.cartList[i].travelRate != null) {
                                this.selectedTotalTravelRate = this.selectedTotalTravelRate + this.appService.Data.cartList[i].travelRate;
                            }
                            this.appService.Data.cartList[i].pasteType = null;
                            this.appService.Data.cartList[i].uploadFile = null;
                        }
                        let obj = {
                            email: this.getSession().email,
                            cartObjs: this.appService.Data.cartList,
                            quotPreferdTravel: this.preferedTravel,
                            expressDel: this.deliveryType,
                            travelAmountArray: travelRateArray,
                            qType: "standard",
                            paymentGatewayOrderTransRefId: new Date().getTime()+"",
                            dispatchDate: this.deliveryDate
                        }
                        if (this.deliveryDate == null || this.deliveryDate == "" || typeof this.deliveryDate == "undefined"){
                            window.location.reload();
                            return;
                        }
                        console.log(obj);
                        this.appService.Data.fullOrPartial = this.fullOrPartial;
                        this.doHttpPost(this.API_SAVE_QUOT_FROM_CART, obj, true).subscribe((data: any) => {
                            data = data.response;
                            console.log("Quotation Objectttttttttttttt");
                            console.log(data);
                            this.appService.Data.quotObj = data;
                            console.log(this.appService.Data.cartList);
                            console.log(data[0].orderDetailsArr);
                            let quotNo = "";
                            for (let i = 0; i < data.length; i++) {
                            let map = new Map<string, string>(); 
                                let strArr = [];
                                for (let j = 0; j < data[i].orderDetailsArr.length; j++) {
                                    let arr = data[i].orderDetailsArr[j].split(":");
                                    if (arr[0] == "" || arr[0] == "" || arr[1] == "" || arr[1] == "" || typeof arr[0] == "undefined" || typeof arr[1] == "undefined"){
                                        arr[0] = "";
                                        arr[1] = "";
                                    }
                                    arr[1] = arr[1].replace("-FB", "");
                                    map.set(arr[0],arr[1]);
                                    let str = '<span><b>'+arr[0].fontcolor("#FF2E2E")+'</b> </span>' + arr[1];
                                    strArr.push(str);
                                }
                                console.log("mapppppppppppppppppppppppppppppppppppppppppp");
                                console.log(map); 
                                data[i].orderDetailsArr = map;
                                quotNo = quotNo + data[i].quotationNo + ",";
                            }
                            if (this.paymentMode == "By Hand") {
                                travelRateArray = null;
                                this.selectedTotalTravelRate = 0;
                            }


                            for (let i = 0; i < this.appService.Data.cartList.length; i++) {
                                this.appService.Data.cartList[i].pasteType = data[i].orderDetailsArr;
                                if (travelRateArray == null) {
                                    this.appService.Data.cartList[i].travelRate = 0;
                                } else {
                                    if (this.appService.Data.cartList[i].travelRate == null) {
                                        this.appService.Data.cartList[i].travelRate = travelRateArray[i];
                                    }
                                }
                            }
                            this.quotationList = data;
                            for (let i = 0; i < this.appService.Data.cartList.length; i++) {
                                this.appService.Data.cartList[i].uploadFile = this.quotationList[i];
                            }
                            this.appService.Data.orderType = "standard";
                            this.appService.Data.totalTravelAmount = this.selectedTotalTravelRate;
                            this.appService.Data.totalOrderAmount = this.orderTotal;
                            this.appService.Data.totalAmount = this.totalAmount;
//                            localStorage.setItem("TempQuotNo", quotNo);
                            this.localStorage.setJsonValue('TempQuotNo', quotNo);
                            if (result.payMode == "Credit Payment"){
                                this.placeCreditPartyOrder();
                            }
                            if(result.payMode == "Online Payment"){
                                this.doHttpPost("/api/setting/getActivePG", "", true).subscribe((data: any) => {
                                    data = data.response;
                                    if(data.activePG == 'PG1'){
                                        this.getCcAvenuePaymentApi(result, quotNo);
                                    }else{
                                        this.getInstaMojoPaymentApi(result, quotNo);
                                    }
                                })
                            }
                            if (result.payMode == "Wallet Payment"){
                                this.doHttpPost("/api/setting/getActivePG", "", true).subscribe((data: any) => {
                                    data = data.response;
                                    if(data.activePG == 'PG1'){
                                        this.payFromWalletOrCcAven(result, quotNo);
                                    }else{
                                        this.payFromWallet(result, quotNo);
                                    }
                                })
                            }
                            if (result.payMode == "Wallet Plus Credit Payment"){
                                this.payFromWalletAndCredit(result, quotNo);
                            }
                        })  
                    }
                    else{
                        this.lazyCriteria = new LazyLoadRequest();
                        this.lazyCriteria.paramObj = {
                            "quotationNo": this.appService.Data.cartList[0].ids
                        }
                        this.doHttpPost("/api/quotationEnquiry/list2", this.lazyCriteria, false).subscribe((quotObj: any) =>
                        {
                            quotObj = quotObj.response;
                            console.log("Quotation Obj ===============");
                            console.log(quotObj);
                            this.appService.Data.quotObj = quotObj;
                            if (this.isCustomisedByHand){
                                quotObj[0].quotPreferdTravel = new TravelMstNew();
                                this.preferedTravel.travelPayMode = "By Hand";
                                quotObj[0].totalQuotationRateWithGst = this.totalAmount;
                                quotObj[0].quotPreferdTravel.quotTotalWeight = this.customisedTravelWeight;
                            }
                            else{
                                quotObj[0].quotPreferdTravel.id = this.v_customisedCustTravel;
                                quotObj[0].quotPreferdTravel.travelName = this.selectCustomisedTravelName;
                                quotObj[0].quotPreferdTravel.travelPayMode = this.customisedPaymentMode;
                                quotObj[0].quotPreferdTravel.quotTotalWeight = this.customisedTravelWeight;
                                quotObj[0].quotPreferdTravel.quotTravelAmount = this.selectedTotalTravelRate;
                                quotObj[0].totalQuotationRateWithGst = this.totalAmount;
                            }
                            
                            if(quotObj[0].orderNo != null){
                                let obj = {
                                    userId: this.getSession().id_mongo,
                                    userCartList: []
                                }
                                this.doHttpPost("/api/auth/removeCartFrmUser", obj, true).subscribe(data => {
                                    data = data.response;
                                    console.log(data);
                                    this.localStorage.clearTokenByKey('originalCartObj');
                                    this.localStorage.clearTokenByKey('updatedCartObj');
                                    this.appService.Data.cartList.length = 0;
                                    this.appService.Data.totalPrice = 0;
                                    this.appService.Data.totalCartCount = 0;
                                    this.router.navigate(['/account/orders']);
                                    this.router.navigate(['/cart']);
                                });
                                return;
                            }


                            let obj = {
                                email: this.getSession().email,
                                quoteObj: quotObj,
                                qType: "customised",
                                paymentGatewayOrderTransRefId: new Date().getTime()+"",
                                dispatchDate: this.deliveryDate
                            }
                            console.log(obj);
                            if (this.deliveryDate == null || this.deliveryDate == "" || typeof this.deliveryDate == "undefined"){
                                window.location.reload();
                                return;
                            }
                            this.appService.Data.fullOrPartial = this.fullOrPartial;
                            this.appService.Data.paperAmount = this.paperAmount;
                            console.log(obj);
                            this.doHttpPost(this.API_SAVE_QUOT_FROM_CART, obj, false).subscribe((data: any) => 
                            {
                                data = data.response;
                                console.log("Quotation Objectttttttttttttt");
                                console.log(data);
                                console.log(this.appService.Data.cartList);
                                console.log(data[0].orderDetailsArr);
                                let quotNo = "";
                                for (let i = 0; i < data.length; i++) {
                                let map = new Map<string, string>(); 
                                    let strArr = [];
                                    for (let j = 0; j < data[i].orderDetailsArr.length; j++) {
                                        let arr = data[i].orderDetailsArr[j].split(":");
                                        if (arr[0] == "" || arr[0] == "" || arr[1] == "" || arr[1] == "" || typeof arr[0] == "undefined" || typeof arr[1] == "undefined"){
                                            arr[0] = "";
                                            arr[1] = "";
                                        }
                                        arr[1] = arr[1].replace("-FB", "");
                                        map.set(arr[0],arr[1]);
                                        let str = '<span><b>'+arr[0].fontcolor("#FF2E2E")+'</b> </span>' + arr[1];
                                        strArr.push(str);
                                    }
                                    console.log("mapppppppppppppppppppppppppppppppppppppppppp");
                                    console.log(map); 
                                    data[i].orderDetailsArr = map;
                                    quotNo = quotNo + data[i].quotationNo + ",";
                                }
                                if (this.customisedPaymentMode == "By Hand") {
                                    travelRateArray = null;
                                    this.selectedTotalTravelRate = 0;
                                }


                                this.appService.Data.cartList[0].pasteType = data[0].orderDetailsArr;
                                this.appService.Data.cartList[0].travelRate = this.selectedTotalTravelRate;
                                this.quotationList = data;
                                for (let i = 0; i < this.appService.Data.cartList.length; i++) {
                                    this.appService.Data.cartList[i].uploadFile = this.quotationList[i];
                                }
                                this.appService.Data.orderType = "customised";
                                this.appService.Data.totalTravelAmount = this.selectedTotalTravelRate;
                                this.appService.Data.totalOrderAmount = this.orderTotal;
                                this.appService.Data.totalAmount = this.totalAmount;
//                                localStorage.setItem("TempQuotNo", quotNo);
                                this.localStorage.setJsonValue('TempQuotNo', quotNo);
                                if (result.payMode == "Credit Payment"){
                                    this.placeCreditPartyOrder();
                                }
                                if(result.payMode == "Online Payment"){
                                    this.doHttpPost("/api/setting/getActivePG", "", true).subscribe((data: any) => {
                                        data = data.response;
                                        if(data.activePG == 'PG1'){
                                            this.getCcAvenuePaymentApi(result, quotNo);
                                        }else{
                                            this.getInstaMojoPaymentApi(result, quotNo);
                                        }
                                    })
                                }
                                if (result.payMode == "Wallet Payment"){
                                    this.doHttpPost("/api/setting/getActivePG", "", true).subscribe((data: any) => {
                                        data = data.response;
                                        if(data.activePG == 'PG1'){
                                            this.payFromWalletOrCcAven(result, quotNo);
                                        }else{
                                            this.payFromWallet(result, quotNo);
                                        }
                                    })
                                }
                                if (result.payMode == "Wallet Plus Credit Payment"){
                                    this.payFromWalletAndCredit(result, quotNo);
                                }
                            }, error =>
                            {
                                console.log(error);
                            })


                        })
                    }
                }
            }
        });
        
    }
    
    
    roundOfWith(value: number, roundOfBy: number) {
        if (value % roundOfBy == 0) {
            return (Math.floor(value / roundOfBy)) * roundOfBy;
        } else {
            return ((Math.floor(value / roundOfBy)) * roundOfBy) + roundOfBy;
        }
    }
    
    ccaven
    getCcAvenuePaymentApi(result?, quotNo?){
        let paymentDetail;
        let mobNo = "8605003000";
        
        if (this.isCustomised){
            if(this.fullOrPartial == "Partial"){
                paymentDetail = {
                    payeeEmail: this.user.email,
                    payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                    payeeAmt: this.paperAmount,
                    payeePhone: mobNo,
                    payeeOrderDtl: "plain",
                    mode: this.isPaymentGTMode,
                    quotNo: quotNo,
                    dispatchDate: this.deliveryDate
                }
            }
            if(this.fullOrPartial == "Full"){
                paymentDetail = {
                    payeeEmail: this.user.email,
                    payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                    payeeAmt: this.totalAmount,
                    payeePhone: mobNo,
                    payeeOrderDtl: "plain",
                    mode: this.isPaymentGTMode,
                    quotNo: quotNo,
                    dispatchDate: this.deliveryDate
                }
            }
        }else{
            paymentDetail = {
                payeeEmail: this.user.email,
                payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                payeeAmt: this.totalAmount,
                payeePhone: mobNo,
                payeeOrderDtl: "plain",
                mode: this.isPaymentGTMode,
                quotNo: quotNo,
                dispatchDate: this.deliveryDate,
                walletAmount: 0
            }
        }
        console.log(paymentDetail);
        this.doHttpPost("/api/ccAvenue/makePayment", paymentDetail, false).subscribe((data: any) =>{
            data = data.response;
            this.appService.Data.paymentUrl = this.paymentUrl;
            this.appService.Data.dispatchDate = this.deliveryDate;
            this.localStorage.clearTokenByKey('OrderData');
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            window.open(data.url+"&encRequest="+data.encRequest+"&access_code="+data.access_code,"_self");
        })
    }

    paymentUrl:any;
    getInstaMojoPaymentApi(result, quotNo){
        console.log(result.payMode);
        let paymentDetail;
        let mobNo = "8605003000";
        
        if (this.isCustomised){
            if(this.fullOrPartial == "Partial"){
                paymentDetail = {
                    payeeEmail: this.user.email,
                    payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                    payeeAmt: this.paperAmount,
                    payeePhone: mobNo,
                    payeeOrderDtl: "Printing Order",
                    mode: this.isPaymentGTMode,
                    quotNo: quotNo,
                    dispatchDate: this.deliveryDate
                }
            }
            if(this.fullOrPartial == "Full"){
                paymentDetail = {
                    payeeEmail: this.user.email,
                    payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                    payeeAmt: this.totalAmount,
                    payeePhone: mobNo,
                    payeeOrderDtl: "Printing Order",
                    mode: this.isPaymentGTMode,
                    quotNo: quotNo,
                    dispatchDate: this.deliveryDate
                }
            }
        }else{
            paymentDetail = {
                payeeEmail: this.user.email,
                payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                payeeAmt: this.totalAmount,
                payeePhone: mobNo,
                payeeOrderDtl: "Printing Order",
                mode: this.isPaymentGTMode,
                quotNo: quotNo,
                dispatchDate: this.deliveryDate,
                walletAmount: 0
            }
        }
        console.log(paymentDetail);
        this.doHttpPost("/api/InstamojoController/payment", paymentDetail, false).subscribe((data: any) =>
        {
            data = data.response;
            console.log(data);
            if(data == null){
                return false;
            }
            let uploadDriveUrl = data.paymentOptions.paymentUrl;
            console.log(data.paymentOptions.paymentUrl);
            this.paymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.paymentOptions.paymentUrl);
            this.appService.Data.paymentUrl = this.paymentUrl;
            this.appService.Data.dispatchDate = this.deliveryDate;
            this.localStorage.clearTokenByKey('OrderData');
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            this.router.navigate(['/payment'],{ replaceUrl: true, skipLocationChange: true });
        }, error =>
        {
            console.log(error);
        })
    }
    
    placeCreditPartyOrder(){
        this.appService.Data.paymentUrl = "";
        this.localStorage.clearTokenByKey('OrderData')
        this.localStorage.setJsonValue('OrderData', this.appService.Data);
         var OrderData = this.localStorage.getJsonValue('OrderData');
        this.appService.Data = OrderData;
        this.appService.Data.paymentMode = "credit";
        this.appService.Data.dispatchDate = this.deliveryDate;
        console.log(this.appService.Data);
        this.localStorage.clearTokenByKey('OrderData')
        this.localStorage.setJsonValue('OrderData', this.appService.Data);
        var OrderDatail = this.localStorage.getJsonValue('OrderData');
        console.log(OrderDatail);
        OrderDatail.fullOrPartial = "Full";
        OrderDatail.paperAmount = this.totalAmount;
        this.localStorage.setJsonValue('OrderData', this.appService.Data);
        this.router.navigate(['/paymentDetail'],{ replaceUrl: true, skipLocationChange: true });
    }
    
    payFromWallet(result, quotNo){
        if(result.paybleAmount == 0){
            this.appService.Data.paymentUrl = "";
            this.localStorage.clearTokenByKey('OrderData')
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            var OrderData = this.localStorage.getJsonValue('OrderData');
            this.appService.Data = OrderData;
            this.appService.Data.paymentMode = "wallet";
            this.appService.Data.paybleAmount = result.paybleAmount;
            this.appService.Data.adjustedAmount = result.adjustedAmount;
            this.appService.Data.walletAmount = result.walletAmount;
            this.appService.Data.dispatchDate = this.deliveryDate;
            console.log(this.appService.Data);
            this.localStorage.clearTokenByKey('OrderData')
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            this.router.navigate(['/paymentDetail'],{ replaceUrl: true, skipLocationChange: true });
        }else{
            let paymentDetail;
            let mobNo = "8605003000";

            paymentDetail = {
                payeeEmail: this.user.email,
                payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                payeeAmt: result.paybleAmount,
                payeePhone: mobNo,
                payeeOrderDtl: "Printing Order",
                mode: this.isPaymentGTMode,
                quotNo: quotNo,
                dispatchDate: this.deliveryDate,
                walletAmount: result.adjustedAmount
            }
            let obj = {
                paymentDTO: paymentDetail,
                paymentOption: "Wallet"
            }
            console.log(paymentDetail);
            this.doHttpPost("/api/InstamojoController/walletPayment", obj, false).subscribe((data: any) =>
            {
                data = data.response;
                if(data == null){
                    return false;
                }
                let uploadDriveUrl = data.paymentOptions.paymentUrl;
                console.log(data.paymentOptions.paymentUrl);
                this.paymentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.paymentOptions.paymentUrl);
                this.appService.Data.paymentUrl = this.paymentUrl;
                this.appService.Data.dispatchDate = this.deliveryDate;
                this.localStorage.clearTokenByKey('OrderData')
                this.localStorage.setJsonValue('OrderData', this.appService.Data);
                this.router.navigate(['/payment'],{ replaceUrl: true, skipLocationChange: true });
            }, error =>
            {
                console.log(error);
            })
        }
    }
    
    payFromWalletOrCcAven(result, quotNo){
        if(result.paybleAmount == 0){
            this.appService.Data.paymentUrl = "";
            this.localStorage.clearTokenByKey('OrderData')
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            var OrderData = this.localStorage.getJsonValue('OrderData');
            this.appService.Data = OrderData;
            this.appService.Data.paymentMode = "wallet";
            this.appService.Data.paybleAmount = result.paybleAmount;
            this.appService.Data.adjustedAmount = result.adjustedAmount;
            this.appService.Data.walletAmount = result.walletAmount;
            this.appService.Data.dispatchDate = this.deliveryDate;
            console.log(this.appService.Data);
            this.localStorage.clearTokenByKey('OrderData')
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            this.router.navigate(['/paymentDetail'],{ replaceUrl: true, skipLocationChange: true });
        }else{
            let paymentDetail;
            let mobNo = "8605003000";

            paymentDetail = {
                payeeEmail: this.user.email,
                payeeName: this.user.custShopName + ", " + this.user.userAddress.addCity,
                payeeAmt: result.paybleAmount,
                payeePhone: mobNo,
                payeeOrderDtl: "wallet",
                mode: this.isPaymentGTMode,
                quotNo: quotNo,
                dispatchDate: this.deliveryDate,
                walletAmount: result.adjustedAmount
            }
            
            console.log(paymentDetail);
            this.doHttpPost("/api/ccAvenue/makePayment", paymentDetail, false).subscribe((data: any) =>{
                data = data.response;
                this.appService.Data.paymentUrl = this.paymentUrl;
                this.appService.Data.dispatchDate = this.deliveryDate;
                this.localStorage.clearTokenByKey('OrderData')
                this.localStorage.setJsonValue('OrderData', this.appService.Data);
                window.open(data.url+"&encRequest="+data.encRequest+"&access_code="+data.access_code,"_self");
            })
        }
    }
    
    payFromWalletAndCredit(result, quotNo){
        if(result.paybleAmount == 0){
        }else{
            this.appService.Data.paymentUrl = "";
            this.localStorage.clearTokenByKey('OrderData')
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            var OrderData = this.localStorage.getJsonValue('OrderData');
            this.appService.Data = OrderData;
            this.appService.Data.paymentMode = "walletPlusCredit";
            this.appService.Data.paybleAmount = result.paybleAmount;
            this.appService.Data.adjustedAmount = result.adjustedAmount;
            this.appService.Data.walletAmount = result.walletAmount;
            this.appService.Data.dispatchDate = this.deliveryDate;
            this.localStorage.clearTokenByKey('OrderData')
            this.localStorage.setJsonValue('OrderData', this.appService.Data);
            this.router.navigate(['/paymentDetail'],{ replaceUrl: true, skipLocationChange: true });
        }
    }
    
    
    getPartialPayment() {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            "quotationNo": this.appService.Data.cartList[0].ids
        }
        this.doHttpPost("/api/quotationEnquiry/list2", this.lazyCriteria, false).subscribe((productCustomisedList: any) => {
            productCustomisedList = productCustomisedList.response;
            console.log(productCustomisedList);
            this.paperAmount = productCustomisedList[0].quotPaperAmt;
            if (this.paperAmount > 1000) {
                this.paperAmount = this.roundOfWith(this.paperAmount, 50);
            }
            else {
                this.paperAmount = this.roundOfWith(this.paperAmount, 10);
            }
        }, error => {
                console.log(error);
            })
    }
    
    fullPartial(payType){
        console.log(payType);
        this.fullOrPartial = payType;
        this.appService.Data.fullOrPartial = payType;
    }
    
    extractNumbersFromString(txt: string) {
        let count = 0;
        var numb = txt.match(/\d/g);
        for (let i = 0; i < numb.length; i++) {
            count = count + parseInt(numb[i]);
        }
        return count;
    }
        
    
    

}