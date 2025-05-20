import { Pipe, PipeTransform } from '@angular/core';
import { Filter } from 'bad-words';

@Pipe({
  name: 'obscenity',
  standalone: true,
})
export class ObscenityPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    let newVal: string = value;
    const filter = new Filter();

    newVal = filter.clean(value);

    return newVal;
  }

  replaceAll(text: string, str1: string, str2: string, ignore: boolean = false) {
    return text.replace(
      new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), ignore ? 'gi' : 'g'),
      typeof str2 == 'string' ? str2.replace(/\$/g, '$$$$') : str2,
    );
  }
}
