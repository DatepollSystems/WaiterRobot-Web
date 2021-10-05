import {Component, OnDestroy} from '@angular/core';
import {ProductsModel} from '../../_models/products';
import {Subscription} from 'rxjs';
import {ProductsService} from '../../_services/products.service';
import {OrganisationsService} from '../../_services/organisations.service';
import {OrganisationModel} from '../../_models/organisation.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnDestroy {
  products: ProductsModel[];
  productsCopy: ProductsModel[] | undefined;
  productsSubscription: Subscription;

  selectedOrganisation: OrganisationModel | undefined;
  selectedOrganisationSubscription: Subscription;

  constructor(private productsService: ProductsService, private organisationsService: OrganisationsService) {
    this.products = this.productsService.getAll();
    this.productsSubscription = this.productsService.allChange.subscribe((value: ProductsModel[]) => {
      this.products = value;
      this.productsCopy = value.slice(0, 5);
    });

    this.selectedOrganisation = this.organisationsService.getSelected();
    this.selectedOrganisationSubscription = this.organisationsService.selectedChange.subscribe((value) => {
      this.selectedOrganisation = value;
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
    this.selectedOrganisationSubscription.unsubscribe();
  }
}
