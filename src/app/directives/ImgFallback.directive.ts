import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
import { addJBeforeWebp, addSampleBeforeWebp } from '@assets/cardlists/DigimonCards';

const PLACEHOLDER = 'assets/images/card_placeholder.png';

@Directive({
  selector: 'img[digimonImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective implements OnChanges {
  @Input() digimonImgFallback: string;

  // Tried in order on each load error. Tracked here, not read back from src: CDN urls have no
  // "assets" in them, so the old src-based check retried the same missing image forever.
  private fallbacks: string[] = [];

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnChanges(): void {
    const src = this.digimonImgFallback;
    if (!src) {
      this.fallbacks = [];
      this.el.nativeElement.src = PLACEHOLDER;
      return;
    }
    const jIndex = src.lastIndexOf('-J.webp');
    this.fallbacks = jIndex !== -1 ? [src.slice(0, jIndex) + '-Sample-J.webp'] : [addJBeforeWebp(src), addSampleBeforeWebp(src)];
    this.el.nativeElement.src = src;
  }

  @HostListener('error')
  loadFallbackOnError() {
    const element = this.el.nativeElement;
    // The placeholder itself failing must not start another round
    if (element.src.endsWith(PLACEHOLDER)) return;
    element.src = this.fallbacks.shift() ?? PLACEHOLDER;
  }
}
