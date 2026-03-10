import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TennisSessionService {

  constructor(private http: HttpClient) {

  }

  getTennisSessionByEventId(event_id: any) {
    return this.http.get(environment.base_url + "/tennis-session-byevent/" + event_id);
  }

  CheckTennisSessionChange(data: any) {
    return this.http.get(environment.base_url + "/check-tennis-session-change/" + data.market_id + "/" + data.runner_name + "/" + data.type + "/" + data.price);
  }

}
