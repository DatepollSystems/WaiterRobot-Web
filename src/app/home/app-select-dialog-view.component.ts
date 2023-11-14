import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

import {s_from} from 'dfts-helper';

import {RedirectService} from '../_shared/services/redirect.service';
import {AppSpinnerRowComponent} from '../_shared/ui/loading/app-spinner-row.component';
import {AppSelectDialogComponent} from './app-select-dialog.component';
import {EventsService} from './events/_services/events.service';
import {SelectedEventService} from './events/_services/selected-event.service';
import {OrganisationsService} from './organisations/_services/organisations.service';
import {SelectedOrganisationService} from './organisations/_services/selected-organisation.service';

@Component({
  template: `
    <div class="d-flex justify-content-center" style="padding-top: 16rem">
      <div class="col-12 col-md-6">
        @defer {
          <h4 class="text-center card-title">Hallo!</h4>
          <p class="text-center">Bitte wähle eine Organisation und ein Event aus um richtig weitergeleitet zu werden.</p>

          <hr class="mb-3" />

          <app-select-dialog
            [selectedOrganisation]="selectedOrganisation()!"
            [selectedEvent]="selectedEvent()"
            [organisations]="allOrganisations() ?? []"
            [events]="allEvents() ?? []"
            (selectEvent)="selectEvent($event.id)"
            (selectOrganisation)="selectedOrganisationService.setSelected($event.id)"
          />
          <a class="btn btn-sm btn-outline-warning mt-3" href="/">Zurück zur Startseite</a>
        } @loading (minimum 450) {
          <app-spinner-row />
        }
      </div>
    </div>
  `,
  selector: 'app-select-dialog-view',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AppSelectDialogComponent, AppSpinnerRowComponent],
})
export class AppSelectDialogViewComponent {
  router = inject(Router);
  redirectService = inject(RedirectService);

  selectedOrganisationService = inject(SelectedOrganisationService);
  selectedEventService = inject(SelectedEventService);

  allOrganisations = toSignal(inject(OrganisationsService).getAll$());
  allEvents = toSignal(inject(EventsService).getAll$());

  selectedOrganisation = this.selectedOrganisationService.selected;
  selectedEvent = this.selectedEventService.selected;

  constructor() {
    effect(() => {
      if (this.selectedOrganisation() && this.selectedEvent()) {
        console.log('org and event defined, redirecting...');
        this.redirectService.redirect(
          {toReplace: 'organisationId', replaceWith: s_from(this.selectedOrganisation()!.id)},
          {toReplace: 'eventId', replaceWith: s_from(this.selectedEvent()!.id)},
        );
      }
      if ((this.allOrganisations()?.length ?? 0) === 1) {
        const organisationId = this.allOrganisations()![0].id;
        console.log(`only one org found, selecting ${organisationId}`);
        this.selectedOrganisationService.setSelected(organisationId);
      }
      if ((this.allEvents()?.length ?? 0) === 1) {
        const eventId = this.allEvents()![0].id;
        console.log(`only one event found, selecting ${eventId}`);
        this.selectEvent(eventId);
      }
    });
  }

  selectEvent(it: number): void {
    this.selectedEventService.setSelected(it);
    this.redirectService.redirect(
      {toReplace: 'organisationId', replaceWith: s_from(this.selectedOrganisation()!.id)},
      {toReplace: 'eventId', replaceWith: s_from(it)},
    );
  }
}
