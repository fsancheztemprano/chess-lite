import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.scss'],
})
export class FormErrorComponent {
  @Input() control: AbstractControl = new FormControl();
  @Input() name = '';
}

@NgModule({
  imports: [CommonModule],
  declarations: [FormErrorComponent],
  exports: [FormErrorComponent],
})
export class FormErrorModule {}
