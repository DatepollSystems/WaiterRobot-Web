import {ChangeDetectionStrategy, Component} from '@angular/core';
import {n_from, n_isNumeric} from 'dfts-helper';
import {combineLatest, filter, map, startWith, tap} from 'rxjs';
import {AbstractModelEditComponentV2} from '../../../_shared/ui/abstract-model-edit.component-v2';
import {CreateProductDto, GetProductMaxResponse, UpdateProductDto} from '../../../_shared/waiterrobot-backend';
import {EventsService} from '../../events/_services/events.service';
import {PrintersService} from '../../printers/_services/printers.service';
import {AllergensService} from '../_services/allergens.service';
import {ProductGroupsService} from '../_services/product-groups.service';
import {ProductsServiceV2} from '../_services/products.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent extends AbstractModelEditComponentV2<CreateProductDto, UpdateProductDto, GetProductMaxResponse, 'DATA'> {
  defaultTab = 'DATA' as const;
  redirectUrl = '/home/products/all';
  continuousUsePropertyNames = ['groupId', 'printerId'];

  vm$ = combineLatest([
    this.route.queryParams.pipe(
      map((params) => params.group),
      filter(n_isNumeric),
      map((id) => n_from(id)),
      tap((id) => this.lumber.info('constructor', 'Selected product group: ' + id)),
      startWith(undefined)
    ),
    this.productGroupsService.getAll$(),
    this.allergensService.getAll$(),
    this.printersService.getAll$(),
    this.eventsService.getSelected$,
  ]).pipe(
    map(([selectedProductGroupId, productGroups, allergens, printers, selectedEvent]) => ({
      selectedProductGroupId,
      productGroups,
      allergens,
      printers,
      selectedEvent,
    }))
  );

  constructor(
    private productsService: ProductsServiceV2,
    private allergensService: AllergensService,
    private printersService: PrintersService,
    private eventsService: EventsService,
    private productGroupsService: ProductGroupsService
  ) {
    super(productsService);

    printersService.setSelectedEventGetAllUrl();
  }

  overrideCreateDto(dto: CreateProductDto): CreateProductDto {
    dto.price = dto.price * 100;

    return super.overrideCreateDto(dto);
  }

  overrideUpdateDto(dto: UpdateProductDto): UpdateProductDto {
    dto.price = dto.price * 100;

    return super.overrideUpdateDto(dto);
  }
}
