import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServerBookList } from './server-book-list';

describe('ServerBookList', () => {
  let component: ServerBookList;
  let fixture: ComponentFixture<ServerBookList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServerBookList],
    }).compileComponents();

    fixture = TestBed.createComponent(ServerBookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
