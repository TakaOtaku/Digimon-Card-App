import { AsyncPipe, DatePipe, NgClass, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { IBlog } from '../../../../models';

@Component({
  selector: 'digimon-blog-item',
  template: `
    <div
      class="flex flex-col w-full h-56 border border-slate-100 shadow-md surface-ground">
      <div
        class="h-1/2 w-full"
        defaultImage="../../../../assets/images/banner.webp"
        [lazyLoad]="'../../../../assets/images/banner.webp'"
        [ngStyle]="{
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          'background-position-y': '100%',
          'background-size': 'cover'
        }"></div>

      <div class="flex flex-col h-1/2 p-1 surface-card">
        <div
          class="border-b border-slate-500 h-1/2 items-center justify-center">
          <h1
            class="text-white text-black-outline max-w-[100vw] truncate text-center">
            {{ blog.title }}
          </h1>
          <h3 *ngIf="blog.description !== ''" class="text-white truncate">
            {{ blog.description }}
          </h3>
        </div>

        <div class="h-1/2 items-center justify-center flex flex-row">
          <div
            *ngIf="blog.autherImage; else userIcon"
            class='min-w-auto primary-background h-6 w-6 overflow-hidden rounded-full text-[#e2e4e6] group-hover:bg-[#64B5F6]"'>
            <img alt="Author" src="{{ blog.autherImage }}" />
          </div>
          <ng-template #userIcon>
            <div
              class='min-w-auto flex flex-col justify-center primary-background h-6 w-6 overflow-hidden rounded-full text-[#e2e4e6]"'>
              <i
                class="pi pi-user ml-[0.3rem] text-white"
                style="font-size: 1rem"></i>
            </div>
          </ng-template>
          <span class="text-white ml-2">{{ blog.author }}</span>
          <span class="text-white ml-2">•</span>
          <span class="text-white ml-2">{{
            blog.date | date: 'dd.MM.yyyy'
          }}</span>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    ButtonModule,
    RippleModule,
    InputTextModule,
    NgClass,
    DatePipe,
    DividerModule,
    AsyncPipe,
    NgStyle,
    LazyLoadImageModule,
  ],
})
export class BlogItemComponent {
  @Input() blog: IBlog;
}
