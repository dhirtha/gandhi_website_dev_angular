import {AdGenralDtlMst, AdColorMst} from "../AddGenralDetail";
import {PaperProperty} from "./PaperProperty";
import {PostPress} from "./PostPress";
import {ImageMst} from "./ImageMst";

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export class AddProductMst
{
    id: string;
    orgId: string;
    
    code: string;

    oprId: string;

    prodName: string;

    prodStdQuantity: number;

    prodGST: AdGenralDtlMst;

    prodHsnCode: string;

    prodDeleveryDays: string;
    
    prodPostPress: string;

    prodPriority: number;

    prodPaperTypeWithPriority: PaperProperty[] = [];

    prodQuotationType: string;

    prodSizeWithPriority: AdGenralDtlMst[] = [];
    
    prodBindingType: AdGenralDtlMst[] = [];
    
    prodPostPressActivityWithPriority: PostPress[] = [];


    prodPrintSide: string;
    
    prodFrontSideColors: AdColorMst[] = [];
    
    
    prodBackSideColors: AdColorMst[] = [];
    
    prodDescription: string;

    defunct: boolean = false;
    
    crDt: Date;
    
    mdDt: Date;
    
    deDt: Date;
    
    crDtBy: string;
    mdDtBy: string;
    deDtBy: string;
    
    prodMaxSize: string;
    prodMaxLength: number;
    prodMaxBreath: number;
    
    prodCode:string;
    
    prodImages:ImageMst[];
    prodCategory:string;
    prodAvailability:string;
    
    description:string;
    ratingsCount:string;
    ratingsValue:string;
    availibilityCount:string;
    categoryId:string;
    discount:number;
    
    
}