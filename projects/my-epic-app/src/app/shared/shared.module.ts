import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../core/core.module';
import { TagListComponent } from './tag-list/tag-list.component';

@NgModule({
  declarations: [TagListComponent],
  imports: [
    // vendor
    CommonModule,
    RouterModule,

    // material
    MatCardModule,
    MatButtonModule,
  ],
  exports: [
    // vendor
    CoreModule,
    RouterModule,

    // material
    MatCardModule,
    MatButtonModule,

    // local
    TagListComponent,
  ],
})
export class SharedModule {}
