import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {ExposureService} from "./exposure.service";
import {UserService} from "./user.service";
import {EncypteService} from "./encrypt-data.services";

@Injectable({
  providedIn: 'root'
})
export class MarketBetsService {

  private _RefreshMatchBets$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService, private encypteService: EncypteService) {
  }

  get refreshMatchBets() {
    return this._RefreshMatchBets$;
  }

  addMatchBet(matchbet_details: any): Observable<any> {
    const userId = localStorage.getItem('user_id');

    // Encrypt the data
    const encryptedPayload = {
      encryptedData: this.encypteService.encryptData(matchbet_details, userId)
    };
    return this.http.post<any>(environment.base_url + "/add-matchbet", encryptedPayload).pipe(tap(() => {
      this._RefreshMatchBets$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }

  getMatchBets(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/matchbets-byevent/" + event_id + "/" + user_id);
  }

  getAllMatchBetsByUser(): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-matchbets-byuserid/" + user_id);
  }

  getUserBetsByEventId(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-matchbet-byeventid-foruser/" + event_id + "/" + user_id);
  }

  getMatchBetByFilter(filter: any): Observable<any> {
    return this.http.get<any>(environment.base_url + "/get-matchbet-byfilter/" + filter.user_id + "/" + filter.from + "/" + filter.to);
  }

  getCloseBetsForMatch(days:any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-openmatchbets/" + user_id+ "/0/" + days);
  }

  getOpenBetsForMatch(): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-openmatchbets/" + user_id + '/1/180');
  }

  cashout(cashout_details: any) {
    return this.http.patch(environment.base_url + "/cashout", cashout_details);
  }

  getBetHistory(data: any){
    return this.http.post<any>(environment.base_url + "/bet-history-client",data);
  }
}
