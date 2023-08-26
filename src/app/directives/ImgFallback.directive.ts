import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { addJBeforeWebp, addSampleBeforeWebp } from 'src/assets/cardlists/DigimonCards';

@Directive({
  selector: 'img[digimonImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective implements OnInit, OnChanges {
  @Input() digimonImgFallback: string;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const element: HTMLImageElement = <HTMLImageElement>this.el.nativeElement;
    element.src = this.digimonImgFallback;
  }

  ngOnChanges(): void {
    const element: HTMLImageElement = <HTMLImageElement>this.el.nativeElement;
    element.src = this.digimonImgFallback;
  }

  @HostListener('error')
  loadFallbackOnError(error: any) {
    const element: HTMLImageElement = <HTMLImageElement>this.el.nativeElement;
    const hasJ = this.digimonImgFallback.includes('-J');
    const currentSrc = 'assets' + element.src.split('assets')[1];

    if (this.digimonImgFallback && !hasJ) {
      const modifiedSrc = addJBeforeWebp(this.digimonImgFallback);
      const sampleSrc = addSampleBeforeWebp(this.digimonImgFallback);
      if (modifiedSrc !== currentSrc && sampleSrc !== currentSrc) {
        element.src = modifiedSrc;
        return;
      } else if (!currentSrc.includes('Sample')) {
        element.src = sampleSrc;
        return;
      }
    } else {
      const indexOfJ = this.digimonImgFallback.lastIndexOf('-J.webp');
      const sampleJ =
        this.digimonImgFallback.slice(0, indexOfJ) + '-Sample-J.webp';
      if (sampleJ !== currentSrc) {
        element.src = sampleJ;
        return;
      }
    }
    element.src = '../../../assets/images/digimon-card-back.webp';
  }
}
