import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSettingComponent } from './create-setting.component';

describe('CreateSettingComponent', () => {
  let component: CreateSettingComponent;
  let fixture: ComponentFixture<CreateSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
