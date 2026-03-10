import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as http from "http";
import {Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExposureService {

  private _refreshNeeded$ = new Subject<void>();
  private _refreshExposureAmtByRunner$ = new Subject<void>();
  private _refreshFancyExposureAmtByRunner$ = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  get refresh() {
    return this._refreshNeeded$;
  }

  get refreshExposureAmtByRunner() {
    return this._refreshExposureAmtByRunner$;
  }
  get refreshFancyExposureAmtByRunner() {
    return this._refreshFancyExposureAmtByRunner$;
  }

  getExposure(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get-exposure/" + user_id);
  }
  getCasinoExposure(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get-casino-exposure/" + user_id);
  }

  getExposureNext() {
    this._refreshNeeded$.next();
  }

  getExposureByRunnerNext() {
    this._refreshExposureAmtByRunner$.next();
  }
  getFancyExposureByRunnerNext() {
    this._refreshFancyExposureAmtByRunner$.next();
  }

  getExposureByrunner(runner_name: string): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get-exposure-byrunner/" + user_id + "/" + runner_name);
  }

  getExposureAmtByRunner(event_id: any): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get-exposureamt-byrunnergrp/" + user_id + "/" + event_id);
  }

  getFancyExposureAmtByRunner(event_id: any): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get-fancyexposureamt-byrunnergrp/" + user_id + "/" + event_id);
  }

  getAllSessionExposure(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get-allsessionexposure/" + user_id);
  }

  getAllMatchExposure(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get-allmatchexposure/" + user_id);
  }

  getAllBetsPl(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get_allbets_pl/" + user_id);
  }

  getTennisAllBetsPL(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get_tennis_allbets_pl/" + user_id);
  }

  getSoccerAllBetsPL(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get_soccer_allbets_pl/" + user_id);
  }

  getSessionAllBetsPL(): Observable<any> {
    let user_id = localStorage.getItem('user_id');
    return this.http.get<any>(environment.base_url + "/get_session_allbets_pl/" + user_id);
  }

  getSimmpleScore(event_id:any): Observable<any> {
    return this.http.get<any>("https://data.sitedata.live/lmt/lmt2.php?match_id="+event_id);
  }

  getAdvanceScore(event_id:any): Observable<any> {
    return this.http.get<any>("https://data.sitedata.live/lmt/lmt.php?match_id="+event_id);
  }
}
