import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MockPaymentGateway, MockWallet } from './mock-finance';

afterEach(cleanup);

describe('Simulated financial input handling', () => {
  it('advances checkout without passing or retaining financial fields', () => {
    const next = vi.fn();
    render(<MockPaymentGateway amount={149} onBack={() => {}} onContinue={next} />);
    for (const [label, value] of [['Credit Card Number', '4242424242424242'], ['Expiration Date', '12/30'], ['CVV', '123'], ['Billing Address', '123 Example Street']] as const) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.submit(screen.getByLabelText('Credit Card Number').closest('form') as HTMLFormElement);
    expect(next.mock.calls).toEqual([[]]);
    expect(screen.getByLabelText('Credit Card Number')).toHaveValue('');
    expect(screen.getByLabelText('Billing Address')).toHaveValue('');
  });

  it('clears dummy bank numbers after mock direct deposit setup', () => {
    render(<MockWallet />);
    fireEvent.change(screen.getByLabelText('Routing Number'), { target: { value: '000000000' } });
    fireEvent.change(screen.getByLabelText('Account Number'), { target: { value: '000000000000' } });
    fireEvent.submit(screen.getByLabelText('Routing Number').closest('form') as HTMLFormElement);
    expect(screen.getByLabelText('Routing Number')).toHaveValue('');
    expect(screen.getByLabelText('Account Number')).toHaveValue('');
  });
});