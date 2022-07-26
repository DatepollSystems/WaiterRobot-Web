import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AEntityWithNumberIDAndName, Converter, EntityList, IEntityList, IEntityWithNumberIDAndName} from 'dfx-helper';

import {AbstractModelEditComponent} from '../../../_helper/abstract-model-edit.component';

import {EventModel} from '../../../_models/event.model';
import {PrinterModel} from '../../../_models/printer.model';
import {ProductGroupModel} from '../../../_models/product/product-group.model';
import {ProductModel} from '../../../_models/product/product.model';
import {AllergensService} from '../../../_services/models/allergens.service';
import {EventsService} from '../../../_services/models/events.service';
import {PrintersService} from '../../../_services/models/printers.service';
import {ProductGroupsService} from '../../../_services/models/product/product-groups.service';
import {ProductsService} from '../../../_services/models/product/products.service';

import {NotificationService} from '../../../_services/notifications/notification.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent extends AbstractModelEditComponent<ProductModel> {
  override redirectUrl = '/home/products/all';
  override continuousUsePropertyNames = ['groupId', 'printerId'];

  selectedEvent: EventModel | undefined;
  productGroups: ProductGroupModel[];
  selectedProductGroup: number | undefined;
  printers: PrinterModel[];
  selectedPrinter?: number;

  allergens: IEntityList<AEntityWithNumberIDAndName>;

  constructor(
    route: ActivatedRoute,
    router: Router,
    productsService: ProductsService,
    modal: NgbModal,
    allergensService: AllergensService,
    printersService: PrintersService,
    private notificationService: NotificationService,
    private eventsService: EventsService,
    private productGroupsService: ProductGroupsService
  ) {
    super(router, route, modal, productsService);

    this.selectedEvent = this.eventsService.getSelected();
    this.autoUnsubscribe(this.eventsService.selectedChange.subscribe((event) => (this.selectedEvent = event)));

    this.productGroups = this.productGroupsService.getAll();
    this.autoUnsubscribe(this.productGroupsService.allChange.subscribe((groups) => (this.productGroups = groups)));

    this.allergens = new EntityList(allergensService.getAll());
    this.autoUnsubscribe(allergensService.allChange.subscribe((allergens) => (this.allergens = allergens)));

    this.printers = printersService.getAll();
    this.autoUnsubscribe(printersService.allChange.subscribe((printers) => (this.printers = printers)));
  }

  selectedAllergens: IEntityList<AEntityWithNumberIDAndName> = new EntityList();

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.groupId = Converter.toNumber(model.groupId as number);
    model.printerId = Converter.toNumber(model.printerId as number);

    model.allergenIds = this.selectedAllergens.map((allergen) => {
      return allergen.id;
    });

    return model;
  }

  override createAndUpdateFilter(model: any): boolean {
    if (!this.selectedProductGroup) {
      this.notificationService.twarning('HOME_PROD_GROUP_ID_INCORRECT');
      return false;
    }
    if (!this.selectedPrinter) {
      this.notificationService.twarning('HOME_PROD_PRINTER_ID_INCORRECT');
      return false;
    }
    return super.createAndUpdateFilter(model);
  }

  override onEntityEdit(model: ProductModel): void {
    this.selectedAllergens = model.allergens;
    this.selectedProductGroup = model.groupId;
    this.selectedPrinter = model.printerId;
  }

  allergenChange(allergens: IEntityList<IEntityWithNumberIDAndName>): void {
    this.selectedAllergens = allergens;
  }
}
