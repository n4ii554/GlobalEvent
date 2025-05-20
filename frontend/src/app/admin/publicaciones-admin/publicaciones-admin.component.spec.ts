import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesAdminComponent } from './publicaciones-admin.component';

describe('PublicacionesAdminComponent', () => {
  let component: PublicacionesAdminComponent;
  let fixture: ComponentFixture<PublicacionesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionesAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
