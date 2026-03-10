import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators, AbstractControl, ValidatorFn} from "@angular/forms";
import {TransactionService} from "../../services/transaction.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-withdraw-form',
  templateUrl: './withdraw-form.component.html',
  styleUrls: ['./withdraw-form.component.css']
})
export class CasinoWithdrawComponent implements OnInit {
  user_id = localStorage.getItem('user_id');
  withdrawForm: any;
  errorMsg: any;
  submitted = false;
  casinopoints=0;
  displayBalance=0;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService,private userService: UserService, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required,this.dynamicMaxValidator(), Validators.min(1)]],
    });
    this.userService.refreshBalance.subscribe(() => {
      this.getBalance();
    })
    this.getBalance();

    // Listen for changes in the 'amount' field
    this.withdrawForm.get('amount')?.valueChanges.subscribe(() => {
      this.calculateNewBalance();
    });
  }

  get withdrawFormControl() {
    return this.withdrawForm.controls;
  }

  getBalance() {
    this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
      this.casinopoints = data.casino_balance;
      this.displayBalance = this.casinopoints;
    })
  }

  calculateNewBalance() {
    const amount = this.withdrawForm.get('amount')?.value;
    if (amount !== null && amount !== undefined && amount <= this.casinopoints && amount > 0) {
      this.displayBalance = this.casinopoints - amount;
    }else{
      this.displayBalance = this.casinopoints;
    }
  }

  dynamicMaxValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const amount = control.value;

      if (amount > this.casinopoints) {
        return { 'max': true };
      }

      return null;
    };
  }

  addWithdrawRequest() {
    this.submitted = true;
    if (this.withdrawForm.valid) {
      this.transactionService.addCasinoWithdrawRequest(this.withdrawForm.value).subscribe((res: any) => {
        if (res.error) {
          this.errorMsg = res.error;
        } else {
          this.toastr.success('Withdraw Request Sent');
          this.dismiss();
        }
      })
    }
  }

  dismiss() {
    this.dialogRef.close();
  }

}
