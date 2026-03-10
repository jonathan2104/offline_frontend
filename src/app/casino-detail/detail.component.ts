import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {ApiproCasinoService} from "../services/apiprocasino.services";
import {Location} from '@angular/common';
import {UserService} from "../services/user.service";

@Component({
    selector: 'app-casino-details',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css'],
    providers: []
})
export class CasinoDetailComponent implements OnInit {
    @ViewChild('gameIframe') gameIframe: ElementRef | undefined;
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    public lobbydata: any;
    public gameid: any;
    gameurl: any = "";
    public loading: boolean = true;
    is_active: boolean = false;
    balance = 0;
    clicked = false;
    public selectedGame: any;

    constructor(private liveCasinoService: ApiproCasinoService, private sanitizer: DomSanitizer, private router: Router, private activatedRoute: ActivatedRoute, private _location: Location, private userService: UserService,) {
        this.lobbydata = this.activatedRoute.snapshot.paramMap.get('lobbydata');
        this.gameid = this.activatedRoute.snapshot.paramMap.get('gameid');
    
        // Ensure gameid exists before calling the method
        if (this.gameid) {
            this.getGameUrl(this.gameid);
        }
    }

    ngOnInit(): void {
        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
        this.gameid = this.activatedRoute.snapshot.paramMap.get('gameid');
        this.selectedGame = this.activatedRoute.snapshot.paramMap.get('selectedgame');
    }

    getBalance() {
        this.userService.getUserBalance(this.user_id).subscribe((data: any) => {
            this.balance = data.casino_balance;
            this.is_active = data.casino_active;
        })
    }

    getGameUrl(gameid:any) {
        this.liveCasinoService.getGamesUrl(gameid).subscribe((res: any) => {
            if(res.status == 'success') {
                this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(res.gameurl);
            }else{
                alert(res.message);
                this.backClicked();
            }
        })
    }

    ngAfterViewInit() {
        if (this.gameIframe) {
          this.gameIframe.nativeElement.addEventListener('load', () => {
            this.loading = false;
          });
        }
    }

    backClicked() {
        this.router.navigate(['dashboard/livecasino']);
    }

}
