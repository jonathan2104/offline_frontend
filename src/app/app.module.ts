import {NgModule} from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import {BrowserModule} from '@angular/platform-browser';
import { AnimatedProgressBarComponent } from './progress-bar.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {SportsbookComponent} from './sportsbook/sportsbook.component';
import {NavbarComponent} from './navbar/navbar.component';
import {CarouselComponent} from './carousel/carousel.component';
import {FooterComponent} from './footer/footer.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SidenavComponent} from './sidenav/sidenav.component';
import {MatchdetailComponent} from './matchdetail/matchdetail.component'
import {MatTabsModule} from '@angular/material/tabs';
import {BetslipComponent} from './betslip/betslip.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {NewDashboardComponent} from './new-dashboard/new-dashboard.component';
import {RegisterComponent} from './register/register.component';
import {RechargeWalletComponent} from './recharge-wallet/recharge-wallet.component';
import {RechargeHistoryComponent} from './recharge-history/recharge-history.component';
import {AuthInterceptor} from "./auth.interceptor";
import {MatchComponent} from './match/match.component';
import {CricketComponent} from './cricket/cricket.component';
import {FootballComponent} from './football/football.component';
import {TennisComponent} from './tennis/tennis.component';
import {ToastrModule} from 'ngx-toastr';
import {InplayMatchesComponent} from './inplay-matches/inplay-matches.component';
import {ChangePasswordComponent} from './modals/change-password/change-password.component';
import {TermsConditionsComponent} from './terms-conditions/terms-conditions.component';
import {ProfileComponent} from './profile/profile.component';
import {TennisdetailsComponent} from './tennisdetails/tennisdetails.component';
import {LedgerComponent} from './ledger/ledger.component';
import {LossBackReportComponent} from './lossback-report/lossback-report.component';
import {MatExpansionModule} from '@angular/material/expansion';
// import {IvyCarouselModule} from 'angular-responsive-carousel';
import {MybetsComponent} from './mybets/mybets.component';
import {CasinoComponent} from './casino/casino.component';
import {TimerOverlayComponent} from './timer-overlay/timer-overlay.component';
import {SoccerdetailsComponent} from './soccerdetails/soccerdetails.component';
import {DwRequestsComponent} from './dw-requests/dw-requests.component';
import {DepositsComponent} from './deposit/deposit.component';
import {DepositNewComponent} from './new-deposit/index.component';
import {WithdrawsComponent} from './withdraw/withdraw.component';
import {DepositFormComponent} from './modals/deposit-form/deposit-form.component';
import {WithdrawFormComponent} from './modals/withdraw-form/withdraw-form.component';
import {MainComponent} from './main/main.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {RegisterModalComponent} from './modals/register-modal/register-modal.component';
import {RefererComponent} from './referer/referer.component';
import {PopupModalComponent} from './modals/popup/popup.component';
import {ApiproCasinoComponent} from "./apipro-casino/casino.component";
import {BabylonCasinoComponent} from "./babylon-casino/casino.component";
import {LivecasinoComponent} from "./livecasino/casino.component";
import {CasinoDwComponent} from "./casino-dw/casinodw.component";
import {CasinoDepositComponent} from './modals/casino-deposit/deposit-form.component';
import {CasinoWithdrawComponent} from './modals/casino-withdraw/withdraw-form.component';
import {CasinoLedgerComponent} from "./casino-ladger/ledger.component";
import {ProofListComponent} from "./modals/proof-list/proof-list.component";
import {UserReportComponent} from "./modals/user-report/user-report.component";
import {ApiproCasinoDetailComponent} from "./apipro-casino-detail/detail.component";
import {BabylonCasinoDetailComponent} from "./babylon-casino-detail/detail.component";
import {CasinoDetailComponent} from "./casino-detail/detail.component";
import {MybetListComponent} from "./my-bets/bets.component";
import {SupportComponent} from "./modals/support/support.component";
import {RulesModelComponent} from "./modals/rule-book/book.component";
import {UnsettlebetListComponent} from "./unsettled-bets/bets.component";
import {ProfitLossComponent} from "./profit-loss/report.component";
import {ComingSoonComponent} from "./coming-soon/detail.component";
import {BonusComponent} from "./bonus/bonus.component";
import {BonusLedgerComponent} from "./bonus-ledger/bonus-ledger.component";
import {LandingPageComponent} from "./landing-page/landing-page.component";
import {TermsPageComponent} from "./static/terms/detail.component";
import {ContactPageComponent} from "./static/contactus/detail.component";
import {PrivacyPageComponent} from "./static/privacypolicy/detail.component";
import {GameRulePageComponent} from "./static/gamesrule/detail.component";
import {LoginModalComponent} from "./modals/login-model/login-modal.component";
import {LivecasinoGamesComponent} from "./casino-games/casino-games.component";
import { DepositAutopayComponent } from './modals/deposit-autopay/deposit-autopay.component';
import {SessionLadder} from './modals/session-ladder/session-ladder.component';
import {PasswordHistoryComponent} from './password-history/password-history.component';
import {ActivityLogComponent} from './activity-log/activity-log.component';
import {PasswordChangeComponent} from './password-change/password-change.component';
import {Ng2SearchPipeModule} from 'ng2-search-filter';
import {LivecasinoIgtechComponent} from "./livecasinoIgtech/casino.component";
import {CasinoDetailIgtechComponent} from "./casino-detailIgtech/detailIGtech.component";
import {OpenbetsComponent} from "./modals/open-bets/open-bets.component";
import {AccountComponent} from "./account/account.component";
import {SharedHeaderComponent} from "./shared-header/shared-header.component";
import {NewRulesModelComponent} from "./modals/new-rule-book/book.component";
import {Betslip2Component} from "./betslip2/betslip2.component";
import {BethistoryComponent} from "./bet-history/bet-history.component";
import {cashoutComponent} from "./cashout/cashout.component";
import {CurrentbetsComponent} from './current-bets/currentbets.component';


import {CasinoBetSlipComponent} from './casino-bet-slip/casino-bet-slip.component';
import {CasinoBetSlip2Component} from './casino-bet-slip2/casino-bet-slip2.component';
import {TeenPattiOnedayomponent} from './casino_games/teenpattioneday/teenpattioneday.component';
import {TeenPatti20Component} from "./casino_games/teen-patti20/teen-patti20.component";
import {Card32aComponent} from "./casino_games/card32a/card32a.component";
import {Card32bComponent} from "./casino_games/card32b/card32b.component";
import {DragonTigert20Component} from './casino_games/dragontigert20/dragontigert20.component';
import {DragonTigerLiont20Component} from './casino_games/dragontigerliont20/dragontigerliont20.component';
import {DragonTigeronedayComponent} from './casino_games/dragontigeroneday/dragontigeroneday.component';
import {Lucky7Component} from "./casino_games/lucky7/lucky7.component";
import {Lucky7bComponent} from "./casino_games/lucky7b/lucky7b.component";
import {AndarBaharComponent} from './casino_games/andarbahar/andarbahar.component';

import {CasinoAaaPopupComponent} from './modals/casino-result-details/aaa/details.component';
import {CasinoDAndarBaharPopupComponent} from './modals/casino-result-details/andarbahar/details.component';
import {CasinoDCardTreeTwoAPopupComponent} from "./modals/casino-result-details/card32a/details.component";
import {CasinoDCardTreeTwoBPopupComponent} from "./modals/casino-result-details/card32b/details.component";
import {CasinoDragonTigerPopupComponent} from './modals/casino-result-details/dragontiger/details.component';
import {CasinoDragonTigerLionPopupComponent} from './modals/casino-result-details/dragontigerlion/details.component';
import {CasinoDLuckyPopupComponent} from './modals/casino-result-details/lucky7/details.component';
import {CasinoDTennPattiPopupComponent} from './modals/casino-result-details/teen-patti20/details.component';
import {CasinoDTennPattiOneDayPopupComponent} from './modals/casino-result-details/teen-pattioneday/details.component';

import {AaaPipe} from './pipes/aaa.pipe';
import {Card32namePipe} from './pipes/card32name.pipe';
import {DragonTigerLionPipe} from './pipes/dragontigerlion.pipe';
import {Dt20namePipe} from './pipes/dt20name.pipe';
import {Lucky7namePipe} from './pipes/lucky7name.pipe';
import {TeenPattiTestnamePipe} from './pipes/teenpatti.pipe';
import {TeenPattiOneDayPipe} from './pipes/teenpattioneday.pipe';
import {WinnernamePipe} from './pipes/winnername.pipe';
import {PlayernamePipe} from './pipes/playername.pipe';
import {DragonTigerPipe} from './pipes/dragontiger.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SportsbookComponent,
        NavbarComponent,
        CarouselComponent,
        FooterComponent,
        DashboardComponent,
        LoginComponent,
        SidenavComponent,
        MatchdetailComponent,
        BetslipComponent,
        NewDashboardComponent,
        RegisterComponent,
        RechargeWalletComponent,
        RechargeHistoryComponent,
        MatchComponent,
        CricketComponent,
        FootballComponent,
        TennisComponent,
        InplayMatchesComponent,
        ChangePasswordComponent,
        TermsConditionsComponent,
        ProfileComponent,
        TennisdetailsComponent,
        LedgerComponent,
        LossBackReportComponent,
        MybetsComponent,
        CasinoComponent,
        TimerOverlayComponent,
        SoccerdetailsComponent,
        DepositsComponent,
        DepositNewComponent,
        DwRequestsComponent,
        WithdrawsComponent,
        DepositFormComponent,
        WithdrawFormComponent,
        MainComponent,
        RegisterModalComponent,
        RefererComponent,
        PopupModalComponent,
        ApiproCasinoComponent,
        BabylonCasinoComponent,
        LivecasinoComponent,
        CasinoDwComponent,
        CasinoDepositComponent,
        CasinoWithdrawComponent,
        CasinoLedgerComponent,
        ProofListComponent,
        UserReportComponent,
        ApiproCasinoDetailComponent,
        BabylonCasinoDetailComponent,
        CasinoDetailComponent,
        MybetListComponent,
        SupportComponent,
        RulesModelComponent,
        UnsettlebetListComponent,
        ProfitLossComponent,
        ComingSoonComponent,
        BonusComponent,
        BonusLedgerComponent,
        LandingPageComponent,
        ContactPageComponent,
        PrivacyPageComponent,
        GameRulePageComponent,
        TermsPageComponent,
        LoginModalComponent,
        LivecasinoGamesComponent,
        DepositAutopayComponent,
        SessionLadder,
        PasswordHistoryComponent,
        ActivityLogComponent,
        PasswordChangeComponent,
        LivecasinoIgtechComponent,
        CasinoDetailIgtechComponent,
        OpenbetsComponent,
        AccountComponent,
        SharedHeaderComponent,
        NewRulesModelComponent,
        Betslip2Component,
        BethistoryComponent,
        cashoutComponent,
        CurrentbetsComponent,

        CasinoBetSlipComponent,
        CasinoBetSlip2Component,
        AnimatedProgressBarComponent,
        TeenPattiOnedayomponent,
        TeenPatti20Component,
        Card32aComponent,
        Card32bComponent,
        DragonTigert20Component,
        DragonTigerLiont20Component,
        DragonTigeronedayComponent,
        Lucky7Component,
        Lucky7bComponent,
        AndarBaharComponent,
        CasinoAaaPopupComponent,
        CasinoDAndarBaharPopupComponent,
        CasinoDCardTreeTwoAPopupComponent,
        CasinoDCardTreeTwoBPopupComponent,
        CasinoDragonTigerPopupComponent,
        CasinoDragonTigerLionPopupComponent,
        CasinoDLuckyPopupComponent,
        CasinoDTennPattiPopupComponent,
        CasinoDTennPattiOneDayPopupComponent,

        AaaPipe,
        Card32namePipe,
        DragonTigerLionPipe,
        Dt20namePipe,
        Lucky7namePipe,
        TeenPattiTestnamePipe,
        TeenPattiOneDayPipe,
        WinnernamePipe,
        PlayernamePipe,
        DragonTigerPipe,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatMenuModule,
        MatTabsModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        FormsModule,
        // IvyCarouselModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatProgressSpinnerModule,
        NgbCollapseModule,
        Ng2SearchPipeModule,
        MatProgressBarModule,

        ToastrModule.forRoot(),
        NgbModule,
        NgxPaginationModule
    ],
    entryComponents: [
        BetslipComponent, ChangePasswordComponent
    ],
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    }],
    bootstrap: [AppComponent]
})
export class AppModule {
}
