import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoviajesAdminComponentComponent } from './ecoviajes-admin.component.component';

describe('EcoviajesAdminComponentComponent', () => {
  let component: EcoviajesAdminComponentComponent;
  let fixture: ComponentFixture<EcoviajesAdminComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoviajesAdminComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcoviajesAdminComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
