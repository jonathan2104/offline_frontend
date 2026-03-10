import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser'
import {ApiproCasinoService} from "../services/apiprocasino.services";

@Component({
    selector: 'app-livecasino',
    templateUrl: './casino.component.html',
    styleUrls: ['./casino.component.css'],
    providers: []
})
export class ApiproCasinoComponent implements OnInit {
    user_id = localStorage.getItem("user_id");
    username = localStorage.getItem("username");
    balance = 0;
    gameList: any = [];
    gameurl: any = "";
    isloading: boolean = true;
    is_active: boolean = true;
    clicked = false;
    currentPage: number = 1;
    totalPages: number = 1;

    constructor(private apiproCasinoService:ApiproCasinoService, private sanitizer: DomSanitizer, private router: Router) {
    }

    ngOnInit(): void {
        this.getGameList(this.currentPage);
    }

    getGameList(page: number) {
        this.apiproCasinoService.getAllGamesByPage(page).subscribe(
          (res: any) => {
            if (res && res.games && res.games.length > 0) {
              this.gameList = res.games;
              this.totalPages = res.total_pages;
              this.isloading = false;
            } else {
              console.log('Empty or invalid response:', res);
            }
          },
          (error) => {
            console.error('Error fetching game list:', error);
          }
        );
    }

    changePage(page: number) {
        if (page > 0 && page <= this.totalPages) {
            this.currentPage = page;
            this.isloading = true;
            this.getGameList(this.currentPage);
        }
    }

    getPaginationRange(): any[] {
        const pages = [];
        pages.push(1);
        if (this.currentPage > 3) {
          pages.push('...');
        }
        for (let i = Math.max(2, this.currentPage - 1); i <= Math.min(this.totalPages - 1, this.currentPage + 1); i++) {
          pages.push(i);
        }
        if (this.currentPage < this.totalPages - 2) {
          pages.push('...');
        }
        if (this.totalPages > 1) {
          pages.push(this.totalPages);
        }
        return pages;
    }

    openGametab(game: any) {
        this.router.navigate(['/casino-detail/'+game.uuid]);
    }

    activateAccount(){
        alert('contact your administrator');
        return false;
    }
}
