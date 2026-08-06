import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SosService } from './sos.service';
import { SosAlert } from './entities/sos-alert.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { RealtimeGateway } from '../socket/realtime.gateway';
import { FirebaseService } from '../firebase/firebase.service';
import { createMockRepository } from '../test-utils/mock-repository';

describe('SosService', () => {
  let service: SosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SosService,
        { provide: getRepositoryToken(SosAlert), useValue: createMockRepository() },
        { provide: getRepositoryToken(ChildProfile), useValue: createMockRepository() },
        { provide: RealtimeGateway, useValue: { emitSosAlert: jest.fn(), emitSosUpdate: jest.fn() } },
        { provide: FirebaseService, useValue: { sendPushNotification: jest.fn() } },
      ],
    }).compile();

    service = module.get<SosService>(SosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
