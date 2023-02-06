import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

export const ROOT_RESOURCE_URL: InjectionToken<string> = new InjectionToken<string>('Url to Root Resource');
export let HTTP_CLIENT: HttpClient;

@NgModule({
  imports: [HttpClientModule],
  providers: [{ provide: ROOT_RESOURCE_URL, useValue: '' }],
})
export class HalFormClientModule {
  constructor(private readonly http: HttpClient) {
    HTTP_CLIENT = this.http;
  }

  static forRoot(rootResourceUrl: string): ModuleWithProviders<HalFormClientModule> {
    return {
      providers: [{ provide: ROOT_RESOURCE_URL, useValue: rootResourceUrl }],
      ngModule: HalFormClientModule,
    };
  }
}
