import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy} from '@angular/core';
import {AComponent, BrowserHelper, ByPassInterceptorBuilder} from 'dfx-helper';
import {EnvironmentHelper} from '../../_helper/EnvironmentHelper';
import {MyUserModel} from '../../_models/user/my-user.model';
import {JsonInfoResponse} from '../../_models/waiterrobot-backend';
import {MyUserService} from '../../_services/auth/my-user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent extends AComponent implements OnDestroy {
  isProduction = true;
  type: string;

  localTime = new Date();
  localTimeInterval?: number;
  browserInfos: ReturnType<typeof BrowserHelper.infos>;

  responseFetchInterval?: number;
  responseTime?: number;
  lastPing?: Date;
  refreshIn = 5;
  status: 'Online' | 'Offline' = 'Online';
  serverInfoResponse?: JsonInfoResponse;

  byPassLoggingInterceptor = new ByPassInterceptorBuilder().logging().enable();

  myUser?: MyUserModel;

  constructor(private httpClient: HttpClient, myUserService: MyUserService) {
    super();

    this.isProduction = EnvironmentHelper.getProduction();
    this.type = EnvironmentHelper.getType();

    this.localTimeInterval = window.setInterval(() => {
      this.localTime = new Date();
      this.refreshIn--;
    }, 1000);

    this.getPing();

    this.responseFetchInterval = window.setInterval(() => this.getPing(), 1000 * 5);

    this.myUser = myUserService.getUser();
    this.autoUnsubscribe(myUserService.userChange.subscribe((user) => (this.myUser = user)));

    this.browserInfos = BrowserHelper.infos();
  }

  getPing(): void {
    this.refreshIn = 5;
    this.localTime = new Date();
    const startMs = new Date().getTime();
    this.httpClient.get<JsonInfoResponse>('/json', {context: this.byPassLoggingInterceptor}).subscribe({
      next: (response: JsonInfoResponse) => {
        this.lastPing = new Date();
        this.responseTime = this.lastPing.getTime() - startMs - 2; // Minus 2 because it takes ~ 2ms to convert the message
        this.status = 'Online';
        this.serverInfoResponse = response;
      },
      error: () => (this.status = 'Offline'),
    });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.responseFetchInterval);
    window.clearInterval(this.localTimeInterval);
  }
}
