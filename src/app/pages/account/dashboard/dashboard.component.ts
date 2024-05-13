import { Component, OnInit, Injector } from '@angular/core';
import {MasterProvider} from '../../../utility/MasterProvider';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../../../utility/auth-service';
import {Router} from '@angular/router';
import {LazyLoadRequest} from '../../../request/LazyLoadRequest';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends MasterProvider implements OnInit {

    lazyCriteria: LazyLoadRequest;
    pendingOrderFileCount:number = 0;
    user: any;
    public alerts: Array<any> = [];
    
    constructor(public injector: Injector, public  http: HttpClient, public  authService: AuthService, public router: Router) {
        super(injector, http, authService);
        this.alerts.push(
           {
               id: 1,
               type: 'success',
               message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
               Voluptates est animi quibusdam praesentium quam, et perspiciatis,
               consectetur velit culpa molestias dignissimos
               voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
           },
           {
               id: 2,
               type: 'warning',
               message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
               Voluptates est animi quibusdam praesentium quam, et perspiciatis,
               consectetur velit culpa molestias dignissimos
               voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
           }
       );
    }

    ngOnInit() {
        this.getUser();
    }
    
    getUser(){
        this.doHttpPost("/api/auth/getByEmail", this.getSession().email, true).subscribe((data:any)=>{
            data = data.response;
            console.log(data);
            this.user = data;
            this.getPendingOrderFileCount(this.user.id);
        })
    }
    
    getUser1(){
        this.doHttpPost("/api/order/ccAvenue", this.getSession().email, true).subscribe((data:any)=>{
            data = data.response;
            console.log(data);
        })
    }
    
    getPendingOrderFileCount(custId:string){
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.paramObj = {
            "isFileUploaded": false,
            "quotCustId": custId
        }
        this.doHttpPost("/api/order/getCount", this.lazyCriteria, true).subscribe((data:any)=>{
            data = data.response;
            console.log("Order Listtttttttttttttttt");
            console.log(data);
            this.pendingOrderFileCount = data;
        })
    }
    
    goToAccountInfo(){
        this.router.navigate(['/account/information'])
            .then(() => {
        });
    }
  
    goToDeliveryAdd(){
        this.router.navigate(['/account/addresses'])
            .then(() => {
        });
    }
  
    goToOrders(){
        this.router.navigate(['/account/orders'])
            .then(() => {
        });
    }
  
    goToHelp(){
        this.router.navigate(['/contact'])
            .then(() => {
        });
    }
  
    goToStandardProducts(){
        this.router.navigate(['/'])
            .then(() => {
        });
    }
    
    goToCustomisedProducts(){
        this.router.navigate(['/customisedQuotation'])
            .then(() => {
        });
    }
  
    goToFavoriteProducts(){
        this.router.navigate(['/wishlist'])
            .then(() => {
        });
    }
  
    goToCart(){
        this.router.navigate(['/cart'])
            .then(() => {
        });
    }
  
    public save(obj: any){}
    public update(obj: any){}
    public findById(objId: any){}
    public findAll(){}
    public deleteById(obj: any){}
    public defunctById(obj: any){}
    

}
