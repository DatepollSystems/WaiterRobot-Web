import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {TranslocoPipe} from '@ngneat/transloco';

import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {AuthService} from '@shared/services/auth/auth.service';
import {SystemInfoShowService} from '@shared/services/system-info.service';
import {AppDownloadBtnListComponent} from '@shared/ui/app-download-btn-list.component';

import {BiComponent} from 'dfx-bootstrap-icons';

import {catchError, filter, of, startWith} from 'rxjs';
import {MyUserService} from '../_shared/services/user/my-user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterLink, TranslocoPipe, AppDownloadBtnListComponent, BiComponent],
})
export class StartComponent {
  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();

  httpClient = inject(HttpClient);
  authService = inject(AuthService);
  myUser = inject(MyUserService).user;
  showSystemInfoService = inject(SystemInfoShowService);

  hasError = toSignal(
    this.httpClient.get('/user/myself').pipe(
      startWith(false),
      catchError(() => of(true)),
      filter((it) => it === true),
    ),
  );

  logout(): void {
    this.authService.logout();
  }
}
