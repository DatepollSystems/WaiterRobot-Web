import {AsyncPipe, DatePipe, NgIf, UpperCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {i_complete} from 'dfts-helper';
import {AComponent, DfxTimeSpanPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {catchError, combineLatest, EMPTY, interval, map, Observable, of, share, switchMap, tap, timer} from 'rxjs';

import {EnvironmentHelper} from '../../_shared/EnvironmentHelper';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {AppDownloadBtnListComponent} from '../../_shared/ui/app-download-btn-list.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {JsonInfoResponse} from '../../_shared/waiterrobot-backend';
import {AppSelectDialogComponent} from '../app-select-dialog.component';
import {EventModel} from '../events/_models/event.model';
import {EventsService} from '../events/_services/events.service';
import {OrganisationModel} from '../organisations/_models/organisation.model';
import {OrganisationsService} from '../organisations/_services/organisations.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  imports: [
    NgIf,
    DatePipe,
    UpperCasePipe,
    RouterLink,
    NgbTooltipModule,
    DfxTimeSpanPipe,
    DfxTr,
    AppDownloadBtnListComponent,
    AppIconsModule,
    AsyncPipe,
    AppSelectDialogComponent,
  ],
  standalone: true,
})
export class StartComponent extends AComponent {
  isProduction = true;
  type: string;

  localTime$: Observable<Date>;
  browserInfos = i_complete();
  frontendVersion = EnvironmentHelper.getWebVersion();

  serverInfo$: Observable<JsonInfoResponse>;
  startMs = 0;
  responseTime?: number;
  lastPing?: Date;
  refreshIn = 5;
  status: 'Online' | 'Offline' = 'Online';

  myUser$ = inject(MyUserService).getUser$();

  selectedEvent$ = this.eventsService.getSelected$;
  selectedOrganisation$ = this.organisationsService.getSelected$;

  vm$ = combineLatest([
    this.organisationsService.getAll$(),
    this.selectedOrganisation$,
    this.selectedOrganisation$.pipe(switchMap(() => this.eventsService.getAll$().pipe(catchError(() => of([]))))),
    this.selectedEvent$,
  ]).pipe(
    map(([organisations, selectedOrganisation, events, selectedEvent]) => ({organisations, selectedOrganisation, events, selectedEvent}))
  );

  constructor(httpClient: HttpClient, private eventsService: EventsService, private organisationsService: OrganisationsService) {
    super();

    this.isProduction = EnvironmentHelper.getProduction();
    this.type = EnvironmentHelper.getType();

    this.localTime$ = interval(1000).pipe(
      map(() => new Date()),
      tap(() => this.refreshIn--),
      share()
    );

    this.serverInfo$ = timer(0, 5000).pipe(
      map(() => (this.startMs = new Date().getTime())),
      switchMap(() =>
        httpClient.get<JsonInfoResponse>('/json').pipe(
          tap(() => {
            this.status = 'Online';
            this.refreshIn = 5;
            this.lastPing = new Date();
            this.responseTime = this.lastPing.getTime() - this.startMs - 2; // Minus 2 because it takes ~ 2ms to convert the message
          }),
          catchError(() => {
            this.refreshIn = 5;
            this.status = 'Offline';
            return EMPTY;
          })
        )
      ),
      share()
    );
  }

  selectOrganisation(it: OrganisationModel): void {
    this.organisationsService.setSelected(it);
  }

  selectEvent(it: EventModel): void {
    this.eventsService.setSelected(it);
  }
}
