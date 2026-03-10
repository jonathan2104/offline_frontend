import {Component, OnDestroy, OnInit} from '@angular/core';
import {SafeResourceUrl} from "@angular/platform-browser";
import {interval, Subscription} from "rxjs";
import {TeenPattiService} from "../../services/casino/teen-patti.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {CasinoBetsService} from "../../services/casino/casino-bets.service";
import {ExposureService} from "../../services/exposure.service";
import {Router} from "@angular/router";
import {CasinoBetSlipComponent} from "../../casino-bet-slip/casino-bet-slip.component";
import {BetSlipService} from "../../services/betslip.service";
import {CasinoDTennPattiPopupComponent} from "../../modals/casino-result-details/teen-patti20/details.component";
import { RulesModelComponent } from 'src/app/modals/rule-book/book.component';

@Component({
    selector: 'app-teen-patti20',
    templateUrl: './teen-patti20.component.html',
    styleUrls: ['./teen-patti20.component.css']
})
export class TeenPatti20Component implements OnInit, OnDestroy {
    urlSafe: SafeResourceUrl = "";
    myInterval: any

    counter: any = 0;
    result_history: any = [];
    bet_history: any = [];
    live_data: any = [];
    casino_exposure: any = [];
    market_id: any = '';
    last_market_id: any = '';
    exp_amount1: number = 0;
    exp_amount2: number = 0;
    exp_amount3: number = 0;
    exp_amount4: number = 0;
    result_declared: boolean = false;
    isMobile: boolean;
    cards: string[] = [];

    private resultSubscription: Subscription;
    private dataSubscription: Subscription;
    private betHistorySubscription: Subscription;
    private casinoExposureSubscription: Subscription;

    constructor(private betSlipService: BetSlipService, private router: Router, private teen_pattiService: TeenPattiService, public dialog: MatDialog, private toastr: ToastrService, private casinoBetsService: CasinoBetsService, private exposureService: ExposureService) {
    }

    ngOnInit(): void {
        this.getLiveData();
        this.getResultHistory();
        this.getCasinoBetsByMarketId();
        this.myInterval = setInterval(() => {

            if (this.live_data.hasOwnProperty('t1')) {
                this.getLiveData();
            }

            if (this.result_history.success && this.result_history.data.length > 0) {
                this.getResultHistory();
            }
            if (this.bet_history.length > 0) {
                this.getCasinoBetsByMarketId();
            }

        }, 1000);
        this.checkIsMobile();
        window.addEventListener('resize', () => {
            this.checkIsMobile();
        });

    }

    getResultHistory() {
        this.resultSubscription = this.teen_pattiService.getResultHistory().subscribe((res: any) => {
            if (res != null) {
                if (res.hasOwnProperty('success')) {
                    this.result_history = res;
                }
            }
        });

    }


    getLiveData() {
        this.dataSubscription = this.teen_pattiService.getLiveData().subscribe((res: any) => {
            console.log('res-->', res);
            if (res != null) {
                if (res.success) {
                    this.live_data = res.data;
                    // this.market_id = this.live_data.t1[0].mid;
                    this.counter = this.calculatePercentage(this.live_data.t1[0].autotime);
                    const newMarketId = this.live_data.t1[0].mid;

                    // Check if market_id has changed
                    if (this.market_id !== newMarketId && newMarketId  !=0) {
                        console.log("market_id has changed:", newMarketId);
                        this.market_id = newMarketId;
                        this.cards = []; // Reset the cards array

                        // Initialize cards with default values if needed
                        const live_data_var: any = this.live_data.t1[0];
                        for (let i = 1; i <= 6; i++) {
                            const cardValue = live_data_var['C' + i]; // Access C1, C2, C3, C4
                            if (cardValue && cardValue !== "1") {
                                this.cards.push(cardValue);
                            }
                        }

                        console.log('Updated cards array on market_id change:', this.cards); // Log the cards array to verify
                    } else {
                        console.log("No change in market_id:", this.market_id);

                        // Update cards array with new values, if they are different from "1"
                        const live_data_var: any = this.live_data.t1[0];
                        for (let i = 1; i <= 6; i++) {
                            const cardValue = live_data_var['C' + i];
                            if (cardValue && cardValue !== "1" && !this.cards.includes(cardValue)) {
                                this.cards.push(cardValue);
                            }
                        }

                        console.log('Updated cards array with new values:', this.cards); // Log the cards array to verify
                    }


                        console.log('cardss--->', this.cards);

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

    getCasinoBetsByMarketId() {
        console.log(this.market_id);
        if (this.market_id != 0) {
            this.last_market_id = this.market_id;
        }
        if (this.last_market_id != '') {
            this.betHistorySubscription = this.casinoBetsService.getCasinoBetsByMarketId(this.last_market_id, 'teen20').subscribe((res: any) => {
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
        }
        if (this.last_market_id != '') {
            this.casinoExposureSubscription = this.casinoBetsService.getCasinoExposureByMarketId(this.last_market_id, 'teen20').subscribe((res: any) => {
                this.casino_exposure = res;
                console.log('casino exposure---->', this.casino_exposure);
                if (this.casino_exposure.length > 0) {
                    this.exp_amount1 = this.casino_exposure[0].exp_amount1;
                    this.exp_amount2 = this.casino_exposure[0].exp_amount2;
                    this.exp_amount3 = this.casino_exposure[0].exp_amount3;
                    this.exp_amount4 = this.casino_exposure[0].exp_amount4;
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
                    this.exp_amount1 = 0
                    this.exp_amount2 = 0
                    this.exp_amount3 = 0;
                    this.exp_amount4 = 0;
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
                type: 'Back',
                mid: mid,
                bet: data,
                user_id: localStorage.getItem('user_id'),
            }
        };
        if (!this.isMobile) {
            console.log('in desk',config.data);
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
        const dialogRef = this.dialog.open(CasinoDTennPattiPopupComponent, {
          autoFocus: false,
          maxHeight: '100vh',
          maxWidth: '100vh',
          width: '100vh',
          position: { top: '50px' },
          data: {
            mid:data.mid
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
              gtype:'teen'
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
