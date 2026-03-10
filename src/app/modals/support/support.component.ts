import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransactionService} from "../../services/transaction.service";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  deposit_whatsapp:string = '';
  withdraw_whatsapp:string = '';
  technical_whatsapp:string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<any>,private transactionService:TransactionService) {
  }

  ngOnInit(): void {
    this.getPopupDataRequests();
  }

  depositSupport(){
    location.href = "https://wa.me/91"+this.deposit_whatsapp;
  }

  withdrawSupport(){
    location.href = "https://wa.me/91"+this.withdraw_whatsapp;
  }

  techSupport(){
    location.href = "https://wa.me/91"+this.technical_whatsapp;
  }

  getPopupDataRequests() {
    this.transactionService.getPopupDataRequests().subscribe((res: any) => {
      this.deposit_whatsapp = res[0].deposit_whatsapp;
      this.withdraw_whatsapp = res[0].withdraw_whatsapp;
      this.technical_whatsapp = res[0].technical_whatsapp;
    });
  }

  dismiss() {
    this.dialogRef.close();
  }
}
