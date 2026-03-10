import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {ExposureService} from "../exposure.service";
import {UserService} from "../user.service";

@Injectable({
    providedIn: 'root'
})
export class CasinoBetsService {

    constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService) {
    }

    addCasinoBet(casinobet_details: any): Observable<any> {
        console.log('CB--->', casinobet_details);
        
        return this.http.post<any>(environment.base_url + "/add-casinobet", casinobet_details).pipe(tap(() => {
            this.exposureService.getExposureNext();
            this.exposureService.getExposureByRunnerNext();
            this.userService.getBalanceNext();
        }));
    }

    addTeenpattiOneDayCasinoBet(casinobet_details: any): Observable<any> {
        console.log('CB--->', casinobet_details);
        return this.http.post<any>(environment.base_url + "/add-casinoteenpattioneday-bet", casinobet_details).pipe(tap(() => {
            this.exposureService.getExposureNext();
            this.exposureService.getExposureByRunnerNext();
            this.userService.getBalanceNext();
        }));
    }

     addDTOneDayCasinoBet(casinobet_details: any): Observable<any> {
        console.log('CB--->', casinobet_details);
        return this.http.post<any>(environment.base_url + "/add-dtoneday-bet", casinobet_details).pipe(tap(() => {
            this.exposureService.getExposureNext();
            this.exposureService.getExposureByRunnerNext();
            this.userService.getBalanceNext();
        }));
    }

    addCard32BCasinoBet(casinobet_details: any): Observable<any> {
        console.log('CB--->', casinobet_details);
        return this.http.post<any>(environment.base_url + "/add-card32b-bet", casinobet_details).pipe(tap(() => {
            this.exposureService.getExposureNext();
            this.exposureService.getExposureByRunnerNext();
            this.userService.getBalanceNext();
        }));
    }

     addAAACasinoBet(casinobet_details: any): Observable<any> {
        console.log('CB--->', casinobet_details);
        return this.http.post<any>(environment.base_url + "/add-aaa-bet", casinobet_details).pipe(tap(() => {
            this.exposureService.getExposureNext();
            this.exposureService.getExposureByRunnerNext();
            this.userService.getBalanceNext();
        }));
    }

    addPokerOneDayCasinoBet(casinobet_details: any): Observable<any> {
        console.log('CB--->', casinobet_details);
        return this.http.post<any>(environment.base_url + "/add-casinopokeroneday-bet", casinobet_details).pipe(tap(() => {
            this.exposureService.getExposureNext();
            this.exposureService.getExposureByRunnerNext();
            this.userService.getBalanceNext();
        }));
    }

    addABJCasinoBet(casinobet_details: any): Observable<any> {
        console.log('CB--->', casinobet_details);
        return this.http.post<any>(environment.base_url + "/add-casinobet-abj", casinobet_details).pipe(tap(() => {
            this.exposureService.getExposureNext();
            this.exposureService.getExposureByRunnerNext();
            this.userService.getBalanceNext();
        }));
    }

    getCasinoBetsByMarketId(mid: any, game_name: any) {
        let user_id = localStorage.getItem("user_id")
        return this.http.get<any>(environment.base_url + "/casinobets-bymarket/" + mid + "/" + user_id + "/" + game_name);
    }

    getCasinoBetsByOnlyMarketId(mid: any) {
        let user_id = localStorage.getItem("user_id")
        return this.http.get<any>(environment.base_url + "/casinobets-byonlymarket/" + mid + "/" + user_id);
    }


    getCasinoExposureByMarketId(mid: any, game_name: any) {
        let user_id = localStorage.getItem("user_id")
        return this.http.get<any>(environment.base_url + "/casinoexposure-bymarket/" + mid + "/" + user_id + "/" + game_name);
    }

    getCasinoExposureByMarketIdFancy1(mid: any, game_name: any) {
        let user_id = localStorage.getItem("user_id")
        return this.http.get<any>(environment.base_url + "/casinoexposure-bymarket-fancy1/" + mid + "/" + user_id + "/" + game_name);
    }



    getCasinoExposureByOnlyMarketId(mid: any) {
        let user_id = localStorage.getItem("user_id")
        return this.http.get<any>(environment.base_url + "/casinoexposure-byonlymarket/" + mid + "/" + user_id);
    }

    getCasinoPlacedBetByFilter(filter: any) {
        return this.http.get<any>(environment.base_url + "/getDeclaredBetsByFilter/" + filter.game_name + "/" + filter.user_id + "/" + filter.f_date);
    }

    getCasinoResultsInDB(filter: any) {
        return this.http.get<any>(environment.base_url + "/getCasinoResultsInDB/" + filter.game_name + "/" + filter.f_date);
    }

    getCasinoResultonMarketId(mid:any){
        return this.http.get<any>(environment.base_url + "/getCasinoResultsonMarketId/" +mid);
      }

    getTeenPattiDetails(mid: any) {
        return this.http.get<any>(environment.base_url + "/get-casino-result/" + mid);
    }

    getCurrentBets() {
        let user_id = localStorage.getItem("user_id")
        return this.http.get<any>(environment.base_url + "/getCasinoCurrentBets/" + user_id);
    }
}
