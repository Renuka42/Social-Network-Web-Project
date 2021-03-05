import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProFriendsComponent } from './pro-friends.component';

describe('ProFriendsComponent', () => {
  let component: ProFriendsComponent;
  let fixture: ComponentFixture<ProFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProFriendsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
