import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientVisitComponent } from './patient-visit/patient-visit.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';

import { AppRoutingModule } from './app-routing.module';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { EstimationPointsComponent } from './estimation-points/estimation-points.component'

import { MessagesComponent } from './messages/messages.component';

@NgModule({
  imports: [
    AppRoutingModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
     // The HttpClientInMemoryWebApiModule module intercepts HTTP requests
    // and returns simulated server responses.
    // Remove it when a real server is ready to receive requests.
    HttpClientInMemoryWebApiModule.forRoot(
      InMemoryDataService, { dataEncapsulation: false }
    )
 ],
  declarations: [
    AppComponent,
    TopBarComponent,
    PatientDetailsComponent,
    PatientSearchComponent,
    MessagesComponent,
    PatientVisitComponent,
    NewPatientComponent,
    PatientHistoryComponent,
    EstimationPointsComponent,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/