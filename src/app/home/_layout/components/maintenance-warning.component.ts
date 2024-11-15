import {Component} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';

import {catchError, map, of, switchMap, timer} from 'rxjs';

import {TranslocoPipe} from '@jsverse/transloco';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxHideIfOffline, DfxHideIfPingSucceeds} from 'dfx-helper';

import {injectAPI} from '@shared/api';

@Component({
  template: `
    <div hideIfOffline>
      @if (pingFails()) {
        <div class="alert alert-warning" role="alert">
          <div class="d-flex gap-3 align-items-center">
            <bi name="exclamation-triangle-fill" />
            <div>
              <b>{{ 'ABOUT_MAINTENANCE_1' | transloco }}</b>
              <br />
              {{ 'ABOUT_MAINTENANCE_2' | transloco }}
              <br />
              {{ 'ABOUT_MAINTENANCE_3' | transloco }}
              <a style="text-decoration: underline; color: #664d03" href="https://status.kellner.team" target="_blank" rel="noreferrer"
                >status.kellner.team</a
              >.
              <br />
              {{ 'ABOUT_MAINTENANCE_4' | transloco }}
            </div>
          </div>
        </div>
      }
    </div>
  `,
  standalone: true,
  selector: 'app-maintenance-warning',
  imports: [DfxHideIfOffline, DfxHideIfPingSucceeds, BiComponent, TranslocoPipe],
})
export class MaintenanceWarningComponent {
  #api = injectAPI();

  pingFails = toSignal(
    timer(0, 30 * 1000).pipe(
      takeUntilDestroyed(),
      switchMap(() => this.#api.get('/v1/json')),
      map(() => false),
      catchError(() => of(true)),
    ),
  );
}
