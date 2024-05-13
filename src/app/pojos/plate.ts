import {Elements} from "./DyElements";

export class PlateMst {
    id: string;
    orgId: string;
    oprId: string;
    crTdBy: string;
    crDt: Date;
    mdDt: Date;
    defaunt: boolean = false;
    plate: string;
    vendor: string;
    purchaseRate: string;
    sellingRate: string;
    sellingRateFormula: string;
    McDyElements: Elements = new Elements();

}