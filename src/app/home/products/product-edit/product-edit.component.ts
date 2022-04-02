import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AEntityWithNumberIDAndName, Converter, EntityList, IEntityList, IEntityWithNumberIDAndName} from 'dfx-helper';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {NotificationService} from '../../../_services/notifications/notification.service';
import {ProductsService} from '../../../_services/models/product/products.service';
import {ProductGroupsService} from '../../../_services/models/product/product-groups.service';
import {EventsService} from '../../../_services/models/events.service';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {EventModel} from '../../../_models/event.model';
import {ProductGroupModel} from '../../../_models/product/product-group.model';
import {ProductModel} from '../../../_models/product/product.model';
import {AllergensService} from '../../../_services/models/allergens.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent extends AbstractModelEditComponent<ProductModel> {
  override redirectUrl = '/home/products/all';
  override continuousUsePropertyNames = ['group_id'];

  selectedEvent: EventModel | undefined;
  productGroups: ProductGroupModel[];
  selectedProductGroup: number | undefined;

  allergens: IEntityList<AEntityWithNumberIDAndName>;
  selectedAllergens: IEntityList<AEntityWithNumberIDAndName> = new EntityList();

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
    this.autoUnsubscribe(this.eventsService.selectedChange.subscribe((event) => (this.selectedEvent = event)));

    this.productGroups = this.productGroupsService.getAll();
    this.autoUnsubscribe(this.productGroupsService.allChange.subscribe((groups) => (this.productGroups = groups)));

    this.allergens = new EntityList(this.allergensService.getAll());
    this.autoUnsubscribe(this.allergensService.allChange.subscribe((allergens) => (this.allergens = allergens)));
  }

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.groupId = Converter.toNumber(model.groupId as number);
    model.allergenIds = this.selectedAllergens.map((allergen) => {
      return allergen.id;
    });

    //TODO: printer id
    model.printerId = 0;

    return model;
  }

  override createAndUpdateFilter(model: any): boolean {
    if (!this.selectedProductGroup) {
      this.notificationService.twarning('HOME_PROD_GROUP_ID_INCORRECT');
      return false;
    }
    return super.createAndUpdateFilter(model);
  }

  override onEntityEdit(model: ProductModel): void {
    this.selectedAllergens = model.allergens;
    this.selectedProductGroup = model.groupId;
  }

  allergenChange(allergens: IEntityList<IEntityWithNumberIDAndName>): void {
    this.selectedAllergens = allergens;
  }
}
