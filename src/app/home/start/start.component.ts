import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy} from '@angular/core';
import {AComponent, ByPassInterceptorBuilder} from 'dfx-helper';
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

  responseFetchInterval?: number;
  responseTime?: number;
  lastPing?: Date;
  status: 'Online' | 'Offline' = 'Online';
  serverTime?: string;
  serverVersion?: string;
  serverInfo?: string;

  byPassLogginInterceptor = new ByPassInterceptorBuilder().logging().enable();

  myUser?: MyUserModel;

  constructor(private httpClient: HttpClient, myUserService: MyUserService) {
    super();

    this.isProduction = EnvironmentHelper.getProduction();
    this.type = EnvironmentHelper.getType();

    this.getPing();
    this.responseFetchInterval = setInterval(() => this.getPing(), 1000 * 5);

    this.myUser = myUserService.getUser();
    this.autoUnsubscribe(myUserService.userChange.subscribe((user) => (this.myUser = user)));
  }

  getPing(): void {
    const startMs = new Date().getTime();
    this.httpClient.get<JsonInfoResponse>('/json', {context: this.byPassLogginInterceptor}).subscribe({
      next: (response: JsonInfoResponse) => {
        this.lastPing = new Date();
        this.responseTime = this.lastPing.getTime() - startMs;
        this.status = 'Online';
        this.serverTime = response.serverTime;
        this.serverVersion = response.version;
        this.serverInfo = response.info;
      },
      error: () => (this.status = 'Offline'),
    });
  }

  ngOnDestroy() {
    if (this.responseFetchInterval) {
      clearInterval(this.responseFetchInterval);
    }
  }
}
