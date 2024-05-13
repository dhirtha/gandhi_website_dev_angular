import {Address} from "./oprAddress";

export class TravelMstNew
{
    id:string;
    
    orgId:string;
    oprId:string;
    
    travelName: string;
    travelNgpAdd : string;
    travelSourceAdd: Address = new Address();
    travelNgpContNo : string;

    travelDestinationName : string;
    travelDestAdd: Address = new Address();
    
    travelDestinationContNo : string;

    travelPayMode : string;

    travelService : string;
    travelWeeklyOff : string;
    travelSecureTime : number;
    travelLastBookingTime: number;

    travelRate_1_5kg: number;
    travelRate_5_10kg: number;
    travelRate_10_20kg: number;
    travelRate_20_30kg: number;
    
    
    //Fields For QuotationRate
    quotTotalWeight:number;
    quotNoOfBundle:number;
    quotRatePerBundle:number;
    quotTravelAmount:number;

    defunct: boolean = false;

}


