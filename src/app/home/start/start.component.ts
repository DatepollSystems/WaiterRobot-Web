import {AsyncPipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';

import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {AuthService} from '@shared/services/auth/auth.service';
import {SystemInfoShowService} from '@shared/services/system-info.service';
import {AppDownloadBtnListComponent} from '@shared/ui/app-download-btn-list.component';

import {BiComponent} from 'dfx-bootstrap-icons';
import {TranslocoPipe} from '@ngneat/transloco';

import {catchError, filter, of} from 'rxjs';
import {MyUserService} from '../_shared/services/user/my-user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, TranslocoPipe, AppDownloadBtnListComponent, BiComponent, AsyncPipe],
})
export class StartComponent {
  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();

  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  myUser = inject(MyUserService).user;
  showSystemInfoService = inject(SystemInfoShowService);

  errors$ = this.httpClient.get('/user/myself').pipe(
    catchError(() => of(true)),
    filter((it) => it === true),
  );

  logout(): void {
    this.authService.logout();
  }
}
