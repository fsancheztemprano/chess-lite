import { Component } from '@angular/core';

@Component({
  selector: 'chess-lite-dummy',
  template: `
    <p>dummy works!</p>
    <button (click)="throw()">THROW</button>
  `,
  styles: [],
})
export class DummyComponent {
  throw() {
    throw new Error('ERRRR');
  }
}
