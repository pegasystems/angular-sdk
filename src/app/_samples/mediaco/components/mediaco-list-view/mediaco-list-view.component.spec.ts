import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediacoListViewComponent } from './mediaco-list-view.component';

describe('MediacoListViewComponent', () => {
  let component: MediacoListViewComponent;
  let fixture: ComponentFixture<MediacoListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediacoListViewComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MediacoListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
