import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { Type, types } from '../types';
import { typeValidator } from '../utils/type.validators';

@Component({
  selector: 'app-form-arr-dialog',
  templateUrl: './form-arr-dialog.component.html',
  styleUrls: ['./form-arr-dialog.component.scss'],
})
export class FormArrDialogComponent implements OnInit, OnDestroy {
  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  private readonly destroy$ = new Subject<void>();
  filteredTypeOptions!: Observable<Type[]>;

  private filterTypes(value: string | Type): Type[] {
    if (typeof value === 'string') {
      return this._filterTypes(value);
    } else {
      return this._filterTypes(value.title);
    }
  }

  private _filterTypes(type: string): Type[] {
    let filterValue = '';
    if (!!type) {
      filterValue = type.toLowerCase();
    }
    return types.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  fg: FormGroup = new FormGroup({});
  typeCreate: Type = new Type('', '', '');
  currentPanelIndex: number = 0;
  currentControl = this.typeGroups()?.at(this.currentPanelIndex);
  typeControl = this.currentControl?.get('type');
  isTitleSelected: boolean = false;
  tooltipText: string = 'Check console log after create';

  constructor(
    public dialogRef: MatDialogRef<FormArrDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.setFilteredTypeOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setFilteredTypeOptions(): void {
    this.filteredTypeOptions = this.typeGroups()
      .at(this.currentPanelIndex)
      .get('type')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        startWith(''),
        map((value: string | Type) => this.filterTypes(value))
      );
  }

  initializeForm(): void {
    this.fg = this.formBuilder.group({
      typeGroups: this.formBuilder.array([]),
    });
    this.addType();
  }

  typeGroups(): FormArray {
    return this.fg.get('typeGroups') as FormArray;
  }

  newType(): FormGroup {
    return this.formBuilder.group({
      type: [new Type('', '', ''), [Validators.required, typeValidator(types)]],
    });
  }

  resetType(): void {
    this.typeGroups()
      ?.at(this.currentPanelIndex)
      .get('type')
      .reset(new Type('', '', ''));
    this.isTitleSelected = false;
  }

  addType(): void {
    this.typeGroups().push(this.newType());
  }

  removeTypeAt(index: number): void {
    this.typeGroups().removeAt(index);
    this.currentPanelIndex--;
  }

  onTypeChange() {
    this.typeGroups().at(this.currentPanelIndex).get('type').setErrors(null);
    this.typeGroups()
      .at(this.currentPanelIndex)
      .get('type')
      .setValidators([Validators.required, typeValidator(types).bind(this)]);
    this.isTitleSelected = true;
  }

  getOptionText(option: Type) {
    return option.title;
  }

  onCancelClick(): void {
    const output: DialogOutput = {
      action: 'cancel',
    };
    this.dialogRef.close(output);
  }

  onCreateClick(): void {
    const typeCreateRequests: Type[] = this.typeGroups().value;
    const output: DialogOutput = {
      action: 'confirm',
      typeCreateRequests: typeCreateRequests,
    };
    this.dialogRef.close(output);
  }

  onPanelOpen(idx: number) {
    this.currentPanelIndex = idx;
    this.setFilteredTypeOptions();

    // for close icon to clear input value
    this.isTitleSelected = !!this.typeGroups()
      .at(this.currentPanelIndex)
      .get('type').value.title;

    // this demo doesn't require patch; but some cases of form arr, patch is needed
    this.typeGroups()
      .at(this.currentPanelIndex)
      .get('type')
      .patchValue(
        this.typeGroups().at(this.currentPanelIndex).get('type').value,
        {
          emitEvent: true,
        }
      );
  }
}

export interface DialogOutput {
  action: 'confirm' | 'cancel';
  typeCreateRequests?: Type[];
}
