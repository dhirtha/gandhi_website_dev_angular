
import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {finalize} from "rxjs/operators";
import {catchError} from "rxjs/internal/operators/catchError";
import {Injector} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {MasterProvider} from "../../../utility/MasterProvider";
import {AuthService} from "../../../utility/auth-service";
import {LazyLoadRequest} from "../../../request/LazyLoadRequest";

export class ProductListDataSource extends MasterProvider implements DataSource<any> {
    
    API_LAZY_LST = "/api/quotationEnquiry/getFilterList";
    API_LAZY_LST_COUNT = "/api/quotationEnquiry/getCountFilterList";


    public oprsSubject = new BehaviorSubject<any[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();
    constructor(public injector: Injector,
        public http: HttpClient,
        public authService: AuthService) {
        super(injector, http, authService);
    }

    connect(collectionViewer: CollectionViewer): Observable<any[]> {
        return this.oprsSubject.asObservable();
    }
    disconnect(collectionViewer: CollectionViewer): void {
        this.oprsSubject.complete();
        this.loadingSubject.complete();
    }

    loadLazyLst(lazyReq: LazyLoadRequest) {
        this.loadingSubject.next(true);
        this.getList(lazyReq).pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe((oprs: any[]) => this.oprsSubject.next(oprs));
    }



    loadCount(lazyReq: LazyLoadRequest) {
        return new Promise((resolve, reject) => {
            this.getCount(lazyReq).subscribe(length => {

                resolve(length);
            })
        })

    }

    getList(req: LazyLoadRequest) {
        return this.doHttpPostLazy(this.API_LAZY_LST, true, req);
    }

    getCount(lazyReq: LazyLoadRequest) {
        return this.doHttpPostLazy(this.API_LAZY_LST_COUNT, true, lazyReq);
    }
    
    public save(obj: any) {
    }
    public update(obj: any) {
    }
    public findById(objId: any) {
    }
    public findAll() {
    }
    public deleteById(obj: any) {
    }
    public defunctById(obj: any) {
    }

    
}









