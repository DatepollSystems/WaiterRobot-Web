import {NgForOf, NgIf} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {IEntityWithName, StringOrNumber} from 'dfts-helper';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {AppListLoadingItemComponent} from './loading/app-list-loading-item.component';
import {AppSpinnerComponent} from './loading/app-spinner.component';
import {AppIconsModule} from './icons.module';

@Component({
  template: `
    <div class="list-group-item d-lg-none">
      <div class="input-group">
        <span class="input-group-text" id="selectOrganisation-addon"><i-bs name="people"></i-bs></span>
        <select
          class="form-select"
          id="selectOrganisation"
          #select
          (change)="select.value !== 'default' ? router.navigateByUrl(select.value) : undefined">
          <option value="default">{{ 'SELECT' | tr }}</option>
          <option value="{{ path }}{{ entity.id }}" *ngFor="let entity of entities; trackById">
            {{ entity.name }}
          </option>
        </select>
      </div>
    </div>

    <ng-container *ngIf="entities; else loading">
      <a
        *ngFor="let entity of entities; trackById"
        class="list-group-item list-group-item-action d-none d-lg-block"
        routerLinkActive="active"
        routerLink="{{ path }}{{ entity.id }}"
        (click)="select.value = path + entity.id">
        {{ entity.name }}
      </a>
    </ng-container>

    <ng-template #loading>
      <app-list-loading-item></app-list-loading-item>
    </ng-template>
  `,
  standalone: true,
  selector: 'app-list-nav-items',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgIf,
    NgForOf,
    DfxTr,
    DfxTrackById,
    AppSpinnerComponent,
    AppIconsModule,
    AppListLoadingItemComponent,
  ],
})
export class AppListNavItemsComponent {
  router = inject(Router);

  @Input() entities: IEntityWithName<StringOrNumber>[] | null = null;

  @Input() path!: string;
}
