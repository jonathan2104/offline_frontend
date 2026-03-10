import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class DragonTigerService {

  constructor(private http: HttpClient) {
  }

  getLiveData() {
    return this.http.get<any>(environment.base_url + "/get-dt20");
  }

  getResultHistory() {
    return this.http.get<any>(environment.base_url + "/get-dt20-result-history");
  }

  getLiveData202() {
    return this.http.get<any>(environment.base_url + "/get-dt202");
  }

  getResultHistory202() {
    return this.http.get<any>(environment.base_url + "/get-dt202-result-history");
  }

  getLiveDataOneDay() {
    return this.http.get<any>(environment.base_url + "/get-dtoneday");
  }

  getResultHistoryOneDay() {
    return this.http.get<any>(environment.base_url + "/get-dtoneday-result-history");
  }

  getLiveDataLion() {
    return this.http.get<any>(environment.base_url + "/get-dtl20");
  }

  getResultHistoryLion() {
    return this.http.get<any>(environment.base_url + "/get-dtl20-result-history");
  }

}
