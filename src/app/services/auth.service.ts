import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.base_url;
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(private http: HttpClient) {
  }

  logIn(user: any) {
    return this.http.post(this.url + '/login', {username: user.username, password: user.password});
  }

  changePasswordWithOld(user_data: any) {
    return this.http.patch(this.url + "/password-change-fromlogin", user_data);
  }

  public isLoggedIn() {
    return localStorage.getItem('token') !== null;
  }

  public logout() {
    localStorage.removeItem('user_data');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('popup');

  }

  public getToken() {
    return localStorage.getItem('token');
  }
}
