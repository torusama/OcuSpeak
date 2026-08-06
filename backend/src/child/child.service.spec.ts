import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ChildService } from './child.service';
import { ChildProfile } from './entities/child.entity';
import { ChildConfig } from './entities/child-config.entity';
import { createMockRepository } from '../test-utils/mock-repository';

describe('ChildService', () => {
  let service: ChildService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildService,
        { provide: getRepositoryToken(ChildProfile), useValue: createMockRepository() },
        { provide: getRepositoryToken(ChildConfig), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<ChildService>(ChildService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
