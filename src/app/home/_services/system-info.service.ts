import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {connect} from 'ngxtension/connect';

import {catchError, interval, map, merge, Observable, of, switchMap, timer} from 'rxjs';

import {AdminInfoResponse, JsonInfoResponse} from '../../_shared/waiterrobot-backend';

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

  private getAdminInfo$: Observable<AdminInfoResponse | undefined> = this.httpClient
    .get<AdminInfoResponse>('/config/info/environment')
    .pipe(catchError(() => of(undefined)));

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
  public show = signal(false);
}
