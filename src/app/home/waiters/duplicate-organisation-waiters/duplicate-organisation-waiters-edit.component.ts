import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {ScrollableToolbarComponent} from '@home-shared/components/scrollable-toolbar.component';
import {AppContinuesCreationSwitchComponent} from '@home-shared/form/app-continues-creation-switch.component';

import {DuplicateWaiterResponse, IdAndNameResponse} from '@shared/waiterrobot-backend';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxTr} from 'dfx-translate';

import {combineLatest, filter, map, merge, share, shareReplay, Subject, switchMap, take, tap} from 'rxjs';
import {DuplicateWaitersService} from '../_services/duplicate-waiters.service';

type DuplicateWaiterWithSelected = IdAndNameResponse & {selectedToMerge: boolean; selectedAsMain: boolean};

@Component({
  template: `
    @if (vm$ | async; as vm) {
      <div class="d-flex flex-column gap-2">
        <h1>"{{ vm.duplicateWaiter.name }}" Duplikate</h1>

        <scrollable-toolbar>
          <div>
            <a routerLink="../../" class="btn btn-sm btn-outline-secondary">{{ 'GO_BACK' | tr }}</a>
          </div>
          <div>
            <button type="button" class="btn btn-sm btn-success" [disabled]="!vm.minTwo" (click)="merge()">
              {{ 'SAVE' | tr }}
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
                (click)="selectMainDuplicateWaiter(duplicateWaiter)"
              >
                <div>
                  @if (!duplicateWaiter.selectedAsMain) {
                    <input
                      class="form-check-input me-1"
                      type="checkbox"
                      [checked]="duplicateWaiter.selectedToMerge"
                      (click)="selectDuplicateWaiterToMerge(duplicateWaiter); $event.stopPropagation()"
                    />
                  }
                  {{ duplicateWaiter.name }}
                </div>
                @if (ignoreFeature) {
                  <button type="button" class="btn btn-sm btn-warning" (click)="$event.stopPropagation()">
                    <bi name="person-x-fill" />
                    {{ 'IGNORE' | tr }}
                  </button>
                }
              </button>
            }
          </div>
          @if (!vm.minTwo) {
            <div class="text-danger">Markiere mindestens zwei Namen welche du zusammenführen willst</div>
          }
        </div>
        <app-continues-creation-switch text="HOME_WAITERS_DUPLICATES_CONTINUE" (continuesCreationChange)="continueMerge = $event" />
      </div>
    }
  `,
  imports: [BiComponent, DfxTr, ScrollableToolbarComponent, RouterLink, AsyncPipe, AppContinuesCreationSwitchComponent, FormsModule],
  selector: 'app-duplicate-organisation-waiters-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DuplicateOrganisationWaitersEditComponent {
  #duplicateWaitersService = inject(DuplicateWaitersService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  continueMerge = false;

  ignoreFeature = false;

  private allDuplicateWaiters$ = this.#duplicateWaitersService.getAll$().pipe(share(), shareReplay(1));

  private duplicateWaiter$ = this.#route.paramMap.pipe(
    map((params) => params.get('name')),
    filter(notNullAndUndefined),
    map((name) => name.replace('"', '').replace('"', '')),
    tap((name) => {
      console.log('param name', name);
    }),
    switchMap((name) => this.allDuplicateWaiters$.pipe(map((waiters) => waiters.find((it) => it.name === name)))),
    filter((waiter): waiter is DuplicateWaiterResponse => {
      if (!waiter) {
        void this.#router.navigateByUrl('/o/organisationId/e/eventId/waiters/duplicates');
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
  ).pipe(
    tap((waiters) => {
      console.log('duplicate waiters', waiters);
    }),
    share(),
    shareReplay(1),
  );

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
      if (this.continueMerge) {
        combineLatest([this.allDuplicateWaiters$, this.duplicateWaiter$])
          .pipe(take(1))
          .subscribe(([allDuplicateWaiters, duplicateWaiter]) => {
            let next: DuplicateWaiterResponse | undefined = undefined;
            let i = 0;
            while (i < 100) {
              next = allDuplicateWaiters[i];
              i++;
              if (next.name !== duplicateWaiter.name) {
                break;
              }
            }
            if (i > 98) {
              console.warn('duplicateWaiter merge - Could not find another duplicate waiter', allDuplicateWaiters);
            } else {
              void this.#router.navigateByUrl(`/o/organisationId/e/eventId/waiters/duplicates/merge/"${next!.name}"`);
              return;
            }
            void this.#router.navigateByUrl('/o/organisationId/e/eventId/waiters/duplicates');
          });
      } else {
        void this.#router.navigateByUrl('/o/organisationId/e/eventId/waiters/duplicates');
      }
    });
  }
}
