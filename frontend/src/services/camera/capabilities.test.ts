import { checkCapabilities } from '@/services/camera/capabilities';

describe('capability check', () => {
  it('returns named capability rows', () => {
    const result = checkCapabilities();
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.every((item) => typeof item.label === 'string')).toBe(true);
  });
});
