import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HomeComponent} from './home/home.component';
import {SportsbookComponent} from './sportsbook/sportsbook.component';
import {CricketComponent} from './cricket/cricket.component';
import {FootballComponent} from './football/football.component';
import {TennisComponent} from './tennis/tennis.component';
import {LoginComponent} from './login/login.component';
import {MatchdetailComponent} from './matchdetail/matchdetail.component';
import {NewDashboardComponent} from "./new-dashboard/new-dashboard.component";
import {RegisterComponent} from "./register/register.component";
import {RefererComponent} from "./referer/referer.component";
import {AuthGuard} from "./guards/auth.guard";
import {RechargeWalletComponent} from "./recharge-wallet/recharge-wallet.component";
import {RechargeHistoryComponent} from "./recharge-history/recharge-history.component";
import {MatchComponent} from "./match/match.component";
import {InplayMatchesComponent} from "./inplay-matches/inplay-matches.component";
import {TermsConditionsComponent} from "./terms-conditions/terms-conditions.component";
import {ProfileComponent} from "./profile/profile.component";
import {TennisdetailsComponent} from "./tennisdetails/tennisdetails.component";
import {LedgerComponent} from "./ledger/ledger.component";
import {LossBackReportComponent} from './lossback-report/lossback-report.component';
import {MybetsComponent} from "./mybets/mybets.component";
import {CasinoComponent} from "./casino/casino.component";
import {SoccerdetailsComponent} from "./soccerdetails/soccerdetails.component";
import {DwRequestsComponent} from "./dw-requests/dw-requests.component";
import {DepositsComponent} from "./deposit/deposit.component";
import {DepositNewComponent} from './new-deposit/index.component';
import {WithdrawsComponent} from "./withdraw/withdraw.component";
import {MainComponent} from "./main/main.component";
import {ApiproCasinoComponent} from "./apipro-casino/casino.component";
import {BabylonCasinoComponent} from "./babylon-casino/casino.component";
import {LivecasinoComponent} from "./livecasino/casino.component";
import {CasinoDwComponent} from "./casino-dw/casinodw.component";
import {CasinoLedgerComponent} from "./casino-ladger/ledger.component";
import {ApiproCasinoDetailComponent} from "./apipro-casino-detail/detail.component";
import {BabylonCasinoDetailComponent} from "./babylon-casino-detail/detail.component";
import {CasinoDetailComponent} from "./casino-detail/detail.component";
import {MybetListComponent} from "./my-bets/bets.component";
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
import {LivecasinoGamesComponent} from "./casino-games/casino-games.component";
import {PasswordHistoryComponent} from "./password-history/password-history.component";
import {ActivityLogComponent} from "./activity-log/activity-log.component";
import {PasswordChangeComponent} from "./password-change/password-change.component";
import {LivecasinoIgtechComponent} from "./livecasinoIgtech/casino.component";
import {CasinoDetailIgtechComponent} from "./casino-detailIgtech/detailIGtech.component";
import {AccountComponent} from "./account/account.component";
import {BethistoryComponent} from "./bet-history/bet-history.component";

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

const appRoutes: Routes = [
    // {path:'matchdetail',component:MatchdetailComponent},
    // {path:'matchdetail/:id',component:MatchdetailComponent},
    // {path:'dashboard',component:NewDashboardComponent},

    {
        path: 'dashboard', component: NewDashboardComponent, canActivate: [AuthGuard], children: [
            {path: '', redirectTo: 'match', pathMatch: 'full'},
            {path: 'match', component: MatchComponent},
            {path: 'inplay-match', component: InplayMatchesComponent},
            {path: 'match-details/:event_id', component: MatchdetailComponent},
            {path: 'tennis-details/:event_id', component: TennisdetailsComponent},
            {path: 'soccer-details/:event_id', component: SoccerdetailsComponent},
            {path: 'mybets', component: MybetsComponent},
            {path: 'recharge-history', component: RechargeHistoryComponent},
            {path: 'recharge-wallet', component: RechargeWalletComponent},
            {path: 'terms-conditions', component: TermsConditionsComponent},
            {path: 'profile', component: ProfileComponent},
            {path: 'ledger', component: LedgerComponent},
            {path: 'bonus-report', component: LossBackReportComponent},

            {path: 'deposit', component: DepositNewComponent},
            {path: 'withdraw', component: WithdrawsComponent},
            {path: 'dw-request', component: DwRequestsComponent},
            //{path: 'home', component: HomeComponent},
            {path: 'sportsbook', component: SportsbookComponent},
            //{path: 'cricket', component: CricketComponent},
            //{path: 'football', component: FootballComponent},
            //{path: 'tennis', component: TennisComponent},
            {path: 'live-casino', component: ApiproCasinoComponent},
            {path: 'casino', component: CasinoComponent},
            // {path: 'livecasino', component: LivecasinoComponent},
            {path: 'livecasino', component: LivecasinoIgtechComponent},
            {path: 'casino-dw', component: CasinoDwComponent},
            {path: 'livecasino/:gameid', component: LivecasinoGamesComponent},
            {path: 'casino-ledger', component: CasinoLedgerComponent},
            {path: 'my-bets', component: MybetListComponent},
            {path: 'unsettled-bets', component: UnsettlebetListComponent},
            {path: 'profit-loss', component: ProfitLossComponent},
            {path: 'coming-soon', component: ComingSoonComponent},
            {path: 'bonus', component: BonusComponent},
            {path: 'bonus-ledger', component: BonusLedgerComponent},
            {path: 'casino-detail/:gameid/:selectedgame', component: CasinoDetailComponent},
            {path: 'password-history', component: PasswordHistoryComponent},
            {path: 'activity-log', component: ActivityLogComponent},
            {path: 'password-change', component: PasswordChangeComponent},
            {path: 'account', component: AccountComponent},
            {path: 'bet-history', component: BethistoryComponent},

            {path: 'teenpattioneday', component: TeenPattiOnedayomponent},
            {path: 'teen-patti20', component: TeenPatti20Component},
            {path: 'card32a', component: Card32aComponent},
            {path: 'card32b', component: Card32bComponent},
            {path: 'dragontigert20', component: DragonTigert20Component},
            {path: 'dragontigerliont20', component: DragonTigerLiont20Component},
            {path: 'dragontigeroneday', component: DragonTigeronedayComponent},
            {path: 'lucky7', component: Lucky7Component},
            {path: 'lucky7b', component: Lucky7bComponent},
            {path: 'andarbahar', component: AndarBaharComponent},
        ]
    },
    {path: 'casino-detail-igtech/:gameid/:provider', component: CasinoDetailIgtechComponent,canActivate: [AuthGuard]},
    //{path: 'casino-detail/:gameid/:provider', component: BabylonCasinoDetailComponent,canActivate: [AuthGuard]},
    {path: 'casino-detail/:gameid', component: CasinoDetailComponent,canActivate: [AuthGuard]},
    {path: 'casino-detail/lobby/:gameid/:lobbydata', component: CasinoDetailComponent,canActivate: [AuthGuard]},
    //{path: 'casino-detail/:provider/:table_id', component: BabylonCasinoDetailComponent,canActivate: [AuthGuard]},
    //{path: 'livecasino/:gameid', component: LivecasinoGamesComponent,canActivate: [AuthGuard]},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'referer/:username', component: RefererComponent},

    {
        path: 'dashboard', component: NewDashboardComponent, children: [
            {path: 'coming-soon', component: ComingSoonComponent},
            {path: 'contactus', component: ContactPageComponent},
            {path: 'privacypolicy', component: PrivacyPageComponent},
            //{path: 'gamesrule', component: GameRulePageComponent},
            {path: 'terms', component: TermsPageComponent},
            {path: 'casino/:provider', component: CasinoComponent},
        ]
    },
    //{path: '', children: [{path: '', component: LoginComponent}]},
    {path: 'dashboard/home', component: NewDashboardComponent, children: [{path: '', component: HomeComponent}]},
    {path: 'dashboard/cricket', component: NewDashboardComponent, children: [{path: '', component: CricketComponent}]},
    {path: 'dashboard/football', component: NewDashboardComponent, children: [{path: '', component: FootballComponent}]},
    {path: 'dashboard/tennis', component: NewDashboardComponent, children: [{path: '', component: TennisComponent}]},
    {path: '', component: NewDashboardComponent, children: [{path: '', component: HomeComponent}]},
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
