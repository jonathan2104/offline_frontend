import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SoccerSessionService {

  constructor(private http: HttpClient) {

  }

  getSoccerSessionByEventId(event_id: any) {
    return this.http.get(environment.base_url + "/soccer-session-byevent/" + event_id);
  }

  CheckSoccerSessionChange(data: any) {
    return this.http.get(environment.base_url + "/check-soccer-session-change/" + data.market_id + "/" + data.runner_name + "/" + data.type + "/" + data.price);
  }

}
