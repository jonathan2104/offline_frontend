import {Component, OnDestroy, OnInit} from '@angular/core';
import {SafeResourceUrl} from "@angular/platform-browser";
import {interval, Subscription} from "rxjs";
import {DragonTigerService} from "../../services/casino/dragontiger.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {CasinoBetsService} from "../../services/casino/casino-bets.service";
import {ExposureService} from "../../services/exposure.service";
import {Router} from "@angular/router";
import {CasinoBetSlipComponent} from "../../casino-bet-slip/casino-bet-slip.component";
import {BetSlipService} from "../../services/betslip.service";
import {CasinoDragonTigerPopupComponent} from "../../modals/casino-result-details/dragontiger/details.component";
import { RulesModelComponent } from 'src/app/modals/rule-book/book.component';

@Component({
    selector: 'app-dragontigeroneday',
    templateUrl: './dragontigeroneday.component.html',
    styleUrls: ['./dragontigeroneday.component.css']
})
export class DragonTigeronedayComponent implements OnInit, OnDestroy {
    urlSafe: SafeResourceUrl = "";
    myInterval: any
    myResultInterval: any
    private casinoExposureSubscription: Subscription;

    result_history: any = [];
    bet_history: any = [];
    live_data: any = [];
    counter: any = 0;
    market_id: any = '';
    last_market_id: any = '';
    exp_amount1: number = 0;
    exp_amount2: number = 0;
    exp_amount3: number = 0;
    exp_amount4: number = 0;
    exp_amount5: number = 0;
    exp_amount6: number = 0;
    exp_amount7: number = 0;
    exp_amount8: number = 0;
    exp_amount9: number = 0;
    exp_amount10: number = 0;
    exp_amount11: number = 0;
    exp_amount12: number = 0;
    exp_amount13: number = 0;
    exp_amount14: number = 0;
    exp_amount15: number = 0;
    exp_amount16: number = 0;
    exp_amount17: number = 0;
    exp_amount18: number = 0;
    exp_amount19: number = 0;

    result_declared: boolean = false;
    private resultSubscription: Subscription;
    private dataSubscription: Subscription;
    private betHistorySubscription: Subscription;
    isMobile: boolean;
    casino_exposure: any = [];

    constructor(private betSlipService: BetSlipService, private router: Router, private dragonTigerService: DragonTigerService, public dialog: MatDialog, private toastr: ToastrService, private casinoBetsService: CasinoBetsService, private exposureService: ExposureService) {
    }

    ngOnInit(): void {
        this.getLiveData();
        this.getResultHistory();
        this.getCasinoBetsByMarketId();
        this.myInterval = setInterval(() => {
            if (this.live_data.hasOwnProperty('t1')) {
                this.getLiveData();
            }
        }, 1000);
        this.myResultInterval = setInterval(() => {
            if (this.result_history.success && this.result_history.data.length > 0) {
                this.getResultHistory();
            }
            if (this.bet_history.length > 0) {
                this.getCasinoBetsByMarketId();
            }
        }, 3000);
        this.checkIsMobile();
        window.addEventListener('resize', () => {
            this.checkIsMobile();
        });


    }

    getResultHistory() {
        this.resultSubscription = this.dragonTigerService.getResultHistoryOneDay().subscribe((res: any) => {
            if (res != null) {
                if (res.hasOwnProperty('success')) {
                    this.result_history = res;
                    //console.log('history',res);

                }
            }
        });
    }


    getLiveData() {
        this.dataSubscription = this.dragonTigerService.getLiveDataOneDay().subscribe((res: any) => {
            if (res != null) {
                //console.log('res dragon tiger one day',res);
                //if (res.msg.toLowerCase()=="success") {
                if (res.success) {
                    this.live_data = res.data;
                    this.market_id = this.live_data.t1[0].mid;
                    this.counter = this.calculatePercentage(this.live_data.t1[0].autotime);
                    if (this.market_id != 0) {
                        this.live_data = {...res.data, m_result: false};
                    } else if (this.market_id == 0) {
                        this.live_data = {...res.data, m_result: true};
                    }
                    this.getCasinoExposureByMarketId();
                    this.getCasinoBetsByMarketId();
                }
            }
        })
    }

    calculatePercentage(currentValue: number): string {
        const initialValue: number = 30;
        if (initialValue === 0) {
            return "0";
        }
        return ((currentValue / initialValue) * 100).toFixed(2);
    }  

    checkIsMobile() {
        this.isMobile = window.innerWidth <= 768;
    }

    getCasinoBetsByMarketId() {
        console.log(this.market_id);
        if (this.market_id != 0) {
            this.last_market_id = this.market_id;
        }
        if (this.last_market_id != '') {
            this.betHistorySubscription = this.casinoBetsService.getCasinoBetsByMarketId(this.last_market_id, 'dt6').subscribe((res: any) => {
                this.bet_history = res;
            })
        }
    }

    getCasinoExposureByMarketId() {
        if (this.market_id != 0) {
            this.last_market_id = this.market_id;
        } else {
            this.exp_amount1 = 0;
            this.exp_amount2 = 0;
            this.exp_amount3 = 0;
            this.exp_amount4 = 0;
            this.exp_amount5 = 0;
            this.exp_amount6 = 0;
            this.exp_amount7 = 0;
            this.exp_amount8 = 0;
            this.exp_amount9 = 0;
            this.exp_amount10 = 0;
            this.exp_amount11 = 0;
            this.exp_amount12 = 0;
            this.exp_amount13 = 0;
            this.exp_amount14 = 0;
            this.exp_amount15 = 0;
            this.exp_amount16 = 0;
            this.exp_amount17 = 0;
            this.exp_amount18 = 0;
            this.exp_amount19 = 0; 

        }
        if (this.last_market_id != '') {
            this.casinoExposureSubscription = this.casinoBetsService.getCasinoExposureByOnlyMarketId(this.last_market_id).subscribe((res: any) => {
                this.casino_exposure = res;
                console.log('casino exposure---->', this.casino_exposure);
                if (this.casino_exposure.length > 0) {
                    this.exp_amount1 = this.casino_exposure[0].exp_amount1;
                    this.exp_amount2 = this.casino_exposure[0].exp_amount2;
                    this.exp_amount3 = this.casino_exposure[0].exp_amount3;
                    this.exp_amount4 = this.casino_exposure[0].exp_amount4;
                    this.exp_amount5 = this.casino_exposure[0].exp_amount5;
                    this.exp_amount6 = this.casino_exposure[0].exp_amount6;
                    this.exp_amount7 = this.casino_exposure[0].exp_amount7;
                    this.exp_amount8 = this.casino_exposure[0].exp_amount8;
                    this.exp_amount9 = this.casino_exposure[0].exp_amount9;
                    this.exp_amount10 = this.casino_exposure[0].exp_amount10;
                    this.exp_amount11 = this.casino_exposure[0].exp_amount11;
                    this.exp_amount12 = this.casino_exposure[0].exp_amount12;
                    this.exp_amount13 = this.casino_exposure[0].exp_amount13;
                    this.exp_amount14 = this.casino_exposure[0].exp_amount14;
                    this.exp_amount15 = this.casino_exposure[0].exp_amount15;
                    this.exp_amount16 = this.casino_exposure[0].exp_amount16;
                    this.exp_amount17 = this.casino_exposure[0].exp_amount17;
                    this.exp_amount18 = this.casino_exposure[0].exp_amount18;
                    this.exp_amount19 = this.casino_exposure[0].exp_amount19;

                    // this.casino_exposure.forEach((obj: any) => {
                    //     if (obj.runner_name === 'Player A') {
                    //         this.exp_amount1 = obj.exp_amount;
                    //     } else if (obj.runner_name === 'Player B') {
                    //         this.exp_amount2 = obj.exp_amount;
                    //     } else if (obj.runner_name === 'Pair plus A') {
                    //         this.exp_amount3 = obj.exp_amount;
                    //     } else if (obj.runner_name === 'Pair plus B') {
                    //         this.exp_amount4 = obj.exp_amount;
                    //     }
                    // });
                } else {
                    this.exp_amount1 = 0;
                    this.exp_amount2 = 0;
                    this.exp_amount3 = 0;
                    this.exp_amount4 = 0;
                    this.exp_amount5 = 0;
                    this.exp_amount6 = 0;
                    this.exp_amount7 = 0;
                    this.exp_amount8 = 0;
                    this.exp_amount9 = 0;
                    this.exp_amount10 = 0;
                    this.exp_amount11 = 0;
                    this.exp_amount12 = 0;
                    this.exp_amount13 = 0;
                    this.exp_amount14 = 0;
                    this.exp_amount15 = 0;
                    this.exp_amount16 = 0;
                    this.exp_amount17 = 0;
                    this.exp_amount18 = 0;
                    this.exp_amount19 = 0;

                }
            })
        }
    }


    redirectResult() {
        this.router.navigateByUrl('/dashboard/casino-results');
    }


    openDialog(type: any, mid: any, data: any) {
        let config = {
            disableClose: true,
            autoFocus: false,
            maxHeight: '100vh',
            maxWidth: '100vh',
            width: '100vh',
            position: {top: '50px'},
            data: {
                g_type: 'casino',
                m_type: type,
                type: data.hasOwnProperty('type') ? data.type : 'Back',
                mid: mid,
                bet: data,
                user_id: localStorage.getItem('user_id'),
            }
        };
        if (!this.isMobile) {
            console.log('in desk', config.data);
            this.betSlipService.setSharedData(config.data);
            this.betSlipService.callCasinoParentFunction();
        } else {

            const dialogRef = this.dialog.open(CasinoBetSlipComponent, config);

            // setTimeout(() => {
            //   this.toastr.info('please select bet again');
            //   dialogRef.close();
            // }, 10000);

            dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
                this.result_declared = result;
            });

        }
    }

    openCasinoDetails(data:any){
        const dialogRef = this.dialog.open(CasinoDragonTigerPopupComponent, {
          autoFocus: false,
          maxHeight: '100vh',
          maxWidth: '100vh',
          width: '100vh',
          position: { top: '50px' },
          data: {
            mid:data.mid,
            gamename:"1 Day Dragon Tiger"
          }
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
    }
    
    openCasinoRule(){
        const dialogRef = this.dialog.open(RulesModelComponent, {
            autoFocus: false,
            maxHeight: '100vh',
            maxWidth: '100vh',
            width: '100vh',
            position: { top: '50px' },
            data: {
              gtype:'dtoneday'
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
          });
    }

    ngOnDestroy(): void {
        clearInterval(this.myInterval);
        clearInterval(this.myResultInterval);
        this.resultSubscription.unsubscribe();
        if (this.betHistorySubscription) {
            this.betHistorySubscription.unsubscribe();
        }
        if (this.casinoExposureSubscription) {
            this.casinoExposureSubscription.unsubscribe();
        }
        this.dataSubscription.unsubscribe();

    }


}
