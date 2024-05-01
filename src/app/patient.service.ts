import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, zip } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Patient } from './patients';
import { MessageService } from './message.service';


@Injectable({ providedIn: 'root' })
export class PatientService {

  private patientUrl = 'api/patients';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** GET patients from the server */
  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.patientUrl)
      .pipe(
        tap(x => this.log('fetched', x)),
        catchError(this.handleError<Patient[]>('getPatients', []))
      );
  }

  /** GET patient by id. Return `undefined` when id not found */
  getPatientNo404<Data>(id: number): Observable<Patient> {
    const url = `${this.patientUrl}/?id=${id}`;
    return this.http.get<Patient[]>(url)
      .pipe(
        map(patients => patients[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
          this.log(`${outcome} patient id=${id}`, h);
        }),
        catchError(this.handleError<Patient>(`get patient id=${id}`))
      );
  }

  /** GET patient by id. Will 404 if id not found */
  getPatient(id: number): Observable<Patient> {
    const url = `${this.patientUrl}/${id}`;
    return this.http.get<Patient>(url).pipe(
      tap(x => this.log(`fetched patient id=${id}`, x)),
      catchError(this.handleError<Patient>(`getPatient id=${id}`))
    );
  }

  /* GET patients whose name contains search term */
  searchPatients(term: string): Observable<Patient[]> {
    if (!term.trim()) {
      // if not search term, return empty patient array.
      return of([]);
    }
    var fn = this.http.get<Patient[]>(`${this.patientUrl}/?firstName=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found patients matching "${term}"`,x) :
         this.log(`no patients matching "${term}"`,x)),
      catchError(this.handleError<Patient[]>('searchPatients', []))
    );
    var ln = this.http.get<Patient[]>(`${this.patientUrl}/?lastName=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found patients matching "${term}"`,x) :
         this.log(`no patients matching "${term}"`,x)),
      catchError(this.handleError<Patient[]>('searchPatients', []))
    );
    var mn = this.http.get<Patient[]>(`${this.patientUrl}/?middleName=${term}`).pipe(
      tap(x => x.length ?
         this.log(`found patients matching "${term}"`,x) :
         this.log(`no patients matching "${term}"`,x)),
      catchError(this.handleError<Patient[]>('searchPatients', []))
    );

    return zip(ln, fn, mn)
    .pipe(map(x => x[0].concat(x[1])))
  }

  //////// Save methods //////////

  /** POST: add a new patient to the server */
  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.patientUrl, patient, this.httpOptions).pipe(
      tap((newPatient: Patient) => this.log(`added patient w/ id=${newPatient.id}`, newPatient)),
      catchError(this.handleError<Patient>('add patient'))
    );
  }

  /** DELETE: delete the patient from the server */
  deletePatient(id: number): Observable<Patient> {
    const url = `${this.patientUrl}/${id}`;

    return this.http.delete<Patient>(url, this.httpOptions).pipe(
      tap(x => this.log(`deleted patient id=${id}`, x)),
      catchError(this.handleError<Patient>('delete patient'))
    );
  }

  /** PUT: update the patient on the server */
  updatePatient(patient: Patient): Observable<any> {
    return this.http.put(this.patientUrl, patient, this.httpOptions).pipe(
      tap(x => this.log(`updated patient id=${patient.id}`, x)),
      catchError(this.handleError<any>('update patient'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed`,error);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a PatientsService message with the MessageService */
  private log(message: string, x: any) {
    this.messageService.add(`PatientsService: ${message}, ${JSON.stringify(x)}`);
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/