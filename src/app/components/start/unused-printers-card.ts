import {Component, inject} from '@angular/core';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';

import {combineLatest, map, switchMap, tap, timer} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';

import {MediatorStore} from '../../services/mediator.store';
import {PrintersService} from '../../services/printers.service';

@Component({
  template: `
    @defer (when unusedPrinters()) {
      @if (unusedPrinters(); as unusedPrinters) {
        <div class="card p-2">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              {{ 'Ungekoppelte Drucker' | transloco }}
              <a href="https://help.kellner.team/desktop.html" target="_blank" rel="noopener">
                <bi name="info-circle-fill" />
              </a>
            </h5>

            <div class="list-group mb-3">
              @for (printer of unusedPrinters; track printer.id) {
                <a
                  class="list-group-item list-group-item-action list-group-item-warning d-flex align-items-center gap-2"
                  [routerLink]="'o/organisationId/e/eventId/printers/' + printer.id"
                >
                  {{ printer.name }}
                </a>
              }
            </div>
            <a class="card-link" href="#" routerLink="o/organisationId/e/eventId/printers/mediators/all">Zu den Mediators</a>
          </div>
        </div>
      }
    }
  `,
  selector: 'wr-unused-printers-card',
  imports: [BiComponent, RouterLink, TranslocoPipe],
})
export class UnusedPrintersCard {
  #mediatorStore = inject(MediatorStore);
  #printersService = inject(PrintersService);

  #mediators = toObservable(this.#mediatorStore.entities);

  unusedPrinters = toSignal(
    timer(0, 3 * 60000).pipe(
      tap(() => this.#mediatorStore.loadAll()),
      switchMap(() => combineLatest([this.#mediators, this.#printersService.getAll$()])),
      map(([mediators, printers]) => {
        const allUsedPrinters = mediators.map((mediator) => mediator.printers.map((printer) => printer.id)).flat();
        return printers.filter((printer) => !allUsedPrinters.includes(printer.id));
      }),
      map((printers) => (printers.length > 0 ? printers : undefined)),
    ),
  );
}
