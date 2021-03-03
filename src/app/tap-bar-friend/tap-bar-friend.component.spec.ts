import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TapBarFriendComponent } from './tap-bar-friend.component';

describe('TapBarFriendComponent', () => {
  let component: TapBarFriendComponent;
  let fixture: ComponentFixture<TapBarFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TapBarFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TapBarFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
