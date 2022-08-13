import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { User } from '../models/user.model';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const reqbody= {
      user:{
        "email":email,
        "password":password
      }
    }
    return this.http.post<User>('https://thawing-ravine-87621.herokuapp.com/api/users/login', reqbody).pipe(
      tap(res => this.setSession(res)),
      shareReplay());
  }

  private setSession(authResult:User) {
    const expiresAt = moment().add(1, 'days');

    localStorage.setItem('email', authResult.email);
    localStorage.setItem('user_id', authResult._id!);
    localStorage.setItem('id_token', authResult.token!);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getUserID():string | null{
    return localStorage.getItem('user_id');
  }

  getEmailID():string | null{
    return localStorage.getItem('email');
  }
  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = expiration ? JSON.parse(expiration) : moment().subtract(1,"days");
    return moment(expiresAt);
  }
}

