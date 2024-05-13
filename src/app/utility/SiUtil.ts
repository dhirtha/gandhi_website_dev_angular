import {Injectable} from '@angular/core';
import {Verification} from './Verification';
import swal from 'sweetalert';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable()
export class SiUtil {

 public MSG_TITLE:string="Are You Sure?";
 public VALIDATION_MSG:string="Please Enter All Mandatory Fields";
 public SAVE_CONFIRMATION_MSG:string="Are you sure want to save this page?";
 public CLOSE_CONFIRMATION_MSG:string="Are you sure you want to close it?";
 public SAVE_MSG:string="Your Record has been Saved Successfully";
 public UPDATE_CONFIRMATION_MSG:string="Are you sure want to update this page?";
 public UPDATE_MSG:string="Your Record has been Updated Successfully";
 public DELETE_CONFIRMATION_MSG:string="Are you sure want to delete this page?";
 public DELETE_MSG:string="Your Record has been Deleted Successfully";
 public ABORT_MSG:string="Abort Transaction";
 public INFO_ICON:string="info";
 public SUCCESS_ICON:string="success";
 public WARNING_ICON:string="warning";
 public ERROR_ICON:string="error";
 
    
       
             constructor(
        public verification: Verification,
        private dialog:MatDialog,
        private snackBar: MatSnackBar
        
    ) {





    }
    
    displayDialog(component:any ,mode:string, paramData?:any)
    {
           const dialogRef = this.dialog.open(component, {

            width: '60%',
            height: '85%',
//            backdropClass: 'custom-dialog-backdrop-class',
//            panelClass: 'custom-dialog-panel-class',
               data: {formMode: mode, paramObj: paramData ||null}
        });
          dialogRef.afterClosed().subscribe(result => {

            console.log('The dialog was closed');
        });

        
    }

    toastError( msg:string)
    {
        return swal("Error?", msg, "error");
    }
    
    toastInfo(heading : string, msg:string)
    {
        return swal(heading, msg, "info");
    }
    
    toastSuccess( msg:string)
    {
        return swal("Success!", msg, "success");
    }
    
    toastWarning(heading : string, msg:string)
    {
        return swal(heading, msg, "warning");
    }
    toastIAccept()
    {
        return swal({
            title: "Agreement",
            text: "In case we fail to deliver. Only express delivery charges will be refunded full order will not be cancelled.",
            icon: 'info',
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: 
                {
                    confirm: {
                        text: "I Agree",
                        value: true,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,
                    }
                }
        })
        
    }
    toastConfirmationUpdate()
    {
        return swal({
            title: "Update Confirmation",
            text: "Are Your Sure want to Update?",
            icon: 'question',
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: 
                {
                    cancel: {
                        text: "Cancel",
                        value: false,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,
                    },
                    confirm: {
                        text: "OK",
                        value: true,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,


                    }
                }
        })
        
    }
    toastConfirmationSave()
    {
        return swal({
            title: "Save Confirmation",
            text: "Are Your Sure want to Save?",
            icon: 'question',
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: 
                {
                    cancel: {
                        text: "Cancel",
                        value: false,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,
                    },
                    confirm: {
                        text: "OK",
                        value: true,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,


                    }
                }
        })
        
    }
    
    toastConfirmationDelete()
    {
        return swal({
            title: "Delete Confirmation",
            text: "Are Your Sure want to delete?",
            icon: 'question',
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: 
                {
                    cancel: {
                        text: "Cancel",
                        value: false,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,
                    },
                    confirm: {
                        text: "OK",
                        value: true,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,

                    }
                }
        })
    }
    
    toastRemoveConfirmation()
    {
        return swal({
            title: "Remove Confirmation",
            text: "Are Your Sure want to remove?",
//            icon: 'question',
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: 
                {
                    cancel: {
                        text: "Cancel",
                        value: false,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,
                    },
                    confirm: {
                        text: "OK",
                        value: true,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,

                    }
                }
        })
    }
    
    toastLogOutConfirmation()
    {
        return swal({
            title: "Log Out Confirmation",
            text: "Are Your Sure want to logout?",
//            icon: 'question',
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: 
                {
                    cancel: {
                        text: "Cancel",
                        value: false,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,
                    },
                    confirm: {
                        text: "OK",
                        value: true,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,

                    }
                }
        })
    }
    
    toastConfirmation_Save(bodyText:string, icon:string)
    {
         return new Promise((resolve, reject) =>
         {
        swal({
            title: "Are you sure?",
            text: bodyText,
            icon: icon,
            dangerMode: true,
            closeOnClickOutside: false,
            closeOnEsc: false,
            buttons: 
                {
                    cancel: {
                        text: "Cancel",
                        value: false,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,
                    },
                    confirm: {
                        text: "OK",
                        value: true,
                        visible: true,
                        className: "swal-button",
                        closeModal: true,


                    }
                }
        })
            .then(async status => {
                if (status) {
                    resolve (status);
                }
                else{
                    reject(null)
                }
            });
             }) 
            
    }
    
    showLoading()
    {
        return true;
    }
    
    hideLoading()
    {
        return false;
    }
    
    showSnackBar(message: string, duration: number, horizontalPosition: any, verticalPosition: any, action?: any)
    {
        this.snackBar.open(message, action, {
            duration: duration,
            horizontalPosition: horizontalPosition,
            verticalPosition: verticalPosition
        });
    }

}