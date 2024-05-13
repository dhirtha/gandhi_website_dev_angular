/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export class QuotationEnquiryMst
{
    id: string;
    
    trnId: string;

    oprId: string = "0";

    orgId: string;

    enqProduct: any;

    enqJobStatus: any;

    enqProdSize: any;
    
    enqProdEnvelopeType: any;
    
    enqProdPasteType: any;

    enqPaperType: any;
    
    enqPageType: any;

    enqMill: any;

    enqPaperGsm: any;

    enqPrintSide: any;

    enqFrontSideColor: any;
    
    enqBackSideColor: any;
    
    enqFrontColor1: string;
    
    enqFrontColor2: string;
    
    enqFrontColor3: string;
    
    enqFrontColor4: string;
    
    enqFrontBackColor1: string;
    
    enqFrontBackColor2: string;
    
    enqFrontBackColor3: string;
    
    enqFrontBackColor4: string;

    enqLamination: any;

    enqLaminationSide: string;

    enqLaminationType: any;

    enqQuantity: string;

    enqCount: string;
    
    state: string;
    
    city: string;
    
    custName: string;
    
    enqProdCoverInnerPaperType: any;
    
    enqProdBindingType: any;
    
    enqProdBindingSide: any;
    
    enqProdBookOpenSide: any;
    
    enqNoOfPages: any;
    
    enqProdCoverSheeterApplied: any;
    
    enqProdCoverSheeter: any;
    
    enqProdInnerSheeter: any;
    
    enqProdTotalCoverSheeter: any;
    
    enqLaminationForPages: any;
    
    enqPageNo: any;
    
    enqPageId: any;
    
    crDt: Date;
    
    mdDt: Date;
    
    deDt: Date;
    
    defunct: boolean = false;
    
    crBy: string;
    
    mdBy: string;
    
    dtBy: string;
    
    enqLstQuoteTracking: EnqQuotationTracking[];
    
    formType: string;
    
    enqPageBy: any;
    
    enqPageByParty: any;
    
    enqRemark: any;
}

export class EnqQuotationTracking
{
    trackId: string;
    
    trackStatus: string;
    
    trackDt: Date;
    
    trackDesciption: string;
}