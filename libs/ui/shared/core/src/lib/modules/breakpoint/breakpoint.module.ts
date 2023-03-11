import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreakpointDirective } from './directives/breakpoint.directive';
import { IfIsLDirective } from './directives/if-is-l.directive';
import { IfIsMDirective } from './directives/if-is-m.directive';
import { IfIsXlDirective } from './directives/if-is-xl.directive';
import { IfIsXsDirective } from './directives/if-is-xs.directive';
import { IfOverLDirective } from './directives/if-over-l.directive';
import { IfOverMDirective } from './directives/if-over-m.directive';
import { IfOverSDirective } from './directives/if-over-s.directive';
import { BreakpointService } from './services/breakpoint.service';

@NgModule({
  imports: [
    CommonModule,
    BreakpointDirective,
    IfIsLDirective,
    IfIsMDirective,
    IfIsXlDirective,
    IfIsXsDirective,
    IfIsXsDirective,
    IfOverSDirective,
    IfOverMDirective,
    IfOverLDirective,
  ],
  providers: [BreakpointService],
})
export class BreakpointModule {}
