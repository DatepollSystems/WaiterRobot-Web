import {AfterViewInit, Component, Inject, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {distinctUntilChanged, filter, map, shareReplay, switchMap, tap} from 'rxjs';

import {IHasID, n_from, n_isNumeric} from 'dfts-helper';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from 'dfx-helper';

import {AbstractModelsListWithDeleteComponent} from '../models-list-with-delete/abstract-models-list-with-delete.component';

@Component({
  standalone: true,
  template: '',
})
export abstract class AbstractModelsListByIdComponent<
    EntitiesTypes extends IHasID<EntitiesTypes['id']>,
    EntityType extends IHasID<EntityType['id']>,
  >
  extends AbstractModelsListWithDeleteComponent<EntitiesTypes>
  implements AfterViewInit
{
  protected route = inject(ActivatedRoute);

  entityLoading = signal(true);

  private idParam$ = this.route.paramMap.pipe(
    map((params) => params.get('id')),
    filter((id): id is string => {
      if (id !== null && n_isNumeric(id)) {
        return true;
      } else {
        void this.router.navigateByUrl('/home');
        return false;
      }
    }),
    map((id) => n_from(id)),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading.set(true);
    }),
    shareReplay(1),
  );

  entity$ = this.idParam$.pipe(
    tap(() => {
      this.entityLoading.set(true);
    }),
    switchMap((id) => this.byIdEntityService.getSingle$(id)),
    tap(() => {
      this.entityLoading.set(false);
    }),
  );

  protected constructor(
    @Inject(null)
    protected entitiesService: HasGetAll<EntitiesTypes> & HasGetByParent<EntitiesTypes, EntityType> & HasDelete<EntitiesTypes>,
    @Inject(null) protected byIdEntityService: HasGetSingle<EntityType>,
  ) {
    super(entitiesService);
  }

  override ngAfterViewInit(): void {
    this.dataSource$ = this.idParam$.pipe(switchMap((id) => this.getDataSource(this.entitiesService.getByParent$(id))));
  }
}
