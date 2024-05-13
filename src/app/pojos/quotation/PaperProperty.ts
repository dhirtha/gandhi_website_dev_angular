import {AdGenralDtlMst} from "../AddGenralDetail";

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// package com.bezkoder.spring.jwt.mongodb.quotation.models;

// import org.springframework.data.annotation.Id;

export class PaperProperty
{
  
    id: string; 
    orgId: string;
    papBase: string;
    papType: string;
    papGSMs: AdGenralDtlMst[] = [];
    papSizs: AdGenralDtlMst[] = [];
    papLaminationType: AdGenralDtlMst[] = [];
    papDescription: string;
    defunct: boolean = false;
    papMills:AdGenralDtlMst[] = [];
    crDt: Date = new Date();
    mdDt: Date;
    deDt: Date;
    papLaminationSide: string;
    papLaminationMandatory: string;
    
}

