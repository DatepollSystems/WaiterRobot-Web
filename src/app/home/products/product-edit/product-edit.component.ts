import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AEntityWithNumberIDAndName, Converter, EntityList, IEntityList, IEntityWithNumberIDAndName, TypeHelper} from 'dfx-helper';

import {AbstractModelEditComponent} from '../../../_shared/ui/abstract-model-edit.component';

import {EventModel} from '../../events/_models/event.model';
import {PrinterModel} from '../../printers/_models/printer.model';
import {ProductGroupModel} from '../_models/product-group.model';
import {ProductModel} from '../_models/product.model';
import {AllergensService} from '../_services/allergens.service';
import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductsService} from '../_services/products.service';

import {NotificationService} from '../../../notifications/notification.service';

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
  selectedProductGroup?: number;
  printers: PrinterModel[];
  selectedPrinter?: number;

  allergens: IEntityList<AEntityWithNumberIDAndName> = new EntityList();

  constructor(
    route: ActivatedRoute,
    router: Router,
    productsService: ProductsService,
    modal: NgbModal,
    allergensService: AllergensService,
    printersService: PrintersService,
    eventsService: EventsService,
    productGroupsService: ProductGroupsService,
    private notificationService: NotificationService
  ) {
    super(router, route, modal, productsService);

    this.selectedEvent = eventsService.getSelected();
    this.productGroups = productGroupsService.getAll();
    this.allergens = allergensService.getAll();

    printersService.setSelectedEventGetAllUrl();
    this.printers = printersService.getAll();

    this.unsubscribe(
      eventsService.selectedChange.subscribe((it) => (this.selectedEvent = it)),
      productGroupsService.allChange.subscribe((it) => (this.productGroups = it)),
      allergensService.allChange.subscribe((it) => (this.allergens = it)),
      printersService.allChange.subscribe((it) => (this.printers = it))
    );

    route.queryParams.subscribe((params) => {
      const id = params.group;
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          this.selectedProductGroup = Converter.toNumber(id);
          this.lumber.info('constructor', 'Selected product group: ' + id);
        }
      }
    });
  }

  selectedAllergens: IEntityList<AEntityWithNumberIDAndName> = new EntityList();

  override addCustomAttributesBeforeCreateAndUpdate(model: any): any {
    model.groupId = Converter.toNumber(model.groupId as number);
    model.printerId = Converter.toNumber(model.printerId as number);

    model.price = model.price * 100;

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

  override onEntityEdit(it: ProductModel): void {
    this.selectedAllergens = it.allergens;
    this.selectedProductGroup = it.groupId;
    this.selectedPrinter = it.printerId;
  }

  formatter = (it: unknown) => (it as IEntityWithNumberIDAndName).name;

  allergenChange = (allergens: any[]) => (this.selectedAllergens = new EntityList(allergens));
}
