/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


export class PostPress
{
    id: string;
    postPressFormName: string;
    postPressDescription: string;
    postPressImageURL: string;
    lstFormFields: FormFields[] = [];
    defunct: boolean = false;
}

export class FormFields
{
    fpriority: number;
    fName: string;
    fValue: string;
    fIsMandatory: boolean = false;
    fErrorMessage: string;
    ffType: FormField;
    fAlign: string;
    fMaxLength: string;
    fMinLength: string;
    fId: string;
    lstFormSubFileds: FormSubFiledsValues[] = [];
    defunct: boolean = false;
}

export class FormSubFiledsValues
{
    key: string;
    value: string;
}
export class FormField
{
    id: string;
    fType: string;
    fCss: string;
}