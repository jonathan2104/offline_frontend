import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransactionService} from "../../services/transaction.service";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupModalComponent implements OnInit {
  public popupImg: any;
  imageBaseUrl:any = environment.image_url

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<any>, private fb: FormBuilder,private transactionService:TransactionService) {
  }

  ngOnInit(): void {
    this.getPopupDataRequests();
  }

  getPopupDataRequests() {
    this.transactionService.getPopupDataRequests().subscribe((res: any) => {
      if(res[0].popup_img){
        this.popupImg = this.imageBaseUrl+res[0].popup_img;
      }else{
        this.dismiss();
      }
    });
  }
  
  dismiss() {
  this.dialogRef.close();
  }
}
