import {Injectable, computed, inject, signal} from '@angular/core';

import {EMPTY, Subject, catchError, map, merge, of, switchMap} from 'rxjs';

import {connect} from 'ngxtension/connect';

import {injectAPI} from '@shared/api';
import {AuthService} from '@shared/services';

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
  #api = injectAPI();
  #authStatus$ = inject(AuthService).status$;

  #manualUserChange: Subject<MyUserModel> = new Subject<MyUserModel>();

  #myUserLoaded$ = this.#authStatus$.pipe(
    switchMap((status) => (status === 'LOGGED_IN' ? this.#api.get('/v1/user/myself').pipe(map((it) => new MyUserModel(it))) : EMPTY)),
  );

  private myUserState = signal<MyUserState>({
    status: 'UNSET',
    manualOverwritten: false,
  });

  constructor() {
    connect(
      this.myUserState,
      merge(
        this.#manualUserChange.pipe(map((myUser) => ({myUser, manualOverwritten: true}))),
        this.#myUserLoaded$.pipe(
          map((myUser) => ({myUser, status: 'LOADED' as const})),
          catchError(() => of({status: 'UNSET' as const})),
        ),
      ),
    );
  }

  setUser(it: MyUserModel): void {
    this.#manualUserChange.next(it);
  }

  user = computed(() => this.myUserState().myUser);
  status = computed(() => this.myUserState().status);
  manualOverwritten = computed(() => this.myUserState().manualOverwritten);
}
