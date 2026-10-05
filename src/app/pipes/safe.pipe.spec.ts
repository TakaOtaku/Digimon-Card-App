import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { SafePipe } from './safe.pipe';

describe('SafePipe', () => {
  let pipe: SafePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    pipe = new SafePipe(TestBed.inject(DomSanitizer));
  });

  it('returns a trusted resource URL', () => {
    const result = pipe.transform('https://www.youtube.com/embed/abc');
    expect(result).toBeTruthy();
  });
});
