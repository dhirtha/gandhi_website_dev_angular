import {Address} from "../oprAddress";
import {BankDetails} from "../BankDetails";
import {GstMst} from "../gst-mst";
import {TravelMstNew} from "../travel-rateNew";


export class User
{
    id: string;
    orgId: string;
    oprId: string;
//    userOPRId: string;
//    fullname: string;
    defunct: boolean = false;
    email: string;
    username: string;
    appRoleId: string;
    password: string;
//    userContactNo: string;
    userMobileNo: string;
//    userGender: string;
    userType: string;
    userAddress: Address = new Address();
//    userBankDetail: BankDetails = new BankDetails();
    userTravelRates: TravelMstNew[] = [];
    roles: any[] = [];
//    crDt: Date;
//    mdDt: Date;
//    deDt: Date;
    custShopName: string;
    custFirstName: string;
    custLastName: string;
    custGstNo: string;
    custGstType: GstMst = new GstMst();
//    custMaxQuotePerDay: number;
//    custDescription: string;
    custRateLabel: string;
//    custRelationshipManager: string;
//    custTravelDelivery: string;
//    custTravelVendor: any[] = [];
    emailVerified: boolean = false;
    mobileVerified: boolean = false;
//    userMobileNoOTP: string;
//    custTravelPayMode:string;
}
