import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FileUtilityComponent } from './file-utility.component';

describe('FileUtilityComponent', () => {
  let component: FileUtilityComponent;
  let fixture: ComponentFixture<FileUtilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FileUtilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUtilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
