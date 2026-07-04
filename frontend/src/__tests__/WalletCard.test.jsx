import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WalletCard from '../components/WalletCard';

// Mock the useWallet hook
vi.mock('../hooks/useWallet', () => ({
  useWallet: vi.fn(() => ({
    address: null,
    network: null,
    networkOk: false,
    installed: true,
    connecting: false,
    error: null,
    connect: vi.fn(),
    disconnect: vi.fn()
  }))
}));

// Mock stellar utilities
vi.mock('../utils/stellar', () => ({
  shortenAddress: vi.fn((addr, len) => {
    if (!addr) return '';
    return `${addr.slice(0, len)}...${addr.slice(-len)}`;
  })
}));

describe('WalletCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders connect button when Freighter is detected', async () => {
    render(<WalletCard onWalletConnect={vi.fn()} onWalletDisconnect={vi.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Connect Freighter/i)).toBeInTheDocument();
    });
  });

  it('shows not connected status initially', () => {
    render(<WalletCard onWalletConnect={vi.fn()} onWalletDisconnect={vi.fn()} />);
    expect(screen.getByText(/Not Connected/i)).toBeInTheDocument();
  });

  it('shows demo mode button', () => {
    render(<WalletCard onWalletConnect={vi.fn()} onWalletDisconnect={vi.fn()} />);
    expect(screen.getByText(/Use Demo Wallet/i)).toBeInTheDocument();
  });
});
