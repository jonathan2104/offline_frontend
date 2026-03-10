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
export class CasinoDLuckyPopupComponent implements OnInit {
  passwordForm: any;
  errorMsg: any;
  submitted = false;
  details: any = {};
  showcard: any = "";
  winner: any = '';
  card: any = '';
  color: any = '';
  oddeven: any = '';
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
    const [winner,color,oddeven] = this.extractArrayFromString(data.desc);
    this.winner = winner;
    this.color = color;
    this.oddeven = oddeven;
    this.card = this.getFirstCharacters(data.cards);
    this.showcard = data.cards;
  }

  private extractArrayFromString(str:string) {
      const parts = str.split("||");
      const array = parts.map(part => part.trim());
      return array;
  }

  private getFirstCharacters(inputString:string) {
    const gameArray = inputString.split(',');
    const result = gameArray.map(game => game.charAt(0));
    return result.join(' ');
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
        console.log(this.totalbets)
    }

  closeDialog() {
    this.dialogRef.close();
  }

  dismiss() {
    this.dialogRef.close();
  }

}
