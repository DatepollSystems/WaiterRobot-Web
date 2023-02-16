import {Component, Inject, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IHasID, n_from, n_isNumeric} from 'dfts-helper';
import {distinctUntilChanged, filter, map, shareReplay, switchMap} from 'rxjs';
import {HasDelete, HasGetAll, HasGetByParent, HasGetSingle} from '../../services/abstract-entity.service';
import {AbstractModelsListWithDeleteComponent} from '../models-list-with-delete/abstract-models-list-with-delete.component';

@Component({
  template: '',
})
export abstract class AbstractModelsListByIdComponentV2<
  EntitiesTypes extends IHasID<EntitiesTypes['id']>,
  EntityType extends IHasID<EntityType['id']>
> extends AbstractModelsListWithDeleteComponent<EntitiesTypes> {
  protected route = inject(ActivatedRoute);

  protected idParam$ = this.route.paramMap.pipe(
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
    shareReplay(1)
  );

  entity$ = this.idParam$.pipe(switchMap((id) => this.byIdEntityService.getSingle$(id)));

  protected constructor(
    @Inject(null)
    protected entitiesService: HasGetAll<EntitiesTypes> & HasGetByParent<EntitiesTypes, EntityType> & HasDelete<EntitiesTypes>,
    @Inject(null) protected byIdEntityService: HasGetSingle<EntityType>
  ) {
    super(entitiesService);
  }

  override ngAfterViewInit() {
    this.dataSource$ = this.idParam$.pipe(switchMap((id) => this.getDataSource(this.entitiesService.getByParent$(id))));
  }
}
