import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletCard from '../components/WalletCard';

// Mock wallet utilities
vi.mock('../utils/wallet', () => ({
  connectFreighter: vi.fn(),
  disconnectWallet: vi.fn(),
  getWalletErrorMessage: vi.fn((err) => err.message),
}));

describe('WalletCard', () => {
  it('renders connect button when not connected', () => {
    render(<WalletCard onWalletConnect={vi.fn()} onWalletDisconnect={vi.fn()} />);
    expect(screen.getByText(/Connect Freighter/i)).toBeInTheDocument();
  });

  it('shows not connected status initially', () => {
    render(<WalletCard onWalletConnect={vi.fn()} onWalletDisconnect={vi.fn()} />);
    expect(screen.getByText(/Not Connected/i)).toBeInTheDocument();
  });
});
