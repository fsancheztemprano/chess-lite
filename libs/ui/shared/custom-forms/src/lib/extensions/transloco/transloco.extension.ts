import { NgModule } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FORMLY_CONFIG, FormlyExtension, FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs';

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
      'props.label': this.transloco.selectTranslate(props.label || '', props.translateParams),
    };
    if (props.translateOptions) {
      field.expressions = {
        ...(field.expressions || {}),
        'props.options': this.transloco.selectTranslateObject(props.translateOptions).pipe(
          map((translations) =>
            Array.isArray(props.options)
              ? props.options?.map((option) => ({
                  ...option,
                  label: translations[option.label] || option.label,
                }))
              : undefined,
          ),
        ),
      };
    }
  }
}

export function registerTranslocoExtension(transloco: TranslocoService) {
  return {
    validationMessages: [
      {
        name: 'required',
        message() {
          return transloco.selectTranslate('form.validation.required');
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
