import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

import {catchError, filter, map, merge, Observable, of, Subject} from 'rxjs';

import {connect} from 'ngxtension/connect';

import {loggerOf, notNullAndUndefined} from 'dfts-helper';

import {GetMyselfResponse} from '../../../waiterrobot-backend';
import {MyUserModel} from './my-user.model';

type MyUserState = {
  status: 'UNSET' | 'LOADING' | 'LOADED';
  manualOverwritten: boolean;
  myUser?: MyUserModel;
};

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  private httpClient = inject(HttpClient);
  private lumber = loggerOf('MyUserService');

  private manualUserChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  private myUserLoaded$ = this.httpClient.get<GetMyselfResponse>('/user/myself').pipe(map((it) => new MyUserModel(it)));

  private myUserState = signal<MyUserState>({status: 'UNSET', manualOverwritten: false});

  constructor() {
    connect(
      this.myUserState,
      merge(
        this.manualUserChange.pipe(map((myUser) => ({myUser, manualOverwritten: true}))),
        this.myUserLoaded$.pipe(
          map((myUser) => ({myUser, status: 'LOADED' as const})),
          catchError(() => of({status: 'UNSET' as const})),
        ),
      ),
    );
  }

  setUser(it: MyUserModel): void {
    this.manualUserChange.next(it);
  }

  user = computed(() => this.myUserState().myUser);
  status = computed(() => this.myUserState().status);
  manualOverwritten = computed(() => this.myUserState().manualOverwritten);

  user$ = toObservable(this.user);

  getUser$(): Observable<MyUserModel> {
    return this.user$.pipe(filter(notNullAndUndefined));
  }
}
