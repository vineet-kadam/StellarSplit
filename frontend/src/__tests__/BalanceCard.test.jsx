import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BalanceCard from '../components/BalanceCard';

// Mock Stellar utilities
vi.mock('../utils/stellar', () => ({
  getAccountBalance: vi.fn().mockResolvedValue('100'),
  formatXLM: vi.fn((amount) => amount),
}));

describe('BalanceCard', () => {
  it('renders nothing when no public key provided', () => {
    const { container } = render(<BalanceCard publicKey={null} refreshTrigger={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders balance header when public key is provided', () => {
    render(<BalanceCard publicKey="GTEST123" refreshTrigger={0} />);
    expect(screen.getByText(/XLM Balance/i)).toBeInTheDocument();
  });
});
