import {Component, OnDestroy, QueryList, ViewChildren} from '@angular/core';
import {FormControl} from '@angular/forms';

import {Subscription} from 'rxjs';
import {Converter} from 'dfx-helper';

import {compare, SortableHeaderDirective, SortEvent} from '../../../_helper/table-sortable';

import {ProductsService} from '../../../_services/products.service';
import {ProductsModel} from '../../../_models/products';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss'],
})
export class AllProductsComponent implements OnDestroy {
  @ViewChildren(SortableHeaderDirective) headers: QueryList<SortableHeaderDirective> | undefined;
  filter = new FormControl('');

  products: ProductsModel[];
  productsCopy: ProductsModel[];
  productsSubscription: Subscription;

  constructor(private productsService: ProductsService) {
    this.products = this.productsService.getAll();
    this.productsCopy = this.products.slice();
    this.productsSubscription = this.productsService.allChange.subscribe((value) => {
      this.products = value;
      this.productsCopy = this.products.slice();
    });

    this.filter.valueChanges.subscribe((value) => {
      if (value == null) {
        this.productsCopy = this.products.slice();
        return;
      }
      value = value.trim().toLowerCase();
      this.productsCopy = [];
      for (const pro of this.products) {
        if (
          pro.id == value ||
          pro.name.trim().toLowerCase().includes(value) ||
          pro.price === Converter.stringToNumber(value) ||
          pro.organisation_id == value ||
          pro.printer_id == value ||
          pro.group_id == value
        ) {
          this.productsCopy.push(pro);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.productsSubscription.unsubscribe();
  }

  onDelete(id: number): void {
    this.productsService.delete(id);
  }

  onSort({column, direction}: SortEvent): boolean | void {
    if (this.headers == null) {
      return;
    }

    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.productsCopy = this.products.slice();
    } else {
      this.productsCopy = [...this.products].sort((a, b) => {
        const res = compare((a as any)[column], (b as any)[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}
