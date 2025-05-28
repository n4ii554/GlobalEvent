import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarEventosComponent } from './generar-eventos.component';

describe('GenerarEventosComponent', () => {
  let component: GenerarEventosComponent;
  let fixture: ComponentFixture<GenerarEventosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarEventosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
