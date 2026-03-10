import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import { Router} from '@angular/router';
import {CasinoBetsService} from "../../../services/casino/casino-bets.service";

@Component({
  selector: 'app-casino-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class CasinoDCardTreeTwoAPopupComponent implements OnInit {
  passwordForm: any;
  errorMsg: any;
  submitted = false;
  details: any = {};
  player1: any = [];
  player2: any = [];
  player3: any = [];
  player4: any = [];
  main_groups:any = [];
  main_totals:any = [];
  winner: any = '';
  casino_bets: any = [];
    filter_bets: any = [];
    totalbets: number = 0;
    totalAmount: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private casinoBetsService:CasinoBetsService,private router: Router, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService) {

  }


  ngOnInit(): void {
    this.dialogRef.updateSize('100%',);
    // this.getTeenPattiDetails();
    if(!this.data.acc_state){
      this.getTeenPattiDetails();
      }else{
        this.getCasinoResultonMarketId();
      }
      this.getCasinoBetsByMarketID();
  }

  getCasinoResultonMarketId(){
    this.casinoBetsService.getCasinoResultonMarketId(this.data.mid).subscribe((res:any)=>{
      if(res.length>0){
      const renamedObject = {
        ...res[0],          // Copy all existing properties
        desc: res[0].description, // Rename description to desc
        cards: res[0].result // Rename result to cards
      };
      console.log("renamedObject",renamedObject);
      this.getResults(renamedObject)
    }
    })
  }


  getTeenPattiDetails() {
    this.casinoBetsService.getTeenPattiDetails(this.data.mid).subscribe((res: any) => {
      if(res.success){
        this.details = res.data;
        console.log('result', res.data);
        this.getResults(this.details[0]);
      }
    });
    this.getCasinoBetsByMarketID();
  }

  // private getResults(data:any){
  //   const [player1,player2,player3,player4] = this.divideIntoArrays(data.cards);
  //   this.player1 = player1;
  //   this.player2 = player2;
  //   this.player3 = player3;
  //   this.player4 = player4;
  //   this.winner = data.win;
  // }

  private getResults(data: any) {
    this.winner = data.win;
    console.log('this.winner',typeof this.winner)
    let cardsArray: string[] = data.cards.split(',');

    // Explicitly type `groups` as an array of string arrays
    let groups: string[][] = [[], [], [], []];

    // Distribute cards into four arrays in a round-robin manner
    for (let i = 0; i < cardsArray.length; i++) {
        groups[i % 4].push(cardsArray[i]);
    }

    // Calculate the total for each group, ignoring all "1" values
    let totals = groups.map((group: string[]) => {
        return group.reduce((sum, card) => sum + this.getCardValue(card), 0);
    });
    this.main_groups = groups;
    this.main_totals = totals;
    console.log("Groups:", groups);
    console.log("Totals:", totals);
}


  // Function to calculate the value of a card based on the rules
  getCardValue(card:any) {
    if (card === "1") return 0;  // Ignore cards with value "1"

    // Check if card starts with a face card or a numeric value
    let value = card.startsWith('10') ? '10' : card[0];

    switch (value) {
        case 'J': return 11;
        case 'Q': return 12;
        case 'K': return 13;
        default: 
            // Convert numeric strings to integers, default to 0 if invalid
            const numericValue = parseInt(value, 10);
            return isNaN(numericValue) ? 0 : numericValue;
    }
}

  private divideIntoArrays(inputString:string) {
    const gameArray = inputString.split(',');
    return [gameArray[0], gameArray[1], gameArray[2], gameArray[3]];
  }

   getCasinoBetsByMarketID() {
        this.casinoBetsService.getCasinoBetsByOnlyMarketId(this.data.mid).subscribe((res: any) => {
            // console.log('filter_bets data', res);
            this.casino_bets = res;
            this.filter_bets = this.casino_bets;
            this.totalbets = this.casino_bets.length;
            this.totalAmount = this.casino_bets.reduce((sum: any, entry: any) => sum + (entry.profit_loss || 0), 0);
        });
    }

    filterBetsByType(event: any) {
        const filterType = (event.target as HTMLInputElement).value;
        console.log('filterType', filterType);
        if (filterType === 'all') {
            this.filter_bets = this.casino_bets;
        } else if (filterType === 'deleted') {
            this.filter_bets = this.casino_bets.filter((bet: any) => bet.from === "deleted");
        } else if (filterType === 'Back') {
            this.filter_bets = this.casino_bets.filter((bet: any) => bet.type === "Back");
        }
        if (filterType === 'Lay') {
            this.filter_bets = this.casino_bets.filter((bet: any) => bet.type === "Lay");
        }
        this.totalbets = this.filter_bets.length;
        this.totalAmount = this.filter_bets.reduce((sum: any, entry: any) => sum + (entry.profit_loss || 0), 0);
    }

  closeDialog() {
    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }

}
