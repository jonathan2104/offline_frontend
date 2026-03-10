import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";

import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {ExposureService} from "../exposure.service";
import {UserService} from "../user.service";
import {EncypteService} from "../encrypt-data.services";

@Injectable({
  providedIn: 'root'
})
export class SoccerBetsService {

  private _RefreshSoccerBets$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService,private encypteService: EncypteService) {
  }

  get refreshSoccerBets() {
    return this._RefreshSoccerBets$;
  }

  addSoccerBet(soccerbet_details: any): Observable<any> {
    const userId = localStorage.getItem('user_id');

    // Encrypt the data
    const encryptedPayload = {
      encryptedData: this.encypteService.encryptData(soccerbet_details, userId)
    };
    return this.http.post<any>(environment.base_url + "/add-soccerbet", encryptedPayload).pipe(tap(() => {
      this._RefreshSoccerBets$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }
  getSoccerBets(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/soccerbets-byevent/" + event_id + "/" + user_id);
  }

  getUserSoccerBetsByEventId(event_id: any,market_id:any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/get-soccerbet-byeventid-foruser/" + event_id + "/" + market_id + "/" + user_id);
  }

  getCloseBetsforSoccer(days:any):Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opensoccerbets/" +user_id+ "/0/" + days);
  }

  getOpenBetsforSoccer():Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opensoccerbets/" +user_id + '/1/180');
  }
}
