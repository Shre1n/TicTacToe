import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPasswordChangeComponent } from './player-password-change.component';

describe('PlayerPasswordChangeComponent', () => {
  let component: PlayerPasswordChangeComponent;
  let fixture: ComponentFixture<PlayerPasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerPasswordChangeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
