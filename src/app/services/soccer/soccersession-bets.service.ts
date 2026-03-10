import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {ExposureService} from "../exposure.service";
import {UserService} from "../user.service";

@Injectable({
  providedIn: 'root'
})
export class SoccerSessionBetService {

  private _RefreshSoccerBets$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService) {

  }

  getUserSoccerSessionBetsByEventId(event_id: any, market_id: any, main_type: any): Observable<any> {

  
    let user_id = localStorage.getItem("user_id");
    const encodedMainType = encodeURIComponent(main_type);
  
    const url = `${environment.base_url}/get-soccersessionbet-byeventid-foruser/${event_id}/${market_id}/${user_id}/${encodedMainType}`;
    
    return this.http.get<any>(url);
  }

  addSoccerSessionBet(soccerbet_details: any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/add-soccersessionbet", soccerbet_details).pipe(tap(() => {
      this._RefreshSoccerBets$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }

  getSoccerSessionBets(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/soccersessionbets-byevent/" + event_id + "/" + user_id);
  }

  getOpenBetsforSoccerSession():Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opensoccersessionbets/" +user_id + '/1');
  }
}
