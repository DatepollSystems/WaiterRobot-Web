import {Component, OnDestroy} from '@angular/core';
import {ProductsModel} from '../../../_models/products';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductsService} from '../../../_services/models/products.service';
import {Converter, TypeHelper} from 'dfx-helper';
import {NgForm} from '@angular/forms';
import {OrganisationsService} from '../../../_services/models/organisations.service';
import {OrganisationModel} from '../../../_models/organisation.model';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnDestroy {
  isEdit = false;
  active = 1;

  product: ProductsModel | null | undefined;
  _productSubscription: Subscription | undefined;

  organisations: OrganisationModel[] | null | undefined;
  _organisationsSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private organisationsService: OrganisationsService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params?.tab != null) {
        this.active = Converter.stringToNumber(params?.tab);
      }
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id != null) {
        if (TypeHelper.isNumeric(id)) {
          console.log('Prod to open: ' + id);
          this.product = this.productsService.getSingle(Converter.stringToNumber(id));
          this._productSubscription = this.productsService.singleChange.subscribe((value: ProductsModel) => {
            this.product = value;
          });
          this.isEdit = true;
        } else if (id == 'create') {
          this.organisations = this.organisationsService.getAll();
          this._organisationsSubscription = this.organisationsService.allChange.subscribe((value) => {
            this.organisations = value;
          });
        } else {
          this.isEdit = false;
          console.log('Create new prod');
        }
      } else {
        console.log('No prod to open');
      }
    });
  }

  ngOnDestroy(): void {
    this._productSubscription?.unsubscribe();
  }

  onNavChange($event: any): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {tab: $event.nextId},
      queryParamsHandling: 'merge',
    });
  }

  onSave(f: NgForm): void {
    const values = f.form.value;
    const prod = new ProductsModel(values);
    console.log(prod);
    if (this.isEdit && this.product?.id != null) {
      prod.id = this.product?.id;
      this.productsService.update(prod);
    } else {
      this.productsService.create(prod);
    }
    void this.router.navigateByUrl('/home/products/all');
  }

  onDelete(productId: number): void {
    this.productsService.delete(productId);
    void this.router.navigateByUrl('/home/products/all');
  }
}
