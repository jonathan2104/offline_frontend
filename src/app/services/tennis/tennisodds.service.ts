import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TennisoddsService {

  constructor(private http: HttpClient) {
  }

  getAllTennisOdds() {
    return this.http.get(environment.base_url + "/tennis-markets");
  }

  getTennistOddsByMarketId(market_id: any) {
    return this.http.get(environment.base_url + "/tennis-odd/" + market_id);
  }

  getTennisOddsByEventId(event_id: any) {
    return this.http.get(environment.base_url + "/tennis-odd-byevent/" + event_id);
  }

  CheckTennisOddChange(data: any) {
    return this.http.get(environment.base_url + "/check-tennis-odd-change/" + data.market_id + "/" + data.runner_name + "/" + data.type + "/" + data.price);
  }
  getTennisCompetitions() {
    return this.http.get(environment.base_url + "/all-tennis-competitions");
  }
}
