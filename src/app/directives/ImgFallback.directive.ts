import { Directive, ElementRef, HostListener, Input, OnChanges, OnInit } from '@angular/core';
import { addJBeforeWebp } from 'src/assets/cardlists/DigimonCards';

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
    element.src = this.digimonImgFallback ? addJBeforeWebp(this.digimonImgFallback) : '../../../assets/images/digimon-card-back.webp';
  }
}
