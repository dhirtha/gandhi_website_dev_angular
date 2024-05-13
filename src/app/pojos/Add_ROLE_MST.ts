//export class AdRolePageMst{
//    id:string;
//    adRoleId: string;
//    adRolePageCreate: boolean;
//    adRolePageDelete: boolean;
//    adRolePageUpdate: boolean;
//    adRolePageView: boolean;
//    adRolePageName: string;
//    adRolePageRoutingUrl: string;
//    adRolePageModuleId: string;
//    oprId: string;
//    orgId: string;
//}
//export class  AdRoleMst{
//    id: string;
//    adRoleName: string;
//    orgId: string;
//    oprId: string;
//    defaunt: boolean;
//}
//
//
//export class RoleHeaderDetailRequest {
//     roleMstObj:AdRoleMst;
//     lstAdPageMst:AdRolePageMst[];
//}
//


export class AdRolePageMst{
    id:string;
    adRoleId: string;
    adRolePageCreate: boolean;
    adRolePageDelete: boolean;
    adRolePageUpdate: boolean;
    adRolePageView: boolean;
    adRolePageName: string;
    adRolePageRoutingUrl: string;
    adRolePageModuleId: string;
    adPageType: string;
    oprId: string;
    orgId: string;
}
export class  AdRoleMst{
    id: string;
    adRoleName: string;
    orgId: string;
    oprId: string;
    defaunt: boolean;
}


export class RoleHeaderDetailRequest {
     roleMstObj:AdRoleMst;
     lstAdPageMst:AdRolePageMst[];
}


