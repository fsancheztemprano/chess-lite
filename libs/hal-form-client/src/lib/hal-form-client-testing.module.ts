import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ROOT_RESOURCE_URL } from './hal-form-client.module';
import { stubHalFormServiceProvider } from './service/hal-form.service.stub';

@NgModule({
  declarations: [],
  imports: [HttpClientTestingModule],
  providers: [stubHalFormServiceProvider],
})
export class HalFormClientTestingModule {
  static forRoot(root_resource_url: string): ModuleWithProviders<HalFormClientTestingModule> {
    return {
      providers: [{ provide: ROOT_RESOURCE_URL, useValue: root_resource_url }],
      ngModule: HalFormClientTestingModule,
    };
  }
}
