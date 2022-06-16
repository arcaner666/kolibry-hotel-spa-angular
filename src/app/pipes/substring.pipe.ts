import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'substring'
})
export class SubstringPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return `${value.substring(0, 15)}... `;
  }

}
