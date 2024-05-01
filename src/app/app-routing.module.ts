import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { NewPatientComponent } from './new-patient/new-patient.component';

const routes: Routes = [
  { path: '', component: PatientSearchComponent },
  { path: 'patients/:patientId', component: PatientDetailsComponent },
  { path: 'newpatient/:name', component: NewPatientComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/