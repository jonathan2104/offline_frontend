import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private http: HttpClient) {
  }

  getMatches() {
      return this.http.get(environment.base_url + "/markets");
  }

  getEvent(event_id: any) {
    return this.http.get(environment.base_url + "/event/" + event_id);
  }

  getMarketOdd(market_id: any) {
    return this.http.get(environment.base_url + "/market-odd/" + market_id);
  }

  getSession(event_id: any) {
    // return this.http.get(environment.base_url + "/session/" + event_id);
    //to fetch mapped session (with live and indb)
    return this.http.get(environment.base_url + "/test-session/" + event_id);
  }

  getFancy(event_id: any) {
    // return this.http.get(environment.base_url + "/session/" + event_id);
    //to fetch mapped session (with live and indb)
    return this.http.get(environment.base_url + "/test-fancy/" + event_id);
  }

  getScore(event_id:any){
    return this.http.get(environment.base_url + "/score/" + event_id);
  }

  CheckMatchOddChange(data:any){
    return this.http.get(environment.base_url + "/check-match-odd-change/" + data.market_id+"/"+data.runner_name+"/"+data.type+"/"+data.price);
  }

  CheckSessionPriceChange(data:any){
    return this.http.get(environment.base_url + "/check-session-change/" + data.event_id+"/"+data.runner_name+"/"+data.type+"/"+data.price);
  }

  getCompetitions() {
    return this.http.get(environment.base_url + "/all-competitions");
  }
}
