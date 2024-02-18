import {ChangeDetectionStrategy, Component, effect, EventEmitter, inject, Input, Output} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

import {AppSpinnerRowComponent} from '@shared/ui/loading/app-spinner-row.component';
import {GetEventOrLocationResponse, GetOrganisationResponse} from '@shared/waiterrobot-backend';

import {s_from} from 'dfts-helper';
import {RedirectService} from './_shared/services/redirect.service';
import {EventsService} from './events/_services/events.service';
import {SelectedEventService} from './events/_services/selected-event.service';
import {OrganisationsService} from './organisations/_services/organisations.service';
import {SelectedOrganisationService} from './organisations/_services/selected-organisation.service';

@Component({
  template: `
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between">
      <p class="mb-1 mb-lg-0 text-center">Wähle eine Organisation aus</p>
      @if (selectedOrganisation; as selectedOrg) {
        <span>{{ selectedOrg.name }}</span>
      } @else {
        <div class="btn-group d-flex flex-wrap" role="group" aria-label="Select organisation">
          @for (organisation of organisations; track organisation.id) {
            <button type="button" class="btn btn-sm btn-outline-primary" (click)="selectOrganisation.emit(organisation)">
              {{ organisation.name }}
            </button>
          }
        </div>
      }
    </div>
    <div class="d-flex flex-column flex-lg-row align-items-center justify-content-between mt-3">
      <p class="mb-1 mb-lg-0 text-center">Wähle ein Event aus</p>

      <div class="btn-group d-flex flex-wrap" role="group" aria-label="Select event">
        @for (event of events; track event.id) {
          <button type="button" class="btn btn-sm btn-outline-secondary" (click)="selectEvent.emit(event)">
            {{ event.name }}
          </button>
        } @empty {
          <button type="button" class="btn btn-sm btn-outline-warning" disabled>Wähle zuerst eine Organisation aus</button>
        }
      </div>
    </div>
  `,
  selector: 'app-select-dialog',
  standalone: true,
  imports: [],
})
export class AppSelectDialogComponent {
  @Input()
  organisations!: GetOrganisationResponse[];

  @Input()
  selectedOrganisation?: GetOrganisationResponse;

  @Input()
  events!: GetEventOrLocationResponse[];

  @Input()
  selectedEvent?: GetEventOrLocationResponse;

  @Output()
  readonly selectOrganisation = new EventEmitter<GetOrganisationResponse>();

  @Output()
  readonly selectEvent = new EventEmitter<GetEventOrLocationResponse>();
}

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
  imports: [AppSpinnerRowComponent, AppSelectDialogComponent],
})
export class SelectDialogViewComponent {
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
