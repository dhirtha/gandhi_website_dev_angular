import {Component, OnInit} from '@angular/core';
import {LazyLoadRequest} from '../../../request/LazyLoadRequest';
import {MasterProvider} from '../../../utility/MasterProvider';
import {Router} from '@angular/router';
import {LocalService} from '../../../utility/LocalService';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    productGrp1: any;
    productGrp2: any;
    lazyCriteria: LazyLoadRequest;
    public lat: number = 21.140887495119753;
    public lng: number = 79.09067829380672;
    public zoom: number = 13;
    
    isSiggnedIn: boolean = false;

    constructor(public provider : MasterProvider, public router: Router, private localStorage: LocalService) {
    }

    ngOnInit() {
        this.getAllProductsGrp1();
        this.getAllProductsGrp2();
        if (this.localStorage.getJsonValue('isLoggedin') == null) {
            this.isSiggnedIn = false;
        }
        else {
            this.isSiggnedIn = true;
        }
    }
    
    getAllProductsGrp1() {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 50;
        this.lazyCriteria.in = ["Leaflet/Pamphlate/Flyer/Brochure","Letterhead","Sticker","Cards Invitation/Wedding/Birthday","Envelope - Office","Envelope - Wedding","Visiting Card","Doctor File","Brochure"];
        this.lazyCriteria.inField = "prodName";
        this.lazyCriteria.include = ["id","prodName"];
        this.lazyCriteria.paramObj = {
        }
        this.provider.doHttpPost("/api/AdProductController/list", this.lazyCriteria, false).subscribe((data: any) => {
            data = data.response;
            console.log(data);
            this.productGrp1 = data;
        })
    }
    
    getAllProductsGrp2() {
        this.lazyCriteria = new LazyLoadRequest();
        this.lazyCriteria.pageSize = 50;
        this.lazyCriteria.in = ["Calendar - Patti Tinning","Bookwork","Calendar - Table Wiro","Plastic PVC Sticker","Poster","Certificate","Book Cover","Poster Calendar","Calendar - Wiro Hanging"];
        this.lazyCriteria.inField = "prodName";
        this.lazyCriteria.include = ["id","prodName"];
        this.lazyCriteria.paramObj = {
        }
        this.provider.doHttpPost("/api/AdProductController/list", this.lazyCriteria, false).subscribe((data: any) => {
            data = data.response;
            console.log(data);
            this.productGrp2 = data;
        })
    }
    
    goToProduct(product?){
        this.router.navigate(['/products', product.id, product.prodName],{ skipLocationChange: true })
            .then(() => {
        });
    }

    subscribe() {}

    getDirection() {
        window.open("https://www.google.co.in/maps/place/Colourprintwala/@21.1407522,79.090025,19z/data=!4m12!1m6!3m5!1s0x3bd4c0beed5cad7b:0x4584ce21084c603f!2sColourprintwala!8m2!3d21.140861!4d79.0906741!3m4!1s0x3bd4c0beed5cad7b:0x4584ce21084c603f!8m2!3d21.140861!4d79.0906741")
    }
    
}