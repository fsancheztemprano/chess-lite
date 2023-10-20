import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { HalFormClientModule, ROOT_RESOURCE_URL } from './hal-form-client.module';

@NgModule({
  imports: [HalFormClientModule, HttpClientTestingModule],
  providers: [{ provide: ROOT_RESOURCE_URL, useValue: '' }],
})
export class HalFormClientTestingModule {
  static forRoot(rootResourceUrl = ''): ModuleWithProviders<HalFormClientModule> {
    return {
      providers: [{ provide: ROOT_RESOURCE_URL, useValue: rootResourceUrl }],
      ngModule: HalFormClientModule,
    };
  }
}
