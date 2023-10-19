import { enableProdMode, isDevMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableElfProdMode } from '@ngneat/elf';
import { devTools } from '@ngneat/elf-devtools';
import { AppModule } from './app/app.module';

if (!isDevMode()) {
  enableProdMode();
  enableElfProdMode();
} else {
  devTools();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
