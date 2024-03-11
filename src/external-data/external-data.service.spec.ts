import { Test, TestingModule } from '@nestjs/testing';
import { ExternalDataService } from './external-data.service';

describe('ExternalDataService', () => {
  let service: ExternalDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalDataService],
    }).compile();

    service = module.get<ExternalDataService>(ExternalDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
