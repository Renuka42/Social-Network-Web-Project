import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoseGroupComponent } from './pose-group.component';

describe('PoseGroupComponent', () => {
  let component: PoseGroupComponent;
  let fixture: ComponentFixture<PoseGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoseGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoseGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
