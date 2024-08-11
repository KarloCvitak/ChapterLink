import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleDashboardComponent } from './user-role-dashboard.component';

describe('UserRoleDashboardComponent', () => {
  let component: UserRoleDashboardComponent;
  let fixture: ComponentFixture<UserRoleDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserRoleDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserRoleDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
