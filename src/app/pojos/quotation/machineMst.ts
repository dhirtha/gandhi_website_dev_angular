import {AdGenralDtlMst} from "../AddGenralDetail";

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

export class MachineMst
{
    id: string;
    orgId: string;
    oprId: string;
    defunct: boolean;
    crDt: Date;
    mdDt: Date;
    deDt: Date;
    macName: string;
    macType: string;
    macColors: AdGenralDtlMst[] = [];
    macMinPrintLength: string;
    macMinPrintBreadth: string;
    macMinPrintSize: string;
    macMaxPrintLength: string;
    macMaxPrintBreadth: string;
    macMaxPrintSize: string;
    macGripperSize: string;
    macPlate: AdGenralDtlMst[] = [];
}
