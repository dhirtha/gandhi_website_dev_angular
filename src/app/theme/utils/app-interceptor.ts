import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {RequestEncryption} from '../../utility/RequestEncryption';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(private spinner: NgxSpinnerService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.spinner.show();

        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
//                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
//                console.log(event);
                if (event.body != null && typeof event.body.response != "undefined") {
                    let requestEncryption = new RequestEncryption();
                    let response = requestEncryption.decrypt("qaed@#4???xwscwsscawvDQervbe", event.body.response);
                    response = JSON.parse(response);
//                    console.log(response);
                    event.body.response = response;
                }
                this.spinner.hide();
            }
            
//            console.log(event);
            return event;
        },
            catchError((error: HttpErrorResponse) => {
//                console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                this.spinner.hide();
                const started = Date.now();
                const elapsed = Date.now() - started;
//                console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
                // debugger;
                return throwError(error);
            })
        ));
    }
}