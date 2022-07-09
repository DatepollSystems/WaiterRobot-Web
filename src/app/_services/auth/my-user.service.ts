import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from '../http.service';
import {GetMyselfResponse} from '../../_models/waiterrobot-backend';
import {MyUserModel} from '../../_models/user/my-user.model';

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  private loaded = false;
  private user: MyUserModel | undefined = undefined;
  public userChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  constructor(private httpService: HttpService) {}

  public getUser(): MyUserModel | undefined {
    if (!this.loaded) {
      this.loaded = true;
      this.fetchUser();
    }
    return this.user;
  }

  private fetchUser(): void {
    this.httpService.get('/user/myself').subscribe({
      next: (data: any) => {
        this.setUser(new MyUserModel(data as GetMyselfResponse));
      },
      error: (error: any) => console.log(error),
    });
  }

  public setUser(user: MyUserModel): void {
    this.user = user;
    this.userChange.next(this.user);
  }
}
