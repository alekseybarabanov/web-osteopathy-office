export interface Patient {
  id?: number;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  birthDate: string;
  description: string;
  currentVisit?: Visit;
  visits: Visit[];
}

export interface Visit {
  id?: number;
  visitDate: Date;
  complaints?: string;
  anamnesis?: string;
  globBio?: number;
  globRithmKarnial?: number;
  globRithmKardio?: number;
  globRightBreath?: number;
  globNeiroPsihosomat?: number;
  globNeiroPostural?: number;
  regionHeadStruct?: number;
  regionNeckStruct?: number;
  regionNeckVistz?: number;
  regionHandsStruct?: number;
  regionBrestStruct?: number;
  regionBrestVistz?: number;
  regionLowerBackStruct?: number;
  regionLowerBackVistz?: number;
  regionPelvicStruct?: number;
  regionPelvicVistz?: number;
  regionLegsStruct?: number;
  regionDuraMaterStruct?: number;
  regionCr?: number;
  regionC1C3Vistz?: number;
  regionC1C3Som?: number;
  regionC4C6Vistz?: number;
  regionC4C6Som?: number;
  regionC7Th1Vistz?: number;
  regionC7Th1Som?: number;
  regionTh2Th5Vistz?: number;
  regionTh2Th5Som?: number;
  regionTh6Th9Vistz?: number;
  regionTh6Th9Som?: number;
  regionTh10L1Vistz?: number;
  regionTh10L1Som?: number;
  regionL2L5Vistz?: number;
  regionL2L5Som?: number;
  localDisfunction?: string;
  dominant?: string;
  treatmentPlan?: string;
  recommendations?: string;
  specialists?: string[];
}

export class PatientImpl implements Patient {
    phone = ''
    description = ''
    birthDate = ''
    visits = []
    id = undefined
  constructor(
    public lastName: string,
    public firstName: string,
    public middleName: string
   )
    {
    }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/