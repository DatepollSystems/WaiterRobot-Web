import {HttpClient} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {catchError, EMPTY, interval, map, Observable, switchMap, timer} from 'rxjs';

import {AdminInfoResponse, JsonInfoResponse} from '../../_shared/waiterrobot-backend';

type SeverInfoState = {
  status: 'Online' | 'Offline' | 'Pending';
  refreshIn: number;
  publicInfo?: {
    lastPing: Date;
    responseTime: number;
  } & JsonInfoResponse;
  adminInfo?: AdminInfoResponse;
};

@Injectable({providedIn: 'root'})
export class ServerInfoService {
  private httpClient = inject(HttpClient);

  private serverInfoState = signal<SeverInfoState>({
    status: 'Pending',
    refreshIn: 5,
  });

  private getJsonInfo$: Observable<JsonInfoResponse> = this.httpClient.get<JsonInfoResponse>('/json').pipe(
    catchError(() => {
      this.serverInfoState.update((it) => ({...it, status: 'Offline'}));
      return EMPTY;
    }),
  );

  private getAdminInfo$: Observable<AdminInfoResponse> = this.httpClient
    .get<AdminInfoResponse>('/config/info/environment')
    .pipe(catchError(() => EMPTY));

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.serverInfoState.update((it) => ({...it, refreshIn: it.refreshIn - 1})));

    timer(0, 5000)
      .pipe(
        map(() => new Date().getTime()),
        switchMap((startMs) =>
          this.getJsonInfo$.pipe(
            map((response) => ({
              ...response,
              lastPing: new Date(),
              responseTime: new Date().getTime() - startMs - 5,
            })),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((publicInfo) =>
        this.serverInfoState.update((it) => ({
          ...it,
          publicInfo,
          status: 'Online',
          refreshIn: 5,
        })),
      );

    this.getAdminInfo$.subscribe((adminInfo) => this.serverInfoState.update((it) => ({...it, adminInfo})));
  }

  public status = computed(() => this.serverInfoState().status);
  public refreshIn = computed(() => this.serverInfoState().refreshIn);
  public publicInfo = computed(() => this.serverInfoState().publicInfo);
  public adminInfo = computed(() => this.serverInfoState().adminInfo);
}
