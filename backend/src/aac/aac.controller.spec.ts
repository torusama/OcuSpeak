import { Test, TestingModule } from '@nestjs/testing';
import { AacController } from './aac.controller';

describe('AacController', () => {
  let controller: AacController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AacController],
    }).compile();

    controller = module.get<AacController>(AacController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
