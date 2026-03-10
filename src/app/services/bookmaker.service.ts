import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserService} from "./user.service";
import {ExposureService} from "./exposure.service";
import {Observable, Subject, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookmakerService {


  constructor(private http: HttpClient, private exposureService: ExposureService, private userService: UserService) {
  }


  getBookmakerOdd(event_id: any) {
    return this.http.get(environment.base_url + "/bookmaker-odd/" + event_id);
  }

}
