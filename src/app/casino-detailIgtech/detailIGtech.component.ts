import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'
import {BabyLonCasinoService} from "../services/babyloncasino.services";
import {LiveCasinoService} from "../services/livecasino.service";
import {Location} from '@angular/common';
import {UserService} from "../services/user.service";

@Component({
    selector: 'app-casino-detail-igtech',
    templateUrl: './detailIGtech.component.html',
    styleUrls: ['./detailIGtech.component.css']
})
export class CasinoDetailIgtechComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    public gameid: any;
    public provider: any;
    gameurl: SafeResourceUrl;
    is_active: boolean = true;
    open_lobby: boolean = false;
    balance = 0;
    clicked = false;
    public selectedGame: any;
    public loading: boolean = true;
    @ViewChild('gameIframe') gameIframe: ElementRef | undefined;

    constructor(private liveCasinoService: LiveCasinoService,private sanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute, private _location: Location, private userService: UserService) {

    }

    ngOnInit(): void {
        // this.userService.refreshBalance.subscribe(() => {
        //     this.getBalance();
        // })
        // this.getBalance();
        this.route.params.subscribe((param: any) => {
            this.gameid = param['gameid'];
            this.provider = param['provider'];
            if(param['type']=='true') this.open_lobby = true;
            this.loading = true;
            this.getGameUrl(this.gameid,this.provider);
        })
    }

    ngAfterViewInit() {
        if (this.gameIframe) {
          this.gameIframe.nativeElement.addEventListener('load', () => {
            this.loading = false;
          });
        }
    }

    getBalance() {
        this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
            this.balance = data.casino_balance;
            this.is_active = data.casino_active;
        })
    }

    getGameUrl(gameId: any, provider: any) {
        this.liveCasinoService.getGamesUrlByidRequestsIgtech({
            gameId,
            provider,
            openLobby: this.open_lobby
        }).subscribe({
            next: (res: any) => {
                if (res && res.url) {
                    const gameurl = res.url;
                    this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(gameurl);
                } else {
                    this.gameurl = "";
                    alert("Game URL not found. Please try again later.");
                    this.backClicked();
                }
            },
            error: (err) => {
                this.gameurl = "";
                alert("Something went wrong while loading the game. Please try again.");
                this.backClicked();
            }
        });
    }

    activateAccount(){
        return ;
    }

    backClicked() {
        this.router.navigate(['/dashboard/livecasino'])
        //this._location.back();
    }
}
