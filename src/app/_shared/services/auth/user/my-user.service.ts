import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {filter, map, merge, Observable, share, startWith, Subject, tap} from 'rxjs';
import {StorageHelper} from 'dfx-helper';

import {MyUserModel} from './my-user.model';
import {GetMyselfResponse} from '../../../waiterrobot-backend';

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  public manualUserChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  constructor(private httpClient: HttpClient) {}

  public getUser$(): Observable<MyUserModel> {
    return merge(
      this.httpClient.get<GetMyselfResponse>('/user/myself').pipe(
        tap((it) => StorageHelper.set('myuser_2', it)),
        startWith(StorageHelper.getObject('myuser_2') as GetMyselfResponse),
        filter((it) => it != undefined),
        map((it) => new MyUserModel(it)),
        share()
      ),
      this.manualUserChange.asObservable()
    );
  }
}
