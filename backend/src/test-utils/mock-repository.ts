export const createMockRepository = () => ({
  create: jest.fn((dto) => dto),
  save: jest.fn((entity) => Promise.resolve({ id: 'mock-id', ...entity })),
  find: jest.fn(() => Promise.resolve([])),
  findOne: jest.fn(() => Promise.resolve(null)),
  findOneBy: jest.fn(() => Promise.resolve(null)),
  update: jest.fn(() => Promise.resolve({ affected: 1 })),
  delete: jest.fn(() => Promise.resolve({ affected: 1 })),
  createQueryBuilder: jest.fn(() => ({
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(() => Promise.resolve(null)),
  })),
});
