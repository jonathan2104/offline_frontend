import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DepositFormComponent} from "../modals/deposit-form/deposit-form.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TransactionService} from "../services/transaction.service";
import {WithdrawFormComponent} from "../modals/withdraw-form/withdraw-form.component";
import {UserService} from "../services/user.service";
import {DepositAutopayComponent} from "../modals/deposit-autopay/deposit-autopay.component";

@Component({
    selector: 'app-deposit',
    templateUrl: './deposit.component.html',
    styleUrls: ['./deposit.component.css']
})
export class DepositsComponent implements OnInit {
    deposit_requests: any = []
    withdraw_requests: any = []
    selectedTabIndex = 0;
    is_manual:boolean = true;

    constructor(public dialog: MatDialog, private transactionService: TransactionService, private _location: Location, private userService: UserService) {
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

    addDepositRequest(method: any) {
        if (method == 'auto-deposit') {
            this.openDialog('auto-deposit', method);
        } else {
            this.openDialog('deposit', method);
        }
    }

    addWithdrawRequest() {
        this.openDialog('withdraw');
    }

    getDepositRequests() {

        this.transactionService.getDepositRequests().subscribe((res: any) => {
            this.deposit_requests = res;
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

    openDialog(type: any, method?: any) {
        if (type == 'deposit') {
            const dialogRef = this.dialog.open(DepositFormComponent, {
                autoFocus: false,
                maxHeight: '100vh',
                disableClose: true,
                data: {method: method}
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                this.getDepositRequests();
            });
        }
        if (type == 'withdraw') {
            const dialogRef = this.dialog.open(WithdrawFormComponent, {autoFocus: false, maxHeight: '100vh'});
            dialogRef.afterClosed().subscribe((result: any) => {
                //console.log(`Dialog result: ${result}`);
            });
        }
        if (type == 'auto-deposit') {
            const dialogRef = this.dialog.open(DepositAutopayComponent, {
                autoFocus: false,
                maxHeight: '100vh',
                disableClose: true
            });
            dialogRef.afterClosed().subscribe((result: any) => {
                this.getDepositRequests();
            });
        }


    }

    selectTab(index: number): void {
        this.selectedTabIndex = index;
    }

    backClicked() {
        this._location.back();
    }

    changeManual(type:any){
        if(type=='instant') {
            this.is_manual = false;
        }
        else{
            this.is_manual = true;
        }

    }
}
