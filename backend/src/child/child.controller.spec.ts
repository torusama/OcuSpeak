import { Test, TestingModule } from '@nestjs/testing';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';

describe('ChildController', () => {
  let controller: ChildController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildController],
      providers: [
        {
          provide: ChildService,
          useValue: {
            create: jest.fn(),
            findAllByCaregiver: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            getConfig: jest.fn(),
            updateConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ChildController>(ChildController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
