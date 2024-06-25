import {AsyncPipe, Location} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {TranslocoPipe} from '@jsverse/transloco';

import {DuplicateWaiterResponse, IdAndNameResponse} from '@shared/waiterrobot-backend';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {StopPropagationDirective} from 'dfx-helper';

import {combineLatest, filter, map, merge, share, shareReplay, Subject, switchMap, take} from 'rxjs';
import {DuplicateWaitersService} from '../_services/duplicate-waiters.service';

type DuplicateWaiterWithSelected = IdAndNameResponse & {selectedToMerge: boolean; selectedAsMain: boolean};

@Component({
  template: `
    @if (vm$ | async; as vm) {
      <div class="d-flex flex-column gap-2">
        <h1>"{{ vm.duplicateWaiter.name }}" Duplikate</h1>

        <scrollable-toolbar>
          <div>
            <a routerLink="../../" class="btn btn-sm btn-outline-secondary">{{ 'GO_BACK' | transloco }}</a>
          </div>
          <div>
            <button type="button" class="btn btn-sm btn-success" [disabled]="!vm.minTwo" (mousedown)="merge()">
              {{ 'SAVE' | transloco }}
            </button>
          </div>
        </scrollable-toolbar>

        <hr />

        <div class="col-12 col-md-4">
          <div class="list-group">
            @for (duplicateWaiter of vm.duplicateWaitersToMerge; track duplicateWaiter.id) {
              <button
                type="button"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                [class.active]="duplicateWaiter.selectedAsMain"
                (mousedown)="selectMainDuplicateWaiter(duplicateWaiter)"
              >
                <div>
                  @if (!duplicateWaiter.selectedAsMain) {
                    <input
                      class="form-check-input me-1"
                      type="checkbox"
                      stopPropagation
                      [checked]="duplicateWaiter.selectedToMerge"
                      (mousedown)="selectDuplicateWaiterToMerge(duplicateWaiter)"
                    />
                  }
                  {{ duplicateWaiter.name }}
                </div>
                @if (ignoreFeature) {
                  <button type="button" class="btn btn-sm btn-warning" stopPropagation>
                    <bi name="person-x-fill" />
                    {{ 'IGNORE' | transloco }}
                  </button>
                }
              </button>
            }
          </div>
          @if (!vm.minTwo) {
            <div class="text-danger">Markiere mindestens zwei Namen welche du zusammenführen willst</div>
          }
        </div>
      </div>
    }
  `,
  imports: [BiComponent, TranslocoPipe, ScrollableToolbarComponent, RouterLink, AsyncPipe, FormsModule, StopPropagationDirective],
  selector: 'app-duplicate-organisation-waiters-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DuplicateOrganisationWaitersEditComponent {
  #duplicateWaitersService = inject(DuplicateWaitersService);
  #route = inject(ActivatedRoute);
  #location = inject(Location);

  ignoreFeature = false;

  private allDuplicateWaiters$ = this.#duplicateWaitersService.getAll$().pipe(share(), shareReplay(1));

  private duplicateWaiter$ = this.#route.paramMap.pipe(
    map((params) => params.get('name')),
    filter(notNullAndUndefined),
    map((name) => name.replace('"', '').replace('"', '')),
    switchMap((name) => this.allDuplicateWaiters$.pipe(map((waiters) => waiters.find((it) => it.name === name)))),
    filter((waiter): waiter is DuplicateWaiterResponse => {
      if (!waiter) {
        this.#location.back();
        return false;
      }
      return true;
    }),
    share(),
    shareReplay(1),
  );

  private setDuplicateWaitersToMerge = new Subject<DuplicateWaiterWithSelected[]>();
  private duplicateWaitersToMerge$ = merge(
    this.duplicateWaiter$.pipe(
      map((waiter) => waiter.waiters.sort((a, b) => a.name.localeCompare(b.name))),
      map((waiters) =>
        waiters.map(
          (waiter, index) =>
            ({
              ...waiter,
              selectedToMerge: true,
              selectedAsMain: index === 0,
            }) as DuplicateWaiterWithSelected,
        ),
      ),
    ),
    this.setDuplicateWaitersToMerge,
  ).pipe(share(), shareReplay(1));

  private minTwoDuplicateWaitersForMergeSelected$ = this.duplicateWaitersToMerge$.pipe(
    map((waiters) => waiters.filter((it) => it.selectedToMerge || it.selectedAsMain)),
    map((waiters) => waiters.length > 1),
  );

  vm$ = combineLatest([this.duplicateWaiter$, this.duplicateWaitersToMerge$, this.minTwoDuplicateWaitersForMergeSelected$]).pipe(
    map(([duplicateWaiter, duplicateWaitersToMerge, minTwo]) => ({
      duplicateWaiter,
      duplicateWaitersToMerge,
      minTwo,
    })),
  );

  selectMainDuplicateWaiter(duplicateWaiter: DuplicateWaiterWithSelected): void {
    this.duplicateWaitersToMerge$.pipe(take(1)).subscribe((waiters) => {
      for (const waiter of waiters) {
        if (waiter.id === duplicateWaiter.id) {
          waiter.selectedAsMain = true;
          waiter.selectedToMerge = false;
        } else {
          waiter.selectedAsMain = false;
        }
      }
      this.setDuplicateWaitersToMerge.next(waiters);
    });
  }

  selectDuplicateWaiterToMerge(duplicateWaiter: DuplicateWaiterWithSelected): void {
    this.duplicateWaitersToMerge$.pipe(take(1)).subscribe((waiters) => {
      const waiter = waiters.find((it) => it.id === duplicateWaiter.id);
      waiter!.selectedToMerge = !waiter!.selectedToMerge;
      this.setDuplicateWaitersToMerge.next(waiters);
    });
  }

  merge(): void {
    this.duplicateWaitersToMerge$.pipe(take(1)).subscribe((waiters) => {
      const mainDuplicateWaiter = waiters.find((it) => it.selectedAsMain);
      if (!mainDuplicateWaiter) {
        console.error('No main waiter selected');
        return;
      }

      this.#duplicateWaitersService
        .merge({
          waiterId: mainDuplicateWaiter.id,
          waiterIds: waiters.filter((it) => it.selectedToMerge && !it.selectedAsMain).map((value) => value.id),
        })
        .subscribe();
      this.#location.back();
    });
  }
}
