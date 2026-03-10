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
export class CasinoDragonTigerLionPopupComponent implements OnInit {
  passwordForm: any;
  errorMsg: any;
  submitted = false;
  details: any = {};
  player1: any = [];
  player2: any = [];
  player3: any = [];
  winner: any = '';
  win: any = 0;
  cards: any = '';
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
      this.getDragonDetailsDetails();
      }else{
        this.getCasinoResultonMarketId();
      }
      this.getCasinoBetsByMarketID();
  }

  getDragonDetailsDetails() {
    this.casinoBetsService.getTeenPattiDetails(this.data.mid).subscribe((res: any) => {
      if(res.success){
        console.log('result data',res.data);
        this.details = res.data;
        this.getResults(this.details[0]);
      }
    });
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

  private getResults(data:any){
    const [player1,player2,player3] = this.divideIntoArrays(data.cards);
    const [oddeven,cards,color] = this.extractArrayFromString(data.cards);
    this.player1 = player1;
    this.player2 = player2;
    this.player3 = player3;
    this.winner = data.desc;
    this.win = data.win;
    this.cards = cards;
    this.color = color;
    this.oddeven = oddeven;
  }

  private extractArrayFromString(str:string) {
    let dtl20_result:any = [];
        let desc_dtl20;
        if (str.length > 0) {
          desc_dtl20 = str.split(",");

          for (let i = 0; i <= 2; i++) {
            switch (i) {
              case 0:
                const getOddEvenD = (value:any) => {
                  if (!isNaN(parseFloat(value))) {
                    return value % 2 === 0 ? "Even D" : "Odd D";
                  } else {
                    switch (value) {
                      case "J":
                      case "K":
                      case "A":
                        return "Odd D";
                      case "Q":
                        return "Even D";
                      default:
                        return "";
                    }
                  }
                };

                const getColorD = (color:any) => {
                  if (color === "SS" || color === "DD") {
                    return "Red D";
                  } else if (color === "CC" || color === "HH") {
                    return "Black D";
                  } else {
                    return "";
                  }
                };

                let valueD =
                  desc_dtl20[i].length === 4
                    ? desc_dtl20[i].substring(0, 2)
                    : desc_dtl20[i].charAt(0);
                dtl20_result.push(getOddEvenD(valueD));
                dtl20_result.push("Dragon " + valueD);
                dtl20_result.push(getColorD(desc_dtl20[i].slice(-2)));
                break;

              case 1:
                const getOddEvenT = (value:any) => {
                  if (!isNaN(parseFloat(value))) {
                    return value % 2 === 0 ? "Even T" : "Odd T";
                  } else {
                    switch (value) {
                      case "J":
                      case "K":
                      case "A":
                        return "Odd T";
                      case "Q":
                        return "Even T";
                      default:
                        return "";
                    }
                  }
                };

                const getColorT = (color:any) => {
                  if (color === "SS" || color === "DD") {
                    return "Red T";
                  } else if (color === "CC" || color === "HH") {
                    return "Black T";
                  } else {
                    return "";
                  }
                };

                let valueT =
                  desc_dtl20[i].length === 4
                    ? desc_dtl20[i].substring(0, 2)
                    : desc_dtl20[i].charAt(0);
                dtl20_result.push(getOddEvenT(valueT));
                dtl20_result.push("Tiger " + valueT);
                dtl20_result.push(getColorT(desc_dtl20[i].slice(-2)));
                break;

              case 2:
                const getOddEvenL = (value:any) => {
                  if (!isNaN(parseFloat(value))) {
                    return value % 2 === 0 ? "Even L" : "Odd L";
                  } else {
                    switch (value) {
                      case "J":
                      case "K":
                      case "A":
                        return "Odd L";
                      case "Q":
                        return "Even L";
                      default:
                        return "";
                    }
                  }
                };

                const getColorL = (color:any) => {
                  if (color === "SS" || color === "DD") {
                    return "Red L";
                  } else if (color === "CC" || color === "HH") {
                    return "Black L";
                  } else {
                    return "";
                  }
                };

                let valueL =
                  desc_dtl20[i].length === 4
                    ? desc_dtl20[i].substring(0, 2)
                    : desc_dtl20[i].charAt(0);
                dtl20_result.push(getOddEvenL(valueL));
                dtl20_result.push("Lion " + valueL);
                dtl20_result.push(getColorL(desc_dtl20[i].slice(-2)));
                break;
            }
          }

          //dtl20_result = "('" + dtl20_result.join("','") + "')";
         // console.log("dtl20_result", dtl20_result);
        }

    return [dtl20_result[0]+ ' | ' +dtl20_result[3]+ ' | ' +dtl20_result[6],dtl20_result[1]+ ' | ' +dtl20_result[4]+ ' | ' +dtl20_result[7],dtl20_result[2]+ ' | ' +dtl20_result[5]+ ' | ' +dtl20_result[8]];
  }

  private divideIntoArrays(inputString:string) {
    const gameArray = inputString.split(',');
    const array1: any[] = [];
    const array2: any[] = [];
    const array3: any[] = [];

    gameArray.forEach((game, index) => {
        if (index % 3 === 0) {
            array1.push(game);
        } else if (index % 3 === 1) {
            array2.push(game);
        } else {
            array3.push(game);
        }
    });

    return [array1, array2, array3];
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
