//import {SiUtil} from "./SiUtil";
import {HttpClient} from "@angular/common/http";
import {Injector} from "@angular/core";
import {AuthService, User} from '../utility/auth-service';
import {HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SiUtil} from "./SiUtil";
import {LocalService} from "./LocalService";
import {StorageService} from "./StorageServices";
import {tap, finalize} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {RequestEncryption} from "./RequestEncryption";


@Injectable({
    providedIn:"root"
})

export abstract class MasterProvider{
   
//    util: SiUtil;
    logedInUser: any;
    globalUser:User;
    public pageSize: number = 10;
    
    isMobileViewGlbal: boolean = false;
    route: Router;
    
    isPaymentGTMode: boolean = true;
    
//    serverIpAndPort: string = "13.127.101.12:8080";
//    serverIpAndPort: string = "192.168.2.107:8080";
//    serverIpAndPort: string = "localhost:8080";
//    globalServerPath: string = "http://" + this.serverIpAndPort; 
    globalServerPath: string = ""; 
    webSocketEndPoint: string = 'wss://secure.aaryancards.com/ws';
    
    
//    serverIpAndPort = "aaryancards.com";
//    globalServerPath: string = "https://" + this.serverIpAndPort; 
//    webSocketEndPoint: string = 'wss://secure.aaryancards.com/ws';
    
    isPaymentMode = true;
    paymentEmail = "roshantasare123@gmail.com";
    public snackBar: MatSnackBar;
    public util: SiUtil;
    public router: Router;
    timer = ms => new Promise(res => setTimeout(res, ms));
    tokenReq:boolean = false;
    
    public injectorObj = Injector.create({
        providers: [
            //            {provide: SiUtil, deps: []},

            ]
    });
//    dataEncryptionDecryption: StorageService;


    constructor(public injector: Injector, public http: HttpClient, public authService: AuthService) {
        //          this.util = this.injectorObj.get(SiUtil);
        this.globalUser = this.getSession();

        if (window.innerWidth < 1000) {
            this.isMobileViewGlbal = true;
        }
//        this.test();

//        this.dataEncryptionDecryption = new StorageService();

//        console.log = function () {};
    }
    
    
    getSession() {
        try {
            if (this.authService.getSession()) {
                this.globalUser = this.authService.getSession();
                return this.globalUser;
            }
            else {
                console.log("Session Not Inited....");
                localStorage.removeItem('isLoggedin');
                localStorage.clear();

                //                this.route.navigate(['/login']);
            }

        } catch (e) {
            console.log(e);
        }

    }
    
    
    
    
    public abstract save(obj: any);
    public abstract update(obj: any);
    public abstract findById(objId: any);
    public abstract findAll();
    public abstract deleteById(obj: any);
    public abstract defunctById(obj: any);



//  doHttpPost(servicePath:string, param:any, authentication:boolean)
//  {
//      if (authentication)
//      {
//      
//           let headers: HttpHeaders = new HttpHeaders();
//     headers = headers.append('Content-Type', 'application/json');
//     headers = headers.append('Authorization', this.authService.getSession().token_Type+" " + this.authService.getSession().token);
//       return this.http.post(this.globalServerPath+servicePath, param, {headers:headers});
//      }
//      else{
//          console.log("POST METHOD: ",this.globalServerPath+servicePath);
//          console.log("POST PARAM: ", param);
//
//            return this.http.post(this.globalServerPath+servicePath, param);
//      }
//      
//  }
    
    async test(){
        while(true){
//            this.tokenReq = true;
            await this.timer(300); 
            this.tokenReq = false;
        }
    }
    
    getSecuredAuthToken()
    {
        if (!this.tokenReq){
            this.tokenReq = true;
            return this.http.get(this.globalServerPath+"/api/auth/token");
        }
    }
        
    doHttpPost(servicePath:string, param:any, authentication?:boolean): Observable<any>{
        let requestEncryption = new RequestEncryption();
        let response = requestEncryption.encrypt("qaed@#4???xwscwsscawvDQervbe", JSON.stringify(param));
        let obj = {
            value : response
        }
        return this.http.post(this.globalServerPath + servicePath, obj);
        
        
//        return this.http.post(this.globalServerPath + servicePath, param);
    }
    
    doHttpPost1(servicePath:string, param:any, authentication?:boolean){

//        return this.http.post(this.globalServerPath + servicePath, param)
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Headers', 'https://test.ccavenue.com');
        headers.append('responseType', 'text/html');
        return this.http.post(this.globalServerPath + servicePath, param, {headers:headers})
        
    }
    
  doHttpPutPromised(servicePath:string, param:any, authentication:boolean)
  {
      
      return new Promise((resolve,reject)=>{(result=>{
              if (result)
              {
                  
              
                if (authentication)
      {
          
     let headers: HttpHeaders = new HttpHeaders();
     headers = headers.append('Content-Type', 'application/json');
     headers = headers.append('Authorization', this.authService.getSession().token_Type+" " + this.authService.getSession().token);
               return this.http.post(this.globalServerPath + servicePath, param, {headers:headers}).subscribe(result=>{
                   alert("Record Update Successfully.");
                   resolve(result);
               },error=>{
               alert("Abort Transaction.");
                   console.log(error);
                   reject(error);
               })
      }
      else{
          console.log("POST METHOD: ",this.globalServerPath+servicePath);
          console.log("POST PARAM: ", param);
          
            return this.http.post(this.globalServerPath+servicePath, param).subscribe(result=>{
                alert("Record Update Successfully.");
                   resolve(result);
               },error=>{
                   alert("Abort Transaction.");
                   console.log(error);
                   reject(error);
               })
      }
              }else{
                  console.log("no Action ");
                  reject("cancel");
              }
      
          })
         
      })
     
  }
  doHttpPostPromised(servicePath:string, param:any, authentication:boolean)
  {
      
      return new Promise((resolve,reject)=>{(result=>{
              if (result)
              {
                  
              
                if (authentication)
      {
          
     let headers: HttpHeaders = new HttpHeaders();
     headers = headers.append('Content-Type', 'application/json');
     headers = headers.append('Authorization', this.authService.getSession().token_Type+" " + this.authService.getSession().token);
                    return this.http.post(this.globalServerPath + servicePath, param, {headers: headers}).subscribe(result=>{
                   alert("Record Saved Successfully.");
                   resolve(result);
               },error=>{
               alert("Abort Transaction.");
                   console.log(error);
                   reject(error);
               })
      }
      else{
          console.log("POST METHOD: ",this.globalServerPath+servicePath);
          console.log("POST PARAM: ", param);
          
            return this.http.post(this.globalServerPath+servicePath, param).subscribe(result=>{
                alert("Record Saved Successfully.");
                   resolve(result);
               },error=>{
                   alert("Abort Transaction.");
                   console.log(error);
                   reject(error);
               })
      }
              }else{
                  console.log("no Action ");
                  reject("cancel");
              }
      
          })
         
      })
     
  }
  doHttpDeletePromised(servicePath:string, param:any, authentication:boolean)
  {
      
      return new Promise((resolve,reject)=>{(result=>{
              if (result)
              {
                  
              
                if (authentication)
      {
          
     let headers: HttpHeaders = new HttpHeaders();
     headers = headers.append('Content-Type', 'application/json');
     headers = headers.append('Authorization', this.authService.getSession().token_Type+" " + this.authService.getSession().token);
               return this.http.post(this.globalServerPath + servicePath, param, {headers:headers}).subscribe(result=>{
                   alert("Record Delete Successfully.");
                   resolve(result);
               },error=>{
                   alert("Abort Transaction.");
                   console.log(error);
                   reject(error);
               })
      }
      else{
          console.log("POST METHOD: ",this.globalServerPath+servicePath);
          console.log("POST PARAM: ", param);
          
            return this.http.post(this.globalServerPath+servicePath, param).subscribe(result=>{
                alert("Record Delete Successfully.");
                   resolve(result);
               },error=>{
                   alert("Abort Transaction.");
                   console.log(error);
                   reject(error);
               })
      }
              }else{
                  console.log("no Action ");
                  reject("cancel");
              }
      
          })
         
      })
     
  }
  
//  http://192.168.1.15:8080/api/AdRolePage/getSinglePageObj/{"userRole":"ROL1","pageUrl":"/quotation/grade"}
//  http://192.168.1.15:8080/api/AdRolePage/getPages/{"orgId":"1","oprId":"1","roleId":"ROL1"}
    doHttpGet(servicePath: string, authentication: boolean, param?: any) 
    {
        return this.http.get(this.globalServerPath + servicePath, param)
//        if (authentication) 
//        {
//            if(this.globalUser)
//            {
//                let headers: HttpHeaders = new HttpHeaders();
//                headers = headers.append('Content-Type', 'application/json');
//                headers = headers.append('Authorization', this.globalUser.token_Type + " " + this.globalUser.token);
//                if (param) 
//                {
//                    console.log("GET METHOD :" + this.globalServerPath + servicePath + "/" + JSON.stringify(param));
//                    return this.http.get(this.globalServerPath + servicePath + "/" + param, {headers: headers});
//                }
//                else 
//                {
//                    console.log("GET METHOD :" + this.globalServerPath + servicePath);
//                    return this.http.get(this.globalServerPath + servicePath, {headers: headers});
//                }
//            }
//        }
//        else 
//        {
//            if (param)
//            {
//                
//                console.log("GET METHOD :"+this.globalServerPath + servicePath + "/" + JSON.stringify(param));
//                return this.http.get(this.globalServerPath + servicePath + "/" + param);
//            }
//            else
//            {
//                console.log("GET METHOD :"+this.globalServerPath + servicePath);
//                return this.http.get(this.globalServerPath + servicePath);
//            }
//        }
    }
    
    doHttpGetNew(servicePath: string, authentication: boolean, param?: any) {
//        this.getSecuredAuthToken()
//            .subscribe((item: any) => {
//                console.log(item);

                return this.http.get(this.globalServerPath+servicePath, param)
    }
        
    doHttpGetLazyList(servicePath: string, authentication: boolean, pageNumber:any, pageSize: any, param?: any) 
    {
        
        if (authentication) 
        {
            let headers: HttpHeaders = new HttpHeaders();
            headers = headers.append('Content-Type', 'application/json');
            headers = headers.append('Authorization', this.globalUser.token_Type + " " + this.globalUser.token);
            if (param)
            {
                console.log("GET METHOD :"+this.globalServerPath + servicePath + "/" + JSON.stringify(param));
                return this.http.get(this.globalServerPath + servicePath + "/" + pageSize + "," + pageNumber + param, {headers: headers});
            }
            else 
            {
                console.log("GET METHOD :"+this.globalServerPath + servicePath);
                return this.http.get(this.globalServerPath + servicePath + "/" + pageSize + "," + pageNumber, {headers: headers});
            }
        }
        else 
        {
            if (param)
            {
                
                console.log("GET METHOD :"+this.globalServerPath + servicePath + "/" + JSON.stringify(param));
                return this.http.get(this.globalServerPath + servicePath + "/" + pageSize + "," + pageNumber + param);
            }
            else
            {
                console.log("GET METHOD :"+this.globalServerPath + servicePath);
                return this.http.get(this.globalServerPath + servicePath + "/" + pageSize + "," + pageNumber);
            }
        }
    }
//    doHttpPostLazy(servicePath: string, authentication: boolean,  param: any) 
//    {
//        
//        if (authentication)
//      {
//          
//     let headers: HttpHeaders = new HttpHeaders();
//     headers = headers.append('Content-Type', 'application/json');
//     headers = headers.append('Authorization', this.authService.getSession().token_Type+" " + this.authService.getSession().token);
//       return this.http.post(this.globalServerPath+servicePath, param, {headers:headers});
//      }
//      else{
//          console.log("POST METHOD: ",this.globalServerPath+servicePath);
//          console.log("POST PARAM: ", param);
//          
//            return this.http.post(this.globalServerPath+servicePath, param);
//      }
//    }
    doHttpPostLazy(servicePath: string, authentication: boolean,  param: any): Observable<any> {
//        var subject = new Subject<any>();
//        this.getSecuredAuthToken()
//            .subscribe((item: any) => {
//                console.log(item);
        let requestEncryption = new RequestEncryption();
        let response = requestEncryption.encrypt("qaed@#4???xwscwsscawvDQervbe", JSON.stringify(param));
        console.log(response);
        let obj = {
            value : response
        }
        return this.http.post(this.globalServerPath + servicePath, obj);
//                return this.http.post(this.globalServerPath + servicePath, param)
//                    subject.next(lava);
//                })
//
//            })
////            });
//        return subject.asObservable();
    }
    
    doHttpPostBySingleField(servicePath: string, param: any, authentication: boolean) {
        console.log(servicePath);
        console.log(param);
        if (authentication) {
            let headers: HttpHeaders = new HttpHeaders();
            headers = headers.append('Content-Type', 'application/json');
            headers = headers.append('Authorization', this.globalUser.token_Type + " " + this.globalUser.token);
            return this.http.post(this.globalServerPath + servicePath + "/" + param, {headers: headers});
        }
        else {
            return this.http.post(this.globalServerPath + servicePath + "/" + param, "");
        }
    }
  
//    getStateList()
//    {
//        var stateList: any[] = [];
//        return new Promise((resolve, reject) =>
//        {
//            return this.http.get("assets/json/state.json").subscribe((list: any[]) =>
//            {
//                for (let i = 0; i < list.length; i++) {
//                    if (list[i].country_id == "101")
//                    {
//                        stateList.push(list[i]);
//                    }
//                }
//                resolve(stateList);
//            });
//        })
//    }
//
//   
//    getCityList(stateId: string)
//    {
//        var cityList: any[] = [];
//        return new Promise((resolve, reject) =>
//        {
//            return this.http.get("assets/json/city.json").subscribe((list: any[]) =>
//            {
//                for (let i = 0; i < list.length; i++) {
//                    if (list[i].state_id == stateId)
//                    {
//                        cityList.push(list[i]);
//                    }
//                }
//                resolve(cityList);
//            });
//        })
//    }
    
    getStateList() {
        var stateList: any[] = [];
        return new Promise((resolve, reject) => {
            this.doHttpPost("/api/json/stateList", "101", false).subscribe((list: any) => {
                list = list.response;
                //                console.log(list);
                stateList = list;
                resolve(stateList);
            })
        })
    }

   
    getCityList(stateId: string) {
        var cityList: any[] = [];
        return new Promise((resolve, reject) => {
            this.doHttpPost("/api/json/cityList", stateId, false).subscribe((list: any) => {
                list = list.response;
                cityList = list;
                resolve(cityList);
            })
        })
    }

    doHttpPostReport(servicePath: string, param: any, authentication: boolean) {
        if (authentication) {

            let headers: HttpHeaders = new HttpHeaders();
            headers = headers.append('Content-Type', 'application/json');
            headers = headers.append('Authorization', this.authService.getSession().token_Type + " " + this.authService.getSession().token);
            return this.http.post(this.globalServerPath + servicePath, param, {headers: headers, responseType: "arraybuffer"});
        }
        else {
            console.log("POST METHOD: ", this.globalServerPath + servicePath);
            console.log("POST PARAM: ", param);

            return this.http.post(this.globalServerPath + servicePath, param, {responseType: "arraybuffer"});
        }

    }

    
    //This method only used for getting Mac Address
    //Dont use this method for calling any other list because it doesn't include any authentication
    doHttpPostMacAddress(servicePath:string, param:any, authentication:boolean)
    {
        if (authentication)
        {

       let headers: HttpHeaders = new HttpHeaders();
       headers = headers.append('Content-Type', 'application/json');
         return this.http.post(this.globalServerPath+servicePath, param, {headers:headers});
        }
        else{
            console.log("POST METHOD: ",this.globalServerPath+servicePath);
            console.log("POST PARAM: ", param);

              return this.http.post(this.globalServerPath+servicePath, param);
        }

    }    
    
    
    getGlobalUser(){
        return new Promise((resolve, reject) => {
            let userSession: any = this.getSession();
            console.log(userSession.email);
            this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
                data = data.response;
                console.log(data);
                this.logedInUser = data;
                if (this.logedInUser.custRateLabel==null || typeof this.logedInUser.custRateLabel=="undefined")
                {
                 this.snackBar.open('Your Account Will Be Activated Within 24 hrs.','', { panelClass: 'error', verticalPosition: 'bottom'});

                }
            })
        })
    }
    
    onLoggedout() {
        this.util.toastLogOutConfirmation().then(data=>{
            if(data){
                localStorage.removeItem('isLoggedin');
                localStorage.clear();
                this.router.navigate(['/'])
                    .then(() => {
                        window.location.reload();
                    });
            }
        })
    }
    
}
