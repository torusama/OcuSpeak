import { Test, TestingModule } from '@nestjs/testing';
import { CaregiverController } from './caregiver.controller';

describe('CaregiverController', () => {
  let controller: CaregiverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CaregiverController],
    }).compile();

    controller = module.get<CaregiverController>(CaregiverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
