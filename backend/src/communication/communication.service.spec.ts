import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommunicationService } from './communication.service';
import { CommunicationEvent } from './entities/communication-event.entity';
import { CaregiverResponse } from './entities/caregiver-response.entity';
import { ChildProfile } from '../child/entities/child.entity';
import { RealtimeGateway } from '../socket/realtime.gateway';
import { FirebaseService } from '../firebase/firebase.service';
import { createMockRepository } from '../test-utils/mock-repository';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommunicationService,
        { provide: getRepositoryToken(CommunicationEvent), useValue: createMockRepository() },
        { provide: getRepositoryToken(CaregiverResponse), useValue: createMockRepository() },
        { provide: getRepositoryToken(ChildProfile), useValue: createMockRepository() },
        { provide: RealtimeGateway, useValue: { emitCommunicationEvent: jest.fn(), emitCaregiverResponse: jest.fn() } },
        { provide: FirebaseService, useValue: { sendPushNotification: jest.fn() } },
      ],
    }).compile();

    service = module.get<CommunicationService>(CommunicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
