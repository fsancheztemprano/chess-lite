import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'iso3166' })
export class Iso3166Pipe implements PipeTransform {
  transform(locale: string): unknown {
    switch (locale) {
      case 'en':
        return 'gb';
      case 'es':
        return 'es';
      default:
        return 'en';
    }
  }
}
