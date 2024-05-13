import {Elements} from "./DyElements";

export class PrintrateMst
{   
    id:string;
    orgId: string;
    oprId: string;
    crTdBy: string;
    crDt: Date;
    mdDt: Date;
    printPaper: string;
    printVendor: string;
    printColor: string;
    printMachine: string;
    printMinLength: string;
    printMinBreadth: string;
    printMinSize: string;
    printMaxLength: string;
    printMaxBreadth: string;
    printMaxSize: string;
    printMinGsm: string;
    printMaxGsm: string;
    printMatter: string;
    pntFirstThousandRate: string;
    pntNextThousandRate: string;
    printRateLabel: string;
    pntFirstThousandPercent: string;
    pntNextThousandPercent: string;
    NewFirstThousandRate: string;
    NewNextThousandRate: string;
    PrintDyElements: Elements = new Elements();

}


