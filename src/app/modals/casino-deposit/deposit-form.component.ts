import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators, AbstractControl, ValidatorFn} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransactionService} from "../../services/transaction.service";
import {ToastrService} from "ngx-toastr";
import {UserService} from "../../services/user.service";
import {ExposureService} from "../../services/exposure.service";

@Component({
  selector: 'app-deposit-form',
  templateUrl: './deposit-form.component.html',
  styleUrls: ['./deposit-form.component.css']
})
export class CasinoDepositComponent implements OnInit {
  user_id = localStorage.getItem('user_id')
  balance = 0;
  exposure = 0;
  depositForm: any;
  errorMsg: any;
  submitted = false;
  mainbalance = 0;
  displayBalance = 0;
  showUpiTextbox: boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService, private userService: UserService, private exposureService: ExposureService, public dialogRef: MatDialogRef<any>, private fb: FormBuilder,private transactionService:TransactionService) {
  }

  ngOnInit(): void {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required,this.dynamicMaxValidator(), Validators.min(1)]],
    });
    this.userService.refreshBalance.subscribe(() => {
      this.getBalance();
    })
    this.getBalance();
    this.exposureService.refresh.subscribe(() => {
      this.getExposureDetails();
    })
    this.getExposureDetails();

    // Listen for changes in the 'amount' field
    this.depositForm.get('amount')?.valueChanges.subscribe(() => {
      this.calculateNewBalance();
    });
  }

  get depositFormControl() {
    return this.depositForm.controls;
  }

  calculateNewBalance() {
    const amount = this.depositForm.get('amount')?.value;
    if (amount !== null && amount !== undefined && amount <= this.mainbalance && amount > 0) {
      this.displayBalance = this.mainbalance - amount;
    }else{
      this.displayBalance = this.mainbalance;
    }
  }

  dynamicMaxValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const amount = control.value;

      if (amount > this.mainbalance) {
        return { 'max': true };
      }

      return null;
    };
  }

  getExposureDetails() {
    this.exposureService.getExposure().subscribe((data: any) => {
      this.exposure = data[0].exp_amount;
      this.mainbalance = this.balance+this.exposure;
      this.displayBalance = this.mainbalance;
    })
  }

  getBalance() {
    this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
      this.balance = data.balance;
      this.mainbalance = this.balance+this.exposure;
      this.displayBalance = this.mainbalance;
    })
  }

  addDepositRequest() {
    this.submitted = true;
    if (this.depositForm.valid) {
      this.transactionService.addCasinoDepositRequest(this.depositForm.value).subscribe((res: any) => {
        if (res.error) {
          this.errorMsg = res.error;
        } else {
          this.toastr.success('Deposit Request Sent');
          this.dismiss();
        }
      })
    }
  }

  dismiss() {
  this.dialogRef.close();
  }
}
