import {AsyncPipe, LowerCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

import {allowedCharacterSet} from '@home-shared/regex';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {TranslocoPipe} from '@jsverse/transloco';
import {CreateStripeAccountDto} from '@shared/waiterrobot-backend';

import {BiComponent} from 'dfx-bootstrap-icons';
import {derivedFrom} from 'ngxtension/derived-from';
import {signalSlice} from 'ngxtension/signal-slice';

import {filter, map, Observable, pipe, startWith, switchMap} from 'rxjs';
import {EventsService} from '../../_admin/events/_services/events.service';

interface OrganisationStripeAccountModalState {
  name: string | undefined;
  organisationId: number | undefined;
  eventIds: number[] | undefined;
  existingStripeAccountCount: number | undefined;
  type: 'CREATE' | 'UPDATE' | undefined;
}

@Component({
  template: `
    <div class="modal-header">
      <h3 class="modal-title" id="modal-title-org-stripe-create">
        {{ 'STRIPE_ACCOUNT' | transloco }} {{ (state.type() === 'CREATE' ? 'ADD_3' : 'EDIT') | transloco | lowercase }}
      </h3>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    @if (form.valueChanges | async) {}
    <form [formGroup]="form" (ngSubmit)="submit()">
      <div class="modal-body d-flex flex-column gap-2">
        <div class="form-group col">
          <label for="stripeName">{{ 'NAME' | transloco }}</label>
          <input
            formControlName="name"
            class="form-control"
            type="text"
            id="stripeName"
            [placeholder]="'Stripe Account #' + (state.existingStripeAccountCount() ?? 0) + 1"
          />

          @if (form.controls.name.invalid) {
            <small class="text-danger">
              {{ 'Name incorrect' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col">
          <label for="event">{{ 'NAV_EVENTS' | transloco }}</label>
          <ng-select
            formControlName="eventIds"
            bindValue="id"
            bindLabel="name"
            labelForId="event"
            clearAllText="Clear"
            id="event"
            [items]="events()"
            [multiple]="true"
            [placeholder]="'NAV_EVENTS' | transloco"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-success" type="submit" [disabled]="form.invalid">
          {{ (state.type() === 'CREATE' ? 'ADD_3' : 'SAVE') | transloco }}
        </button>
        <button type="button" class="btn btn-outline-secondary" (click)="activeModal.close()">{{ 'CLOSE' | transloco }}</button>
      </div>
    </form>
  `,
  selector: 'app-stripe-add-create',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, LowerCasePipe, BiComponent, NgSelectModule, ReactiveFormsModule, AsyncPipe],
})
export class StripeAccountModal {
  state = signalSlice({
    initialState: {
      name: undefined,
      organisationId: undefined,
      eventIds: undefined,
      type: undefined,
      existingStripeAccountCount: undefined,
    } as OrganisationStripeAccountModalState,
    actionSources: {
      set: (_, action$: Observable<OrganisationStripeAccountModalState>) => action$,
    },
    effects: (state) => ({
      eventIdChange: () => {
        const eventIds = state.eventIds();
        console.warn('set event ids triggered', eventIds);
        if (eventIds) {
          this.form.controls.eventIds.setValue(eventIds);
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

  events = derivedFrom(
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
    eventIds: [undefined as unknown as number[]],
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
