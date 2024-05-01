import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Visit } from '../patients';

@Component({
  selector: 'app-estimation-points',
  templateUrl: './estimation-points.component.html',
  styleUrls: ['./estimation-points.component.css']
})
export class EstimationPointsComponent {


  @Input() selected?: number;
  @Output() changeEmitter = new EventEmitter<number | undefined>();

  
  onChange(value: number | undefined) {
    this.selected = value
    this.changeEmitter.emit(value);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/