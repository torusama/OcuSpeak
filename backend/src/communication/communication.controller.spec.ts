import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';

describe('CommunicationController', () => {
  let controller: CommunicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationController],
      providers: [
        {
          provide: CommunicationService,
          useValue: {
            createEvent: jest.fn(),
            findAllByChild: jest.fn(),
            findOne: jest.fn(),
            markRead: jest.fn(),
            respond: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommunicationController>(CommunicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
