import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SupportComponent} from "../modals/support/support.component";
import {BannerService} from "../services/banner.service";
import {environment} from "../../environments/environment";
import {AuthService} from "../services/auth.service";
import {MatchService} from "../services/match.service";
import {SocceroddsService} from "../services/soccer/soccerodds.service";
import {TennisoddsService} from "../services/tennis/tennisodds.service";
import {filter, Subscription} from "rxjs";
import {Router, NavigationEnd} from "@angular/router";
import {BetSlipService} from "../services/betslip.service";
import {TransactionService} from "../services/transaction.service";
import {ChangePasswordComponent} from "../modals/change-password/change-password.component";

@Component({
    selector: 'app-new-dashboard',
    templateUrl: './new-dashboard.component.html',
    styleUrls: ['./new-dashboard.component.css']
})
export class NewDashboardComponent implements OnInit {
    private marketSubscription: Subscription;
    private tennisSubscription: Subscription;
    private soccerSubscription: Subscription;
    showSlider: boolean = false;
    screenHeight: number;
    screenWidth: number;
    banner_url: any = [];
    markets: any = [];
    tennisMarkets: any = [];
    soccerMarkets: any = [];
    myInterval: any;
    current_route: string = this.router.url;
    topbar_routes = ['/dashboard/home', '/dashboard/inplay-match', '/dashboard/cricket', '/dashboard/football', '/dashboard/tennis', '/'];
    casino_sidebar = ['match-details', 'tennis-details', 'soccer-details', 'teen-patti20', 'lucky7','teenpattitest','teenpattioneday','card32a','card32b','andarbahar','dragontigert20','dragontigeroneday','dragontigert202','dragontigerliont20','aaa','teenpattiopen','pokert20'];
    istopbar_visible = this.topbar_routes.includes(this.current_route);
    casino_sidebar_visible = this.isvalidRoute(this.casino_sidebar, this.current_route);
    casino_page:boolean = this.isvalidRoute([...this.casino_sidebar,['casino']], this.current_route);
    candepositShow:boolean = ['/dashboard/home'].includes(this.current_route);
    fullview_routes = ['/dashboard/casino'];
    fullview:boolean = this.fullview_routes.includes(this.current_route);
    submenuOpen = false;
    betslip_visible = false;
    casino_betslip_visible = false;
    betdata: any = {};
    competitions: any;
    total_competitions: number = 0;
    soccer_competitions: any;
    soccer_total_competitions: number = 0;
    tennis_competitions: any;
    tennis_total_competitions: number = 0;
    betscount: number = 0;
    display_inplay_bar:boolean = true;
    selectedSport: string = 'football';
    sidebarVisible: boolean = window.innerWidth > 768;
    username = localStorage.getItem('username');
    activeRightTab: 'bet' | 'open' | 'trend' = 'open';
    IgtechcasinoGamelist: any[] = [];
    technical_whatsapp: string = '';
    constructor(public betSlipService: BetSlipService, private matchService: MatchService, private socceroddsService: SocceroddsService, private tennisoddsService: TennisoddsService, private bannerService: BannerService, private authService: AuthService, public dialog: MatDialog, public router: Router, private transactionService: TransactionService) {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
        //console.log(this.screenWidth);
    }

    ngOnInit(): void {
        this.transactionService.getMasterWhatsappByUser().subscribe((res: any) => {
            this.technical_whatsapp = res[0].tech_whatsapp;
        });
        // this.transactionService.getPopupDataRequests().subscribe((res: any) => {
        //     this.technical_whatsapp = res[0].technical_whatsapp;
        // });
        // Add keyboard event listener for sidebar toggle
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.sidebarVisible) {
                this.toggleSidebar();
            }
        });

        // Add window resize listener for responsive behavior
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.sidebarVisible = true;
            } else {
                this.sidebarVisible = false;
            }
        });

        this.betSlipService.setParentFunction(() => {
            this.betdata = this.betSlipService.getSharedData();
            this.betslip_visible = true;
        });
        this.betSlipService.setClearBetFunction(() => {
            this.closeBet();
        });
        this.betSlipService.setCasinoParentFunction(() => {
            this.betdata = this.betSlipService.getSharedData();
            this.casino_betslip_visible = true;
        });
        this.betSlipService.setClearCasinoBetFunction(() => {
            this.closeCasinoBet();
        });
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
            this.display_inplay_bar =  this.router.url.includes('/dashboard/cricket') || this.router.url.includes('/dashboard/tennis') || this.router.url.includes('/dashboard/football');
                console.log('display_inplay_bar out--->',this.display_inplay_bar)
                if(this.display_inplay_bar){
                    console.log('in dis')
                    this.getCompetitions();
            this.getSoccerCompetitions();
            this.getTennisCompetitions();
                }
            if (event instanceof NavigationEnd) {
                this.candepositShow = ['/dashboard/home'].includes(event.url);
                this.istopbar_visible = this.topbar_routes.includes(event.url);
                this.fullview = this.fullview_routes.includes(event.url);
                this.casino_sidebar_visible = this.isvalidRoute(this.casino_sidebar, event.url);
                this.casino_page =  this.isvalidRoute([...this.casino_sidebar,['casino']], this.current_route);
            }
        });
        setInterval(() => this.test(), 3600000);

        this.bannerService.getBanner().subscribe((res: any) => {
            const imageBaseUrl = environment.image_url;
            this.banner_url = res.map((obj: any) => {
                return {
                    ...obj,
                    path: imageBaseUrl + obj.path,
                };
            });
        });

        // load homepage casino games for trending
        try {
            // reuse Home service pattern if available
            // @ts-ignore
            if (this['liveCasinoService'] && this['liveCasinoService'].getHomepageGames) {
                // @ts-ignore
                this['liveCasinoService'].getHomepageGames().subscribe((res: any) => {
                    this.IgtechcasinoGamelist = (res && res.games) ? res.games : [];
                });
            }
        } catch (e) {}

        // if(this.casino_page){
        if(this.display_inplay_bar){
            console.log('display inplay',this.display_inplay_bar)
            this.getMatches();
            this.getInplayTennisOdds();
            this.getInplaySoccerOdds();
            this.myInterval = setInterval(() => {
                this.getMatches();
                this.getInplayTennisOdds();
                this.getInplaySoccerOdds();
            }, 60000);
            this.getCompetitions();
            this.getSoccerCompetitions();
            this.getTennisCompetitions();
        }else {
            // Clear the interval if display is false
            clearInterval(this.myInterval);
            this.myInterval = null;
          }

          
        if (window.innerWidth > 768) {
            this.showSlider = true;
        }
    }

    closeSidebarOnNavigate() {
        if (window.innerWidth <= 768) {
            this.sidebarVisible = false;
        }
    }

    closeBet() {
        this.betdata = {};
        this.betslip_visible = false;
    }

    closeCasinoBet() {
        this.betdata = {};
        this.casino_betslip_visible = false;
    }

    toggleSubmenu() {
        this.submenuOpen = !this.submenuOpen;
    }

    isLoggedIn(): boolean {
        // Check the user's authentication status here
        // Return true if the user is logged in, false otherwise
        const isAuthenticated = this.authService.isLoggedIn();
        return isAuthenticated;
    }

    toggleSlider() {
        this.showSlider = !this.showSlider;
    }

    getMatches() {
        this.marketSubscription = this.matchService.getMatches().subscribe((res: any) => {
                if (res != null) {
                    const matches = res.map((match: any) => {
                        const {back, lay} = this.getBackLay(match);
                        return {...match, ...back, ...lay};
                    });
                    console.log('dash market',this.markets)
                    this.markets = matches.filter((item: any) => item.inplay);

                }
            }
        )
    }

    getInplayTennisOdds() {
        this.tennisSubscription = this.tennisoddsService.getAllTennisOdds().subscribe((res: any) => {
            this.tennisMarkets = res.filter((item: any) => item.inplay == "1");
        })
    }

    getInplaySoccerOdds() {
        this.soccerSubscription = this.socceroddsService.getAllSoccerOdds().subscribe((res: any) => {
            this.soccerMarkets = res.filter((item: any) => item.inplay == "1");
        })
    }

    getBackLay(res: any) {
        let back: any = {back1: 0, back2: 0, back3: 0};
        let lay: any = {lay1: 0, lay2: 0, lay3: 0};

        if (res && res.runners && res.runners.length > 0) {
            res.runners.forEach((runner: any, index: any) => {
                if (runner.ex && runner.ex.availableToBack && runner.ex.availableToBack.length > 0) {
                    back[`back${index + 1}`] = runner.ex.availableToBack[0] ? runner.ex.availableToBack[0].price : null;
                }

                if (runner.ex && runner.ex.availableToLay && runner.ex.availableToLay.length > 0) {
                    lay[`lay${index + 1}`] = runner.ex.availableToLay[0] ? runner.ex.availableToLay[0].price : null;
                }
            });
        }
        return {back, lay}
    }

    config: MatDialogConfig = {
        disableClose: false,
        hasBackdrop: true,
        backdropClass: 'test',
        width: '90%',
        height: '50%',
        panelClass: 'makeItMiddle', //Class Name that can be defined in styles.css as follows:
    };

    openDialog() {
        const dialogRef = this.dialog.open(SupportComponent, {minWidth: '90vw', maxHeight: '100vh'});
        dialogRef.afterClosed().subscribe((result: any) => {
            console.log(`Dialog result: ${result}`);
        });
    }

    logout() {
        console.log('called');
        this.authService.logout();
        this.router.navigate(["login"]).then(() => {
            window.location.reload();
        });
    }

    test() {
        this.logout();
    }

    getCompetitions() {
        this.matchService.getCompetitions().subscribe((data: any) => {
            console.log('data competition-->',data);
            this.competitions = data.competitions;
            this.total_competitions = data.total;
        })
    }

    getSoccerCompetitions() {
        this.socceroddsService.getSoccerCompetitions().subscribe((data: any) => {
            this.soccer_competitions = data.competitions;
            this.soccer_total_competitions = data.total;
        })
    }

    getTennisCompetitions() {
        this.tennisoddsService.getTennisCompetitions().subscribe((data: any) => {
            this.tennis_competitions = data.competitions;
            this.tennis_total_competitions = data.total;
        })
    }

    navigateToEventDetails(event: any, sport: string) {
        let slink = 'match-details';
        if (sport == 'football') {
            slink = 'soccer-details';
        } else if (sport == 'tennis') {
            slink = 'tennis-details';
        }
        if (event && event.event_id) {
            this.router.navigate(['/dashboard/' + slink, event.event_id]);
            event.stopPropagation();
        }
    }


    ngOnDestroy(): void {
        clearInterval(this.myInterval);
        if (this.marketSubscription) this.marketSubscription.unsubscribe();
        if (this.tennisSubscription) this.tennisSubscription.unsubscribe();
        if (this.soccerSubscription) this.soccerSubscription.unsubscribe();
    }

    isvalidRoute(routeArray: any, urlSegment: string) {
        for (const route of routeArray) {
            const pattern = new RegExp(`/${route}/*`);
            if (pattern.test(urlSegment)) {
                return false;
            }
        }
        return true;
    }

    getCurrentUsername(): string {
        return localStorage.getItem('username') || 'Demo User';
    }

    getCurrentUserInitial(): string {
        const username = this.getCurrentUsername();
        return username.charAt(0).toUpperCase();
    }

    isActiveSport(sport: string): boolean {
        const currentRoute = this.router.url;
        return currentRoute.includes(`/dashboard/${sport}`);
    }

    selectSport(sport: string): void {
        this.selectedSport = sport;
        // You can add navigation logic here if needed
        // this.router.navigate([`/dashboard/${sport}`]);
    }

    toggleSidebar(): void {
        this.sidebarVisible = !this.sidebarVisible;
    }

    closeSidebar(): void {
        this.sidebarVisible = false;
    }

    changePassword(): void {
       const dialogRef = this.dialog.open(ChangePasswordComponent, {});
       
        dialogRef.afterClosed().subscribe(result => {
            //console.log(`Dialog result: ${result}`);
        });
    }

    openDWlink(type: string){
      this.router.navigateByUrl('/dashboard/'+type);
    }

    openWhatsapp() {
        window.open('https://wa.me/' + this.technical_whatsapp, '_blank');
    }
}
