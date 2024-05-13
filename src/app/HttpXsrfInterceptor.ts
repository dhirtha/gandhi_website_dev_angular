import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';

//import 'rxjs/add/operator/do';
//import { Observable } from 'rxjs/Observable';
import {CookieService} from 'ngx-cookie'; //
import {Observable} from 'rxjs';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


@Injectable()
export class HttpXsrfInterceptor implements HttpInterceptor {

    constructor(private cookieService: CookieService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //    let token = this.tokenExtractor.getToken() as string;
        let csrftoken = this.cookieService.get('X-CSRF-TOKEN')
//        console.log(csrftoken);
        //    let jwttoken = this.cookieService.get('jwttoken')
        req = req.clone({
            setHeaders: {
                //         This is where you can use your various tokens
                Authorization: `Bearer ${csrftoken}`,
                'X-CSRF-TOKEN': `${csrftoken}`,
                //         'Content-Type': 'application/json'

            }
        });
        //      console.log(req.method);
        //      console.log(csrftoken);
        //    if (csrftoken !== null && !req.headers.has(headerName)) {
        //      req = req.clone({ headers: req.headers.set(headerName, csrftoken) });
        //    }
        return next.handle(req);
    }


    //  intercept1(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //    let csrftoken = this.cookieService.get('X-CSRF-TOKEN')
    //    let jwttoken = this.cookieService.get('jwttoken')
    //    request = request.clone({
    //      setHeaders: {
    ////         This is where you can use your various tokens
    ////         Authorization: `JWT ${jwttoken}`,
    //         'X-CSRFToken': `${csrftoken}`
    //      }
    //    });
    //      return next.handle(request).do((event: HttpEvent<any>) => {
    //      if (event instanceof HttpResponse) {
    //        // do stuff with response if you want
    //      }
    //    }, (err: any) => {
    //      if (err instanceof HttpErrorResponse) {
    //        if (err.status === 401 || err.status === 403) {
    //          console.log("handle error here")
    //          
    //        }
    //      }
    //    });
    //  }
}
