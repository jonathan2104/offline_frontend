import {Component, OnInit, HostListener, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'
import {ApiproCasinoService} from "../services/apiprocasino.services";
import {LiveCasinoService} from "../services/livecasino.service";
import {Location} from '@angular/common';
import {UserService} from "../services/user.service";

@Component({
    selector: 'app-casino-details',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class ApiproCasinoDetailComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    public gameid: any;
    public provider: any;
    gameurl: SafeResourceUrl;
    is_active: boolean = true;
    balance = 0;
    clicked = false;
    public selectedGame: any;
    public loading: boolean = true;
    @ViewChild('gameIframe') gameIframe: ElementRef | undefined;

    constructor(private liveCasinoService: LiveCasinoService,private apiproCasinoService:ApiproCasinoService, private sanitizer: DomSanitizer, private route: ActivatedRoute, private _location: Location, private userService: UserService) {

    }

    ngOnInit(): void {
        this.userService.refreshBalance.subscribe(() => {
            this.getBalance();
        })
        this.getBalance();
        this.route.params.subscribe((param: any) => {
            this.gameid = param['gameid'];
            this.provider = param['provider'];
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

    getGameUrl(gameid:any,provider:any) {
        this.apiproCasinoService.getGamesUrlByApipro({gameid,provider}).subscribe((res: any) => {
            if(res.status == 'success') {
                const gameurl = res.gameurl;
                this.gameurl = this.sanitizer.bypassSecurityTrustResourceUrl(gameurl);
            }else{
                alert(res.message);
                this.backClicked();
            }
        })
    }

    activateAccount(){
        return ;
    }

    backClicked() {
        this._location.back();
    }
}
