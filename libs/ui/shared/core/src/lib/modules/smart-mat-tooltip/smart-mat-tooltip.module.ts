import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SmartMatTooltipDirective } from './smart-mat-tooltip.directive';

@NgModule({
  imports: [CommonModule, MatTooltipModule],
  declarations: [SmartMatTooltipDirective],
  exports: [SmartMatTooltipDirective],
})
export class SmartMatTooltipModule {}
