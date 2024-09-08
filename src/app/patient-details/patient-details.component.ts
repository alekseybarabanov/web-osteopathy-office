import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Patient } from '../patients';
import { PatientService } from '../patient.service';
import { MessageService } from '../message.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {

  patient: Patient | undefined;
  changes: Subject<void> = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private messageService: MessageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getPatient();

    this.changes.pipe(
      debounceTime(1000)
    ).subscribe(x =>  this.save() );
  }

  getPatient(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('patientId')!, 10);
    this.messageService.add(`details patient id: ${JSON.stringify(id)}`)
    this.patientService.getPatient(id)
      .subscribe(patient => {
        this.patient = patient
        this.messageService.add(`details patient: ${JSON.stringify(patient)}`);
      });
  }

  changed(): void {
      console.log("changed");
      this.changes.next(void 0)
  }

  newVisit(): void {
    this.patient!.currentVisit = {visitDate: new Date()}
  }

  dropVisit(): void {
    this.patient!.currentVisit = undefined
  }

  goBack(): void {
    this.save()
    this.router.navigate(['']);
  }

  save(): void {
    if (this.patient) {
      this.patientService.updatePatient(this.patient)
        .subscribe((patient) => { this.patient = patient });
    }
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/