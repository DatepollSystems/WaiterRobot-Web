import {ChangeDetectionStrategy, Component, effect, inject, ViewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

import {filter, of, pipe, startWith, switchMap} from 'rxjs';

import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {StopPropagationDirective} from '@home-shared/stop-propagation';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {CreateStripeAccountDto, GetStripeAccountResponse, UpdateStripeAccountDto} from '@shared/waiterrobot-backend';
import {computedFrom} from 'ngxtension/computed-from';
import {injectParams} from 'ngxtension/inject-params';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {DfxTr} from 'dfx-translate';

import {OrganisationsStripeService} from '../_services/organisations-stripe.service';
import {OrganisationStripeAccountModal} from './organisation-stripe-account-modal.component';
import {StripeAccountStateBadge} from './stripe-account-state-badge.component';

@Component({
  template: `
    <div class="d-flex flex-column gap-2 pt-3">
      <div class="d-flex flex-column flex-md-row gap-3 justify-content-between">
        <div>
          <button class="btn btn-success" type="button" (click)="onCreateStripeAccount()" [disabled]="stripeState.loading()">
            <bi name="save" />
            {{ 'ADD_3' | tr }}
          </button>
        </div>
        <div>
          <div class="input-group">
            <input class="form-control ml-2" type="text" [formControl]="filter" placeholder="{{ 'SEARCH' | tr }}" />
            @if ((filter.value?.length ?? 0) > 0) {
              <button
                class="btn btn-outline-secondary"
                type="button"
                ngbTooltip="{{ 'CLEAR' | tr }}"
                placement="bottom"
                (click)="filter.reset()"
              >
                <bi name="x-circle-fill" />
              </button>
            }
          </div>
        </div>
      </div>

      <div class="table-responsive mt-3">
        <table ngb-table [hover]="true" [dataSource]="dataSource()" ngb-sort ngbSortActive="name" ngbSortDirection="asc">
          <ng-container ngbColumnDef="name">
            <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | tr }}</th>
            <td *ngbCellDef="let stripeAccount" ngb-cell>
              {{ stripeAccount.name }}
              @if (!stripeAccount.event) {
                <bi name="exclamation-triangle-fill" class="text-warning" ngbTooltip="Stripe-Account noch keinem Event zugeordnet." />
              }
            </td>
          </ng-container>

          <ng-container ngbColumnDef="state">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'STATE' | tr }}</th>
            <td *ngbCellDef="let stripeAccount" ngb-cell>
              <app-stripe-account-state-badge [stripeAccountId]="stripeAccount.id" [state]="stripeAccount.state" />
            </td>
          </ng-container>

          <ng-container ngbColumnDef="event">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'NAV_EVENTS' | tr }}</th>
            <td *ngbCellDef="let stripeAccount" ngb-cell>
              @if (stripeAccount.event; as event) {
                <a routerLink="../../o/{{ stripeAccount.organisationId }}/events/{{ event.id }}" stopPropagation>
                  {{ event.name }}
                </a>
              } @else {
                -
              }
            </td>
          </ng-container>

          <ng-container ngbColumnDef="actions">
            <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | tr }}</th>
            <td *ngbCellDef="let stripeAccount" ngb-cell>
              <button
                type="button"
                class="btn btn-sm m-1 btn-outline-success text-body-emphasis"
                ngbTooltip="{{ 'EDIT' | tr }}"
                (click)="$event.stopPropagation(); onUpdateStripeAccount(stripeAccount)"
              >
                <bi name="pencil-square" />
              </button>
              <button
                type="button"
                class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                ngbTooltip="{{ 'DELETE' | tr }}"
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

      @if (stripeState.data()?.length === 0) {
        <div class="d-flex justify-content-center">
          <span>{{ 'STRIPE_ACCOUNT_EMPTY' | tr }}</span>
        </div>
      }

      <app-progress-bar [show]="stripeState.loading()" />
    </div>
  `,
  selector: 'app-organisation-edit-stripe',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BiComponent,
    DfxTr,
    NgbTooltip,
    DfxTableModule,
    DfxSortModule,
    ReactiveFormsModule,
    AppProgressBarComponent,
    StripeAccountStateBadge,
    RouterLink,
    StopPropagationDirective,
  ],
})
export class OrganisationEditStripeComponent {
  modal = inject(NgbModal);
  confirmDialog = injectConfirmDialog();

  stripeState = inject(OrganisationsStripeService).state;

  filter = new FormControl('');
  columnsToDisplay = ['name', 'state', 'event', 'actions'];

  @ViewChild(NgbSort, {static: true}) sort: NgbSort | undefined;

  idParam = injectParams('id');

  dataSource = computedFrom(
    [this.filter.valueChanges.pipe(startWith(''), filter(notNullAndUndefined)), this.stripeState.data],
    pipe(
      switchMap(([filterTerm, all]) => {
        const dataSource = new NgbTableDataSource(all);

        if (this.sort) {
          dataSource.sort = this.sort;
        }
        dataSource.filter = filterTerm ?? '';

        return of(dataSource);
      }),
      startWith(new NgbTableDataSource<unknown>()),
    ),
  );

  constructor() {
    effect(
      () => {
        void this.stripeState.load(Number(this.idParam()));
      },
      {allowSignalWrites: true},
    );
  }

  onCreateStripeAccount(): void {
    const modalRef = this.modal.open(OrganisationStripeAccountModal, {
      ariaLabelledBy: 'modal-title-org-stripe-create',
      size: 'lg',
    });
    void (modalRef.componentInstance as OrganisationStripeAccountModal).state.set({
      type: 'CREATE',
      organisationId: Number(this.idParam()),
      existingStripeAccountCount: this.stripeState.data()?.length ?? 0,
      name: undefined,
      eventId: undefined,
    });
    modalRef.closed.subscribe((it?: CreateStripeAccountDto) => {
      if (it) {
        void this.stripeState.create(it);
      }
    });
  }

  onUpdateStripeAccount(stripeAccount: GetStripeAccountResponse): void {
    const modalRef = this.modal.open(OrganisationStripeAccountModal, {
      ariaLabelledBy: 'modal-title-org-stripe-update',
      size: 'lg',
    });
    void (modalRef.componentInstance as OrganisationStripeAccountModal).state.set({
      type: 'UPDATE',
      organisationId: Number(this.idParam()),
      existingStripeAccountCount: this.stripeState.data()?.length ?? 0,
      name: stripeAccount.name,
      eventId: stripeAccount.event?.id,
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
