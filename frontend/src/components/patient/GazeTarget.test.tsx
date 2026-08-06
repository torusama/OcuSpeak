import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { GazeTarget } from '@/components/patient/GazeTarget';

describe('GazeTarget', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    let now = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => now);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      now += 250;
      return window.setTimeout(() => callback(now), 0);
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => window.clearTimeout(id));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('chooses exactly once for a manual click', () => {
    const onSelect = vi.fn();
    render(<GazeTarget label="Uống nước" onSelect={onSelect}>Uống nước</GazeTarget>);
    const target = screen.getByRole('button', { name: 'Uống nước' });
    fireEvent.click(target, { detail: 1 });
    expect(onSelect).toHaveBeenCalledTimes(1);
    vi.runAllTimers();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('chooses once after gaze dwell duration', () => {
    const onSelect = vi.fn();
    render(<GazeTarget label="Gọi mẹ" dwellMs={1000} onSelect={onSelect}>Gọi mẹ</GazeTarget>);
    fireEvent.pointerEnter(screen.getByRole('button', { name: 'Gọi mẹ' }), { pointerType: 'mouse' });
    vi.runAllTimers();
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
