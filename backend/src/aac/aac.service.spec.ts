import { Test, TestingModule } from '@nestjs/testing';
import { AacService } from './aac.service';

describe('AacService', () => {
  let service: AacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AacService],
    }).compile();

    service = module.get<AacService>(AacService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
