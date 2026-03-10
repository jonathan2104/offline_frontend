import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class BaccaratService {

    constructor(private http: HttpClient) {
    }

    getBaccarat1LiveData() {
        return this.http.get<any>(environment.base_url + "/get-baccarat1");
    }

    getBaccarat1ResultHistory() {
        return this.http.get<any>(environment.base_url + "/get-baccarat1-result-history");
    }

     getBaccarat2LiveData() {
        return this.http.get<any>(environment.base_url + "/get-baccarat2");
    }

    getBaccarat2ResultHistory() {
        return this.http.get<any>(environment.base_url + "/get-baccarat2-result-history");
    }

}
