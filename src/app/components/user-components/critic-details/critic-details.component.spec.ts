import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticDetailsComponent } from './critic-details.component';

describe('ReviewDetailsComponent', () => {
  let component: CriticDetailsComponent;
  let fixture: ComponentFixture<CriticDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CriticDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriticDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
