import {NgForOf, NgIf} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {HasNumberIDAndName, IEntityWithNumberIDAndName, IList, List} from 'dfts-helper';
import {DfxSortModule, DfxTableModule} from 'dfx-bootstrap-table';
import {DfxTrackById} from 'dfx-helper';
import {DfxTr} from 'dfx-translate';
import {AppBtnToolbarComponent} from '../../../_shared/ui/app-btn-toolbar.component';
import {AppIconsModule} from '../../../_shared/ui/icons.module';
import {AppSpinnerRowComponent} from '../../../_shared/ui/loading/app-spinner-row.component';
import {DuplicateWaitersService} from '../_services/duplicate-waiters.service';
import {AbstractModelsListV2Component} from '../../../_shared/ui/abstract-models-list-v2.component';
import {DuplicateWaiterResponse} from '../../../_shared/waiterrobot-backend';

@Component({
  selector: 'app-duplicate-organisation-waiters',
  templateUrl: './duplicate-organisation-waiters.component.html',
  imports: [
    AppSpinnerRowComponent,
    NgbTooltip,
    NgIf,
    AppIconsModule,
    DfxTableModule,
    DfxSortModule,
    DfxTr,
    AppBtnToolbarComponent,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    DfxTrackById,
    RouterLink,
  ],
  standalone: true,
})
export class DuplicateOrganisationWaitersComponent extends AbstractModelsListV2Component<DuplicateWaiterResponse> {
  duplicateWaiter: DuplicateWaiterResponse | undefined;
  selectedDuplicateWaiter: HasNumberIDAndName | undefined;
  duplicateWaitersToMerge: IList<HasNumberIDAndName> = new List<HasNumberIDAndName>();
  continueMerge = true;

  //TODO: Ignore feature
  ignoreFeature = false;
  automaticIgnoreOnSave = true;

  constructor(protected entitiesService: DuplicateWaitersService, private route: ActivatedRoute) {
    super(entitiesService);

    this.columnsToDisplay = ['name', 'count', 'actions'];
  }

  // protected override onEntitiesLoaded(): void {
  //   this.unsubscribe(
  //     this.route.paramMap.subscribe((params) => {
  //       let name = params.get('name');
  //       if (name != null) {
  //         name = name.replace('"', '').replace('"', '');
  //         this.lumber.log('onEntitiesLoaded', 'Found name: "' + name + '"');
  //         for (const duplicateWaiter of this.entities?.data ?? []) {
  //           if (duplicateWaiter.name === name) {
  //             this.lumber.log('onEntitiesLoaded', 'Found matching entity', this.duplicateWaiter);
  //             this.duplicateWaiter = duplicateWaiter;
  //             this.duplicateWaitersToMerge.removeAll();
  //             this.duplicateWaitersToMerge.add(this.duplicateWaiter.waiters);
  //             if (
  //               new Set(
  //                 this.duplicateWaitersToMerge.map((value) => {
  //                   return value.name;
  //                 })
  //               ).size === 1
  //             ) {
  //               this.selectedDuplicateWaiter = this.duplicateWaitersToMerge[0];
  //               this.duplicateWaitersToMerge.remove(this.selectedDuplicateWaiter);
  //             }
  //             this.lumber.log('onEntitiesLoaded', 'duplicateWaitersToMerge', this.duplicateWaitersToMerge);
  //             break;
  //           }
  //         }
  //       }
  //     })
  //   );
  //   super.onEntitiesLoaded();
  // }

  isSelected(duplicateWaiter: IEntityWithNumberIDAndName): boolean {
    return this.selectedDuplicateWaiter?.id === duplicateWaiter.id;
  }

  selectDuplicateWaiter(duplicateWaiter: IEntityWithNumberIDAndName): void {
    if (this.selectedDuplicateWaiter?.id !== duplicateWaiter.id) {
      this.duplicateWaitersToMerge.add(this.selectedDuplicateWaiter);
    }
    this.selectedDuplicateWaiter = duplicateWaiter;
    this.duplicateWaitersToMerge.removeIfPresent(duplicateWaiter);
    this.lumber.log('setDuplicateWaiter', 'DuplicateWaitersToMerge', this.duplicateWaitersToMerge);
  }

  isSelectedToMerge(duplicateWaiter: IEntityWithNumberIDAndName): boolean {
    if (!this.duplicateWaiter) {
      return false;
    }
    return this.duplicateWaitersToMerge.containsAny(duplicateWaiter);
  }

  selectDuplicateWaiterToMerge(duplicateWaiter: IEntityWithNumberIDAndName, event: any | undefined = undefined): boolean {
    event?.stopPropagation();
    if (this.duplicateWaitersToMerge.containsAny(duplicateWaiter)) {
      this.duplicateWaitersToMerge.remove(duplicateWaiter);
    } else {
      this.duplicateWaitersToMerge.add(duplicateWaiter);
    }
    this.lumber.log('setDuplicateWaiterToMerge', 'Finished', this.duplicateWaitersToMerge);
    return true;
  }

  merge(): void {
    // if (this.selectedDuplicateWaiter == null || this.duplicateWaitersToMerge.length < 1) {
    //   return;
    // }
    //
    // this.entitiesService.merge({
    //   waiterId: this.selectedDuplicateWaiter?.id,
    //   waiterIds: this.duplicateWaitersToMerge.map((value) => value.id),
    // });
    // if (this.continueMerge && this.entities && this.entities.data.length > 1) {
    //   let next: HasNumberIDAndName | undefined = undefined;
    //   let i = 0;
    //   while (i < 100) {
    //     next = this.entities.data[i];
    //     i++;
    //     if (next && next.name !== this.duplicateWaiter?.name) {
    //       break;
    //     }
    //   }
    //   if (i > 98) {
    //     this.lumber.warning('merge', 'Could not find another duplicate waiter', this.entities);
    //   } else {
    //     void this.router.navigateByUrl('/home/waiters/organisation/duplicates/"' + next!.name + '"');
    //     return;
    //   }
    // }
    // void this.router.navigateByUrl('/home/waiters/organisation/duplicates');
  }
}
