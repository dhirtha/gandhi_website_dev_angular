import {ViewChild, Injector} from "@angular/core";
//import {ButtonComponent} from "../shared";
//import {Validator} from "./Validator";
import {FormGroup} from "@angular/forms";
//import {SiUtil} from "./SiUtil";
//import {ConnectionService} from "ngx-connection-service";
import {User, AuthService} from "./auth-service";
import {Router} from "@angular/router";
import {MasterProvider} from "./MasterProvider";
import {NavigationExtras} from "@angular/router";
import {AdRolePageMst} from "../pojos/Add_ROLE_MST";
import {LazyLoadRequest} from "../request/LazyLoadRequest";
import {MatDialog} from "@angular/material/dialog";



export abstract class MasterBean {



//    @ViewChild(ButtonComponent) buttonbar: ButtonComponent;
    
   
    public disabledAllFileds:boolean=true;
    public internetStatus: boolean = true;
//    public validation: Validator;
    public globalFormGroup: FormGroup;
//    public util: SiUtil;
    public _dialog: MatDialog;
    public auth: AuthService;
//    public isInternetAvailable: ConnectionService;
    public globalUser: User;
    public isShowDefunct:boolean=false;
    private pageApi: string = "/api/AdRolePage/getSinglePageObj";
    public  static pi: number = 3.14;
    public pageNumber: number = 0;
    public lazyCriteria:LazyLoadRequest;
    pageRole: AdRolePageMst = new AdRolePageMst();
    public injectorObj = Injector.create({
        providers: [
//            {provide: SiUtil, deps: []},
//            {provide: Validator, deps: []},
//            {provide: ConnectionService, deps: []},

        ]
    });


    //// form mode 
    public fMode: string = "LIST";
    public FORM_SAVE: string = "SAVE";
    public FORM_UPDATE: string = "UPDATE";
    public FORM_DELETE: string = "DELETE";
    public FORM_VIEW: string = "VIEW";
    public FORM_LIST: string = "LIST";
    public FORM_All_IN_ONE: string = "All";

    //// for type
    public formType: string = "DETAIL";   //// default form type 
    public FORM_TYPE_MASTER: string = "MASTER";   /// if master then load button bar 
    public FORM_TYPE_DETAIL: string = "DETAIL";   /// not loading button bar 
    constructor(public injector: Injector,
        public globalRouter: Router,
        public provider: MasterProvider,
    ) {

        this.injectorObj = injector;
//        this.util = this.injectorObj.get(SiUtil);
//        this.isInternetAvailable = this.injectorObj.get(ConnectionService);
//        this.validation = this.injectorObj.get(Validator);
        this._dialog = this.injectorObj.get(MatDialog);
        this.auth = this.injectorObj.get(AuthService);
      
        this.isCheckInternet();
        this.globalUser = this.provider.getSession();
        console.log(this.globalRouter.url);
        this.lazyCriteria = new LazyLoadRequest();
        
    }


    isCheckInternet() {
//        this.isInternetAvailable.monitor().subscribe((status) => {
//            if (!status) {
////                this.util.toastWarning("No Internet", "Please Check Internet Connection");
//                alert("Please Check Internet Connection");
//                this.onClearClickedAction();
//                this.internetStatus = false;
//                this.disableForm();
//            }
//            else {
//                this.internetStatus = true;
//                this.enableForm();
//            }
//        })
    }

    displayDialog(component: any, mode: string, paramData?: any) {
        
        let dialogBoxSettings = {
            disableClose: true,
            hasBackdrop: true,
            margin: '0 auto',
            width: '60%',
            height: '85%',
            data: {formMode: mode, paramObj: paramData || null}
        };

        return this._dialog.open(component, dialogBoxSettings);


    }
    
    displayDialogDynamic(component: any, width:any, height:any, mode: string, paramData?: any) {
       
        let dialogBoxSettings = {
            disableClose: true,
            hasBackdrop: true,
            margin: '0 auto',
            width: width+'%',
            height: height+'%',
            data: {formMode: mode, paramObj: paramData || null}
        };

        return this._dialog.open(component, dialogBoxSettings);


    }


    async navigateByUrlParam(obj: any) {
        var param: NavigationExtras = {
            queryParams: {
                param: obj
            }
        }

        await this.globalRouter.navigateByUrl('/' + obj.adRolePageRoutingUrl, param);
    }

    async navigateByUrl(url: string) {


        await this.globalRouter.navigateByUrl('/' + url);
    }
    async  navigate(pageName: string, param?: string) {
        await this.globalRouter.navigate(['/' + pageName]);
    }
    ////// BUTTON BAR METHDOS////

    public abstract onNewClickedAction(event?): any;

    public abstract onNewSaveAction(event?): any;

    public abstract onModifyClickedAction(event?): any;

    public abstract onUpdateSaveAction(event?): any;

    public abstract onRemoveClickedAction(event?): any;

    public abstract onDeleteSaveAction(event?): any;

    public abstract onViewClickedAction(event?): any;

    public abstract onUploadClickedAction(event?): any;
    public abstract formSaveMode(): any;
    public abstract formUpdateMode(): any;
    public abstract formDeleteMode(): any;
    public abstract formViewMode(): any;
    public abstract formListMod(): any;

    public onClearClickedAction(event?) {
        this.globalFormGroup.reset();
//        this.buttonbar.onClearButtonAction();
    }

    public onLovReturnModifyAction() {
//        this.buttonbar.lovReturnModify = true;
    }
    public onLovReturnDeleteAction() {
//        this.buttonbar.lovReturnDelete = true;
    }

    public async onCloseClickedAction(event?) {
//        var result = await this.util.toastConfirmation_Save(this.util.CLOSE_CONFIRMATION_MSG, this.util.WARNING_ICON)
//        if (result) {
//            this._dialog.closeAll();
//        }
    }

    public enableForm() {

        if (this.internetStatus) {
            this.globalFormGroup.enable();
            this.internetStatus = true;
        }
        else {
//            this.util.toastWarning("No Internet", "Please Check Internet Connection");
            alert("Please Check Internet Connection");
            this.onClearClickedAction();
            this.internetStatus = false;
        }

    }


    public disableForm() {
        this.globalFormGroup.disable();
    }

    customStyle = {
        selectButton: {
            "background-color": "yellow",
            "border-radius": "25px",
            "color": "#000"
        },
        clearButton: {
            "background-color": "#FFF",
            "border-radius": "25px",
            "color": "#000",
            "margin-left": "10px"
        },
        layout: {
            "background-color": "purple",
            "border-radius": "25px",
            "color": "#FFF",
            "font-size": "15px",
            "margin": "10px",
            "padding-top": "5px",
            "width": "500px"
        },
        previewPanel: {
            "background-color": "#894489",
            "border-radius": "0 0 25px 25px",
        }
    }

    getAuthenticationForMasterForm() {
        return new Promise((resolve, reject) => {

            var pageRequest = {
                userRole: this.globalUser.app_role_id,
                pageUrl: this.globalRouter.url.replace("/", "&").replace("/", "&")
            }
            this.print(MasterBean.name, "PAGE REQ", pageRequest.pageUrl)
            this.provider.doHttpPost(this.pageApi, pageRequest, true).subscribe((data: any) => {
                data = data.response;
                console.log(data);
                if(data){
//                    this.buttonbar.firebase_Input_Create_Or_Save = data.adRolePageCreate
//                    this.buttonbar.firebase_Input_Update = data.adRolePageUpdate
//                    this.buttonbar.firebase_Input_Delete = data.adRolePageDelete
//                    this.buttonbar.firebase_Input_View = data.adRolePageView
//                    resolve(this.buttonbar);
                }
                else{
//                    this.buttonbar.firebase_Input_Create_Or_Save = true
//                    this.buttonbar.firebase_Input_Update = true
//                    this.buttonbar.firebase_Input_Delete = true
//                    this.buttonbar.firebase_Input_View = true
//                    resolve(this.buttonbar);
                }
            }, error => {
                console.log(error);

//                this.buttonbar.firebase_Input_Create_Or_Save = true
//                this.buttonbar.firebase_Input_Update = true
//                this.buttonbar.firebase_Input_Delete = true
//                this.buttonbar.firebase_Input_View = true
                resolve("The Role Page Authentication Not Loaded");
            })
        })
        //        this.provider.doHttpGet()


    }

    getAuthenticationForDetailForm() {
        return new Promise((resolve, reject) => {

            var pageRequest = {
                userRole: this.globalUser.app_role_id,
                pageUrl: this.globalRouter.url.replace("/", "&").replace("/", "&")
            }
            this.print(MasterBean.name, "PAGE REQ", pageRequest.pageUrl)
            this.provider.doHttpPost(this.pageApi, pageRequest, true).subscribe((data: any) => {
                data = data.response;

                resolve(data);
            }, error => {
                console.log(error);
                var data = new AdRolePageMst();
                data.id = "0";
                data.adRolePageCreate = true
                data.adRolePageUpdate = true
                data.adRolePageDelete = true
                data.adRolePageView = true
                console.log(data);
                resolve(data);

            })
        })
    }


    formMode(formMode: string) {
        switch (formMode) {
            case this.FORM_SAVE: {
                console.log("SAVE mode Activated...");
//                console.log(this.buttonbar.firebase_Input_Create_Or_Save);
//                if (!this.buttonbar.firebase_Input_Create_Or_Save) {
//                    this.util.toastError("You Are Not Permitted");
////                    this._dialog.closeAll();
//                   
//                    this.disableForm();
//                   
//                }
//                else{
//                     this.fMode = this.FORM_SAVE;
//                    this.enableForm();
//                    this.formSaveMode();
//                }
//                //statements; 
//                break;
//            }
//            case this.FORM_UPDATE: {
//                if (!this.buttonbar.firebase_Input_Update) {
//                    this.util.toastError("You Are Not Permitted");
////                    this._dialog.closeAll();
//                    this.disableForm();
//                   
//                }
//                  else{
//                     this.fMode = this.FORM_UPDATE;
//                     this.isShowDefunct=true;
//                    this.enableForm();
//                    this.formUpdateMode();
//                }
//                //statements; 
//                break;
//            }
//            case this.FORM_DELETE: {
//                //statements;  
//                if (!this.buttonbar.firebase_Input_Delete) {
//                    this.util.toastError("You Are Not Permitted");
//                    this.disableForm();
////                    this._dialog.closeAll();
//                }
//                else{
//                    this.fMode = this.FORM_DELETE;
//                   this.disableForm();
//                    this.formDeleteMode();
//                }
//                break;
//            }
//            case this.FORM_VIEW: {
//                //statements; 
//                if (!this.buttonbar.firebase_Input_View) {
//                    this.util.toastError("You Are Not Permitted");
//                    this.disableForm();
////                    this._dialog.closeAll();
//                }
//                  else{
//                    this.fMode = this.FORM_VIEW;
//                   this.disableForm();
//                    this.formViewMode();
//                }
//                break;
//            }
//            case this.FORM_LIST: {
//                //statements; 
//                if (!this.buttonbar.firebase_Input_View) {
//                    this.util.toastError("You Are Not Permitted");
//                    this.disableForm();
////                    this._dialog.closeAll();
//                }
//                  else{
//                    this.fMode = this.FORM_LIST;
//                     this.formListMod();
//                }
//                break;
//            }
//            default: {
//                //statements; 
//                this.util.toastError("You Are Not Permitted");
//                this._dialog.closeAll();
//                this.fMode = this.FORM_All_IN_ONE;
////                this.enableForm();
//               
                break;
            }
        }

    }


    print(className: string, msg: string, obj: any) {
        console.log("[", className, "]", " ", msg, " ", obj);
    }


    async registrationForm(formType: string) {

        this.formType = formType;

        if (formType === this.FORM_TYPE_MASTER) {
            await this.getAuthenticationForMasterForm();
        } else {
            this.pageRole = await this.getAuthenticationForDetailForm() as AdRolePageMst;
        }

    }
    
    keyboardKeyPress(event: any) 
    {
        const pattern = /[0-9\+\-\.\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) 
        {
            event.preventDefault();
        }
    }

    getFontSize() {
        return Math.max(10, 10);
    }
    
    getMediumFontSize() {
        return Math.max(12, 12);
    }

    errorHandling(control: string, error: string) {
        return this.globalFormGroup.controls[control].hasError(error);
    }
    
    checkIsSubstring(s1: any,  s2: any) 
    {
        let M = s1.length;
        let N = s2.length;

        for (let i = 0; i <= N - M; i++) 
        {
            let j;

            for (j = 0; j < M; j++)
                if (s2.charAt(i + j) != s1.charAt(j))
                    break;

            if (j == M)
                return i;
        }

        return -1;
    }
    
    getColorNameByHex(hexCode: string)
    {
        let colorName: string;
        switch (hexCode) 
        {
            case "#000000":
                colorName = "Black";
                break;
            case "#00ffff":
                colorName = "Cyan";
                break;
            case "#ff00ff":
                colorName = "Magenta";
                break;
            case "#ffff00":
                colorName = "Yellow";
                break;
            case "#ff0000":
                colorName = "Red";
                break;
            case "#0000ff":
                colorName = "Royal Blue";
                break;
            case "#008000":
                colorName = "Green";
                break;
            case "#800080":
                colorName = "Purple";
                break;
            case "#a52a2a":
                colorName = "Brown";
                break;
            case "#ffffff":
                colorName = "Any Colour";
                break;
            default:
                colorName = "Any Colour";
                break;
        }
        
        return colorName;
    }
    
    roundOfWith(value: number, roundOfBy: number) 
    { 
        if (value % roundOfBy == 0) 
        { 
            return (Math.floor(value / roundOfBy)) * roundOfBy;
        } else 
        { 
            return ((Math.floor(value / roundOfBy)) * roundOfBy) + roundOfBy;
        } 
    }
    
}
