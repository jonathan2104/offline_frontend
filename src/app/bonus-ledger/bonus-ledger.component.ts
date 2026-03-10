import {Component, OnInit} from '@angular/core';
import {LedgerService} from "../services/ledger.service";
import {UserService} from "../services/user.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Location} from '@angular/common';

@Component({
  selector: 'app-bonus-ledger',
  templateUrl: './bonus-ledger.component.html',
  styleUrls: ['./bonus-ledger.component.css'],
})
export class BonusLedgerComponent implements OnInit {
  panelOpenState = false;
  user_balance: any;
  user_bonus: any;
  FilterForm:any;
  submitted = false;

  ledger_data: any = [];
  updated_ledger_data: any = [];
  user_id = localStorage.getItem('user_id');
  activeTab: string = 'accountStatement';

  constructor(private fb: FormBuilder,private ledgerService: LedgerService, private userService: UserService, private _location: Location) {
  }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      from: [new Date().toISOString().substring(0, 10), Validators.required],
      to: [new Date().toISOString().substring(0, 10), Validators.required]
    });
    const currentDate = new Date();
    const threeDaysBefore = new Date();
    threeDaysBefore.setDate(currentDate.getDate() - 3);
    this.FilterForm.get('from').setValue(threeDaysBefore.toISOString().substring(0, 10));
  }

  get filterFormControl() {
    return this.FilterForm.controls;
  }

  daysDiff(start:any,end:any) {
    let start_date = new Date(start);
    let end_date = new Date(end);
    const startUTC = Date.UTC(start_date.getFullYear(), start_date.getMonth(), start_date.getDate());
    const endUTC = Date.UTC(end_date.getFullYear(), end_date.getMonth(), end_date.getDate());

    const diffInMs = endUTC - startUTC;
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  }

  filter () {
    const days = this.daysDiff(this.FilterForm.value.from,this.FilterForm.value.to);
    this.getBonusLedgerDatabyDays(days);
  }


  getBonusLedgerDatabyDays(days: any){
    this.ledgerService.getBonusLedgerByDays(Number(days)).subscribe((res: any) => {
      this.ledger_data = res;
      let ladgerData:any = [];
      this.userService.getUserBonus(this.user_id).subscribe((res: any) => {
        this.user_bonus = res;
        let new_limit = this.user_bonus.bonus;
        for (let i = 0; i <this.ledger_data.length ; i++) {
          const old_limit = new_limit - this.ledger_data[i].amount;
          ladgerData.push({...this.ledger_data[i], old_limit: old_limit,new_limit:new_limit});
          new_limit = old_limit;
        }
        this.updated_ledger_data = ladgerData;
        //console.log(this.updated_ledger_data);
      });
    })
  }

  switchToTab(tab: string) {
    this.activeTab = tab;
  }

  backClicked(){
    this._location.back();
  }
}
