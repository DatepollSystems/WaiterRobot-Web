import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from './http.service';
import {UserModel} from '../_models/user.model';

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  private loaded = false;
  private user: UserModel | null = null;
  public userChange: Subject<UserModel> = new Subject<UserModel>();

  constructor(private httpService: HttpService) {
  }

  public getUser(): UserModel | null {
    if (!this.loaded) {
      this.loaded = true;
      this.fetchUser();
    }
    return this.user;
  }

  private fetchUser(): void {
    this.httpService.get('/auth/myself').subscribe((data: any) => {
        console.log(data);
        this.setUser(new UserModel(data));
      },
      (error: any) => console.log(error));
  }

  public setUser(user: UserModel) {
    this.user = user;
    this.userChange.next(this.user);
  }
}
