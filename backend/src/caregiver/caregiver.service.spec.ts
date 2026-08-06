import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CaregiverService } from './caregiver.service';
import { Caregiver } from './entities/caregiver.entity';
import { createMockRepository } from '../test-utils/mock-repository';

describe('CaregiverService', () => {
  let service: CaregiverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CaregiverService,
        { provide: getRepositoryToken(Caregiver), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<CaregiverService>(CaregiverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
