import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AacService } from './aac.service';
import { AacItem } from './entities/aac-item.entity';
import { createMockRepository } from '../test-utils/mock-repository';

describe('AacService', () => {
  let service: AacService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AacService,
        { provide: getRepositoryToken(AacItem), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<AacService>(AacService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
