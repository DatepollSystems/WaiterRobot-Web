import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from './http.service';
import {UserModel} from '../_models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  private loaded = false;
  private user: UserModel | undefined = undefined;
  public userChange: Subject<UserModel> = new Subject<UserModel>();

  constructor(private httpService: HttpService) {}

  public getUser(): UserModel | undefined {
    if (!this.loaded) {
      this.loaded = true;
      this.fetchUser();
    }
    return this.user;
  }

  private fetchUser(): void {
    this.httpService.get('/user/myself').subscribe(
      (data: any) => {
        this.setUser(new UserModel(data));
      },
      (error: any) => console.log(error)
    );
  }

  public setUser(user: UserModel): void {
    this.user = user;
    this.userChange.next(this.user);
  }
}
