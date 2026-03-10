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
export class CasinoDTennPattiPopupComponent implements OnInit {
  passwordForm: any;
  errorMsg: any;
  submitted = false;
  details: any = {};
  player1: any = [];
  player2: any = [];
  pair_result: any = [];
  winner: any = '';
  cards: any = '';
  other_winners: any = '';
  casino_bets: any = [];
    filter_bets: any = [];
    totalbets: number = 0;
    totalAmount: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private casinoBetsService:CasinoBetsService,private router: Router, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService) {

  }


  ngOnInit(): void {
    this.dialogRef.updateSize('100%',);
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
        this.getResults(this.details[0]);
      }
    });
    this.getCasinoBetsByMarketID();
  }

  private getResults(data:any){
    const [player1,player2] = this.divideIntoArrays(data.cards);
    this.player1 = player1;
    this.player2 = player2;
    this.winner = data.win;
    this.cards = this.getFirstCharacters(data.cards);
    this.other_winners = this.getOtherWinners(data.cards);
    if (this.hasPair(this.player1)) {
      this.pair_result.push("Pair plus A");
    }
    if (this.hasPair(this.player2)) {
      this.pair_result.push("Pair plus B");
      }
}

  private divideIntoArrays(inputString:string) {
    const gameArray = inputString.split(',');
    const array1:any = [];
    const array2:any = [];
  
    gameArray.forEach((game, index) => {
      if (index % 2 === 0) {
        array1.push(game);
      } else {
        array2.push(game);
      }
    });
  
    return [array1, array2];
  }

  private getOtherWinners(cards:any){
    let desc_aaa = cards.split(",");
    
    let results:any = []; // Array to store results in the format index+1:pattern
    
    
    const array1:any = [];
    const array2:any = [];

    desc_aaa.forEach((game:any, index:any) => {
      if (index % 2 === 0) {
        array1.push(game);
      } else {
        array2.push(game);
      }
    });
    // Distribute cards into arrays (example logic)

    // Helper function to extract rank and suit
    function parseCard(card:any) {
        const rank = card.slice(0, -2); // Everything except the last two characters
        const suit = card.slice(-2);   // Last two characters
        return { rank, suit };
    }
    
    // Check for flush
    function isFlush(cards:any) {
        const suits = cards.map((card:any) => parseCard(card).suit);
        return suits.every((suit:any) => suit === suits[0]);
    }
    
    // Check for straight
    function isStraight(cards:any) {
        const ranks = cards
            .map((card:any) => parseCard(card).rank)
            .map((rank:any) => {
                if (rank === "A") return 1;  // Treat Ace as 1
                if (rank === "J") return 11;
                if (rank === "Q") return 12;
                if (rank === "K") return 13;
                return parseInt(rank, 10);  // Convert numeric ranks
            })
            .sort((a:any, b:any) => a - b);
        
        for (let i = 1; i < ranks.length; i++) {
            if (ranks[i] !== ranks[i - 1] + 1) return false;
        }
        return true;
    }
    
    // Check for trio
    function isTrio(cards:any) {
        const rankCounts:any = {};
        cards.forEach((card:any) => {
            const rank = parseCard(card).rank;
            rankCounts[rank] = (rankCounts[rank] || 0) + 1;
        });
        return Object.values(rankCounts).includes(3);
    }
    
    // Check for flush straight
    function isFlushStraight(cards:any) {
        return isFlush(cards) && isStraight(cards);
    }
    
    // Evaluate each inner array and store results
    
        if (isFlush(array1)) results.push(`A:flush`);
        if (isStraight(array1)) results.push(`A:straight`);
        if (isTrio(array1)) results.push(`A:trio`);
        if (isFlushStraight(array1)) results.push(`A:flush straight`);

        if (isFlush(array2)) results.push(`B:flush`);
        if (isStraight(array2)) results.push(`B:straight`);
        if (isTrio(array2)) results.push(`B:trio`);
        if (isFlushStraight(array2)) results.push(`B:flush straight`);
    
    
    // Output results
    console.log("Patterns Detected:");
    console.log(results);
    return results;
  }

  private hasPair(playerCards:any) {
    let values = playerCards.map((card:any) => card.slice(0, -2)); // Extract card values
    let valueSet = new Set(values); // Use Set to identify duplicates
    return valueSet.size < values.length; // If size reduced, there's a pair
}

  private getFirstCharacters(inputString:string) {
    const gameArray = inputString.split(',');
    const result = gameArray.map(game => game.charAt(0));
    return result.join(' ');
  }

   getCasinoBetsByMarketID() {
    console.log('in bets')
        this.casinoBetsService.getCasinoBetsByOnlyMarketId(this.data.mid).subscribe((res: any) => {
            console.log('filter_bets data', res);
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
