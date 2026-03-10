import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DepositFormComponent} from "../modals/deposit-form/deposit-form.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TransactionService} from "../services/transaction.service";
import {WithdrawFormComponent} from "../modals/withdraw-form/withdraw-form.component";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {ProofListComponent} from "../modals/proof-list/proof-list.component";

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawsComponent implements OnInit {
  deposit_requests: any = []
  withdraw_requests: any = []
  selectedTabIndex = 0;
  username = localStorage.getItem('username');
  canwithdrawal:boolean=this.username!='demo';
  technical_whatsapp: string = '';

  constructor(public dialog: MatDialog, private transactionService: TransactionService,private imageLightBoxService: NgbModal,private _location: Location) {
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
    this.transactionService.getPopupDataRequests().subscribe((res: any) => {
        this.technical_whatsapp = res[0].technical_whatsapp;
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
      this.withdraw_requests = res.sort((a:any, b:any) => b.id - a.id);
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
      const dialogRef = this.dialog.open(DepositFormComponent, { autoFocus: false, maxHeight: '100vh' });
      dialogRef.afterClosed().subscribe((result: any) => {
        //console.log(`Dialog result: ${result}`);
      });
    }
    if (type == 'withdraw') {
      const dialogRef = this.dialog.open(WithdrawFormComponent, { autoFocus: false, maxHeight: '100vh' });
      dialogRef.afterClosed().subscribe((result: any) => {
        //console.log(`Dialog result: ${result}`);
      });
    }


  }

  selectTab(index: number): void {
    this.selectedTabIndex = index;
  }

  openProofListModal(id:number){
    const config: NgbModalOptions = {
      backdrop: 'static',
    };
    const modalRef = this.imageLightBoxService.open(ProofListComponent,config);
    modalRef.componentInstance.withdraw_id = id;
  }

  backClicked(){
    this._location.back();
  }
  openWhatsapp() {
    window.open('https://wa.me/' + this.technical_whatsapp, '_blank');
  }

  whatsapp(){
    this.transactionService.getMasterWhatsappByUser().subscribe((res: any) => {
        window.open("https://wa.me/" + res[0].deposit_whatsapp, "_blank");
    });
  }
}
