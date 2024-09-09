import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesInfoComponent } from './games-info.component';

describe('GamesInfoComponent', () => {
  let component: GamesInfoComponent;
  let fixture: ComponentFixture<GamesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
