import {Component, OnInit} from '@angular/core';
import {DepositFormComponent} from "../modals/deposit-form/deposit-form.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TransactionService} from "../services/transaction.service";
import {WithdrawFormComponent} from "../modals/withdraw-form/withdraw-form.component";

@Component({
  selector: 'app-dw-requests',
  templateUrl: './dw-requests.component.html',
  styleUrls: ['./dw-requests.component.css']
})
export class DwRequestsComponent implements OnInit {
  deposit_requests: any = []
  withdraw_requests: any = []
  selectedTabIndex = 0;

  constructor(public dialog: MatDialog, private transactionService: TransactionService) {
  }

  ngOnInit(): void {
    this.getDepositRequests();
    this.getWithdrawRequests();
    this.transactionService.refreshDepositRequests.subscribe(() => {
      this.getDepositRequests();
    });
    this.transactionService.refreshWithdrawRequests.subscribe(() => {
      this.getWithdrawRequests();
    });
  }

  addDepositRequest() {
    this.openDialog('deposit');
  }

  addWithdrawRequest() {
    this.openDialog('withdraw');
  }

  getDepositRequests() {
    this.transactionService.getDepositRequests().subscribe((res: any) => {
      this.deposit_requests = res;
      // console.log(this.deposit_requests);
    });
  }

  getWithdrawRequests() {
    this.transactionService.getWithdrawRequests().subscribe((res: any) => {
      this.withdraw_requests = res;
      // console.log(this.withdraw_requests);
    });
  }

  config: MatDialogConfig = {
    disableClose: false,
    hasBackdrop: true,
    backdropClass: 'test',
    width: '90%',
    height: '50%',
    panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
  };

  openDialog(type: any) {
    if (type == 'deposit') {
      const dialogRef = this.dialog.open(DepositFormComponent, {});
      dialogRef.afterClosed().subscribe((result: any) => {
        //console.log(`Dialog result: ${result}`);
      });
    }
    if (type == 'withdraw') {
      const dialogRef = this.dialog.open(WithdrawFormComponent, {});
      dialogRef.afterClosed().subscribe((result: any) => {
        //console.log(`Dialog result: ${result}`);
      });
    }


  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }

}
