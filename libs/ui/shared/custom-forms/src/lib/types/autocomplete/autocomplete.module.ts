import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMatFormFieldModule } from '@ngx-formly/material/form-field';
import { FormlyFieldAutocomplete } from './autocomplete.type';

@NgModule({
  declarations: [FormlyFieldAutocomplete],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FormlyMatFormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'autocomplete',
          component: FormlyFieldAutocomplete,
          wrappers: ['form-field'],
        },
      ],
    }),
  ],
})
export class FormlyMatAutocompleteModule {}
