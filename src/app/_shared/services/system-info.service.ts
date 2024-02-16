import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {catchError, interval, map, merge, Observable, of, switchMap, timer} from 'rxjs';

import {connect} from 'ngxtension/connect';

import {b_fromStorage, st_set} from 'dfts-helper';

import {AdminInfoResponse, JsonInfoResponse} from '../waiterrobot-backend';
import {AuthService} from './auth/auth.service';

type ServerInfoState = {
  status: 'Online' | 'Offline' | 'Pending';
  refreshIn: number;
  publicInfo?: {
    lastPing: Date;
    responseTime: number;
  } & JsonInfoResponse;
  adminInfo?: AdminInfoResponse;
};

const refreshIn = 20;

@Injectable()
export class SystemInfoService {
  private httpClient = inject(HttpClient);
  private authService = inject(AuthService);

  private serverInfoState = signal<ServerInfoState>({
    status: 'Pending',
    refreshIn,
  });

  private getJsonInfo$ = timer(0, refreshIn * 1000).pipe(
    takeUntilDestroyed(),
    map(() => new Date().getTime()),
    switchMap((startMs) =>
      this.httpClient.get<JsonInfoResponse>('/json').pipe(
        map((response) => ({
          status: 'Online' as const,
          refreshIn,
          publicInfo: {
            ...response,
            lastPing: new Date(),
            responseTime: new Date().getTime() - startMs - 5,
          },
        })),
        catchError(() => of({status: 'Offline' as const})),
      ),
    ),
  );

  private getAdminInfo$: Observable<AdminInfoResponse | undefined> = this.authService.status$.pipe(
    switchMap((status) => (status === 'LOGGED_IN' ? this.httpClient.get<AdminInfoResponse>('/config/info/environment') : of(undefined))),
    catchError(() => of(undefined)),
  );

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.serverInfoState.update((it) => ({...it, refreshIn: it.refreshIn - 1})));

    connect(this.serverInfoState, merge(this.getJsonInfo$, this.getAdminInfo$.pipe(map((adminInfo) => ({adminInfo})))));
  }

  public status = computed(() => this.serverInfoState().status);
  public refreshIn = computed(() => this.serverInfoState().refreshIn);
  public publicInfo = computed(() => this.serverInfoState().publicInfo);
  public adminInfo = computed(() => this.serverInfoState().adminInfo);
}

@Injectable({
  providedIn: 'root',
})
export class SystemInfoShowService {
  _show = signal(b_fromStorage('show_devmenu') ?? false);

  show = computed(() => this._show());

  set(it: boolean): void {
    st_set('show_devmenu', it);
    this._show.set(it);
    console.warn(`Developer mode ${it ? 'enabled' : 'disabled'}`);
  }
}
