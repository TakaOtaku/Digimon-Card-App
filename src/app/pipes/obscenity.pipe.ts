declare var require: any;
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'obscenity',
  standalone: true,
})
export class ObscenityPipe implements PipeTransform {
  public readonly obscenities = require('badwords-list');

  transform(value: any, ...args: any[]): any {
    let newVal: string = value;
    const grawlix: string = '@#$%&!';

    this.obscenities.array.forEach((curse: any) => {
      newVal = this.replaceAll(newVal, curse, grawlix);
    });

    return newVal;
  }

  replaceAll(text: string, str1: string, str2: string, ignore: boolean = false) {
    return text.replace(
      new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, '\\$&'), ignore ? 'gi' : 'g'),
      typeof str2 == 'string' ? str2.replace(/\$/g, '$$$$') : str2
    );
  }
}
