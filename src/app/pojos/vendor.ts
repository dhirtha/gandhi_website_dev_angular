import {Address} from "./oprAddress";
import {BankDetails} from "./BankDetails";

export class Vendor
{
    id:string;
    orgId:string;
    crDt:Date;
    mdDt:Date;
    defunct:boolean = false;
    vendorName:string;
    vendorCode:string;
    vendorType:string;
    vendorCategory:string;
    vendorFaxNumber:string;
    vendorGst:string;
    vendorAuthorityName:string;
    vendorMobileNo:string;
    vendorContactNo:string;
    vendorEmail:string;
    vendorDescription:string;
    vendorRemark:string;
    vendorAddress: Address = new Address();
    vendorBankDetail: BankDetails = new BankDetails();
    vendorServiceType:string;
    vendorWeeklyOff:string;
    vendorWeekOffDay:string;
    vendorSecureTime:Date;
    vendorBookTime:Date;
}