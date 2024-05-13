export class USER_MST{
    ORG_KEY:string;
    OPR_KEY:string;
    DEFUNCT:boolean;
    CR_DT:Date;
    USER_TITLE:string;
    USER_EMAIL:string;
    USER_PASSWORD:string;
    USER_FIRST_NAME:string;
    USER_LAST_NAME:string;
    USER_DOB:Date;
    // USER_COUNTRY_NAME:string;
    USER_STATE_NAME:string;
    USER_CITY_NAME:string;
    USER_ADDRESS_1:string;
    USER_ADDRESS_2:string;
    USER_CON_1:string;
    USER_CON_2:string;
    USER_DESIGNATION:string;
    ROLE:string;
    USER_LEVEL:string;
    USER_PROFILE_IMG:string;
    key: any;
    USER_ID: string;

}

export interface AddUser {
    userObj:any;
    password:string;
    saveUser:boolean;
    updateUser:boolean;
    phonecode:string;
}