import {AsyncPipe, DatePipe, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {i_complete} from 'dfts-helper';
import {AComponent, DfxTimeSpan} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {catchError, EMPTY, interval, map, Observable, share, switchMap, tap, timer} from 'rxjs';

import {EnvironmentHelper} from '../../_shared/EnvironmentHelper';
import {MyUserModel} from '../../_shared/services/auth/user/my-user.model';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {AppDownloadBtnListComponent} from '../../_shared/ui/app-download-btn-list.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
import {JsonInfoResponse} from '../../_shared/waiterrobot-backend';
import {EventModel} from '../events/_models/event.model';
import {EventsService} from '../events/_services/events.service';
import {OrganisationModel} from '../organisations/_models/organisation.model';
import {OrganisationsService} from '../organisations/_services/organisations.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    UpperCasePipe,
    RouterLink,
    NgbTooltipModule,
    NgbDropdownModule,
    DfxTimeSpan,
    DfxTr,
    AppDownloadBtnListComponent,
    AppIconsModule,
    AsyncPipe,
  ],
  standalone: true,
})
export class StartComponent extends AComponent {
  isProduction = true;
  type: string;

  localTime$: Observable<Date>;
  browserInfos = i_complete();

  serverInfo$: Observable<JsonInfoResponse>;
  startMs = 0;
  responseTime?: number;
  lastPing?: Date;
  refreshIn = 5;
  status: 'Online' | 'Offline' = 'Online';

  myUser$: Observable<MyUserModel>;

  selectedOrganisation?: OrganisationModel;
  organisations: OrganisationModel[];
  selectedEvent?: EventModel;
  events: EventModel[];

  constructor(
    httpClient: HttpClient,
    myUserService: MyUserService,
    private eventsService: EventsService,
    private organisationsService: OrganisationsService
  ) {
    super();

    this.isProduction = EnvironmentHelper.getProduction();
    this.type = EnvironmentHelper.getType();

    this.myUser$ = myUserService.getUser$();

    this.localTime$ = interval(1000).pipe(
      map(() => new Date()),
      tap(() => this.refreshIn--),
      share()
    );

    this.serverInfo$ = timer(0, 5000).pipe(
      map(() => (this.startMs = new Date().getTime())),
      switchMap(() => httpClient.get<JsonInfoResponse>('/json')),
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
      }),
      share()
    );

    this.selectedOrganisation = organisationsService.getSelected();
    this.organisations = organisationsService.getAll();
    if (this.selectedOrganisation) {
      this.selectedEvent = eventsService.getSelected();
      this.events = eventsService.getAll();
    } else {
      this.events = [];
    }

    this.unsubscribe(
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it)),
      organisationsService.selectedChange.subscribe((it) => (this.selectedOrganisation = it)),
      organisationsService.allChange.subscribe((it) => (this.organisations = it)),
      eventsService.allChange.subscribe((it) => (this.events = it))
    );
  }

  selectOrg(it: OrganisationModel): void {
    this.organisationsService.setSelected(it);
    this.eventsService.setSelected(undefined);
  }

  selectEvent(it: EventModel): void {
    this.eventsService.setSelected(it);
  }
}
