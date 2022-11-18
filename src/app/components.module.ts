import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SingleContainerComponent } from './components/atoms/single-container.component';

@NgModule({
  declarations: [SingleContainerComponent],
  exports: [SingleContainerComponent],
  imports: [CommonModule],
})
export class ComponentsModule {}
