import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

import {AuthService} from '@shared/services/auth/auth.service';
import {GetMyselfResponse} from '@shared/waiterrobot-backend';

import {notNullAndUndefined} from 'dfts-helper';

import {connect} from 'ngxtension/connect';

import {catchError, EMPTY, filter, map, merge, Observable, of, Subject, switchMap} from 'rxjs';
import {MyUserModel} from './my-user.model';

interface MyUserState {
  status: 'UNSET' | 'LOADING' | 'LOADED';
  manualOverwritten: boolean;
  myUser?: MyUserModel;
}

@Injectable({
  providedIn: 'root',
})
export class MyUserService {
  private httpClient = inject(HttpClient);
  private authStatus$ = inject(AuthService).status$;

  private manualUserChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  private myUserLoaded$ = this.authStatus$.pipe(
    switchMap((status) =>
      status === 'LOGGED_IN' ? this.httpClient.get<GetMyselfResponse>('/user/myself').pipe(map((it) => new MyUserModel(it))) : EMPTY,
    ),
  );

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
