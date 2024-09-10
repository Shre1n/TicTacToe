import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastMessageSavingComponent } from './toast-message-saving.component';

describe('ToastMessageSavingComponent', () => {
  let component: ToastMessageSavingComponent;
  let fixture: ComponentFixture<ToastMessageSavingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastMessageSavingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastMessageSavingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
