import {DatePipe, JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';

import {interval, map} from 'rxjs';

import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';

import {i_complete} from 'dfts-helper';
import {DfxTimeSpanPipe, injectIsMobile} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';

import {EnvironmentHelper} from './_shared/EnvironmentHelper';
import {AuthService} from './_shared/services/auth/auth.service';
import {SystemInfoService, SystemInfoShowService} from './_shared/services/system-info.service';
import {ThemeService} from './_shared/services/theme.service';
import {Hotkeys} from './home/_shared/services/hot-keys.service';
import {QrCodeService} from './home/_shared/services/qr-code.service';
import {RedirectService} from './home/_shared/services/redirect.service';
import {MyUserService} from './home/_shared/services/user/my-user.service';

@Component({
  template: `
    @if (showService.show()) {
      <div class="row w-100 g-2 px-2 my-2" style="z-index: 1000000; bottom: 30px; left: 20px" [class.position-fixed]="!isMobile()">
        <div class="col-12 col-xl-4" style="margin-top: auto">
          <div class="card px-2 pt-2" [class.transparent]="theme().id === 'dark'" [class.light-transparent]="theme().id === 'light'">
            <div class="card-body">
              <h5 class="card-title">{{ 'HOME_START_STATISTICS' | tr }}</h5>
              <ul class="list-unstyled px-2">
                <li class="d-flex flex-column flex-sm-row justify-content-between mb-2">
                  Web version: <span>{{ frontendVersion }}</span>
                </li>
                <li class="d-flex flex-column flex-sm-row justify-content-between mb-2">
                  Local time: <span>{{ localTime() | date: 'YYYY-MM-dd HH:mm:ss (zzz)' }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  OS: <span>{{ browserInfos.os }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  OS version: <span>{{ browserInfos.osVersion }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Browser: <span>{{ browserInfos.name }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Browser version: <span>{{ browserInfos.version }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Mobile: <span>{{ browserInfos.mobile }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Screen size: <span>{{ browserInfos.screenSize }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Local storage: <span>{{ browserInfos.localStorage }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Cookies: <span>{{ browserInfos.cookies }}</span>
                </li>
                <hr />
                <li class="d-flex justify-content-between mb-2">
                  isProduction: <span>{{ isProduction }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Environment: <span>{{ type }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  API: <span>{{ apiUrl }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Logo: <span>{{ logoUrl }}</span>
                </li>
                <hr />
                @if (authService.status() === 'LOGGED_IN') {
                  <li class="d-flex justify-content-between mb-2">
                    User: <span>{{ myUser()?.emailAddress }}</span>
                  </li>
                  <li class="d-flex justify-content-between mb-2">
                    isAdmin: <span>{{ myUser()?.isAdmin }}</span>
                  </li>
                } @else {
                  <li class="d-flex justify-content-between mb-2">User: <span>Logged out</span></li>
                }
                <li class="d-flex justify-content-between mb-2">
                  Selected Theme: <span>{{ theme().name }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Auth redirect: <span>{{ authService.redirectUrl() ?? '-' }}</span>
                </li>
                <li class="d-flex justify-content-between mb-2">
                  Selected redirect: <span>{{ redirectUrl() ?? '-' }}</span>
                </li>
                @if (qrCodeData(); as data) {
                  <li>
                    QrCode Data:
                    <pre><code>{{  qrCodeData() | json }}</code></pre>
                  </li>
                } @else {
                  <li class="d-flex justify-content-between mb-2">QrCode Data: <span>-</span></li>
                }
              </ul>
            </div>
          </div>
        </div>

        <div class=" col-12 col-xl-4" style="margin-top: auto">
          <div class="card px-2 pt-2" [class.transparent]="theme().id === 'dark'" [class.light-transparent]="theme().id === 'light'">
            <div class="card-body">
              <h5>Backend</h5>
              <ul class="list-unstyled d-flex flex-column gap-2">
                <li class="d-flex justify-content-between">
                  Status:
                  <span
                    [class.text-success]="serverInfoService.status() === 'Online'"
                    [class.text-warning]="serverInfoService.status() === 'Pending'"
                    [class.text-danger]="serverInfoService.status() === 'Offline'"
                  >
                    {{ serverInfoService.status() }}</span
                  >
                </li>
                @if (serverInfoService.status() !== 'Offline') {
                  @if (serverInfoService.publicInfo(); as publicInfo) {
                    <li class="d-flex justify-content-between">
                      Ping:
                      <div class="d-flex">
                        <div>
                          {{ publicInfo.responseTime }}ms&nbsp;
                          <span placement="bottom" ngbTooltip="Last ping">({{ publicInfo.lastPing | date: 'HH:mm:ss' }} )</span>
                        </div>
                        <div placement="bottom" ngbTooltip="Next refresh" aria-label="Next refresh in">
                          &nbsp;&nbsp;/&nbsp;&nbsp;{{ serverInfoService.refreshIn() }} s
                        </div>
                      </div>
                    </li>
                    <li class="d-flex flex-row justify-content-between">
                      Uptime: <span>{{ localTime() | d_timespan: publicInfo.serverStartTime }}</span>
                    </li>
                    <li class="d-flex flex-row justify-content-between">
                      Version: <span>{{ publicInfo.version }}</span>
                    </li>
                    <li class="d-flex flex-row justify-content-between">
                      Info: <span class="ms-md-5" style="white-space: nowrap">"{{ publicInfo.info }}"</span>
                    </li>
                    <li class="d-flex flex-column flex-sm-row justify-content-between">
                      Time: <span>{{ publicInfo.serverTime | date: 'YYYY-MM-dd HH:mm:ss (zzz)' : 'UTC' }}</span>
                    </li>
                    <li class="d-flex flex-column flex-sm-row justify-content-between">
                      Started: <span>{{ publicInfo.serverStartTime | date: 'YYYY-MM-dd HH:mm:ss (zzz)' }}</span>
                    </li>
                  }

                  @if (authService.status() === 'LOGGED_IN') {
                    @if (serverInfoService.adminInfo(); as adminInfo) {
                      <li>
                        Environment Info:
                        <pre><code>{{ adminInfo | json }}</code></pre>
                      </li>
                    }
                  }
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
  .transparent {
  background-color: rgba(0, 0, 0, 0.85);
  }

  .light-transparent {
  background-color: rgba(0, 0, 0, 0.35);
  }
  `,
  selector: 'app-system-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DfxTimeSpanPipe, DfxTr, JsonPipe, NgbTooltip],
  providers: [SystemInfoService],
})
export class SystemInfoComponent {
  isProduction = EnvironmentHelper.getProduction();
  type = EnvironmentHelper.getType();
  apiUrl = EnvironmentHelper.getAPIUrl();
  logoUrl = EnvironmentHelper.getLogoUrl();
  frontendVersion = EnvironmentHelper.getWebVersion();

  isMobile = injectIsMobile();
  serverInfoService = inject(SystemInfoService);
  myUser = inject(MyUserService).user;
  theme = inject(ThemeService).currentTheme;
  redirectUrl = inject(RedirectService).redirectUrl;
  authService = inject(AuthService);
  qrCodeData = inject(QrCodeService).data;

  localTime = toSignal(interval(1000).pipe(map(() => new Date())), {initialValue: new Date()});

  browserInfos = i_complete();

  showService = inject(SystemInfoShowService);

  constructor() {
    inject(Hotkeys)
      .addShortcut({keys: 'meta.k'})
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.showService.set(!this.showService.show());
      });
  }
}
