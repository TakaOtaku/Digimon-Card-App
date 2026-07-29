import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtmlPipe } from './SafeHtml.pipe';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = new SafeHtmlPipe(TestBed.inject(DomSanitizer));
  });

  it('returns trusted HTML', () => {
    const result = pipe.transform('<b>hello</b>');
    expect(result).toBeTruthy();
  });
});
