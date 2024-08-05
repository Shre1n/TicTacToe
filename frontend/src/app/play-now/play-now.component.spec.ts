import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayNowComponent } from './play-now.component';

describe('PlayNowComponent', () => {
  let component: PlayNowComponent;
  let fixture: ComponentFixture<PlayNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayNowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
