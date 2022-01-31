import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AEntityWithNumberIDAndName, Converter, IEntityWithNumberIDAndName, IList, List, LoggerFactory} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {NotificationService} from '../../../_services/notifications/notification.service';
import {ProductsService} from '../../../_services/models/products.service';
import {ProductGroupsService} from '../../../_services/models/product-groups.service';
import {EventsService} from '../../../_services/models/events.service';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {EventModel} from '../../../_models/event.model';
import {ProductGroupModel} from '../../../_models/product-group.model';
import {ProductModel} from '../../../_models/product.model';
import {AllergensService} from '../../../_services/models/allergens.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent extends AbstractModelEditComponent<ProductModel> {
  override redirectUrl = '/home/products/all';

  private log = LoggerFactory.getLogger('ProductEditComponent');

  selectedEvent: EventModel | undefined;
  productGroups: ProductGroupModel[];
  selectedProductGroup = 'default';

  allergens: IList<AEntityWithNumberIDAndName>;
  selectedAllergens: IList<AEntityWithNumberIDAndName> = new List();

  constructor(
    route: ActivatedRoute,
    router: Router,
    productsService: ProductsService,
    modal: NgbModal,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    private productGroupsService: ProductGroupsService,
    private allergensService: AllergensService
  ) {
    super(router, route, modal, productsService);

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(
      this.eventsService.selectedChange.subscribe((event) => {
        this.selectedEvent = event;
      })
    );

    this.productGroups = this.productGroupsService.getAll();
    this.autoUnsubscribe(
      this.productGroupsService.allChange.subscribe((tableGroups) => {
        this.productGroups = tableGroups;
      })
    );

    this.allergens = this.allergensService.getAll();
    this.autoUnsubscribe(
      this.allergensService.allChange.subscribe((allergens) => {
        this.allergens = allergens;
      })
    );
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.group_id = Converter.toNumber(this.selectedProductGroup);
    model.allergen_ids = this.selectedAllergens.map((allergen) => {
      return allergen.id;
    });

    return model;
  }

  override customCreateAndUpdateFilter(model: any): boolean {
    if (this.selectedProductGroup.includes('default')) {
      this.notificationService.twarning('HOME_PROD_GROUP_ID_INCORRECT');
      return false;
    }
    return super.customCreateAndUpdateFilter(model);
  }

  override onEntityLoaded(): void {
    if (this.isEditing && this.entity) {
      //TODO This isnt working
      this.selectedProductGroup = Converter.toString(this.entity?.group_id);
    }
  }

  selectProductGroup(value: string): void {
    if (value.includes('default')) {
      return;
    }
    this.log.info('selectTableGroup', 'Selecting product group', value);
  }

  allergenChange(allergens: IList<IEntityWithNumberIDAndName>): void {
    this.selectedAllergens = allergens;
  }
}
