import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Patient, PatientImpl } from '../patients';
import { PatientService } from '../patient.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.css']
})
export class NewPatientComponent implements OnInit {

  patient: Patient | undefined

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPatient();
  }

  getPatient(): void {
    const name = this.route.snapshot.paramMap.get('name')!;
    var nameArr = name.split(/\s+/,3)
    var firstName = '', lastName = '', middleName = ''
    if (nameArr.length > 0) {
        lastName = nameArr[0]
    }
    if (nameArr.length > 1) {
        firstName = nameArr[1]
    }
    if (nameArr.length > 2) {
        middleName = nameArr[2]
    }
    this.patient = new PatientImpl(
      lastName,
      firstName,
      middleName,
    )
    this.messageService.add(`details patient name: ${JSON.stringify(name)}`)
  
  }

  goBack(): void {
    this.router.navigate(['']);
  }

  save(): void {
    if (this.patient) {
      this.patientService.addPatient(this.patient)
        .subscribe(savedPatient => {
            this.patient = savedPatient
            this.router.navigate(['/patients/'+savedPatient.id!])
        });
    }
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/