import { Test, TestingModule } from '@nestjs/testing';
import { DemodataService } from './demodata.service';

describe('DemodataService', () => {
  let service: DemodataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemodataService],
    }).compile();

    service = module.get<DemodataService>(DemodataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
