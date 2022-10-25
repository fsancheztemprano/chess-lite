import { HttpClientModule } from '@angular/common/http';
import { InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core';

export const ROOT_RESOURCE_URL: InjectionToken<string> = new InjectionToken<string>('Url to Root Resource');
export let INJECTOR_INSTANCE: Injector;

@NgModule({
  imports: [HttpClientModule],
  providers: [{ provide: ROOT_RESOURCE_URL, useValue: '' }],
})
export class HalFormClientModule {
  constructor(private readonly injector: Injector) {
    INJECTOR_INSTANCE = this.injector;
  }

  static forRoot(rootResourceUrl: string): ModuleWithProviders<HalFormClientModule> {
    return {
      providers: [{ provide: ROOT_RESOURCE_URL, useValue: rootResourceUrl }],
      ngModule: HalFormClientModule,
    };
  }
}
