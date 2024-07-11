import {Component, effect, inject, input, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {RedirectService} from '@home-shared/services/redirect.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {s_from} from 'dfts-helper';
import {derivedFrom} from 'ngxtension/derived-from';
import {filterNil} from 'ngxtension/filter-nil';
import {distinctUntilChanged, map, pipe, startWith, switchMap, tap} from 'rxjs';
import {EventsService} from '../../_admin/events/_services/events.service';
import {SelectedEventService} from '../../_admin/events/_services/selected-event.service';
import {OrganisationsService} from '../../_admin/organisations/_services/organisations.service';
import {SelectedOrganisationService} from '../../_admin/organisations/_services/selected-organisation.service';

@Component({
  template: `
    <form [formGroup]="form" (ngSubmit)="select()">
      @if (formValueChanges()) {}

      @if (!modal()) {
        <h1 class="fw-bold mb-0 fs-2 pb-5">Wähle Organisation und Event aus</h1>
      }

      <div class="d-flex gap-4 flex-column flex-lg-row">
        @if (filteredOrganisations(); as organisations) {
          <div class="w-100">
            <h2>Organisation</h2>

            <input class="form-control" placeholder="Suche..." type="text" [formControl]="organisationFilter" />

            <div class="list-group list-group-checkable d-grid gap-2 border-0 w-100 mt-2">
              @for (organisation of organisations; track organisation.id) {
                <input
                  class="list-group-item-check pe-none"
                  type="radio"
                  name="organisationId"
                  formControlName="organisationId"
                  checked=""
                  [value]="organisation.id"
                  [id]="(modal() ? 'm_' : '') + 'organisationIdRadio' + organisation.id"
                />
                <!-- Weird m_ syntax because else modal and switcher view conflict -->
                <label class="list-group-item rounded-3 py-3" [for]="(modal() ? 'm_' : '') + 'organisationIdRadio' + organisation.id">
                  {{ organisation.name }}
                  <span class="d-block small opacity-50">
                    {{ organisation.street }} {{ organisation.streetNumber }}, {{ organisation.postalCode }} {{ organisation.city }}
                  </span>
                </label>
              }
            </div>
          </div>
        } @else {
          <app-progress-bar />
        }
        <div class="w-100">
          <h2>Event / Location</h2>

          <input class="form-control" placeholder="Suche..." type="text" [formControl]="eventFilter" />

          @if (form.controls.organisationId.value) {
            @if (filteredEvents(); as events) {
              <div class="list-group list-group-checkable d-grid gap-2 border-0 w-100 mt-2">
                @for (event of events; track event.id) {
                  <input
                    class="list-group-item-check pe-none"
                    type="radio"
                    name="eventId"
                    formControlName="eventId"
                    checked=""
                    [value]="event.id"
                    [id]="'eventIdRadio' + event.id"
                  />
                  <label class="list-group-item rounded-3 py-3" [for]="'eventIdRadio' + event.id">
                    {{ event.name }}
                    <span class="d-block small opacity-50">
                      {{ event.street }} {{ event.streetNumber }}, {{ event.postalCode }} {{ event.city }}
                    </span>
                  </label>
                } @empty {
                  <div class="alert alert-info">Nichts gefunden :(</div>
                }
              </div>
            } @else {
              <app-progress-bar />
            }
          } @else {
            <div class="alert alert-warning mt-2">Wähle eine Organisation aus</div>
          }
        </div>
      </div>
      @if (form.valid) {
        <div class="d-flex justify-content-end gap-4 mt-5">
          <div>
            <button type="submit" class="btn btn-lg btn-primary">Auswählen</button>
          </div>
        </div>
      }
    </form>
  `,
  styles: `
    .list-group-item-check {
      position: absolute;
      clip: rect(0, 0, 0, 0);
    }

    .list-group-item-check:hover + .list-group-item {
      background-color: var(--bs-secondary-bg);
    }

    .list-group-item-check:checked + .list-group-item {
      color: #fff;
      background-color: var(--bs-primary);
      border-color: var(--bs-primary);
    }
  `,
  standalone: true,
  selector: 'app-switcher',
  imports: [ReactiveFormsModule, AppProgressBarComponent],
})
export class SwitcherComponent {
  modal = input<NgbActiveModal>();

  redirectService = inject(RedirectService);

  selectedOrganisationService = inject(SelectedOrganisationService);
  selectedEventService = inject(SelectedEventService);
  eventsService = inject(EventsService);

  state = signal<'SELECT_ORG' | 'SELECT_EVENT'>('SELECT_ORG');

  allOrganisations = toSignal(inject(OrganisationsService).getAll$());

  organisationFilter = new FormControl('');
  filteredOrganisations = derivedFrom(
    [
      this.allOrganisations,
      this.organisationFilter.valueChanges.pipe(
        map((it) => it?.toLowerCase() ?? ''),
        startWith(''),
      ),
    ],
    map(([allOrganisations, filter]) => allOrganisations?.filter((it) => it.name.toLowerCase().includes(filter)) ?? []),
  );

  form = inject(NonNullableFormBuilder).group({
    organisationId: [undefined as unknown as number, [Validators.required]],
    eventId: [undefined as unknown as number, [Validators.required]],
  });

  formValueChanges = toSignal(this.form.valueChanges);

  selectedOrganisation = this.selectedOrganisationService.selected;
  selectedEvent = this.selectedEventService.selected;

  allEvents = derivedFrom(
    [this.formValueChanges],
    pipe(
      map(([it]) => it?.organisationId),
      filterNil(),
      distinctUntilChanged(),
      tap((organisationId) => {
        if (organisationId === this.selectedOrganisation()?.id) {
          this.form.patchValue({eventId: this.selectedEvent()?.id});
        } else {
          this.form.patchValue({eventId: undefined});
        }
      }),
      switchMap((it) => this.eventsService.getAllById$(it)),
      startWith(undefined),
    ),
  );

  eventFilter = new FormControl('');
  filteredEvents = derivedFrom(
    [
      this.allEvents,
      this.eventFilter.valueChanges.pipe(
        map((it) => it?.toLowerCase() ?? ''),
        startWith(''),
      ),
    ],
    map(([allEvents, filter]) => allEvents?.filter((it) => it.name.toLowerCase().includes(filter)) ?? []),
  );

  constructor() {
    effect(() => {
      const organisation = this.selectedOrganisation();

      if (organisation) {
        this.form.patchValue({organisationId: organisation.id});
      }
    });

    effect(() => {
      const event = this.selectedEvent();

      if (event) {
        this.form.patchValue({eventId: event.id});
      }
    });

    effect(() => {
      if (!this.modal()) {
        if (this.selectedOrganisation() && this.selectedEvent()) {
          console.log('org and event defined, redirecting...');
          this.redirectService.redirect(
            {toReplace: 'organisationId', replaceWith: s_from(this.selectedOrganisation()!.id)},
            {toReplace: 'eventId', replaceWith: s_from(this.selectedEvent()!.id)},
          );
        }
      }
    });
    effect(
      () => {
        if (!this.modal()) {
          if ((this.allOrganisations()?.length ?? 0) === 1) {
            const organisationId = this.allOrganisations()![0].id;
            console.log(`only one org found, selecting ${organisationId}`);
            this.selectedOrganisationService.setSelected(organisationId);
          }
        }
      },
      {allowSignalWrites: true},
    );
    effect(
      () => {
        if (!this.modal()) {
          if ((this.allEvents()?.length ?? 0) === 1) {
            const eventId = this.allEvents()![0].id;
            console.log(`only one event found, selecting ${eventId}`);
            //this.selectEvent(eventId);
          }
        }
      },
      {allowSignalWrites: true},
    );
  }

  select(): void {
    const organisationId = this.form.getRawValue().organisationId;
    const eventId = this.form.getRawValue().eventId;
    this.selectedOrganisationService.setSelected(organisationId);
    this.selectedEventService.setSelected(eventId);

    const modal = this.modal();
    if (modal) {
      modal.close();
      this.redirectService.resetRedirectUrl();
      this.redirectService.redirect();

      return;
    }

    this.redirectService.redirect(
      {toReplace: 'organisationId', replaceWith: s_from(organisationId)},
      {toReplace: 'eventId', replaceWith: s_from(eventId)},
    );
  }
}

@Component({
  template: `
    <div class="modal-header p-5 pb-0 border-bottom-0">
      <h1 class="fw-bold mb-0 fs-2" id="modal-switcher-title">Wähle Organisation und Event aus</h1>
      <button type="button" class="btn-close" aria-label="Close" (mousedown)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body p-5">
      <app-switcher [modal]="activeModal" />
    </div>
  `,
  standalone: true,
  selector: 'app-switcher-modal',
  imports: [SwitcherComponent],
})
export class SwitcherModalComponent {
  activeModal = inject(NgbActiveModal);
}
