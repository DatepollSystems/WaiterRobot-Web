import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ReactiveFormsModule} from '@angular/forms';

import {interval, map} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLinkButton, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';

import {DfxTimeSpanPipe} from '@home-shared/format-date';
import {AppActivatedPipe} from '@home-shared/pipes/app-activated.pipe';

import {injectIsValid} from '@shared/form';

import {EventsService} from '../home/_admin/events/_services/events.service';
import {MaxiService} from './maxi.service';

@Component({
  selector: 'app-maxi',
  template: `
    <div class="d-flex flex-column gap-3">
      <h1 class="my-0">maxi-tester-v1</h1>

      <form class="d-flex gap-3" [formGroup]="maxiService.form">
        <div class="form-group">
          <label for="interval">{{ 'Interval (in ms)' | transloco }}</label>
          <input class="form-control" id="interval" [placeholder]="'10' | transloco" formControlName="intervalInMs" type="number" />
          @if (maxiService.form.controls.intervalInMs.invalid) {
            <small class="text-danger">
              {{ 'Interval needs to be bigger than 0' | transloco }}
            </small>
          }
        </div>

        <div class="form-group col-4">
          <label for="event">{{ 'Event' | transloco }}</label>
          <ng-select
            [items]="events()"
            [placeholder]="'Event select' | transloco"
            bindValue="id"
            bindLabel="name"
            formControlName="eventId"
            labelForId="event"
          />
        </div>
      </form>

      <div class="d-inline-flex gap-2">
        <button class="btn btn-primary" [disabled]="!isValid()" (click)="maxiService.state.start()" type="button">Start Test</button>
        <button class="btn btn-danger" [disabled]="!maxiService.state.currentSession()" (click)="maxiService.state.end()" type="button">
          End Test
        </button>
        <button class="btn btn-info d-inline-flex gap-2" type="button">
          <span>Status: {{ maxiService.state.currentSession() ? 'Running' : 'Stopped' }}</span>
        </button>
      </div>

      <ul class="nav-tabs" #nav="ngbNav" [activeId]="maxiService.state.activeTab()" ngbNav>
        <li [ngbNavItem]="'CREATE'">
          <button type="button" ngbNavLink>Neuer Test</button>
          <ng-template ngbNavContent>
            <div class="d-flex flex-column gap-3">
              @if (maxiService.state.currentSession(); as session) {
                <div class="d-flex align-items-center gap-2">
                  <button
                    class="btn btn-sm"
                    [class.btn-success]="session.successRate === 100"
                    [class.btn-danger]="session.successRate !== 100"
                    type="button"
                  >
                    Success rate: {{ session.successRate }}%
                  </button>
                  <div>
                    <span class="badge text-bg-secondary">Gestartet: {{ session.started | date: 'dd.MM. HH:mm:ss:SSS' }}</span>
                  </div>
                  <div>
                    <span class="badge text-bg-secondary">Laufzeit: {{ session.started | d_timespan: localDate() }}</span>
                  </div>
                </div>
              }
              <span>Versuche: {{ maxiService.state.currentSessionOrders().length }}</span>
              <ul>
                @for (order of maxiService.state.currentSessionOrders(); track order.id) {
                  <li>
                    {{ order.success | activated }} {{ order.id }}
                    {{ order.sent | date: 'dd.MM. HH:mm:ss:SSS' }}
                  </li>
                }
              </ul>
            </div>
          </ng-template>
        </li>
        @for (session of maxiService.state.sessions(); track session) {
          <li [ngbNavItem]="session.id">
            <button ngbNavLink type="button">
              Test - {{ session.id }}
              <button class="btn-close ms-3 fw-light" (click)="close($event, session.id)" type="button">
                <span class="visually-hidden">Remove test</span>
              </button>
            </button>
            <ng-template ngbNavContent>
              <div class="d-flex flex-column gap-3">
                <div class="d-flex align-items-center gap-2">
                  <button
                    class="btn btn-sm"
                    [class.btn-success]="session.successRate === 100"
                    [class.btn-danger]="session.successRate !== 100"
                    type="button"
                  >
                    Success rate: {{ session.successRate }}%
                  </button>
                  <div>
                    <span class="badge text-bg-secondary"
                      >Laufzeit: {{ session.started | date: 'dd.MM. HH:mm:ss:SSS' }} - {{ session.ended | date: 'dd.MM. HH:mm:ss:SSS' }} ({{
                        session.started | d_timespan: session.ended
                      }})</span
                    >
                  </div>
                  <div>
                    <span class="badge text-bg-secondary">Versuche: {{ session.orders.length }}</span>
                  </div>
                  <div>
                    <span class="badge text-bg-secondary">Event Id: {{ session.eventId }}</span>
                  </div>
                  <div>
                    <span class="badge text-bg-secondary">Interval: {{ session.intervalInMs }}ms</span>
                  </div>
                </div>

                <ul>
                  @for (order of session.orders; track order.id) {
                    <li>
                      {{ order.success | activated }} {{ order.id }}
                      {{ order.sent | date: 'dd.MM. HH:mm:ss:SSS' }}
                    </li>
                  }
                </ul>
              </div>
            </ng-template>
          </li>
        }
      </ul>

      <div class="mt-2" [ngbNavOutlet]="nav"></div>
    </div>
  `,
  styles: `
    .close {
      font-size: 1.4rem;
      opacity: 0.1;
      transition: opacity 0.3s;
    }
    .nav-link:hover > .close {
      topacity: 0.8;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    NgSelectModule,
    DatePipe,
    NgbNav,
    NgbNavItem,
    NgbNavLinkButton,
    NgbNavContent,
    NgbNavOutlet,
    DfxTimeSpanPipe,
    AppActivatedPipe,
  ],
})
export class MaxiComponent {
  maxiService = inject(MaxiService);

  isValid = injectIsValid(this.maxiService.form);

  events = toSignal(inject(EventsService).getAll$(), {initialValue: []});

  localDate = toSignal(interval(1000).pipe(map(() => new Date())), {
    initialValue: new Date(),
  });

  close(event: MouseEvent, toRemove: number): void {
    event.preventDefault();
    event.stopImmediatePropagation();
    void this.maxiService.state.remove(toRemove);
  }
}
