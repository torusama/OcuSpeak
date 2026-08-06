import { Test, TestingModule } from '@nestjs/testing';
import { SosController } from './sos.controller';
import { SosService } from './sos.service';

describe('SosController', () => {
  let controller: SosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SosController],
      providers: [
        { provide: SosService, useValue: { create: jest.fn(), findAllByChild: jest.fn(), updateStatus: jest.fn() } },
      ],
    }).compile();

    controller = module.get<SosController>(SosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
