//import {Injectable} from "@angular/core";
//
//@Injectable({
//    providedIn: 'root'
//})
//export class Validator
//{
//    validateField(fieldName: string)
//    {
//        if (typeof fieldName == "undefined")
//        {
//            return false;
//        }
//        else
//        {
//            return true;
//        }
//    }
//    
//    validateEmailId(emailId: string)
//    {
//        if (emailId)
//        {
//            var checkEmailId = emailId.match("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
//            if (checkEmailId)
//            {
//                return true;
//            }
//            else 
//            {
//                return false;
//            }
//        }
//        else
//        {
//            return this.validateField(emailId);
//        }
//    }
//    
//    validatePhoneNumber(phoneNumber: number)
//    {
//        if (phoneNumber)
//        {
//            var checkPhoneNumber = phoneNumber.toString().match("^[0-9]{10,11}$");
//            if (checkPhoneNumber)
//            {
//                return true;
//            }
//            else 
//            {
//                return false;
//            }
//        }
//        else
//        {
//            return this.validateField(phoneNumber.toString());
//        }
//    }
//    
//    
//    
//}