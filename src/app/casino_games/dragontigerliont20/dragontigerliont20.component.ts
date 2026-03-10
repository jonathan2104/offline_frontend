import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {SafeResourceUrl} from "@angular/platform-browser";
import {Subscription} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {MatDialog} from "@angular/material/dialog";
import {ExposureService} from "../../services/exposure.service";
import {CasinoBetsService} from "../../services/casino/casino-bets.service";
import {Router} from "@angular/router";
import {DragonTigerService} from "../../services/casino/dragontiger.service";
import {CasinoBetSlipComponent} from "../../casino-bet-slip/casino-bet-slip.component";
import {BetSlipService} from "../../services/betslip.service";
import {CasinoDragonTigerLionPopupComponent} from "../../modals/casino-result-details/dragontigerlion/details.component";
import { RulesModelComponent } from 'src/app/modals/rule-book/book.component';

@Component({
    selector: 'app-dragontigerliont20',
    templateUrl: './dragontigerliont20.component.html',
    styleUrls: ['./dragontigerliont20.component.css']
})
export class DragonTigerLiont20Component implements OnInit {
    @ViewChildren('dragons') dragons: QueryList<any>;
    @ViewChildren('tigers') tigers: QueryList<any>;
    @ViewChildren('lions') lions: QueryList<any>;
    tabname:string = 'dragons';
    urlSafe: SafeResourceUrl = "";
    counter: any = 0;
    myInterval: any
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
    exp_amount31: number = 0;
    exp_amount32: number = 0;
    exp_amount33: number = 0;
    exp_amount34: number = 0;
    exp_amount35: number = 0;
    exp_amount36: number = 0;
    exp_amount37: number = 0;
    exp_amount38: number = 0;
    exp_amount39: number = 0;
    exp_amount40: number = 0;
    exp_amount41: number = 0;
    exp_amount42: number = 0;
    exp_amount43: number = 0;
    exp_amount44: number = 0;
    exp_amount45: number = 0;
    exp_amount46: number = 0;
    exp_amount47: number = 0;
    exp_amount48: number = 0;
    exp_amount49: number = 0;
    exp_amount50: number = 0;
    exp_amount51: number = 0;
    exp_amount52: number = 0;
    exp_amount53: number = 0;
    exp_amount54: number = 0;
    exp_amount55: number = 0;
    exp_amount56: number = 0;
    exp_amount57: number = 0;
    exp_amount58: number = 0;
    result_declared: boolean = false;
    isMobile: boolean;
    private resultSubscription: Subscription;
    private dataSubscription: Subscription;
    private betHistorySubscription: Subscription;
    private casinoExposureSubscription: Subscription;

    constructor(private router: Router, private betSlipService: BetSlipService, private dragonTigerService: DragonTigerService, public dialog: MatDialog, private toastr: ToastrService, private exposureService: ExposureService, private casinoBetService: CasinoBetsService) {
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
        this.resultSubscription = this.dragonTigerService.getResultHistoryLion().subscribe((res: any) => {
            if (res != null) {
                if (res.hasOwnProperty('success')) {
                    this.result_history = res;
                    // console.log('history',res);
                }
            }
        });
    }

    getLiveData() {
        this.dataSubscription = this.dragonTigerService.getLiveDataLion().subscribe((res: any) => {
            if (res != null) {
                //console.log('liveData', res);
                //if (res.msg.toLowerCase()=="success") {
                if (res.success) {
                    this.live_data = res.data;
                    this.market_id = this.live_data.t1[0].mid;
                    this.counter = this.calculatePercentage(this.live_data.t1[0].autotime);
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
            this.betHistorySubscription = this.casinoBetService.getCasinoBetsByMarketId(this.last_market_id, 'dtl20').subscribe((res: any) => {
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
            this.exp_amount34 = 0;
            this.exp_amount35 = 0;
            this.exp_amount36 = 0;
            this.exp_amount37 = 0;
            this.exp_amount38 = 0;
            this.exp_amount39 = 0;
            this.exp_amount40 = 0;
            this.exp_amount41 = 0;
            this.exp_amount42 = 0;
            this.exp_amount43 = 0;
            this.exp_amount44 = 0;
            this.exp_amount45 = 0;
            this.exp_amount46 = 0;
            this.exp_amount47 = 0;
            this.exp_amount48 = 0;
            this.exp_amount49 = 0;
            this.exp_amount50 = 0;
            this.exp_amount51 = 0;
            this.exp_amount52 = 0;
            this.exp_amount53 = 0;
            this.exp_amount54 = 0;
            this.exp_amount55 = 0;
            this.exp_amount56 = 0;
            this.exp_amount57 = 0;
            this.exp_amount58 = 0;

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
                    this.exp_amount31 = this.casino_exposure[0].exp_amount31;
                    this.exp_amount32 = this.casino_exposure[0].exp_amount32;
                    this.exp_amount33 = this.casino_exposure[0].exp_amount33;
                    this.exp_amount34 = this.casino_exposure[0].exp_amount34;
                    this.exp_amount35 = this.casino_exposure[0].exp_amount35;
                    this.exp_amount36 = this.casino_exposure[0].exp_amount36;
                    this.exp_amount37 = this.casino_exposure[0].exp_amount37;
                    this.exp_amount38 = this.casino_exposure[0].exp_amount38;
                    this.exp_amount39 = this.casino_exposure[0].exp_amount39;
                    this.exp_amount40 = this.casino_exposure[0].exp_amount40;
                    this.exp_amount41 = this.casino_exposure[0].exp_amount41;
                    this.exp_amount42 = this.casino_exposure[0].exp_amount42;
                    this.exp_amount43 = this.casino_exposure[0].exp_amount43;
                    this.exp_amount44 = this.casino_exposure[0].exp_amount44;
                    this.exp_amount45 = this.casino_exposure[0].exp_amount45;
                    this.exp_amount46 = this.casino_exposure[0].exp_amount46;
                    this.exp_amount47 = this.casino_exposure[0].exp_amount47;
                    this.exp_amount48 = this.casino_exposure[0].exp_amount48;
                    this.exp_amount49 = this.casino_exposure[0].exp_amount49;
                    this.exp_amount50 = this.casino_exposure[0].exp_amount50;
                    this.exp_amount51 = this.casino_exposure[0].exp_amount51;
                    this.exp_amount52 = this.casino_exposure[0].exp_amount52;
                    this.exp_amount53 = this.casino_exposure[0].exp_amount53;
                    this.exp_amount54 = this.casino_exposure[0].exp_amount54;
                    this.exp_amount55 = this.casino_exposure[0].exp_amount55;
                    this.exp_amount56 = this.casino_exposure[0].exp_amount56;
                    this.exp_amount57 = this.casino_exposure[0].exp_amount57;
                    this.exp_amount58 = this.casino_exposure[0].exp_amount58;
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
                    this.exp_amount31 = 0;
                    this.exp_amount32 = 0;
                    this.exp_amount33 = 0;
                    this.exp_amount34 = 0;
                    this.exp_amount35 = 0;
                    this.exp_amount36 = 0;
                    this.exp_amount37 = 0;
                    this.exp_amount38 = 0;
                    this.exp_amount39 = 0;
                    this.exp_amount40 = 0;
                    this.exp_amount41 = 0;
                    this.exp_amount42 = 0;
                    this.exp_amount43 = 0;
                    this.exp_amount44 = 0;
                    this.exp_amount45 = 0;
                    this.exp_amount46 = 0;
                    this.exp_amount47 = 0;
                    this.exp_amount48 = 0;
                    this.exp_amount49 = 0;
                    this.exp_amount50 = 0;
                    this.exp_amount51 = 0;
                    this.exp_amount52 = 0;
                    this.exp_amount53 = 0;
                    this.exp_amount54 = 0;
                    this.exp_amount54 = 0;
                    this.exp_amount55 = 0;
                    this.exp_amount56 = 0;
                    this.exp_amount57 = 0;
                    this.exp_amount58 = 0;
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

    openCasinoDetails(data: any) {
        const dialogRef = this.dialog.open(CasinoDragonTigerLionPopupComponent, {
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

    mobileLayout(isMobile:boolean) {
        return ;
        if(isMobile){
            this.hideShowElements(this.dragons, false);
            this.hideShowElements(this.tigers, true);
            this.hideShowElements(this.lions, true);
        }else{
            this.hideShowElements(this.dragons, false);
            this.hideShowElements(this.tigers, false);
            this.hideShowElements(this.lions, false);
        }
    }

    showTab(tabname: string) {
        return ;
        this.tabname = tabname;
        if (tabname == 'dragons') {
            this.hideShowElements(this.dragons, false);
            this.hideShowElements(this.tigers, true);
            this.hideShowElements(this.lions, true);
        } else if (tabname == 'tigers') {
            this.hideShowElements(this.dragons, true);
            this.hideShowElements(this.tigers, false);
            this.hideShowElements(this.lions, true);
        } else {
            this.hideShowElements(this.dragons, true);
            this.hideShowElements(this.tigers, true);
            this.hideShowElements(this.lions, false);
        }
    }

    hideShowElements(elements: QueryList<any>, hide: boolean) {
        const displayStyle = hide ? 'none' : 'block';
        elements.forEach(div => {
            div.nativeElement.style.display = displayStyle;
        });
    }

    checkIsMobile() {
        const isCurrentlyMobile = window.innerWidth <= 768;
        if (isCurrentlyMobile !== this.isMobile) {
          this.isMobile = isCurrentlyMobile;
          this.mobileLayout(this.isMobile);
        }
    }

    ngAfterViewInit() {
        console.log('checked');
        this.mobileLayout(this.isMobile);
    }

    
    openCasinoRule(){
        const dialogRef = this.dialog.open(RulesModelComponent, {
            autoFocus: false,
            maxHeight: '100vh',
            maxWidth: '100vh',
            width: '100vh',
            position: { top: '50px' },
            data: {
              gtype:'dtl20'
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
