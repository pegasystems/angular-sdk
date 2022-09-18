import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTableManualComponent } from './simple-table-manual.component';

describe('SimpleTableManualComponent', () => {
  let component: SimpleTableManualComponent;
  let fixture: ComponentFixture<SimpleTableManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTableManualComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTableManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
