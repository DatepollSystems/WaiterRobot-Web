import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {SelectedEventService} from '@shared/services';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';

import {EventLicencesRangesStore, EventLicencesStore} from '../_services/event-licences.store';
import {LicencesLicencesComponent} from './licences-licences.component';
import {LicencesRangesComponent} from './licences-ranges.component';

@Component({
  template: `
    <div class="d-grid gap-4">
      <div>
        <h3>Licences</h3>
        <app-event-licences-licences />
      </div>
      <app-progress-bar [show]="eventLicencesStore.isPending()" />

      <div>
        <h3>Ranges</h3>
        <app-event-licences-ranges />
      </div>
      <app-progress-bar [show]="eventLicencesStore.isPending()" />
    </div>
  `,
  selector: 'app-event-licences',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppProgressBarComponent, LicencesLicencesComponent, LicencesRangesComponent],
})
export class LicencesComponent {
  eventLicencesStore = inject(EventLicencesStore);
  eventLicencesRangesStore = inject(EventLicencesRangesStore);

  #activeId = inject(SelectedEventService).selectedId;

  constructor() {
    this.eventLicencesStore.load(this.#activeId);
  }
}
