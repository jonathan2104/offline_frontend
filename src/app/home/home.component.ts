import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LiveCasinoService } from '../services/livecasino.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatchService } from '../services/match.service';
import { Subscription } from 'rxjs';
import {TransactionService} from "../services/transaction.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  @ViewChild('casinoLobby') casinoLobby!: ElementRef;
  @ViewChildren('loopSlider') loopSliders!: QueryList<ElementRef<HTMLDivElement>>;

  gameSections: Record<string, any[]> = {
    newLaunch: [],
    trendingGames: [],
    recommendedGames: [],
    liveCasino: [],
    slots: [],
    casinoLobby: []
  };

  sports = [
    { icon: 'assets/icons/cricket.svg', name: 'CRICKET', linkerLink: '/dashboard/cricket' },
    { icon: 'assets/icons/soccer-ball-variant.svg', name: 'FOOTBALL', linkerLink: '/dashboard/football' },
    { icon: 'assets/icons/tennis-balls.svg', name: 'TENNIS', linkerLink: '/dashboard/tennis' },
  ];

  // dynamic matches
  matches: any[] = [];
  trendingGames: any[] = [
    { logo_square: "assets/trending-games/aviator.png", casinoGameId: "aviator", provider: "SPB" }, 
    { logo_square: "assets/trending-games/live-prediction.png", casinoGameId: "151116", provider: "DC" }, 
    { logo_square: "assets/trending-games/chicken-games.png", casinoGameId: "151132", provider: "DC" }, 
    { logo_square: "assets/trending-games/color-prediction.png", casinoGameId: "HAK-colors", provider: "QT" }, 
    { logo_square: "assets/trending-games/marble-race.png", casinoGameId: "400091", provider: "DC" }, 
    { logo_square: "assets/trending-games/mines.png", casinoGameId: "mines", provider: "SPB" },
  ];
  newLobbys: any[] = [
    { game_name: "Aman Casino", logo_square: "./assets/casino/lobby/Aman Casino.png", casinoGameId: '98790', provider: "AC" },
    { game_name: "Betradar", logo_square: "./assets/casino/lobby/Bet Radar.png", casinoGameId: null, provider: "BR" },
    { game_name: "BollyTech", logo_square: "./assets/casino/lobby/BolyTech.png", casinoGameId: null, provider: "BT" },
    // { game_name: "Dream Casino", logo_square: "./assets/casino/lobby/Dream CAsino.png", casinoGameId: null, provider: "DC" },
    { game_name: "Evolution", logo_square: "./assets/casino/lobby/Evolution.png", casinoGameId: '1000000', provider: "EVZ" },
    { game_name: "Ezugi", logo_square: "./assets/casino/lobby/Ezugi.png", casinoGameId: null, provider: "EZ" },
    // { game_name: "Onlyplay", logo_square: "./assets/casino/lobby/OnlyPlay.png", casinoGameId: null, provider: "GT" },
    // { game_name: "Pragmatic Play", logo_square: "./assets/casino/lobby/ParagmaticPlay.png", casinoGameId: null, provider: "PP" },
    // { game_name: "Qtech", logo_square: "./assets/casino/lobby/Qtech.png", casinoGameId: null, provider: "QT" },
    // { game_name: "SmartSoft Gaming", logo_square: "./assets/casino/lobby/SmartBetGaming.png", casinoGameId: null, provider: "SMTSG" },
    // { game_name: "Supernowa", logo_square: "./assets/casino/lobby/Supernova.png", casinoGameId: null, provider: "SN" },
    // { game_name: "Spribe", logo_square: "./assets/casino/lobby/Spribe.png", casinoGameId: null, provider: "SPB" },
    { game_name: "XPro Gaming", logo_square: "./assets/casino/lobby/Xprogaming.png", casinoGameId: null, provider: "XPG" },
  ];
  private matchSubscription!: Subscription;
  private intervalId: any;

  isLoading = true;
  technical_whatsapp: string = '';

  constructor(
    private liveCasinoService: LiveCasinoService,
    private matchService: MatchService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // Load games
    this.loadSection('newLaunch', 'DC', 'Crash%20Type');
    this.loadSection('trendingGames', 'TRENDING', 'All');
    this.loadSection('recommendedGames', 'SPB', 'All');
    this.loadSection('liveCasino', 'All', 'EvolutionLive');
    this.loadSection('slots', 'All', 'Slots');
    this.loadSection('casinoLobby', 'All', 'DcLobby');

    // Load matches
    this.getMatches();
    //this.intervalId = setInterval(() => this.getMatches(), 5000);
    this.transactionService.getPopupDataRequests().subscribe((res: any) => {
        this.technical_whatsapp = res[0].technical_whatsapp;
    });
  }

  // Returns a triplicated array for seamless looping
  getLooped<T>(items: T[]): T[] {
    if (!items || items.length === 0) return items;
    return items.concat(items, items);
  }

  // Replace getLooped() usage for lobby with this
  getLoopedLobby<T>(items: T[]): T[] {
    if (!items || items.length === 0) return [];
    const repeatCount = 10; // repeat 10 times for a smooth infinite feel
    let result: T[] = [];
    for (let i = 0; i < repeatCount; i++) {
      result = result.concat(items);
    }
    return result;
  }

  // Initialize all horizontal sliders to the middle copy
  initLoopSliders(): void {
    if (!this.loopSliders) return;
    this.loopSliders.forEach((ref) => {
      const el = ref.nativeElement as HTMLDivElement;
      const oneSetWidth = el.scrollWidth / 3;
      // Jump to the middle set so both sides are available
      el.scrollLeft = Math.round(oneSetWidth);
    });
  }

  scrollLobby(direction: 'left' | 'right') {
    const container = this.casinoLobby.nativeElement;
    const scrollAmount = 300; // adjust step
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  // Keep lobby scroll infinite by recentering at edges
  onLobbyScroll(): void {
    const container = this.casinoLobby?.nativeElement as HTMLDivElement;
    if (!container) return;

    const total = container.scrollWidth;
    const visible = container.clientWidth;
    const scrollLeft = container.scrollLeft;

    // When near left end → jump forward by original array width
    const oneSet = total / 10; // match repeatCount
    if (scrollLeft <= 0) {
      container.scrollLeft += oneSet;
    }

    // When near right end → jump backward by original array width
    if (scrollLeft + visible >= total) {
      container.scrollLeft -= oneSet;
    }
  }

  // Recenter generic sliders when hitting edges
  onLoopScroll(event: Event): void {
    const el = event.currentTarget as HTMLDivElement;
    if (!el) return;
    const total = el.scrollWidth;
    if (total === 0) return;
    const oneSet = total / 3;
    if (el.scrollLeft <= 1) {
      el.scrollLeft = Math.round(el.scrollLeft + oneSet);
    }
    if (el.scrollLeft >= Math.floor(oneSet * 2) - 1) {
      el.scrollLeft = Math.round(el.scrollLeft - oneSet);
    }
  }

  /**
   * Fetch matches dynamically (similar to cricket.component)
   */
  getMatches() {
    this.matchSubscription = this.matchService.getMatches().subscribe((res: any) => {
      res.sort((a: any, b: any) => {
        const startTimeA = new Date(a.start_time);
        const startTimeB = new Date(b.start_time);

        if (a.inplay && !b.inplay) return -1;
        if (!a.inplay && b.inplay) return 1;

        return startTimeA.getTime() - startTimeB.getTime();
      });

      this.matches = res;
    });
  }

  // Game section loader
  loadSection(section: string, provider: string, category: string) {
    this.liveCasinoService.getGamesByCategoryRequestsIgtech(provider, category, 1, null)
      .subscribe({
        next: (res: any) => {
          let games = res.games || [];

          if (section === 'casinoLobby') {
            // merge static + dynamic
            games = [...games, ...this.newLobbys];

            // remove specific game by gameId
            const removeIds = ["150031"];
            games = games.filter((g: any) => !removeIds.includes(g.casinoGameId));

            // sort with priority
            games.sort((a: any, b: any) => {
              const priority = (game: any) => {
                if (game.game_name === 'Mac88 Lobby') return 0;
                if (game.game_name.startsWith('MAC')) return 1;
                return 2;
              };

              return priority(a) - priority(b);
            });
          }
          this.gameSections[section] = games;
          this.isLoading = false;
          // After sections receive data, initialize sliders and lobby once
          setTimeout(() => {
            if (this.casinoLobby) {
              const el = this.casinoLobby.nativeElement as HTMLDivElement;
              const total = el.scrollWidth;
              const oneSet = total / 10; // repeatCount
              el.scrollLeft = oneSet * Math.floor(10 / 2); // start from middle set
            }
          }, 100);
        },
        error: () => {
          this.gameSections[section] = [];
          this.isLoading = false;
        }
      });
  }

  onImageError(event: any) {
    event.target.src = './assets/images/no_images.png';
  }

  openDWlink(type: string) {
    this.router.navigateByUrl('/dashboard/' + type);
  }

  openNewGameTab(gameid: any, provider: any) {
    if (provider === 'DC2') {
      this.router.navigate(['/dashboard/' + gameid]);
      return;
    }
    if(gameid==null){
       this.router.navigate(['/casino-detail-igtech/', 'true', provider]);
       return;
    }
    this.router.navigate(['/casino-detail-igtech/', gameid, provider]);
  }

  openMatchDetails(event_id: any) {
    this.router.navigate(['/dashboard/match-details', event_id]);
  }

  openWhatsapp() {
    window.open('https://wa.me/' + this.technical_whatsapp, '_blank');
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.classList.add('loaded');
    const wrapper = img.parentElement;
    if (wrapper) wrapper.classList.add('loaded');
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (this.matchSubscription) this.matchSubscription.unsubscribe();
  }
}