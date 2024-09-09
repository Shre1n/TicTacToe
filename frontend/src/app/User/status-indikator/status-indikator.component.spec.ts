import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusIndikatorComponent } from './status-indikator.component';

describe('StatusIndikatorComponent', () => {
  let component: StatusIndikatorComponent;
  let fixture: ComponentFixture<StatusIndikatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusIndikatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusIndikatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
