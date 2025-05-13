import {ChangeDetectionStrategy, Component, inject, numberAttribute} from '@angular/core';

import {injectParams} from 'ngxtension/inject-params';

import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {EventLicensesStore} from '../_services/event-licences.store';
import {EventLicencesLicencesComponent} from './event-licences-licences.component';
import {EventLicencesRangesComponent} from './event-licences-ranges.component';

@Component({
  template: `
    <div class="d-grid gap-4">
      <div>
        <h3>Licences</h3>
        <app-event-licences-licences />
      </div>

      <div>
        <h3>Ranges</h3>
        <app-event-licences-ranges />
      </div>

      <app-progress-bar [show]="eventLicencesStore.isPending()" />
    </div>
  `,
  selector: 'app-event-licences',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppProgressBarComponent, EventLicencesLicencesComponent, EventLicencesRangesComponent],
})
export class EventLicencesComponent {
  eventLicencesStore = inject(EventLicensesStore);

  #activeId = injectParams('id', {parse: numberAttribute});

  constructor() {
    this.eventLicencesStore.load(this.#activeId);
  }
}
