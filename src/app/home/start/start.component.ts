import {AsyncPipe, DatePipe, JsonPipe, UpperCasePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {catchError, filter, interval, map, of} from 'rxjs';

import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

import {i_complete} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTimeSpanPipe} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {EnvironmentHelper} from '../../_shared/EnvironmentHelper';
import {AuthService} from '../../_shared/services/auth/auth.service';
import {MyUserService} from '../../_shared/services/auth/user/my-user.service';
import {AppDownloadBtnListComponent} from '../../_shared/ui/button/app-download-btn-list.component';
import {ServerInfoService} from './server-info.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [ServerInfoService],
  imports: [
    DatePipe,
    UpperCasePipe,
    RouterLink,
    NgbTooltipModule,
    DfxTimeSpanPipe,
    DfxTr,
    AppDownloadBtnListComponent,
    BiComponent,
    AsyncPipe,
    JsonPipe,
  ],
})
export class StartComponent {
  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();
  frontendVersion = EnvironmentHelper.getWebVersion();

  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  serverInfoService = inject(ServerInfoService);

  localTime = toSignal(interval(1000).pipe(map(() => new Date())), {initialValue: new Date()});

  myUser = inject(MyUserService).user;

  browserInfos = i_complete();

  errors$ = this.httpClient.get('/user/myself').pipe(
    catchError(() => of(true)),
    filter((it) => it === true),
  );

  logout(): void {
    this.authService.logout();
  }
}
