import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';

import {NgSelectModule} from '@ng-select/ng-select';

import {DfxTr} from 'dfx-translate';

import {injectIsValid} from '../_shared/form';
import {EventsService} from '../home/events/_services/events.service';
import {MaxiService} from './maxi.service';

@Component({
  selector: 'app-maxi',
  template: `
    <h1>Maxi-Tester</h1>

    @if (isValid()) {}

    <form [formGroup]="maxiService.form" class="d-flex gap-3">
      <div class="form-group">
        <label for="interval">{{ 'Interval (in ms)' | tr }}</label>
        <input formControlName="intervalInMs" class="form-control" type="number" id="interval" placeholder="{{ '10' | tr }}" />
        @if (maxiService.form.controls.intervalInMs.invalid) {
          <small class="text-danger">
            {{ 'Interval needs to be bigger than 0' | tr }}
          </small>
        }
      </div>

      <div class="form-group">
        <label for="event">{{ 'Event' | tr }}</label>
        <ng-select
          [items]="events()"
          bindValue="id"
          bindLabel="name"
          formControlName="eventId"
          labelForId="event"
          [placeholder]="'Event select' | tr"
        />
      </div>
    </form>

    <button class="btn btn-primary" (click)="maxiService.state.start()">Start Session</button>

    <ul>
      @for (order of maxiService.state().currentSession?.orders ?? []; track order.id) {
        <li>{{ order.id }}</li>
      }
    </ul>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, DfxTr, NgSelectModule],
})
export class MaxiComponent {
  maxiService = inject(MaxiService);

  isValid = injectIsValid(this.maxiService.form);

  events = toSignal(inject(EventsService).getAll$(), {initialValue: []});
}
