import { Test, TestingModule } from '@nestjs/testing';
import { CaregiverController } from './caregiver.controller';
import { CaregiverService } from './caregiver.service';

describe('CaregiverController', () => {
  let controller: CaregiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaregiverController],
      providers: [
        {
          provide: CaregiverService,
          useValue: { create: jest.fn(), findAll: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<CaregiverController>(CaregiverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
