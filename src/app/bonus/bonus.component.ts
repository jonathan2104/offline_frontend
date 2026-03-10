import {Component, OnInit} from '@angular/core';
import {LedgerService} from "../services/ledger.service";
import {UserService} from "../services/user.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Location} from '@angular/common';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'bonus-ledger',
  templateUrl: './bonus.component.html',
  styleUrls: ['./bonus.component.css'],
})
export class BonusComponent implements OnInit {
  panelOpenState = false;
  user_balance: any;
  FilterForm:any;
  Bonus:number;
  submitted = false;

  ledger_data: any = [];
  updated_ledger_data: any = [];
  user_id = localStorage.getItem('user_id');
  activeTab: string = 'accountStatement';

  constructor(private fb: FormBuilder,private ledgerService: LedgerService, private userService: UserService, private _location: Location, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    this.FilterForm = this.fb.group({
      from: [new Date().toISOString().substring(0, 10), Validators.required],
      to: [new Date().toISOString().substring(0, 10), Validators.required]
    });
    
    this.userService.getUserBonus(this.user_id).subscribe((res: any) => {
      console.log(res)
      this.Bonus = res.bonus;
    });
  }

  get filterFormControl() {
    return this.FilterForm.controls;
  }

 

  convert () {
    this.convertBonusAmount();
  }

  convertBonusAmount() {
   
    if(confirm("Are you sure? \n you want to redeem your bonus.")) {
      const bonus_data = {'user_id':this.user_id,'bonus_amount':this.Bonus};
      this.userService.convertBonus(bonus_data).subscribe((res: any) => {
        
        if(res.error!=null){
          this.toastr.error("Amount must be greater than 100",res.err)
        }
        else{
          this.Bonus = 0; 
          this.toastr.success("Bonus claimed Succesfully");
        }
      });
    }
  }

  switchToTab(tab: string) {
    this.activeTab = tab;
  }

  backClicked(){
    this._location.back();
  }
}
