/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
export class EnvelopMst {
    id:string;
    orgId: string;
    oprId: string;
    crTdBy: string;
    crDt: Date;
    mdDt: Date;
    envLength: string;
    envBreadth: string;
    envOpenLength: string;
    envOpenBreadth: string;
    envRateLength: string;
    envRateBreadth: string;
    envSize: string;
    envOpenSize: string;
    envRateSize: string;
}

export class EnvelopeSize {
    id:string;
    orgId: string;
    oprId: string;
    
    prodSizeL: number;
    prodSizeB: number;
    
    envelopeOpenSizeL: number;
    envelopeOpenSizeB: number;
    
    
}