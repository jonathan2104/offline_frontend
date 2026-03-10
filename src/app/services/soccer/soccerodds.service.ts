import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SocceroddsService {

  constructor(private http: HttpClient) {

  }

  getAllSoccerOdds() {
    return this.http.get(environment.base_url + "/soccer-markets");
  }

  getSoccerOddsByEventId(event_id: any) {
    return this.http.get(environment.base_url + "/soccer-odd-byevent/" + event_id);
  }

  CheckSoccerOddChange(data: any) {
    return this.http.get(environment.base_url + "/check-soccer-odd-change/" + data.market_id + "/" + data.runner_name + "/" + data.type + "/" + data.price);
  }

  getSoccerCompetitions(){
    return this.http.get(environment.base_url + "/all-soccer-competitions");
  }

}
