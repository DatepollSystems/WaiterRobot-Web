import {AsyncPipe, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {DfxTr} from 'dfx-translate';
import {combineLatest, map, Observable, switchMap, tap} from 'rxjs';
import {getActivatedRouteIdParam} from '../../../_shared/services/getActivatedRouteIdParam';
import {GetUserResponse, IdAndNameResponse} from '../../../_shared/waiterrobot-backend';
import {UsersOrganisationsService} from '../services/users-organisations.service';
import {OrganisationsUsersService} from '../../organisations/_services/organisations-users.service';
import {OrganisationsService} from '../../organisations/_services/organisations.service';
import {ChipInput} from '../../../_shared/ui/chip-input/chip-input.component';

@Component({
  template: `
    <div class="d-flex flex-column">
      <chip-input
        *ngIf="vm$ | async as vm"
        (valueChange)="orgUserChange($event)"
        [allModelsToAutoComplete]="vm.organisations"
        [formatter]="formatter"
        [models]="vm.selectedOrganisations"
        validationErrorText="{{ 'INCORRECT_INPUT' | tr }}"
        placeholder="{{ 'HOME_USERS_ORGS_INPUT_PLACEHOLDER' | tr }}"
      />
    </div>
  `,
  selector: 'app-user-edit-organisations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, DfxTr, AsyncPipe, ChipInput],
})
export class UserEditOrganisationsComponent {
  usersOrganisationsService = inject(UsersOrganisationsService);
  organisationsUsersService = inject(OrganisationsUsersService);

  organisations$ = inject(OrganisationsService).getAll$();
  selectedOrganisations$ = getActivatedRouteIdParam().pipe(
    switchMap((id) => this.usersOrganisationsService.getByUserId$(id)),
    tap((it) => (this.selectedOrganisations = it.slice()))
  );

  vm$ = combineLatest([this.organisations$, this.selectedOrganisations$]).pipe(
    map(([organisations, selectedOrganisations]) => ({
      organisations,
      selectedOrganisations,
    }))
  );

  selectedOrganisations: IdAndNameResponse[] = [];

  @Input() user!: GetUserResponse;

  formatter = (it: unknown): string => (it as IdAndNameResponse).name;

  orgUserChange(organisations: IdAndNameResponse[]): void {
    console.log(organisations, this.selectedOrganisations);
    const todos: Observable<unknown>[] = [];
    for (const organisation of organisations) {
      let contains = false;
      for (const org of this.selectedOrganisations) {
        if (organisation.id === org.id) {
          contains = true;
          break;
        }
      }
      if (!contains) {
        todos.push(this.organisationsUsersService.create$(organisation.id, this.user.emailAddress, {role: 'ADMIN'}));
      }
    }

    for (const org of this.selectedOrganisations) {
      let toDelete = true;
      for (const organisation of organisations) {
        if (org.id === organisation.id) {
          toDelete = false;
          break;
        }
      }
      if (toDelete) {
        todos.push(this.organisationsUsersService.delete$(org.id, this.user.emailAddress));
      }
    }

    for (const todo of todos) {
      todo.subscribe();
    }
  }
}
