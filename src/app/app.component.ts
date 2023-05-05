import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';

interface Type {
  key: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  formGroup!: FormGroup;
  typeCtrl: FormControl = new FormControl();
  types: Type[] = [
    { key: 'food', title: 'Food', description: 'All types of food' },
    { key: 'fruit', title: 'Fruit', description: 'All types of fruit' },
    { key: 'football', title: 'Football', description: 'All types of football' },
    { key: 'footwear', title: 'Footwear', description: 'All types of footwear' },
    { key: 'foam', title: 'Foam', description: 'All types of foam' },
    { key: 'folklore', title: 'Folklore', description: 'All types of folklore' },
    { key: 'movies', title: 'Movies', description: 'All types of movies' },
    { key: 'music', title: 'Music', description: 'All types of music' },
    { key: 'books', title: 'Books', description: 'All types of books' },
    { key: 'sports', title: 'Sports', description: 'All types of sports' },
    { key: 'games', title: 'Games', description: 'All types of games' }
  ];
  filteredTypeOptions!: Observable<Type[]>;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      typeCtrl: ['', [Validators.required, this.validateType]]
    });
    this.setFilteredTypeOptions();
  }

  ngAfterViewInit(): void {
    this.trigger.panelClosingActions.subscribe(e => {
      if (!e?.source) {
        this.resetType();
        this.typeCtrl.setErrors({ invalid: true });
        this.trigger.closePanel();
      }
    });
  }

  private _filterTypes(value: string | Type): Type[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.title.toLowerCase();
    return this.types.filter(option => option.title.toLowerCase().includes(filterValue));
  }

  validateType(control: FormControl) {
    return control.value && control.value.title === '' && control.value.description === '' ? { invalid: true } : null;
  }

  setFilteredTypeOptions(): void {
    this.filteredTypeOptions = this.formGroup.controls['typeCtrl'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterTypes(value))
    );
  }

  typeValidator(types: Type[]): Validators {
    return (control: FormControl) => {
      const selectedType = control.value as Type;
      const isValid = types.some(type => type.key === selectedType.key && type.title === selectedType.title && type.description === selectedType.description);
      return isValid ? null : { invalidType: { value: control.value } };
    };
  }

  resetType(): void {
    this.formGroup.controls['typeCtrl'].setValue({ key: '', title: '', description: '' });
  }

  onTypeChange(): void {
    this.typeCtrl.setErrors(null);
  }

  getOptionTitle(option: Type): string {
    return option.title;
  }
}