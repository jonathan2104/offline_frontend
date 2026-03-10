import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {TransactionService} from "../../services/transaction.service";
import {UserService} from "../../services/user.service";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-withdraw-form',
  templateUrl: './withdraw-form.component.html',
  styleUrls: ['./withdraw-form.component.css']
})
export class WithdrawFormComponent implements OnInit {
  withdrawForm: any;
  errorMsg: any;
  submitted = false;
  msgs:any = [];

  user_id = localStorage.getItem('user_id')

  username = localStorage.getItem('username');
  showUpiTextbox: boolean = false;
  showUpiOtherbox: boolean = false;
  client_master:any = 1;

  clicked:boolean=false;
  isClientMasterLoaded:boolean=false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private transactionService: TransactionService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.withdrawForm = this.fb.group({
      user_id: [this.user_id, Validators.required],
      txn_type: ['', Validators.required],
      upi: [''],
      amount: ['', [Validators.required, Validators.min(100)]],
      account_name: [''],
      account_id: [''],
      ifsc_code: [''],
      bank_name: [''],
      branch: [''],
      username: [this.username, Validators.required],
    });
    // Add custom validation for 'upi' field
    this.withdrawForm.get('txn_type').valueChanges.subscribe((value: string) => {
      const upiControl = this.withdrawForm.get('upi');
      if (value === 'upi') {
        upiControl.setValidators([Validators.required]);
      } else {
        upiControl.clearValidators();
      }
      upiControl.updateValueAndValidity();
    });
    this.clientMaster();
    this.setBankDetails();
  }

  setBankDetails(){
    this.withdrawForm.patchValue({branch: 'default'});
    this.withdrawForm.patchValue({account_name: this.data.withdrawAc.account_name});
    this.withdrawForm.patchValue({account_id: this.data.withdrawAc.account_no});
    this.withdrawForm.patchValue({ifsc_code: this.data.withdrawAc.ifsc_code});
    this.withdrawForm.patchValue({bank_name: this.data.withdrawAc.bank_name});
  }
  
  clientMaster(){
    this.userService.getUserMaster(this.user_id).subscribe((res: any) => {
      this.client_master = res.added_by;
      this.isClientMasterLoaded = true;
    });
  }

  get withdrawFormControl() {
    return this.withdrawForm.controls;
  }

  toggleUpiTextbox() {
    this.showUpiTextbox = true;
    this.showUpiOtherbox = false;
  }

  toggleBankbox() {
    this.showUpiOtherbox = true;
    this.showUpiTextbox = false;
  }

  addWithdrawRequest() {
    this.submitted = true;
    if (this.withdrawForm.invalid) {
      Object.keys(this.withdrawForm.controls).forEach(field => {
        const control = this.withdrawForm.get(field);
        if (control && !control.valid) {
          console.error(`Validation error in ${field} field:`, control.errors);
        }
      });
      return;
    } else {
      let request_details:any;
      if(this.withdrawForm.value.txn_type=='bank'){
        request_details = {
        user_id: this.user_id,
        amount: this.withdrawForm.value.amount,
        txn_type:this.withdrawForm.value.txn_type,
        account_name: this.withdrawForm.value.account_name,
        account_id: this.withdrawForm.value.account_id,
        ifsc_code: this.withdrawForm.value.ifsc_code,
        bank_name: this.withdrawForm.value.bank_name,
        branch: this.withdrawForm.value.branch,
        username: this.username
      };
      }else if(this.withdrawForm.value.txn_type=='upi'){
        request_details = {
        user_id: this.user_id,
        amount: this.withdrawForm.value.amount,
        txn_type:this.withdrawForm.value.txn_type,
        upi:this.withdrawForm.value.upi,
        username: this.username
      };
      }
      var admin_id = 1;
      if(!this.isClientMasterLoaded){
        this.toastr.error('Something went wrong');
        this.dismiss();
        return;
      }
      var transfer_data = {
        'amount':request_details.amount,
        'transfer_by':admin_id,
        'transfer_from_id':request_details.user_id,
        'transfer_to_id':this.client_master
      };
      this.clicked=true;
      this.transactionService.addWithdrawRequest(request_details).subscribe((res: any) => {
        if (res.error) {
          this.errorMsg = res.error;
        } else {
          if (res.affectedRows > 0) {
            this.userService.transferFund({ ...transfer_data, type: "withdraw"}).subscribe((res: any) => {
              if (res.errors) {
                this.errorMsg = res.errors;
              } else {
                this.clicked=false;
                this.toastr.success('Withdraw Request Sent');
                this.dismiss();
              }
            });
          }else{
            this.toastr.error('Something went wrong');
                this.dismiss();
          }
        }
      }, (error:any) => {
        //console.log('print-->', error.error.errors);
        this.errorMsg = error.error.errors;
        this.msgs = [];
        this.errorMsg.forEach((obj: any) => {
          Object.values(obj);
          this.msgs.push(Object.values(obj));
          this.toastr.error(this.msgs[0]);
        });
      });
    }
  }


  dismiss() {
    this.dialogRef.close();
  }

}
