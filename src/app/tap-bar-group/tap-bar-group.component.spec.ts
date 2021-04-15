import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapBarGroupComponent } from './tap-bar-group.component';

describe('TapBarGroupComponent', () => {
  let component: TapBarGroupComponent;
  let fixture: ComponentFixture<TapBarGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TapBarGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TapBarGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
