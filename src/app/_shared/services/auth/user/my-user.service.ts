import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {o_fromStorage, st_set} from 'dfts-helper';
import {filter, map, merge, Observable, share, startWith, Subject, tap} from 'rxjs';
import {GetMyselfResponse} from '../../../waiterrobot-backend';

import {MyUserModel} from './my-user.model';

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  public manualUserChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  constructor(private httpClient: HttpClient) {}

  public getUser$(): Observable<MyUserModel> {
    return merge(
      this.httpClient.get<GetMyselfResponse>('/user/myself').pipe(
        tap((it) => st_set('myuser_2', it)),
        startWith(o_fromStorage('myuser_2') as GetMyselfResponse),
        filter((it) => it != undefined),
        map((it) => new MyUserModel(it)),
        share()
      ),
      this.manualUserChange.asObservable()
    );
  }
}
