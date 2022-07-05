import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RouteUpButtonComponent } from './route-up-button.component';

@Component({
  selector: 'app-route-up-button',
  template: '',
})
export class StubRouteUpButtonComponent implements Partial<RouteUpButtonComponent> {
  @Input() icon = 'keyboard_return';
  @Input() iconScaleY = -1;
  @Input() navigationLink?: string;

  get navigationLink$(): Observable<string> {
    return of(this.navigationLink || '');
  }
}
