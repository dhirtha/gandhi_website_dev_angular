import {Address} from "./oprAddress";

export class TravelMst
{
    id:string;
    orgId:string;
    oprId:string;
    crTdBy:string;
    crDt:Date;
    mdDt:Date;
    trvlVendor: string;
    trvlRate1: string;
    trvlRate2: string;
    trvlRate3: string;
    trvlRate4: string;
    trvlRate5: string;
    trvlAddress: Address = new Address();

}


