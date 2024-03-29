import {CdkDrag} from '@angular/cdk/drag-drop';
import {DatePipe, JsonPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';

import {Hotkeys} from '@home-shared/services/hot-keys.service';
import {QrCodeService} from '@home-shared/services/qr-code.service';
import {RedirectService} from '@home-shared/services/redirect.service';
import {MyUserService} from '@home-shared/services/user/my-user.service';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {EnvironmentHelper} from '@shared/EnvironmentHelper';
import {AuthService} from '@shared/services/auth/auth.service';
import {SystemInfoService, SystemInfoShowService} from '@shared/services/system-info.service';
import {ThemeService} from '@shared/services/theme.service';

import {i_complete} from 'dfts-helper';
import {DfxTimeSpanPipe, injectIsMobile} from 'dfx-helper';

import {interval, map} from 'rxjs';

@Component({
  template: `
    @defer (when showService.show()) {
      @if (showService.show()) {
        <div
          class="col-12 col-md-8 col-lg-6 col-xl-4 col-xxl-3"
          cdkDrag
          style="z-index: 1000000; bottom: 30px; left: 20px"
          [cdkDragDisabled]="isMobile()"
          [class.position-fixed]="!isMobile()"
        >
          <div class="card px-2 pt-2 transparent" [class.text-white]="theme().id === 'light'">
            <div class="card-body">
              <h5 class="card-title">{{ 'HOME_START_STATISTICS' | transloco }}</h5>
              <ul class="list-unstyled px-2 d-flex flex-column gap-2">
                <li class="d-flex flex-column flex-sm-row justify-content-between">
                  Local time: <span>{{ localTime() | date: 'YYYY-MM-dd HH:mm:ss (zzz)' }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  OS: <span>{{ browserInfos.os }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  OS version: <span>{{ browserInfos.osVersion }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  Browser: <span>{{ browserInfos.name }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  Browser version: <span>{{ browserInfos.version }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  Mobile: <span>{{ browserInfos.mobile }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  Screen size: <span>{{ browserInfos.screenSize }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  Local storage: <span>{{ browserInfos.localStorage }}</span>
                </li>
                <li class="d-flex justify-content-between">
                  Cookies: <span>{{ browserInfos.cookies }}</span>
                </li>
                <hr />
                <pre><code>{{ environment | json }}</code></pre>
                <li class="d-flex justify-content-between">
                  Logo: <span>{{ logoUrl }}</span>
                </li>
                <hr />
                @if (authService.status() === 'LOGGED_IN') {
                  <li class="d-flex justify-content-between">
                    User: <span>{{ myUser()?.emailAddress }}</span>
                  </li>
                  <li class="d-flex justify-content-between">
                    isAdmin: <span>{{ myUser()?.isAdmin }}</span>
                  </li>
                } @else {
                  <li class="d-flex justify-content-between">User: <span i18n>Logged out</span></li>
                }
                <li class="d-flex justify-content-between">
                  Selected Theme: <span>{{ theme().name }}</span>
                </li>
                <li i18n class="d-flex justify-content-between flex-wrap">
                  Auth redirect:

                  @if (authService.redirectUrl(); as it) {
                    <pre><code>{{  it }}</code></pre>
                  } @else {
                    <span>-</span>
                  }
                </li>
                <li i18n class="d-flex justify-content-between flex-wrap">
                  Selected redirect:

                  @if (redirectUrl(); as it) {
                    <pre><code>{{  it }}</code></pre>
                  } @else {
                    <span>-</span>
                  }
                </li>

                <li i18n class="d-flex justify-content-between flex-wrap">
                  QrCode Data:

                  @if (qrCodeData(); as it) {
                    <pre><code>{{  it | json }}</code></pre>
                  } @else {
                    <span>-</span>
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="col-12 col-md-8 col-lg-6 col-xl-4 col-xxl-3"
          cdkDrag
          style="z-index: 1000000; bottom: 30px; left: 50%"
          [cdkDragDisabled]="isMobile()"
          [class.position-fixed]="!isMobile()"
        >
          <div class="card px-2 pt-2 transparent" [class.text-white]="theme().id === 'light'">
            <div class="card-body">
              <h5 i18n>Backend</h5>
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
                          <span placement="bottom" i18n-placement ngbTooltip="Last ping" i18n-ngbTooltip
                            >({{ publicInfo.lastPing | date: 'HH:mm:ss' }} )</span
                          >
                        </div>
                        <div
                          i18n
                          placement="bottom"
                          i18n-placement
                          ngbTooltip="Next refresh"
                          i18n-ngbTooltip
                          aria-label="Next refresh in"
                          i18n-aria-label
                        >
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
                        <pre><code>{{ adminInfo.infos | json }}</code></pre>
                      </li>
                    }
                  }
                }
              </ul>
            </div>
          </div>
        </div>
      }
    }
  `,
  styles: `
    .transparent {
      background-color: rgba(0, 0, 0, 0.85);
    }
  `,
  selector: 'app-system-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DfxTimeSpanPipe, JsonPipe, NgbTooltip, CdkDrag, TranslocoPipe],
  providers: [SystemInfoService],
})
export class SystemInfoComponent {
  environment = EnvironmentHelper.get();
  type = EnvironmentHelper.getType();
  logoUrl = EnvironmentHelper.getLogoUrl();

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
