import {GradeMst} from "./Add_Grade";
import {OprMst} from "./OPR_MST";
import {RoleHeaderDetailRequest, AdRoleMst} from "./Add_ROLE_MST";
import {UserMst} from "./user-mst";

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export interface DialogData {
    alertMessage: string;
    firstButtonText: string;
    secoundButtonText: string;
    element: GradeMst;
    elements: OprMst;
    roleElement: AdRoleMst;
    elementUser:UserMst;
    formMode: string;
    paramObj:any;
//    roleElement: RoleHeaderDetailRequest;
}
