import {Component, OnDestroy, OnInit} from '@angular/core';
import {SafeResourceUrl} from "@angular/platform-browser";
import {interval, Subscription} from "rxjs";
import {AndarBaharService} from "../../services/casino/andarbahar.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {CasinoBetsService} from "../../services/casino/casino-bets.service";
import {ExposureService} from "../../services/exposure.service";
import {Router} from "@angular/router";
import {CasinoBetSlipComponent} from "../../casino-bet-slip/casino-bet-slip.component";
import {BetSlipService} from "../../services/betslip.service";
import {CasinoDAndarBaharPopupComponent} from "../../modals/casino-result-details/andarbahar/details.component";

@Component({
    selector: 'app-andarbahar',
    templateUrl: './andarbahar.component.html',
    styleUrls: ['./andarbahar.component.css']
})
export class AndarBaharComponent implements OnInit, OnDestroy {
    urlSafe: SafeResourceUrl = "";
    myInterval: any

    result_history: any = [];
    bet_history: any = [];
    live_data: any = [];
    casino_exposure: any = [];
    market_id: any = '';
    last_market_id: any = '';
    counter:any = 0;
    ar_cards:any = [];
    br_cards:any = [];
    ar_all_cards:any = [];
    br_all_cards:any = [];
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
    exp_amount27 : number = 0;
    exp_amount28 : number = 0;
    exp_amount29 : number = 0;
    exp_amount30 : number = 0;
    exp_amount31 : number = 0;
    exp_amount32 : number = 0;
    exp_amount33 : number = 0;
    result_declared: boolean = false;
    isMobile: boolean;
    position_andar: number = 0;
    position_bahar: number = 0;
    private resultSubscription: Subscription;
    private dataSubscription: Subscription;
    private betHistorySubscription: Subscription;
    private casinoExposureSubscription: Subscription;

    constructor(private betSlipService: BetSlipService, private router: Router, private andarBaharService: AndarBaharService, public dialog: MatDialog, private toastr: ToastrService, private casinoBetsService: CasinoBetsService, private exposureService: ExposureService) {
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
        this.resultSubscription = this.andarBaharService.getResultHistory().subscribe((res: any) => {
            if (res != null) {
                if (res.hasOwnProperty('success')) {
                    this.result_history = res;
                }
            }
        });

    }


    getLiveData() {
        this.dataSubscription = this.andarBaharService.getLiveData().subscribe((res: any) => {
            //console.log('res-->', res);
            if (res != null) {
                if (res.success) {
                    this.live_data = res.data;
                    this.counter = this.calculatePercentage(this.live_data.t1[0].autotime);
                    const newMarketId = this.live_data.t1[0].mid;

                    // Check if mid has changed
                    if (this.market_id !== newMarketId) {
                        console.log("market_id has changed:", newMarketId);
                        this.market_id = newMarketId;
        
                        // Reset ar_cards on market_id change
                        this.ar_cards = [];
                        this.br_cards = [];
                        this.ar_all_cards = [];
                        this.br_all_cards = [];
                    }
        
                    // Update ar_cards every second with latest values from API
                    this.ar_cards = this.live_data.t3[0].ar.split(",");
                    this.br_cards = this.live_data.t3[0].br.split(",");
                    if(this.live_data.t3[0].aall!=""){
                        this.ar_all_cards = this.live_data.t3[0].aall.split(",").reverse();
                    }
                    if(this.live_data.t3[0].ball!=""){
                        this.br_all_cards = this.live_data.t3[0].ball.split(",").reverse();
                    }
                    console.log("Updated ar_cards array:", this.ar_all_cards);
                    // console.log("Updated br_cards array:", this.br_cards);

                    // this.market_id = this.live_data.t1[0].mid;
                    //     this.ar_cards = this.live_data.t3[0].ar.split(",");
                    //     console.log(this.ar_cards);


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
            this.betHistorySubscription = this.casinoBetsService.getCasinoBetsByMarketId(this.last_market_id, 'ab20').subscribe((res: any) => {
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
            this.exp_amount31 = 0;
            this.exp_amount32 = 0;
            this.exp_amount33 = 0;
        }
        if (this.last_market_id != '') {
            this.casinoExposureSubscription = this.casinoBetsService.getCasinoExposureByMarketId(this.last_market_id, 'ab20').subscribe((res: any) => {
                this.casino_exposure = res;
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
                    this.exp_amount31 = this.casino_exposure[0].exp_amount31;
                    this.exp_amount32 = this.casino_exposure[0].exp_amount32;
                    this.exp_amount33 = this.casino_exposure[0].exp_amount33;
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
                    this.exp_amount31 = 0;
                    this.exp_amount32 = 0;
                    this.exp_amount33 = 0;
                }
            })
        }
    }


    redirectResult() {
        this.router.navigateByUrl('/dashboard/casino-results');
    }


    openDialog(type: any, mid: any, data: any) {
        if(data.gstatus==0) return;
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
        const dialogRef = this.dialog.open(CasinoDAndarBaharPopupComponent, {
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


    translateLeft(type:any) {
        if(type=="andar"){
        if (this.position_andar > -300) {
          this.position_andar -= 75;
        }
      }else if(type=='bahar'){
        if (this.position_bahar > -300) {
          this.position_bahar -= 75;
        }
      }
      console.log('position_andar',this.position_andar)
      }
    
      // Translate right in +75px increments until reaching 0px
      translateRight(type:any) {
        if(type=="andar"){
        if (this.position_andar <= 0) {
          this.position_andar += 75;
        }
      }else if(type=='bahar'){
        if (this.position_bahar <= 0) {
          this.position_bahar += 75;
        }
      }
      console.log('position_andar',this.position_andar)
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
