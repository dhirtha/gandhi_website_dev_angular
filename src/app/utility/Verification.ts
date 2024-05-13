import {HttpHeaders, HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class Verification
{
    constructor(private http:  HttpClient)
    {
        
    }
    
    emailIdVerification(functionUrl: string, userEmailId: string, userOtp: string)
    {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        let body = {
            "Info":
                {
                    "to": userEmailId,
                    "otp": userOtp,
                }
        };
        return this.http.post(functionUrl, body, httpOptions)
            .toPromise()
            .then(res => {
                return true;
            })
            .catch(err => {
                return false;
            })
    }
    
    
    phoneNumberVerification(functionUrl: string, userMobileNo: number, userOtp: string, userName: string)
    {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        let body = {
            "Info":
                {
                    "to": userMobileNo,
                    "otp": userOtp,
                    "name": userName
                }
        };
        return this.http.post(functionUrl, body, httpOptions).toPromise()
    }
    
    
}