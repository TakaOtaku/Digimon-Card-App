import { Directive, ElementRef, HostListener, Input, OnChanges } from '@angular/core';
import { addJBeforeWebp, addSampleBeforeWebp } from '@assets/cardlists/DigimonCards';

const PLACEHOLDER = 'assets/images/card_placeholder.png';
const ALYSION_PLACEHOLDER = 'assets/images/alysion_card_placeholder.png';
// Image files are named after the card, and Alysion cards are the BD, ED and SD sets
const ALYSION_IMAGE = /(^|\/)(BD|ED|SD)\d+-[^/]*$/;

@Directive({
  selector: 'img[digimonImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective implements OnChanges {
  @Input() digimonImgFallback: string;

  // Tried in order on each load error. Tracked here, not read back from src: CDN urls have no
  // "assets" in them, so the old src-based check retried the same missing image forever.
  private fallbacks: string[] = [];
  private placeholder = PLACEHOLDER;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnChanges(): void {
    const src = this.digimonImgFallback;
    this.placeholder = ALYSION_IMAGE.test(src ?? '') ? ALYSION_PLACEHOLDER : PLACEHOLDER;
    if (!src) {
      this.fallbacks = [];
      this.el.nativeElement.src = this.placeholder;
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
    if (element.src.endsWith(this.placeholder)) return;
    element.src = this.fallbacks.shift() ?? this.placeholder;
  }
}
