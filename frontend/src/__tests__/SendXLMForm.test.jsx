import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SendXLMForm from '../components/SendXLMForm';

// Mock utilities
vi.mock('../utils/stellar', () => ({
  sendPayment: vi.fn(),
  isValidAddress: vi.fn(),
}));

vi.mock('../utils/wallet', () => ({
  signTransactionWithFreighter: vi.fn(),
  getWalletErrorMessage: vi.fn((err) => err.message),
}));

describe('SendXLMForm', () => {
  it('shows connection message when no wallet connected', () => {
    render(<SendXLMForm publicKey={null} onTransactionComplete={vi.fn()} />);
    expect(screen.getByText(/Please connect your wallet to send XLM/i)).toBeInTheDocument();
  });

  it('renders form fields when wallet is connected', () => {
    render(<SendXLMForm publicKey="GTEST123" onTransactionComplete={vi.fn()} />);
    expect(screen.getByLabelText(/Destination Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Amount/i)).toBeInTheDocument();
  });
});
