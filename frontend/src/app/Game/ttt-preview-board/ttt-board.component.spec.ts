import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TttBoardComponent } from './ttt-board.component';

describe('TttBoardComponent', () => {
  let component: TttBoardComponent;
  let fixture: ComponentFixture<TttBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TttBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TttBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
