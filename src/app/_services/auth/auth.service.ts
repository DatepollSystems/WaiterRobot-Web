import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {EnvironmentHelper} from '../../_helper/EnvironmentHelper';
import {BrowserHelper} from 'dfx-helper';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  private apiUrl = EnvironmentHelper.getAPIUrl();

  private sessionToken: string|null = null;
  private jwtToken: string|null = null;
  private jwtTokenExpires: Date;

  public redirectUrl: string | null = null;

  constructor(private http: HttpClient) {
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
  }

  public sendSignInRequest(username: string, password: string): Observable<any> {
    const browser = BrowserHelper.infos();
    const signInObject = {
      username,
      password,
      session_name: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile,
    };

    return this.http.post(this.apiUrl + '/v1/auth/login', signInObject, {headers: this.httpHeaders});
  }

  public setSessionToken(sessionToken: string): void {
    localStorage.setItem('sessionToken', sessionToken);
    this.sessionToken = sessionToken;
  }

  getSessionToken(): string|null {
    if (this.sessionToken == null) {
      this.sessionToken = localStorage.getItem('sessionToken');
    }
    return this.sessionToken;
  }

  public setJWTToken(jwtToken: string): void {
    localStorage.setItem('token', jwtToken);
    this.jwtToken = jwtToken;
    this.jwtTokenExpires = new Date();
    this.jwtTokenExpires.setMinutes(this.jwtTokenExpires.getMinutes() + 50);
  }

  public getJWTToken(): string|null {
    if (this.jwtToken == null) {
      this.jwtToken = localStorage.getItem('token');
    }
    return this.jwtToken;
  }

  public refreshJWTToken(): Observable<any> {
    const browser = BrowserHelper.infos();

    const object = {
      session_token: this.getSessionToken(),
      session_information: browser.name + ' - ' + browser.majorVersion + '; OS: ' + browser.os + '; Phone: ' + browser.mobile,
    };

    return this.http.post(this.apiUrl + '/auth/IamLoggedIn', object, {headers: this.httpHeaders}).pipe(
      tap((data: any) => {
        this.setJWTToken(data.access_token);
      })
    );
  }

  public logout(): void {
    // const object = {
    //   session_token: this.getSessionToken(),
    // };
    //
    // this.http.post(this.apiUrl + '/v1/user/myself/session/logoutCurrentSession', object, {headers: this.httpHeaders}).subscribe(
    //   (data: any) => {
    //     console.log(data);
    //     console.log('authService | Logout successful');
    //
    //     this.clearCookies();
    //     window.location.reload();
    //   },
    //   (error) => {
    //     this.clearCookies();
    //     console.log(error);
    //   }
    // );
    this.clearStorage();
    window.location.reload();
  }

  public clearStorage(): void {
    this.setSessionToken('null');
    this.setJWTToken('null');
    localStorage.clear();
  }


  public isAuthenticated(): boolean {
    return this.getSessionToken() != null;
  }

  public isJWTTokenValid(): boolean {
    if (this.getJWTToken() == null) {
      return false;
    }

    return new Date().getTime() < this.jwtTokenExpires.getTime();
  }
}
