import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {o_fromStorage, st_set} from 'dfts-helper';
import {map, merge, Observable, of, share, shareReplay, Subject, switchMap, tap} from 'rxjs';
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
      of(o_fromStorage<GetMyselfResponse>('myuser_2')).pipe(
        switchMap((it) =>
          it ? of(it) : this.httpClient.get<GetMyselfResponse>('/user/myself').pipe(tap((iit) => st_set('myuser_2', iit)))
        ),
        map((it) => new MyUserModel(it))
      ),
      this.manualUserChange.asObservable()
    ).pipe(share(), shareReplay(1));
  }
}
