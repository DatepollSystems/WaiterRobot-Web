import {AsyncPipe, DatePipe, JsonPipe, NgIf, UpperCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {catchError, combineLatest, filter, interval, map, of, startWith, tap} from 'rxjs';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {i_complete} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTimeSpanPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {EnvironmentHelper} from '../../_shared/EnvironmentHelper';
import {AuthService} from '../../_shared/services/auth/auth.service';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {AppDownloadBtnListComponent} from '../../_shared/ui/button/app-download-btn-list.component';
import {GetEventOrLocationResponse, GetOrganisationResponse} from '../../_shared/waiterrobot-backend';
import {AppSelectDialogComponent} from '../app-select-dialog.component';
import {EventsService} from '../events/_services/events.service';
import {OrganisationsService} from '../organisations/_services/organisations.service';
import {ServerInfoService} from './server-info.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    UpperCasePipe,
    RouterLink,
    NgbTooltipModule,
    DfxTimeSpanPipe,
    DfxTr,
    AppDownloadBtnListComponent,
    BiComponent,
    AsyncPipe,
    AppSelectDialogComponent,
    JsonPipe,
  ],
})
export class StartComponent {
  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();
  frontendVersion = EnvironmentHelper.getWebVersion();

  httpClient = inject(HttpClient);

  serverInfoService = inject(ServerInfoService);

  localTime = toSignal(interval(1000).pipe(map(() => new Date())), {initialValue: new Date()});

  browserInfos = i_complete();

  errors$ = this.httpClient.get('/user/myself').pipe(
    catchError(() => of(true)),
    filter((it) => it === true),
  );

  myUser$ = inject(MyUserService).getUser$();
  selectedEvent$ = this.eventsService.getSelected$;

  vm$ = combineLatest([
    this.organisationsService.getAll$(),
    this.organisationsService.getSelected$,
    this.eventsService.getAll$().pipe(startWith([])),
    this.selectedEvent$,
  ]).pipe(
    map(([organisations, selectedOrganisation, events, selectedEvent]) => ({organisations, selectedOrganisation, events, selectedEvent})),
    tap((vm) => {
      if (vm.organisations.length === 1 && !vm.selectedOrganisation) {
        this.selectOrganisation(vm.organisations[0]);
        vm.selectedOrganisation = vm.organisations[0];
      }
      if (vm.events.length === 1 && !vm.selectedEvent) {
        this.selectEvent(vm.events[0]);
        vm.selectedEvent = vm.events[0];
      }
    }),
  );

  constructor(
    private eventsService: EventsService,
    private organisationsService: OrganisationsService,
    private authService: AuthService,
  ) {}

  selectOrganisation(it: GetOrganisationResponse): void {
    this.organisationsService.setSelected(it);
  }

  selectEvent(it: GetEventOrLocationResponse): void {
    this.eventsService.setSelected(it);
  }

  logout(): void {
    this.authService.logout();
  }
}
