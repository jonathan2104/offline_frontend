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
export class CasinoAaaPopupComponent implements OnInit {
    passwordForm: any;
    errorMsg: any;
    submitted = false;
    details: any = {};
    player1: any = [];
    winner: any = '';
    win: any = 0;
    cards: any = '';
    color: any = '';
    oddeven: any = '';
    underover: any = '';
    casino_bets: any = [];
    filter_bets: any = [];
    totalbets: number = 0;
    totalAmount: number = 0;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private casinoBetsService: CasinoBetsService, private router: Router, public dialogRef: MatDialogRef<any>, private fb: FormBuilder, private userService: UserService, private toasterService: ToastrService) {

    }


    ngOnInit(): void {
        console.log('data-->',this.data);
        this.dialogRef.updateSize('100%',);
        // this.getDragonDetailsDetails();
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
                //console.log('result data',res.data);
                this.details = res.data;
                this.getResults(this.details[0]);
            }
        });
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

    private getResults(data: any) {
        const cards = data.cards;
        const [winner, color, oddeven, underover] = this.extractArrayFromString(data.desc);
        this.player1 = cards;
        this.winner = winner;
        this.win = data.win;
        this.cards = cards.substring(0, cards.length - 2);
        this.color = color;
        this.oddeven = oddeven;
        this.underover = underover;
    }

    private extractArrayFromString(str: string) {
        const parts = str.split("|");
        const array = parts.map(part => part.trim());
        return array;
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
