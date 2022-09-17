import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {AComponent, BrowserHelper, BrowserInfo, ByPassInterceptorBuilder} from 'dfx-helper';
import {EnvironmentHelper} from '../../_helper/EnvironmentHelper';
import {MyUserModel} from '../../_models/user/my-user.model';
import {JsonInfoResponse} from '../../_models/waiterrobot-backend';
import {MyUserService} from '../../_services/auth/my-user.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
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

  byPassLoggingInterceptor = new ByPassInterceptorBuilder().logging().enable();

  myUser?: MyUserModel;

  constructor(private httpClient: HttpClient, myUserService: MyUserService) {
    super();

    this.isProduction = EnvironmentHelper.getProduction();
    this.type = EnvironmentHelper.getType();

    this.autoClearInterval(
      window.setInterval(() => {
        this.localTime = new Date();
        this.refreshIn--;
      }, 1000)
    );

    this.getPing();

    this.autoClearInterval(window.setInterval(() => this.getPing(), 1000 * 6));

    this.myUser = myUserService.getUser();
    this.autoUnsubscribe(myUserService.userChange.subscribe((user) => (this.myUser = user)));

    this.browserInfos = BrowserHelper.infos();
  }

  getPing(): void {
    this.refreshIn = 6;
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
}
