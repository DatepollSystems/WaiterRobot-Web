import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StorageHelper} from 'dfx-helper';

import {Subject} from 'rxjs';
import {MyUserModel} from './my-user.model';

import {GetMyselfResponse} from '../../../waiterrobot-backend';

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
      this.user = StorageHelper.getObject('myuser') as MyUserModel;
      this.fetchUser();
    }
    return this.user;
  }

  private fetchUser(): void {
    this.httpClient.get<GetMyselfResponse>('/user/myself').subscribe({
      next: (data) => {
        this.loaded = true;
        this.setUser(new MyUserModel(data));
      },
    });
  }

  public setUser(user: MyUserModel): void {
    this.user = user;
    this.userChange.next(this.user);
    StorageHelper.set('myuser', this.user);
  }
}
