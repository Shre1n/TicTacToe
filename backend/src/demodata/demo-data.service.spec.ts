import { Test, TestingModule } from '@nestjs/testing';
import { DemoDataService } from './demo-data.service';

describe('DemodataService', () => {
  let service: DemoDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemoDataService],
    }).compile();

    service = module.get<DemoDataService>(DemoDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
