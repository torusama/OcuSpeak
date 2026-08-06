import { aacItems, categories } from '@/data/mockData';

describe('AAC mock board', () => {
  it('supports four-item paging for every default category', () => {
    for (const category of categories) {
      const count = aacItems.filter((item) => item.categoryId === category.id && item.visible).length;
      expect(count).toBeGreaterThanOrEqual(4);
      expect(Math.ceil(count / 4)).toBeGreaterThanOrEqual(1);
    }
  });
});
