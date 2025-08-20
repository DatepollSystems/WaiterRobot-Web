import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

import {AppProgressBarComponent} from '../../../components/loading/app-progress-bar.component';
import {LicencesLicencesComponent} from '../../../components/settings/licenses/licences-licences.component';
import {LicencesRangesComponent} from '../../../components/settings/licenses/licences-ranges.component';
import {EventLicencesRangesStore, EventLicencesStore} from '../../../services/event-licences.store';
import {SelectedEventService} from '../../../services/selected-event.service';

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
export class LicencesPage {
  eventLicencesStore = inject(EventLicencesStore);
  eventLicencesRangesStore = inject(EventLicencesRangesStore);

  #activeId = inject(SelectedEventService).selectedId;

  constructor() {
    this.eventLicencesStore.load(this.#activeId);
  }
}
