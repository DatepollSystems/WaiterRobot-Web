import {HttpClient} from '@angular/common/http';
import {Component, OnDestroy} from '@angular/core';
import {EnvironmentHelper} from '../../_helper/EnvironmentHelper';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
})
export class StartComponent implements OnDestroy {
  isProduction = true;

  responseFetchInterval?: number;
  responseTime?: number;

  constructor(httpClient: HttpClient) {
    this.isProduction = EnvironmentHelper.getProduction();

    this.responseFetchInterval = setInterval(() => {
      const startMs = new Date().getTime();
      httpClient.get('/user/myself').subscribe(() => {
        this.responseTime = new Date().getTime() - startMs;
      });
    }, 1000 * 2);
  }

  ngOnDestroy() {
    if (this.responseFetchInterval) {
      clearInterval(this.responseFetchInterval);
    }
  }
}
