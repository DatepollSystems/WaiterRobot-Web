import {Component} from '@angular/core';
import {DatePipe, NgForOf, NgIf, UpperCasePipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {HttpClient} from '@angular/common/http';

import {NgbDropdownModule, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {DfxTr} from 'dfx-translate';
import {AComponent, BrowserHelper, BrowserInfo, DfxTimeSpan} from 'dfx-helper';

import {EnvironmentHelper} from '../../_shared/EnvironmentHelper';
import {EventModel} from '../events/_models/event.model';
import {OrganisationModel} from '../organisations/_models/organisation.model';
import {MyUserModel} from '../../_shared/services/auth/user/my-user.model';
import {JsonInfoResponse} from '../../_shared/waiterrobot-backend';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {EventsService} from '../events/_services/events.service';
import {AppDownloadBtnListComponent} from '../../_shared/ui/app-download-btn-list.component';
import {AppIconsModule} from '../../_shared/ui/icons.module';
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
  ],
  standalone: true,
})
export class StartComponent extends AComponent {
  isProduction = true;
  type: string;

  localTime = new Date();
  browserInfos: BrowserInfo;

  responseTime?: number;
  lastPing?: Date;
  refreshIn = 5;
  status: 'Online' | 'Offline' = 'Online';
  serverInfoResponse?: JsonInfoResponse;

  myUser?: MyUserModel;
  selectedOrganisation?: OrganisationModel;
  organisations: OrganisationModel[];
  selectedEvent?: EventModel;
  events: EventModel[];

  constructor(
    private httpClient: HttpClient,
    myUserService: MyUserService,
    private eventsService: EventsService,
    private organisationsService: OrganisationsService
  ) {
    super();

    this.isProduction = EnvironmentHelper.getProduction();
    this.type = EnvironmentHelper.getType();

    this.clearInterval(
      window.setInterval(() => {
        this.localTime = new Date();
        this.refreshIn--;
      }, 1000)
    );

    this.getPing();

    this.clearInterval(window.setInterval(() => this.getPing(), 1000 * 6));

    this.myUser = myUserService.getUser();
    this.selectedOrganisation = organisationsService.getSelected();
    this.organisations = organisationsService.getAll();
    if (this.selectedOrganisation) {
      this.selectedEvent = eventsService.getSelected();
      this.events = eventsService.getAll();
    } else {
      this.events = [];
    }

    this.unsubscribe(
      myUserService.userChange.subscribe((user) => (this.myUser = user)),
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it)),
      organisationsService.selectedChange.subscribe((it) => (this.selectedOrganisation = it)),
      organisationsService.allChange.subscribe((it) => (this.organisations = it)),
      eventsService.allChange.subscribe((it) => (this.events = it))
    );

    this.browserInfos = BrowserHelper.infos();
  }

  getPing(): void {
    this.refreshIn = 6;
    this.localTime = new Date();
    const startMs = new Date().getTime();
    this.httpClient.get<JsonInfoResponse>('/json').subscribe({
      next: (response: JsonInfoResponse) => {
        this.lastPing = new Date();
        this.responseTime = this.lastPing.getTime() - startMs - 2; // Minus 2 because it takes ~ 2ms to convert the message
        this.status = 'Online';
        this.serverInfoResponse = response;
      },
      error: () => (this.status = 'Offline'),
    });
  }

  selectOrg(it: OrganisationModel): void {
    this.organisationsService.setSelected(it);
    this.eventsService.setSelected(undefined);
  }

  selectEvent(it: EventModel): void {
    this.eventsService.setSelected(it);
  }
}
