import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, Subject, tap} from "rxjs";
import {ExposureService} from "../exposure.service";
import {UserService} from "../user.service";

@Injectable({
  providedIn: 'root'
})
export class TennisSessionBetService {

  private _RefreshTennisBets$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService) {

  }

  getUserTennisSessionBetsByEventId(event_id: any, market_id: any, main_type: any): Observable<any> {

  
    let user_id = localStorage.getItem("user_id");
    const encodedMainType = encodeURIComponent(main_type);
  
    const url = `${environment.base_url}/get-tennissessionbet-byeventid-foruser/${event_id}/${market_id}/${user_id}/${encodedMainType}`;
    
    return this.http.get<any>(url);
  }

  addTennisSessionBet(Tennisbet_details: any): Observable<any> {
    return this.http.post<any>(environment.base_url + "/add-tennissessionbet", Tennisbet_details).pipe(tap(() => {
      this._RefreshTennisBets$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }

  getTennisSessionBets(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id")
    return this.http.get<any>(environment.base_url + "/tennissessionbets-byevent/" + event_id + "/" + user_id);
  }

  getOpenBetsforTennisSession():Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opentennissessionbets/" +user_id + '/1');
  }
}
