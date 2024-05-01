import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Patient } from '../patients';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: [ './patient-search.component.css' ]
})
export class PatientSearchComponent implements OnInit {
  patients$!: Observable<Patient[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private patientService: PatientService,
    private router: Router) {}
  
  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.router.navigate(['/newpatient/'+name]);
  }

  name(item: Patient): string {
    return item.firstName + " " + item.middleName + " " + item.lastName;
  }

  ngOnInit(): void {

    this.patients$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.patientService.searchPatients(term)),
    );
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/