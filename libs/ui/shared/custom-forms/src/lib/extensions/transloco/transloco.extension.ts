import { NgModule } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FORMLY_CONFIG, FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';

export class TranslocoExtension implements FormlyExtension {
  constructor(private readonly transloco: TranslocoService) {}

  prePopulate(field: FormlyFieldConfig) {
    const props = field.props || {};
    if (!props.translate || props._translated) {
      return;
    }

    props._translated = true;
    field.expressions = {
      ...(field.expressions || {}),
      'props.label': this.transloco.selectTranslate(props.label || ''),
    };
  }
}

export function registerTranslocoExtension(transloco: TranslocoService) {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return transloco.selectTranslate('FORM.VALIDATION.REQUIRED');
        },
      },
    ],
    extensions: [
      {
        name: 'transloco',
        extension: new TranslocoExtension(transloco),
      },
    ],
  };
}

@NgModule({
  providers: [
    { provide: FORMLY_CONFIG, multi: true, useFactory: registerTranslocoExtension, deps: [TranslocoService] },
  ],
})
export class FormlyTranslocoModule {}
