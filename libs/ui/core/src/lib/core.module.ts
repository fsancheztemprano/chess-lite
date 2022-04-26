import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsMobileModule } from '@app/ui/shared/core';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { scopeLoader } from '../../../../../tools/transloco/transloco.scope';
import { CoreComponent } from './components/core/core.component';
import { CoreRoutingModule } from './core-routing.module';
import { CardViewModule } from './modules/card-view/card-view.module';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { ToolbarModule } from './modules/toolbar/toolbar.module';
import { LocalizationEffects } from './store/effects/localization.effects';
import { ThemeEffects } from './store/effects/theme.effects';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    IsMobileModule,
    CardViewModule,
    ToolbarModule,
    SidenavModule,
    EffectsNgModule.forFeature([LocalizationEffects, ThemeEffects]),
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'core',
        loader: scopeLoader((lang: string, root: string) => import(`../${root}/${lang}.json`)),
      },
    },
  ],
})
export class CoreModule {}
