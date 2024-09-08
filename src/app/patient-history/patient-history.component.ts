import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Patient } from '../patients';
import { PatientService } from '../patient.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-patient-history',
  templateUrl: './patient-history.component.html',
  styleUrls: ['./patient-history.component.css']
})
export class PatientHistoryComponent {

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private location: Location,
    private messageService: MessageService,
  ) { }

  @Input() patient!: Patient;
  @Output() changed = new EventEmitter<void>();

  selected: number = -1
  
  onChangeofOptions(newGov: any) {
    console.log(newGov);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/