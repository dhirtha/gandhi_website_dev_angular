import {Address} from "./oprAddress";

export class CustomerMst
{
    
    id:string;
    orgId:string;
    oprId:string;
    username:string;
    userGender:string;
    userContactNo:string;
    userAddress:any;
    userBankDetail:any;

    fullname:string;
    password:string;
    masterPassword:string;

    appRoleObj:any;

    userOPRObj:any;

    appRoleId:any;//taken from AdRoleMs:stringt

    roles:any;

    custShopName:string;

    custFirstName:string;

    custLastName:string;

    custGstNo:string;

    custGstType:any;

    userMobileNo:string;

    email:string;

    custVerificationCode:string;

    custMaxQuotePerDay:number;

    custDescription:string;

    custRateLabel:string;

    transCustRateLabel:string;

    custRelationshipManager:string;

    custTravelVendor:any[]=[];

    userType:string;
    defunct:boolean = false;

    crDt:Date;

    mdDt:Date;

    deDt:Date;

    userTravelRates:any[] =[];

    custTravelDelivery:string;
    custTravelPayMode:string;

    custNo:string;
    clientId:string;
    userCart :any[] =[];
    userWishlist :any[] =[];

    emailVerified:boolean = false;
    mobileVerified:boolean = false;
    userVerified:boolean = false;

    clientCategory:string;
    clientRefBy:string;
    clienDOB:Date;
    clienNickName:string;
    weeklyHoliday:string;
    workingHrs:string;

    natureOfWork:any[]=[];
    typeOfWork:any[]=[];
    machinaries:any[]=[];

    materialPacking:string;
    whatsAppNo:string;
    designerNo:string;
    ownerNo:string;
    accDeptNo:string;
    alternateNo:string;
    landlineNo:string;

    acctsEmailId:string;
    designerEmailId:string;
    alternateEmailId:string;
    panNoOfOwner:string;
    adharNoOfOwner:string;

    //level3 Admin
    clientAllotedTo:string;
    accStatMailDuration:string;
    maxQuotPerDay:string;
    ratelabelCategory:string;
    applyGSTtype:string;

    shopPhotos:any[]=[];
    quotationWhatsAppNos:any[]=[];
    orderBookinWhatsAppNos:any[]=[];
    orderStatusWhatsAppNos:any[]=[];
    accountsWhatsAppNos:any[]=[];
    orderDispatchWhatsAppNos:any[]=[];
    invoiceWhatsAppNos:any[]=[];

    quotationEmails:any[]=[];
    orderBookingEmails:any[]=[];
    accountStatEmails:any[]=[];
    orderDispatchEmails:any[]=[];
    invoiceEmails:any[]=[];

    custTempP:string;
    isDefaultPass: boolean;

    custCreditLimit:number;
    custCreditLimitUsed:number;
    custCreditDays:number;
    custWalletAmt:number;

    creditOnBeforeAfterDispatch:string;
    custCreditDaysAfterDispatch:number;

    stringcrDt:string;
    stringmdDt:string;

}

