import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Patient, PatientImpl, patients } from './patients';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const patients = [new PatientImpl(
      'Михаил',
      "",
      "Иванов",
      "+77477777777",
      'анамнез Иванова',
      [{date: new Date(Date.parse("2024-04-30T12:00:00.000Z")), anamnesis: "что-то болит", complaints: ""},
      {date: new Date(Date.parse("2024-02-30T12:00:00.000Z")), anamnesis: "что-то болит давно", complaints: ""}],
      1
    ),new PatientImpl(
      'Александр',
      "",
      "Сидоров",
      "+11111",
      'анамнез Сидорова',
      [{date: new Date(Date.parse("2024-03-30T12:00:00.000Z")), anamnesis: "что-то болит", complaints: ""}],
      1
    )]
    return {patients};
  }

  genId(patients: Patient[]): number {
    return patients.length > 0 ? 2 : 11;
  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/