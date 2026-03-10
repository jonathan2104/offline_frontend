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
export class SessionBetsService {

  private _refreshNeeded$ = new Subject<void>();

  constructor(private http: HttpClient, private exposureService: ExposureService, private userService:UserService, private encypteService: EncypteService) {
  }

  get refresh() {
    return this._refreshNeeded$;
  }

  addSessionBet(sessionbet_details: any): Observable<any> {
    const userId = localStorage.getItem('user_id');

    // Encrypt the data
    const encryptedPayload = {
      encryptedData: this.encypteService.encryptData(sessionbet_details, userId)
    };
    return this.http.post<any>(environment.base_url + "/add-sessionbets", encryptedPayload).pipe(tap(() => {
      this._refreshNeeded$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }


  updateSessionBet(sessionbet_details: any): Observable<any> {
    return this.http.patch<any>(environment.base_url + "/update-sessionbets", sessionbet_details).pipe(tap(() => {
      this._refreshNeeded$.next();
      this.exposureService.getExposureNext();
      this.exposureService.getExposureByRunnerNext();
      this.userService.getBalanceNext();
    }));
  }
  getSessionBet(event_id: any): Observable<any> {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/sessionbets-byevent/" + event_id+"/"+user_id);
  }
 getAllSessionBetByUser():Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-sessionbets-byuserid/" + user_id);
  }
  getSessionBetsByDateFilter(filter:any):Observable<any>
  {
    return this.http.get<any>(environment.base_url + "/get-sessionbets-byfilter/" + filter.user_id+"/"+filter.from+"/"+filter.to);
  }

  getCloseBetsforSession(days:any):Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opensessionbets/" +user_id+ "/0/" + days);
  }
  getOpenBetsforSession():Observable<any>
  {
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-opensessionbets/" +user_id + '/1/180');
  }

  getSessionByRunnerEvent(event_id:any,runner_name:any){
    let user_id = localStorage.getItem("user_id");
    return this.http.get<any>(environment.base_url + "/get-session-byrunner-event/" +user_id+"/"+event_id+"/"+runner_name);
  }
}
