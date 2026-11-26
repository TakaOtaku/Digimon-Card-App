import { ElementRef } from '@angular/core';
import { ImgFallbackDirective } from './ImgFallback.directive';

/** Loads `src` and fails every attempt, returning the address the image ends on. */
function failAll(src: string): string {
  const element = document.createElement('img');
  const directive = new ImgFallbackDirective(new ElementRef(element));
  directive.digimonImgFallback = src;
  directive.ngOnChanges();
  for (let i = 0; i < 6; i++) directive.loadFallbackOnError();
  return element.getAttribute('src')!;
}

describe('ImgFallbackDirective', () => {
  const cdn = 'https://cdn.example/';

  it.each(['BD01-01.webp', 'ED02-01_P1.webp', 'SD02-07-J.webp', 'BD04-03-Sample.webp'])('ends on the Alysion back for %s', (file) => {
    expect(failAll(cdn + file)).toBe('assets/images/alysion_card_placeholder.png');
  });

  it.each(['BT1-010.webp', 'ST25-01.webp', 'EX1-001.webp'])('keeps the normal placeholder for %s', (file) => {
    expect(failAll(cdn + file)).toBe('assets/images/card_placeholder.png');
  });

  it('shows the normal placeholder without an image address', () => {
    expect(failAll('')).toBe('assets/images/card_placeholder.png');
  });
});
