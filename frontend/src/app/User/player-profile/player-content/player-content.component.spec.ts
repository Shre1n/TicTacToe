import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerContentComponent } from './player-content.component';

describe('PlayerContentComponent', () => {
  let component: PlayerContentComponent;
  let fixture: ComponentFixture<PlayerContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerContentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
