import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { PatientVisitComponent } from './patient-visit/patient-visit.component';

import { AppRoutingModule } from './app-routing.module';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { NewPatientComponent } from './new-patient/new-patient.component';
import { PatientHistoryComponent } from './patient-history/patient-history.component';
import { EstimationPointsComponent } from './estimation-points/estimation-points.component'
import { LatestPatientsComponent } from './latest-patients/latest-patients.component'
import { GoogleCalendarComponent } from './google-calendar/google-calendar.component'
import { DatePipe } from '@angular/common';

import { MessagesComponent } from './messages/messages.component';
import { HostnameService } from './hostname.service';
import { WINDOW_PROVIDERS } from './window.providers';

@NgModule({ declarations: [
        AppComponent,
        TopBarComponent,
        PatientDetailsComponent,
        PatientSearchComponent,
        MessagesComponent,
        PatientVisitComponent,
        NewPatientComponent,
        PatientHistoryComponent,
        EstimationPointsComponent,
        LatestPatientsComponent,
        GoogleCalendarComponent,
    ],
    bootstrap: [
        AppComponent
    ], imports: [AppRoutingModule,
        FormsModule,
        BrowserModule], providers: [DatePipe, WINDOW_PROVIDERS, HostnameService, provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/
