import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { BaiduMapComponent } from './baidu-map/baidu-map.component';
import { WaterQualityComponent } from './water-quality/water-quality.component';
import { MaterialModule } from './material.module';
import { PortDialogComponent } from './dialog/port-dialog/port-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [MainComponent, BaiduMapComponent, WaterQualityComponent, PortDialogComponent],
  entryComponents: [PortDialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule
  ],
  exports: []
})
export class ComponentsModule { }
