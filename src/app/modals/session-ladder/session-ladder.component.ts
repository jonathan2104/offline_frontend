import { Component, OnInit, Inject  } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {MatDialogRef} from "@angular/material/dialog";
import {SessionBetsService} from "../../services/session-bets.service";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-session-ladder',
  templateUrl: './session-ladder.component.html',
  styleUrls: ['./session-ladder.component.css']
})
export class SessionLadder implements OnInit {
  submitted = false;
  session_bets: any[] = [];
  runnerName:any ;
  eventId:any;
  betAmount:any;
  firstLadder:any;
  ladderArray:any=[];
  type:any;
  win_amount:any=0;
  loss_amount:any=0;
  updatedBet_amount:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private router: Router, private fb: FormBuilder, public dialogRef: MatDialogRef<any>,  private _authService: AuthService, private toastr:ToastrService, private sessionBetsService: SessionBetsService ) {
    this.runnerName=data.runner;
    this.eventId=data.event_id
   }

  ngOnInit(): void {
    this.getSessionBets();
  }




  getSessionBets() {
    this.sessionBetsService.getSessionBet(this.eventId).subscribe((data: any) => {
      this.session_bets = data;
      // console.log(this.session_bets)
      const matchingElement = this.session_bets.filter(element => element.runner_name === this.runnerName);
      if (matchingElement) {

        for(let i=0; i<matchingElement.length;i++){
          this.type=matchingElement[i].type
          this.betAmount=matchingElement[i].price
          this.win_amount = matchingElement[i].win_amount
          this.firstLadder=this.betAmount-4
          for(let i=0;i<=7;i++){
              this.ladderArray[i]={ladder:this.firstLadder+i,bet_amount: 0}
          }
        }
        for(let i=0; i<matchingElement.length;i++){
          this.type=matchingElement[i].type
          this.betAmount=matchingElement[i].price
          this.win_amount = matchingElement[i].win_amount
          this.loss_amount = matchingElement[i].loss_amount
          this.firstLadder=this.betAmount-4
          if(this.type=='Back'){
            for(let i=0;i<this.ladderArray.length;i++){
              if(this.ladderArray[i].ladder<this.betAmount){
                  this.ladderArray[i].bet_amount=this.ladderArray[i].bet_amount+this.loss_amount
              }
              else{
                this.ladderArray[i].bet_amount=this.ladderArray[i].bet_amount+this.win_amount
              }
            }
          }
          else{
            for(let i=0;i<this.ladderArray.length;i++){
              if(this.ladderArray[i].ladder>=this.betAmount){
                  this.ladderArray[i].bet_amount=this.ladderArray[i].bet_amount+this.loss_amount
              }
              else{
                this.ladderArray[i].bet_amount=this.ladderArray[i].bet_amount+this.win_amount
              }
            }
          }

        }
      } else {
        console.log('false');
      }
    })
  }


  closeDialog() {
    this.dialogRef.close();
  }

}
