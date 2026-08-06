import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('calls the action and exposes a readable label', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    render(<Button onClick={action}>Lưu cài đặt</Button>);
    await user.click(screen.getByRole('button', { name: 'Lưu cài đặt' }));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('prevents interaction while loading', () => {
    render(<Button loading>Đang gửi</Button>);
    expect(screen.getByRole('button', { name: 'Đang gửi' })).toBeDisabled();
  });
});
