import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  DialogOutput,
  FormArrDialogComponent,
} from './form-arr-dialog/form-arr-dialog.component';
import { Type, types } from './types';
import { typeValidator } from './utils/type.validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  formGroup!: FormGroup;
  typeCtrl: FormControl = new FormControl();
  filteredTypeOptions!: Observable<Type[]>;

  constructor(private formBuilder: FormBuilder, private matDialog: MatDialog) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      typeCtrl: ['', [Validators.required, typeValidator(types)]],
    });
    this.setFilteredTypeOptions();
  }

  ngAfterViewInit(): void {
    this.trigger.panelClosingActions.subscribe((e) => {
      if (!e?.source) {
        this.resetType();
        this.typeCtrl.setErrors({ invalid: true });
        this.trigger.closePanel();
      }
    });
  }

  private _filterTypes(value: string | Type): Type[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value.title.toLowerCase();
    return types.filter((option) =>
      option.title.toLowerCase().includes(filterValue)
    );
  }

  setFilteredTypeOptions(): void {
    this.filteredTypeOptions = this.formGroup.controls[
      'typeCtrl'
    ].valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTypes(value))
    );
  }

  resetType(): void {
    this.formGroup.controls['typeCtrl'].setValue({
      key: '',
      title: '',
      description: '',
    });
  }

  onTypeChange(): void {
    this.typeCtrl.setErrors(null);
  }

  getOptionTitle(option: Type): string {
    return option.title;
  }

  openFormArrDialog(): void {
    const dialogRef = this.matDialog.open(FormArrDialogComponent, {
      disableClose: true,
      width: '500px',
      maxHeight: '90vh',
    });
    dialogRef.afterClosed().subscribe((dialogOutput: DialogOutput) => {
      if (dialogOutput?.action === 'confirm') {
        console.log(
          '[type-create-requests]' +
            JSON.stringify(dialogOutput.typeCreateRequests)
        );
      }
    });
  }
}
