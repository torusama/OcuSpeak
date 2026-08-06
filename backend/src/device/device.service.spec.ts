import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { createMockRepository } from '../test-utils/mock-repository';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        { provide: getRepositoryToken(Device), useValue: createMockRepository() },
        { provide: getRepositoryToken(ChildProfile), useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
