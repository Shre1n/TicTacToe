import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastMenuComponent } from './toast-menu.component';

describe('ToastMenuComponent', () => {
  let component: ToastMenuComponent;
  let fixture: ComponentFixture<ToastMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
