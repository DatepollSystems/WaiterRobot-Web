import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  template: '',
})
export abstract class AbstractComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  public autoUnsubscribe(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  public ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
