import { Component, OnInit, Input, Output, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Patient, Visit } from '../patients';
import { PatientService } from '../patient.service';
import { MessageService } from '../message.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-patient-visit',
    templateUrl: './patient-visit.component.html',
    styleUrls: ['./patient-visit.component.css'],
    standalone: false
})
export class PatientVisitComponent implements OnInit, AfterViewInit {

  constructor(
    private route: ActivatedRoute,
    private patientService: PatientService,
    private location: Location,
    private messageService: MessageService,
    private datePipe: DatePipe,
  ) { }

  @Input() patient!: Patient;
  @Input() visit!: Visit;
  @Output() changed = new EventEmitter<void>();

  visitDate!: String

  ngOnInit(): void {
      this.visitDate = this.datePipe.transform(this.visit.visitDate,'dd.MM.yy HH:mm')!!
  }

  ngAfterViewInit(): void {
      setTimeout(() => {
        var el = document.getElementById("patient-visit-complaints");
        el!.style.height = 'auto';
        el!.style.height = (el!.scrollHeight) + "px";

        var el = document.getElementById("patient-visit-anamnesis");
        el!.style.height = 'auto';
        el!.style.height = (el!.scrollHeight) + "px";
      }, 200)
  }

  public onVisitDate(event: string): void {
    try {
        var parts = event.split(' ');
        var fp = parts[0].split('.');
        var sp = parts[1].split(':');
        var dt = new Date(2000 + +fp[2], +fp[1]-1, +fp[0], +sp[0],+sp[1]);
        if (dt != null) {
            this.visit.visitDate = dt
            console.log(dt)
            this.visitDate = event
        }
    } catch (err) {
        console.log(err)
    }
  }
  
  neckStructItems = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7'];

  isNeckStructSelected(item: string): boolean {
    if (!this.visit.regionNeckStructDetails) return false;
    return this.visit.regionNeckStructDetails.split(',').includes(item);
  }

  toggleNeckStruct(item: string): void {
    const current = this.visit.regionNeckStructDetails
      ? this.visit.regionNeckStructDetails.split(',').filter(s => s)
      : [];
    const idx = current.indexOf(item);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(item);
    }
    this.visit.regionNeckStructDetails = current.length > 0 ? current.join(',') : undefined;
    this.changed.emit();
  }

  public onGlobalBio(event: number | undefined): void {
    //do something on the parent with the data
    this.visit.globBio = event
  }

}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/