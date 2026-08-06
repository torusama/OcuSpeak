import { Test, TestingModule } from '@nestjs/testing';
import { AacController } from './aac.controller';
import { AacService } from './aac.service';

describe('AacController', () => {
  let controller: AacController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AacController],
      providers: [
        {
          provide: AacService,
          useValue: { create: jest.fn(), findAllByChild: jest.fn(), findOne: jest.fn(), update: jest.fn(), remove: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AacController>(AacController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
