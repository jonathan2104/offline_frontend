import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class PokerOnedayService {

    constructor(private http: HttpClient) {
    }

    getLiveData() {
        return this.http.get<any>(environment.base_url + "/get-pokeroneday");
    }

    getResultHistory() {
        return this.http.get<any>(environment.base_url + "/get-pokeroneday-result-history");
    }
}
