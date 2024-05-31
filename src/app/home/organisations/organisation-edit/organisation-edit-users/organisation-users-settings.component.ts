import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, effect, inject, viewChild} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {BlankslateComponent} from '@home-shared/components/blankslate.component';

import {injectConfirmDialog} from '@home-shared/components/question-dialog.component';
import {MyUserService} from '@home-shared/services/user/my-user.service';
import {NgbModal, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {TranslocoPipe} from '@ngneat/transloco';
import {AppProgressBarComponent} from '@shared/ui/loading/app-progress-bar.component';
import {OrganisationUserResponse} from '@shared/waiterrobot-backend';

import {notNullAndUndefined} from 'dfts-helper';
import {BiComponent} from 'dfx-bootstrap-icons';
import {DfxSortModule, DfxTableModule, NgbSort, NgbTableDataSource} from 'dfx-bootstrap-table';
import {derivedFrom} from 'ngxtension/derived-from';

import {filter, of, pipe, startWith, switchMap} from 'rxjs';

import {OrganisationUsersService} from '../../_services/organisations-users.service';
import {SelectedOrganisationService} from '../../_services/selected-organisation.service';
import {OrganisationUserAddModalComponent} from './organisation-user-add-modal.component';

@Component({
  template: `
    <div class="bg-body-tertiary border rounded-3 d-flex flex-column gap-2">
      @if ((organisationUsersState.data()?.length ?? 0) === 0) {
        <app-blankslate icon="people-fill" [header]="'NAV_USERS' | transloco" [description]="'HOME_ORGS_USERS_EMPTY' | transloco">
          <button class="btn btn-success" type="button" (click)="onCreateOrganisationUser()">
            <bi name="plus-circle" />
            {{ 'HOME_ORGS_USERS_CREATE' | transloco }}
          </button>
        </app-blankslate>
      } @else {
        <div class="d-flex flex-column gap-3 p-4 p-lg-5">
          <h2 class="my-0 mb-1">{{ 'USER' | transloco }}</h2>
          <div class="d-flex flex-column flex-md-row gap-3 justify-content-between">
            <button class="btn btn-success" type="button" (click)="onCreateOrganisationUser()">
              <bi name="save" />
              {{ 'ADD_3' | transloco }}
            </button>

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
            <table #sort ngb-table ngb-sort [hover]="true" [dataSource]="dataSource()">
              <ng-container ngbColumnDef="name">
                <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'NAME' | transloco }}</th>
                <td *ngbCellDef="let organisationUser" ngb-cell>{{ organisationUser.firstname }} {{ organisationUser.surname }}</td>
              </ng-container>

              <ng-container ngbColumnDef="email">
                <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'EMAIL' | transloco }}</th>
                <td *ngbCellDef="let organisationUser" ngb-cell>{{ organisationUser.emailAddress }}</td>
              </ng-container>

              <ng-container ngbColumnDef="role">
                <th *ngbHeaderCellDef ngb-header-cell ngb-sort-header>{{ 'ROLE' | transloco }}</th>
                <td *ngbCellDef="let organisationUser" ngb-cell>
                  {{ organisationUser.role }}
                  <a class="btn btn-sm m-1 btn-outline-success" [ngbTooltip]="'EDIT' | transloco">
                    <bi name="pencil-square" />
                  </a>
                </td>
              </ng-container>

              <ng-container ngbColumnDef="actions">
                <th *ngbHeaderCellDef ngb-header-cell>{{ 'ACTIONS' | transloco }}</th>
                <td *ngbCellDef="let organisationUser" ngb-cell>
                  @if (myUserEmailAddress() !== organisationUser.email_address) {
                    <button
                      type="button"
                      class="btn btn-sm m-1 btn-outline-danger text-body-emphasis"
                      [ngbTooltip]="'DELETE' | transloco"
                      (click)="onDeleteOrganisationUser(organisationUser)"
                    >
                      <bi name="trash" />
                    </button>
                  }
                </td>
              </ng-container>

              <tr *ngbHeaderRowDef="columnsToDisplay" ngb-header-row></tr>
              <tr *ngbRowDef="let organisationUser; columns: columnsToDisplay" ngb-row></tr>
            </table>
          </div>
        </div>
      }

      <app-progress-bar [show]="organisationUsersState.loading()" />
    </div>
  `,
  selector: 'app-organisation-edit-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbTooltip,
    BiComponent,
    DfxTableModule,
    DfxSortModule,
    TranslocoPipe,
    AsyncPipe,
    AppProgressBarComponent,
    BlankslateComponent,
    ReactiveFormsModule,
  ],
})
export class OrganisationUsersSettingsComponent {
  modal = inject(NgbModal);
  confirmDialog = injectConfirmDialog();

  organisationUsersState = inject(OrganisationUsersService);

  selectedOrganisationId = inject(SelectedOrganisationService).selectedId;
  myUser = inject(MyUserService).user;
  myUserEmailAddress = computed(() => this.myUser()?.emailAddress);

  sort = viewChild<NgbSort>('sort');

  filter = new FormControl('');
  columnsToDisplay = ['name', 'email', 'actions'];

  dataSource = derivedFrom(
    [this.filter.valueChanges.pipe(startWith(''), filter(notNullAndUndefined)), this.organisationUsersState.data],
    pipe(
      switchMap(([filterTerm, all]) => {
        const dataSource = new NgbTableDataSource(all);

        dataSource.filter = filterTerm;

        return of(dataSource);
      }),
      startWith(new NgbTableDataSource<OrganisationUserResponse>()),
    ),
  );

  constructor() {
    effect(
      () => {
        void this.organisationUsersState.load(this.selectedOrganisationId());
      },
      {allowSignalWrites: true},
    );
  }

  onCreateOrganisationUser(): void {
    const modalRef = this.modal.open(OrganisationUserAddModalComponent, {ariaLabelledBy: 'modal-title-org-user-add', size: 'lg'});
    modalRef.componentInstance.entityId = this.selectedOrganisationId();
  }

  onDeleteOrganisationUser(model: OrganisationUserResponse): void {
    void this.confirmDialog('DELETE_CONFIRMATION').then((result) => {
      if (result) {
        void this.organisationUsersState.delete(model.emailAddress);
      }
    });
  }
}
