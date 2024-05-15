import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Patient, PatientImpl } from '../patients';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-latest-patients',
  templateUrl: './latest-patients.component.html',
  styleUrls: ['./latest-patients.component.css']
})

export class LatestPatientsComponent implements OnInit {
  patients$!: Observable<Patient[]>;
  private searchTerms = new Subject<string>();
  selectedPatient?: Patient;

  constructor(
      private patientService: PatientService,
      private router: Router
  ) { }

  ngOnInit(): void {
    this.patients$ = this.patientService.getLatest()
  }

  name(item: Patient): string {
    return item.firstName + " " + item.middleName + " " + item.lastName;
  }

  onSelect(patient: Patient): void {
    this.selectedPatient = patient;
    this.router.navigate(['/patients/'+patient.id!])
  }
}