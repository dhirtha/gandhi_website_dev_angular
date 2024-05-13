/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export class LazyLoadRequest {

    pageSize: number = 10;
    pageNumber: number = 0;
    filterField: string = "";
    filterValue: string = "";
//    filterFields: string[] = [];
//    filterValues: string[] = [];
    sortFiled: string = "orgId";
    sortValue: string = "asc";
    paramObj:any = {};
    in: any;
    inField: any;
    multipleInFilter:any;

    notIn: any;
    notInField: any;

    greterThan: any = {};

    lessThan : any = {};
    update : any;
    updateInLst : any;

    fromDt: any;
    toDt: any;
    dateField: any;
    
    include: any;
    exclude: any;
    
    reportType: any;
    isReportWithRateLable: boolean = false;
    extraParams: any[] = [];
    
    betweenField: any;
    fromValue: any;
    toValue: any;
}