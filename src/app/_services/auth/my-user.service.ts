import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Subject} from 'rxjs';

import {GetMyselfResponse} from '../../_models/waiterrobot-backend';
import {MyUserModel} from '../../_models/user/my-user.model';

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  private loaded = false;
  private user: MyUserModel | undefined = undefined;
  public userChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  constructor(private httpClient: HttpClient) {}

  public getUser(): MyUserModel | undefined {
    if (!this.loaded) {
      this.loaded = true;
      this.fetchUser();
    }
    return this.user;
  }

  private fetchUser(): void {
    this.httpClient.get('/user/myself').subscribe({
      next: (data: any) => this.setUser(new MyUserModel(data as GetMyselfResponse)),
    });
  }

  public setUser(user: MyUserModel): void {
    this.user = user;
    this.userChange.next(this.user);
  }
}
