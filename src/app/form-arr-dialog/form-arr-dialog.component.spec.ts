import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormArrDialogComponent } from './form-arr-dialog.component';

describe('LinkCreateDialogComponent', () => {
  let component: FormArrDialogComponent;
  let fixture: ComponentFixture<FormArrDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormArrDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormArrDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
