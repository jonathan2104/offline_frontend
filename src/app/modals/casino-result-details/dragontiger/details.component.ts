import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {Router} from '@angular/router';
import {CasinoBetsService} from "../../../services/casino/casino-bets.service";

@Component({
    selector: 'app-casino-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']
})
export class CasinoDragonTigerPopupComponent implements OnInit {
    passwordForm: any;
    errorMsg: any;
    submitted = false;
    gamename: any = '';
    details: any = {};
    player1: any = [];
    player2: any = [];
    winner: any = '';
    pair: any = '';
    cards: any = '';
    color: any = '';
    oddeven: any = '';
    casino_bets: any = [];
    filter_bets: any = [];
    totalbets: number = 0;
    totalAmount: number = 0;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private casinoBetsService: CasinoBetsService, private router: Router, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService) {
        this.gamename = this.data.gamename;
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

    getDragonDetailsDetails() {
        this.casinoBetsService.getTeenPattiDetails(this.data.mid).subscribe((res: any) => {
            if (res.success) {
                console.log('result data', res.data);
                this.details = res.data;
                this.getResults(this.details[0]);
            }
        });
    }


    private getResults(data: any) {
        const [player1, player2] = this.divideIntoArrays(data.cards);
        const [winner, pair, oddeven, color, cards] = this.extractArrayFromString(data.desc);
        this.player1 = player1;
        this.player2 = player2;
        this.winner = data.win;
        this.cards = cards;
        this.color = color;
        this.pair = pair;
        this.oddeven = oddeven;
    }

    private divideIntoArrays(inputString: string) {
        const gameArray = inputString.split(',');
        const array1: any = [];
        const array2: any = [];

        gameArray.forEach((game, index) => {
            if (index % 2 === 0) {
                array1.push(game);
            } else {
                array2.push(game);
            }
        });

        return [array1, array2];
    }

    private extractArrayFromString(str: string) {
        let desc_dt: any;
        if (str.length > 0) {
            desc_dt = str.split("*");
            desc_dt = desc_dt.map((data: any) => {
                return data.split("|");
            });
            for (let i = 1; i <= 2; i++) {
                if (i == 1) {
                    desc_dt[i] = desc_dt[i].map((data: any) => {
                        if (data.includes("Card")) {
                            data = data.slice(0, -1) + " " + data.slice(-1);
                        }
                        data = data.split("Card").join("");
                        return "D: " + data;
                    });
                } else if (i == 2) {
                    desc_dt[i] = desc_dt[i].map((data: any) => {
                        if (data.includes("Card")) {
                            data = data.slice(0, -1) + " " + data.slice(-1);
                        }
                        data = data.split("Card").join("");
                        return "T: " + data;
                    });
                }
            }

        }

        return [desc_dt[0][0], desc_dt[0][1], desc_dt[1][1] + ' | ' + desc_dt[2][1], desc_dt[1][0] + ' | ' + desc_dt[2][0], desc_dt[1][2] + ' | ' + desc_dt[2][2]];
        // desc_dt = "('" + desc_dt.flat().join("','") + "')";
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
