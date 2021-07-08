import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core';

export const ROOT_RESOURCE_URL = new InjectionToken<string>('Url to Root Resource');
export let InjectorInstance: Injector;

@NgModule({
  imports: [HttpClientModule],
})
export class HalFormClientModule {
  constructor(private readonly injector: Injector) {
    InjectorInstance = this.injector;
  }

  static forRoot(root_resource_url: string): ModuleWithProviders<HalFormClientModule> {
    return {
      providers: [{ provide: ROOT_RESOURCE_URL, useValue: root_resource_url }],
      ngModule: HalFormClientModule,
    };
  }
}
