import { Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Patient, Visit } from '../patients';
import { PatientService } from '../patient.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-patient-visit',
  templateUrl: './patient-visit.component.html',
  styleUrls: ['./patient-visit.component.css']
})
export class PatientVisitComponent {

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private location: Location,
    private messageService: MessageService,
  ) { }

  @Input() patient!: Patient;
  @Input() visit!: Visit;
  
  public onGlobalBio(event: number | undefined): void {
    //do something on the parent with the data
    this.visit.globBio = event
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/