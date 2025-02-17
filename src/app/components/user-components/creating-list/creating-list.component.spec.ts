import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatingListComponent } from './creating-list.component';

describe('CreatingListComponent', () => {
  let component: CreatingListComponent;
  let fixture: ComponentFixture<CreatingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreatingListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
