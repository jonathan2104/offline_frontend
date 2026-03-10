import {Component, OnInit} from '@angular/core';
import {LedgerService} from "../services/ledger.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-casinoledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css'],
})
export class CasinoLedgerComponent implements OnInit {
  panelOpenState = false;
  user_balance: any;

  ledger_data: any = [];
  updated_ledger_data: any = [];
  user_id = localStorage.getItem('user_id');

  constructor(private ledgerService: LedgerService, private userService: UserService) {
  }

  ngOnInit(): void {

  }

  getLedgerDataByDays(days: any) {
    this.ledgerService.getCasinoLedgerByDays(Number(days)).subscribe((res: any) => {
      this.ledger_data = res;
      this.userService.getUserBalance(this.user_id).subscribe((res: any) => {
        this.user_balance = res;
        let new_limit = this.user_balance.casino_balance;
        for (let i = 0; i <this.ledger_data.length ; i++) {
          const old_limit = new_limit - this.ledger_data[i].profit_loss;
          this.updated_ledger_data.push({...this.ledger_data[i], old_limit: old_limit,new_limit:new_limit});
          new_limit = old_limit;
        }
        //console.log(this.updated_ledger_data);
      });
    })
  }

}
