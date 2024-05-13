import {BankDetails} from "./BankDetails";
import {Address} from "./oprAddress";

export class OprMst{
  
    id:string;
    oprName:string;
    defaunt:boolean=false;
    oprId:string;
    oprBusinessName:string;
    oprAuthorityName:string;
    oprEmail:string;
    oprBusinessEmail:string;
    oprCurrency:string;
    oprFaxNumber:number;
    oprAddress:Address =new Address();
    bankDetails:BankDetails =new BankDetails();
    oprMobileNo:string;
    oprContactNo:string;
    oprGst:number;
    orgId: string;

}


