import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IsMobileModule } from '@app/ui/shared';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { scopeLoader } from '../../../../../tools/transloco/transloco.scope';
import { CoreComponent } from './components/core/core.component';
import { CoreRoutingModule } from './core-routing.module';
import { CardViewModule } from './modules/card-view/card-view.module';
import { ContextMenuModule } from './modules/context-menu/context-menu.module';
import { SidenavModule } from './modules/sidenav/sidenav.module';
import { ToolbarModule } from './modules/toolbar/toolbar.module';
import { SessionEffects } from './store/effects/session.effects';

@NgModule({
  declarations: [CoreComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    IsMobileModule,
    CardViewModule,
    ContextMenuModule,
    ToolbarModule,
    SidenavModule,
    EffectsNgModule.forFeature([SessionEffects]),
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
