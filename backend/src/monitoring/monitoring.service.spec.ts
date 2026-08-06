import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MonitoringService } from './monitoring.service';
import { MonitoringRecord } from './entities/monitoring-record.entity';
import { RealtimeGateway } from '../socket/realtime.gateway';
import { createMockRepository } from '../test-utils/mock-repository';

describe('MonitoringService', () => {
  let service: MonitoringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MonitoringService,
        { provide: getRepositoryToken(MonitoringRecord), useValue: createMockRepository() },
        { provide: RealtimeGateway, useValue: { emitMonitoringUpdate: jest.fn() } },
      ],
    }).compile();

    service = module.get<MonitoringService>(MonitoringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
