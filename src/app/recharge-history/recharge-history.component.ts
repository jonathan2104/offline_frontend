import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TransactionService} from "../services/transaction.service";

@Component({
  selector: 'app-recharge-history',
  templateUrl: './recharge-history.component.html',
  styleUrls: ['./recharge-history.component.css']
})
export class RechargeHistoryComponent implements OnInit {

  transactionDetails:any;

  constructor(private router: Router, private transactionService:TransactionService) {
  }

  ngOnInit(): void{
    let user_id = localStorage.getItem("user_id")!;
    this.transactionService.getTransactionDetails(parseInt(user_id)).subscribe((res)=>{
      this.transactionDetails = res;
    })
  }

  rechargeWallet() {
    this.router.navigateByUrl('/dashboard/recharge-wallet');
  }

}
