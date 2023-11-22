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
    <div class='flex flex-col border border-slate-100 shadow-md surface-ground'>
      <div
        class='h-28 w-full'
        defaultImage='../../../../assets/images/banner.webp'
        [lazyLoad]="'../../../../assets/images/banner.webp'"
        [ngStyle]="{
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-position-y': '100%',
        'background-size': 'cover'
        }"
      ></div>
      <div class='flex flex-col h-28 gap-2 p-2 surface-card'>
        <h1 class='text-white text-black-outline text-center'>{{blog.title}}</h1>
        <h3 class='text-white'>{{blog.description}}</h3>
        <p-divider></p-divider>
        <div class='flex flex-row mb-3'>
          <div *ngIf='blog.autherImage; else userIcon'
            class='min-w-auto primary-background h-6 w-6 overflow-hidden rounded-full text-[#e2e4e6] group-hover:bg-[#64B5F6]"'>
            <img
              alt="Author"
              src="{{blog.autherImage}}" />
          </div>
          <ng-template #userIcon>
            <div class='min-w-auto flex flex-col justify-center primary-background h-6 w-6 overflow-hidden rounded-full text-[#e2e4e6]"'>
              <i class="pi pi-user ml-[0.3rem] text-white" style="font-size: 1rem"></i>
            </div>
          </ng-template>
          <span class='text-white ml-2'>{{blog.author}}</span>
          <span class='text-white ml-2'>•</span>
          <span class='text-white ml-2'>{{blog.date | date: 'dd.MM.yyyy'}}</span>
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
    LazyLoadImageModule
  ]
})
export class BlogItemComponent {
  @Input() blog: IBlog;
}
