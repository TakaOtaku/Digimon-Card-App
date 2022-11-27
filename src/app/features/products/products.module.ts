import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TooltipModule } from 'primeng/tooltip';
import { ProductsComponent } from './products.component.ts';

@NgModule({
  declarations: [ProductsComponent],
  imports: [CommonModule, FormsModule, TooltipModule, LazyLoadImageModule],
})
export class ProductsModule {}
