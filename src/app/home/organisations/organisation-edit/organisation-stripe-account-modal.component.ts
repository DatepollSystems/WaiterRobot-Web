import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {filter, map, Observable, pipe, startWith, switchMap} from 'rxjs';

import {allowedCharacterSet} from '@home-shared/regex';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {CreateStripeAccountDto} from '@shared/waiterrobot-backend';
import {computedFrom} from 'ngxtension/computed-from';
import {signalSlice} from 'ngxtension/signal-slice';

import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {EventsService} from '../../events/_services/events.service';

type OrganisationStripeAccountModalState = {
  name: string | undefined;
  organisationId: number | undefined;
  eventId: number | undefined;
  existingStripeAccountCount: number | undefined;
  type: 'CREATE' | 'UPDATE' | undefined;
};

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-org-stripe-create">
        {{ 'STRIPE_ACCOUNT' | tr }} {{ (state.type() === 'CREATE' ? 'ADD_3' : 'EDIT') | tr | lowercase }}
      </h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    @if (form.valueChanges | async) {}
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="modal-body d-flex flex-column gap-2">
        <div class="form-group col">
          <label for="stripeName">{{ 'NAME' | tr }}</label>
          <input
            formControlName="name"
            class="form-control"
            type="text"
            id="stripeName"
            placeholder="Stripe Account #{{ (state.existingStripeAccountCount() ?? 0) + 1 }}"
          />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'Name incorrect' | tr }}
            </small>
          }
        </div>

        <div class="form-group col">
          <label for="event">{{ 'NAV_EVENTS' | tr }}</label>
          <ng-select
            formControlName="eventId"
            bindValue="id"
            id="event"
            [items]="events()"
            bindLabel="name"
            placeholder="{{ 'NAV_EVENTS' | tr }}"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-success" type="submit" [disabled]="form.invalid">
          {{ (state.type() === 'CREATE' ? 'ADD_3' : 'SAVE') | tr }}
        </button>
        <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | tr }}</button>
      </div>
    </form>
  `,
  selector: 'app-organisation-stripe-add-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DfxTr, LowerCasePipe, BiComponent, NgSelectModule, ReactiveFormsModule, AsyncPipe],
})
export class OrganisationStripeAccountModal {
  state = signalSlice({
    initialState: {
      name: undefined,
      organisationId: undefined,
      eventId: undefined,
      type: undefined,
      existingStripeAccountCount: undefined,
    } as OrganisationStripeAccountModalState,
    actionSources: {
      set: (_, action$: Observable<OrganisationStripeAccountModalState>) => action$,
    },
    effects: (state) => ({
      eventIdChange: () => {
        const eventId = state.eventId();
        console.warn('set event id triggered', eventId);
        if (eventId) {
          console.warn('set event id triggered');
          this.form.controls.eventId.setValue(eventId);
        }
      },
      nameChange: () => {
        const name = state.name();
        if (name) {
          this.form.controls.name.setValue(name);
        }
      },
    }),
  });

  activeModal = inject(NgbActiveModal);

  #eventsService = inject(EventsService);

  events = computedFrom(
    [this.state.organisationId],
    pipe(
      map(([it]) => it),
      filter((it): it is number => !!it),
      switchMap((it) => this.#eventsService.getAllById$(it)),
      startWith([]),
    ),
  );

  form = inject(FormBuilder).nonNullable.group({
    name: [undefined as unknown as string, [Validators.minLength(4), Validators.maxLength(40), Validators.pattern(allowedCharacterSet)]],
    businessType: ['NON_PROFIT' as CreateStripeAccountDto['businessType'], [Validators.required]],
    eventId: [undefined as unknown as number],
  });

  submit(): void {
    const name =
      this.form.controls.name.value && this.form.controls.name.value !== ''
        ? this.form.controls.name.value
        : `Stripe Account #${this.state.existingStripeAccountCount()! + 1}`;
    this.activeModal.close({
      ...this.form.getRawValue(),
      name,
      organisationId: this.state.organisationId(),
    });
  }
}
