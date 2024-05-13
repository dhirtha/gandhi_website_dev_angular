import {Address} from "./oprAddress";
import {BankDetails} from "./BankDetails";
import {OprMst} from "./OPR_MST";
import {AdRoleMst} from "./Add_ROLE_MST";

export class UserMst {
    id: string;
    username: string;
    defaunt: boolean;
    userMobileNo: string;
    userContactNo: string;
    userGender: string;
    email: string;
    userAddress: Address = new Address();
    userBankDetail: BankDetails = new BankDetails();
    userOPRObj: OprMst = new OprMst();
    appRoleObj: AdRoleMst = new AdRoleMst();
    orgId: string;
    oprId: string;
    fullname: string;
    appRoleId: string;
    userOPRId: string;
    password: string;
    roles: string[] = [];
    userAadhar: string;
    userDob: string;
}


