import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormErrorComponent } from './components/form-error.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FormErrorComponent],
  exports: [FormErrorComponent],
})
export class FormErrorModule {}
