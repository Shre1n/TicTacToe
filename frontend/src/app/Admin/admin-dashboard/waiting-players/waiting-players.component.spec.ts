import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingPlayersComponent } from './waiting-players.component';

describe('WaitingPlayersComponent', () => {
  let component: WaitingPlayersComponent;
  let fixture: ComponentFixture<WaitingPlayersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingPlayersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
