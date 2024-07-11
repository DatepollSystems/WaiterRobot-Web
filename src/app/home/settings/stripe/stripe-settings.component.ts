import {ChangeDetectionStrategy, Component, effect, inject, viewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {BlankslateComponent} from '@home-shared/components/blankslate.component';

import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {CreateStripeAccountDto, GetStripeAccountResponse, UpdateStripeAccountDto} from '@shared/waiterrobot-backend';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {StopPropagationDirective} from 'dfx-helper';
import {derivedFrom} from 'ngxtension/derived-from';

import {filter, of, pipe, startWith, switchMap} from 'rxjs';

import {OrganisationsStripeService} from '../../_admin/organisations/_services/organisations-stripe.service';
import {SelectedOrganisationService} from '../../_admin/organisations/_services/selected-organisation.service';
import {StripeAccountModal} from './stripe-account-modal.component';
import {StripeAccountStateBadge} from './stripe-account-state-badge.component';

@Component({
  template: `
    <div class="bg-body-tertiary border rounded-3 d-flex flex-column gap-2">
      @if ((stripeState.data()?.length ?? 0) === 0) {
        <app-blankslate icon="stripe" [header]="'Willkommen zu Stripe' | transloco" [description]="'STRIPE_ACCOUNT_EMPTY' | transloco">
          <button class="btn btn-success" type="button" (click)="onCreateStripeAccount()">
            <bi name="plus-circle" />
            {{ 'Erstelle deinen ersten Stripe-Account' | transloco }}
          </button>
        </app-blankslate>
      } @else {
        <div class="d-flex flex-column gap-3 p-4 p-lg-5">
          <h2 class="my-0 mb-1">Stripe</h2>
          <div class="d-flex flex-column flex-md-row gap-3 justify-content-between">
            <div>
              <button class="btn btn-success" type="button" [disabled]="stripeState.loading()" (click)="onCreateStripeAccount()">
                <bi name="save" />
                {{ 'ADD_3' | transloco }}
              </button>
            </div>
            <div>
              <div class="input-group">
                <input class="form-control ml-2" type="text" [formControl]="filter" [placeholder]="'SEARCH' | transloco" />
                @if ((filter.value?.length ?? 0) > 0) {
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    placement="bottom"
                    [ngbTooltip]="'CLEAR' | transloco"
                    (click)="filter.reset()"
                  >
                    <bi name="x-circle-fill" />
                  </button>
                }
              </div>
            </div>
          </div>

          <div class="table-responsive mt-3">
            <table ngb-table ngb-sort ngbSortActive="name" ngbSortDirection="asc" [hover]="true" [dataSource]="dataSource()">
              <ng-container ngbColumnDef="name">
                <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
                <td *ngbCellDef="let stripeAccount" ngb-cell>
                  {{ stripeAccount.name }}
                  @if (stripeAccount.events.length === 0) {
                    <bi name="exclamation-triangle-fill" class="text-warning" ngbTooltip="Stripe-Account noch keinem Event zugeordnet." />
                  }
                </td>
              </ng-container>

              <ng-container ngbColumnDef="state">
                <th *ngbHeaderCellDef ngb-header-cell>{{ 'STATE' | transloco }}</th>
                <td *ngbCellDef="let stripeAccount" ngb-cell>
                  <app-stripe-account-state-badge [stripeAccountId]="stripeAccount.id" [state]="stripeAccount.state" />
                </td>
              </ng-container>

              <ng-container ngbColumnDef="event">
                <th *ngbHeaderCellDef ngb-header-cell>{{ 'NAV_EVENTS' | transloco }}</th>
                <td *ngbCellDef="let stripeAccount" ngb-cell>
                  @for (event of stripeAccount.events; track event.id; let last = $last) {
                    <a stopPropagation [routerLink]="'../../o/' + stripeAccount.organisationId + '/events/' + event.id">{{ event.name }}</a>
                    @if (!last) {
                      ,&nbsp;
                    }
                  } @empty {
                    -
                  }
                </td>
              </ng-container>

              <ng-container ngbColumnDef="actions">
                <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
                <td *ngbCellDef="let stripeAccount" ngb-cell>
                  <button
                    type="button"
                    class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
                    [ngbTooltip]="'EDIT' | transloco"
                    (click)="$event.stopPropagation(); onUpdateStripeAccount(stripeAccount)"
                  >
                    <bi name="pencil-square" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                    [ngbTooltip]="'DELETE' | transloco"
                    (click)="$event.stopPropagation(); onDeleteStripeAccount(stripeAccount.id)"
                  >
                    <bi name="trash" />
                  </button>
                </td>
              </ng-container>

              <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
              <tr *ngbRowDef="let stripeAccount; columns: columnsToDisplay" ngb-row (click)="onUpdateStripeAccount(stripeAccount)"></tr>
            </table>
          </div>
        </div>
      }

      <app-progress-bar [show]="stripeState.loading()" />
    </div>
  `,
  selector: 'app-stripe-settings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BiComponent,
    TranslocoPipe,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    ReactiveFormsModule,
    AppProgressBarComponent,
    StripeAccountStateBadge,
    RouterLink,
    StopPropagationDirective,
    BlankslateComponent,
  ],
})
export class StripeSettingsComponent {
  modal = inject(NgbModal);
  confirmDialog = injectConfirmDialog();

  stripeState = inject(OrganisationsStripeService).state;
  selectedOrganisationId = inject(SelectedOrganisationService).selectedId;

  filter = new FormControl('');
  columnsToDisplay = ['name', 'state', 'event', 'actions'];

  sort = viewChild<NgbSort | undefined>(NgbSort);

  dataSource = derivedFrom(
    [this.filter.valueChanges.pipe(startWith(''), filter(notNullAndUndefined)), this.stripeState.data],
    pipe(
      switchMap(([filterTerm, all]) => {
        const dataSource = new NgbTableDataSource(all);

        if (this.sort()) {
          dataSource.sort = this.sort()!;
        }
        dataSource.filter = filterTerm;

        return of(dataSource);
      }),
      startWith(new NgbTableDataSource<GetStripeAccountResponse>()),
    ),
  );

  constructor() {
    effect(
      () => {
        void this.stripeState.load(this.selectedOrganisationId());
      },
      {allowSignalWrites: true},
    );
  }

  onCreateStripeAccount(): void {
    const modalRef = this.modal.open(StripeAccountModal, {
      ariaLabelledBy: 'modal-title-org-stripe-create',
      size: 'lg',
    });
    void (modalRef.componentInstance as StripeAccountModal).state.set({
      type: 'CREATE',
      organisationId: Number(this.selectedOrganisationId()),
      existingStripeAccountCount: this.stripeState.data()?.length ?? 0,
      name: undefined,
      eventIds: undefined,
    });
    modalRef.closed.subscribe((it?: CreateStripeAccountDto) => {
      if (it) {
        void this.stripeState.create(it);
      }
    });
  }

  onUpdateStripeAccount(stripeAccount: GetStripeAccountResponse): void {
    const modalRef = this.modal.open(StripeAccountModal, {
      ariaLabelledBy: 'modal-title-org-stripe-update',
      size: 'lg',
    });
    void (modalRef.componentInstance as StripeAccountModal).state.set({
      type: 'UPDATE',
      organisationId: Number(this.selectedOrganisationId()),
      existingStripeAccountCount: this.stripeState.data()?.length ?? 0,
      name: stripeAccount.name,
      eventIds: stripeAccount.events.map((it) => it.id),
    });
    modalRef.closed.subscribe((it?: Omit<UpdateStripeAccountDto, 'id'>) => {
      if (it) {
        void this.stripeState.update({
          ...it,
          id: stripeAccount.id,
        });
      }
    });
  }

  onDeleteStripeAccount(id: string): void {
    void this.confirmDialog('DELETE_CONFIRMATION').then((result) => {
      if (result) {
        void this.stripeState.delete(id);
      }
    });
  }
}
