import {Component, OnInit} from '@angular/core';
import {SafeResourceUrl} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {ExposureService} from "../../services/exposure.service";
import {CasinoBetsService} from "../../services/casino/casino-bets.service";
import {Router} from "@angular/router";
import {Card32aService} from "../../services/casino/card32a.service";
import {CasinoBetSlipComponent} from "../../casino-bet-slip/casino-bet-slip.component";
import {BetSlipService} from "../../services/betslip.service";
import {CasinoDCardTreeTwoBPopupComponent} from "../../modals/casino-result-details/card32b/details.component";
import { RulesModelComponent } from 'src/app/modals/rule-book/book.component';

@Component({
    selector: 'app-card32b',
    templateUrl: './card32b.component.html',
    styleUrls: ['./card32b.component.css']
})
export class Card32bComponent implements OnInit {
    math = Math;
    urlSafe: SafeResourceUrl = "";
    myInterval: any
    result_history: any = [];
    bet_history: any = [];
    live_data: any = [];
    casino_exposure: any = [];
    cards:any =[];
    counter:any =0;

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
    exp_amount20: number = 0;
    exp_amount21: number = 0;
    exp_amount22: number = 0;
    exp_amount23: number = 0;
    exp_amount24: number = 0;
    exp_amount25: number = 0;
    exp_amount26: number = 0;
    exp_amount27: number = 0;
    exp_amount28: number = 0;
    exp_amount29: number = 0;
    exp_amount30: number = 0;
    result_declared: boolean = false;
    isMobile: boolean;
    private resultSubscription: Subscription;
    private dataSubscription: Subscription;
    private betHistorySubscription: Subscription;
    private casinoExposureSubscription: Subscription;

    constructor(private router: Router, private betSlipService: BetSlipService, private card32aService: Card32aService, public dialog: MatDialog, private toastr: ToastrService, private exposureService: ExposureService, private casinoBetService: CasinoBetsService) {
    }

    ngOnInit(): void {
        this.getLiveData();
        this.getResultHistory();
        // this.getCasinoBetsByMarketId();
        this.myInterval = setInterval(() => {

            if (this.live_data.hasOwnProperty('t1')) {
                this.getLiveData();
            }

            if (this.result_history.success && this.result_history.data.length > 0) {
                this.getResultHistory();
            }
            this.checkIsMobile();
            window.addEventListener('resize', () => {
                this.checkIsMobile();
            });

        }, 1000);
    }

    getResultHistory() {
        this.resultSubscription = this.card32aService.getResultHistoryEu().subscribe((res: any) => {
            if (res != null) {
                if (res.hasOwnProperty('success')) {
                    this.result_history = res;
                    // console.log('history',res);
                }
            }
        });
    }

    getLiveData() {
        this.dataSubscription = this.card32aService.getLiveDataEu().subscribe((res: any) => {
            if (res != null) {
                console.log('res', res);
                if (res.success) {
                    this.live_data = res.data;
                    this.counter = this.calculatePercentage(this.live_data.t1[0].autotime);
                    // this.market_id = this.live_data.t1[0].mid;
                    const newMarketId = this.live_data.t1[0].mid;

                    // Check if mid has changed
                    if (this.market_id !== newMarketId) {
                        console.log("market_id has changed:", newMarketId);
                        this.market_id = newMarketId;
                        // Reset ar_cards on market_id change
                        this.cards = [];   
                    }
                    // Update ar_cards every second with latest values from API
                    // this.cards = this.live_data.t1[0].desc.split(",");
                    let cardsArray: string[] = this.live_data.t1[0].desc.split(',');

                    // Explicitly type `groups` as an array of string arrays
                    let groups: string[][] = [[], [], [], []];

                    // Distribute cards into four arrays in a round-robin manner
                    for (let i = 0; i < cardsArray.length; i++) {
                        groups[i % 4].push(cardsArray[i]);
                    }
                    this.cards = groups;
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

    highlight(){
        switch(true){
            case this.live_data.t1[0].C4 != 11 && this.live_data.t1[0].C4 != 0: 
                // console.log('gihh--->',4,this.live_data.t1[0].C4);
                return 4;
                break;
            case this.live_data.t1[0].C3 != 10 && this.live_data.t1[0].C3 != 0:
                // console.log('gihh--->',3,this.live_data.t1[0].C3);
                return 3;
                break;
            case this.live_data.t1[0].C2 != 9 && this.live_data.t1[0].C2 != 0:
                // console.log('gihh--->',2,this.live_data.t1[0].C2);
                return 2;
                break;
            case this.live_data.t1[0].C1 != 8 && this.live_data.t1[0].C1 != 0:
                // console.log('gihh--->',1,this.live_data.t1[0].C1);
                return 1;
                break;
            default:
                console.log('default');
                return 1;
        }
    }


    getCasinoBetsByMarketId() {
        console.log(this.market_id);
        if (this.market_id != 0) {
            this.last_market_id = this.market_id;
        }
        if (this.last_market_id != '') {
            this.betHistorySubscription = this.casinoBetService.getCasinoBetsByMarketId(this.last_market_id, 'card32eu').subscribe((res: any) => {
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
            this.exp_amount20 = 0;
            this.exp_amount21 = 0;
            this.exp_amount22 = 0;
            this.exp_amount23 = 0;
            this.exp_amount24 = 0;
            this.exp_amount25 = 0;
            this.exp_amount26 = 0;
            this.exp_amount27 = 0;
            this.exp_amount28 = 0;
            this.exp_amount29 = 0;
            this.exp_amount30 = 0;

        }
        if (this.last_market_id != '') {
            this.casinoExposureSubscription = this.casinoBetService.getCasinoExposureByOnlyMarketId(this.last_market_id).subscribe((res: any) => {
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
                    this.exp_amount20 = this.casino_exposure[0].exp_amount20;
                    this.exp_amount21 = this.casino_exposure[0].exp_amount21;
                    this.exp_amount22 = this.casino_exposure[0].exp_amount22;
                    this.exp_amount23 = this.casino_exposure[0].exp_amount23;
                    this.exp_amount24 = this.casino_exposure[0].exp_amount24;
                    this.exp_amount25 = this.casino_exposure[0].exp_amount25;
                    this.exp_amount26 = this.casino_exposure[0].exp_amount26;
                    this.exp_amount27 = this.casino_exposure[0].exp_amount27;
                    this.exp_amount28 = this.casino_exposure[0].exp_amount28;
                    this.exp_amount29 = this.casino_exposure[0].exp_amount29;
                    this.exp_amount30 = this.casino_exposure[0].exp_amount30;
                } else {
                    this.exp_amount1 = 0
                    this.exp_amount2 = 0
                    this.exp_amount3 = 0
                    this.exp_amount4 = 0
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
                    this.exp_amount20 = 0;
                    this.exp_amount21 = 0;
                    this.exp_amount22 = 0;
                    this.exp_amount23 = 0;
                    this.exp_amount24 = 0;
                    this.exp_amount25 = 0;
                    this.exp_amount26 = 0;
                    this.exp_amount27 = 0;
                    this.exp_amount28 = 0;
                    this.exp_amount29 = 0;
                    this.exp_amount30 = 0;
                }

                // Second API call

                this.casinoBetService.getCasinoExposureByMarketIdFancy1(this.last_market_id, 'card32eufancy1').subscribe((res2: any) => {
                    const exposureData = res2[0];
                    if (exposureData) {
                        if (exposureData.runner_name === 'Any Three Card Black') {
                            this.exp_amount5 = exposureData.exp_amount;
                        } else if (exposureData.runner_name === 'Any Three Card Red') {
                            this.exp_amount7 = exposureData.exp_amount;
                        }
                         else if (exposureData.runner_name === 'Two Black Two Red') {
                            this.exp_amount9 = exposureData.exp_amount;
                        }
                    }
                });
            });
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

    openCasinoDetails(data: any) {
        const dialogRef = this.dialog.open(CasinoDCardTreeTwoBPopupComponent, {
            autoFocus: false,
            maxHeight: '100vh',
            maxWidth: '100vh',
            width: '100vh',
            position: {top: '50px'},
            data: {
                mid: data.mid
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    checkIsMobile() {
        this.isMobile = window.innerWidth <= 768;
    }

    
    openCasinoRule(){
        const dialogRef = this.dialog.open(RulesModelComponent, {
            autoFocus: false,
            maxHeight: '100vh',
            maxWidth: '100vh',
            width: '100vh',
            position: { top: '50px' },
            data: {
              gtype:'card32b'
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
          });
    }

    ngOnDestroy(): void {
        clearInterval(this.myInterval);
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
