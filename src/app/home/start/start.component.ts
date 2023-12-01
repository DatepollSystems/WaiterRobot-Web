import {AsyncPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {catchError, filter, of} from 'rxjs';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {EnvironmentHelper} from '../../_shared/EnvironmentHelper';
import {AuthService} from '../../_shared/services/auth/auth.service';
import {AppDownloadBtnListComponent} from '../../_shared/ui/app-download-btn-list.component';
import {SystemInfoShowService} from '../_services/system-info.service';
import {MyUserService} from '../_shared/services/user/my-user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, DfxTr, AppDownloadBtnListComponent, BiComponent, AsyncPipe],
})
export class StartComponent {
  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();

  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  myUser = inject(MyUserService).user;
  showSystemInfo = inject(SystemInfoShowService).show;

  errors$ = this.httpClient.get('/user/myself').pipe(
    catchError(() => of(true)),
    filter((it) => it === true),
  );

  logout(): void {
    this.authService.logout();
  }
}
