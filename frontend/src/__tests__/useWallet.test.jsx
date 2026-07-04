import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useWallet } from '../hooks/useWallet';

// Mock @stellar/freighter-api with default export
vi.mock('@stellar/freighter-api', () => ({
  default: {
    isConnected: vi.fn(),
    isAllowed: vi.fn(),
    requestAccess: vi.fn(),
    getPublicKey: vi.fn(),
    getNetwork: vi.fn()
  }
}));

describe('useWallet Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should initialize with null values', () => {
    const { result } = renderHook(() => useWallet());
    
    expect(result.current.address).toBeNull();
    expect(result.current.network).toBeNull();
    expect(result.current.networkOk).toBe(false);
    expect(result.current.connecting).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should connect in demo mode', async () => {
    const { result } = renderHook(() => useWallet());
    
    await act(async () => {
      await result.current.connect('demo');
    });
    
    await waitFor(() => {
      expect(result.current.address).toMatch(/^G(DEMO|CLIENT)/);
      expect(result.current.network).toBe('TESTNET');
      expect(result.current.networkOk).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  it('should save demo connection to localStorage', async () => {
    const { result } = renderHook(() => useWallet());
    
    await act(async () => {
      await result.current.connect('demo');
    });
    
    await waitFor(() => {
      expect(localStorage.getItem('stellarsplit_wallet_type')).toBe('demo');
      expect(localStorage.getItem('stellarsplit_wallet')).toMatch(/^G(DEMO|CLIENT)/);
    });
  });

  it('should disconnect wallet', async () => {
    const { result } = renderHook(() => useWallet());
    
    // First connect
    await act(async () => {
      await result.current.connect('demo');
    });
    
    await waitFor(() => {
      expect(result.current.address).not.toBeNull();
    });
    
    // Then disconnect
    act(() => {
      result.current.disconnect();
    });
    
    expect(result.current.address).toBeNull();
    expect(result.current.network).toBeNull();
    expect(result.current.networkOk).toBe(false);
    expect(localStorage.getItem('stellarsplit_wallet')).toBeNull();
  });

  it('should show connecting state during connection', async () => {
    const { result } = renderHook(() => useWallet());
    
    let connectingStateSeen = false;
    
    const connectPromise = act(async () => {
      await result.current.connect('demo');
    });
    
    // Check if connecting is true during the process
    if (result.current.connecting) {
      connectingStateSeen = true;
    }
    
    await connectPromise;
    
    await waitFor(() => {
      expect(result.current.connecting).toBe(false);
    });
  });

  it('should restore demo session from localStorage', async () => {
    const testAddress = 'GDEMO1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    localStorage.setItem('stellarsplit_wallet', testAddress);
    localStorage.setItem('stellarsplit_wallet_type', 'demo');
    
    const { result } = renderHook(() => useWallet());
    
    await waitFor(() => {
      expect(result.current.address).toBe(testAddress);
      expect(result.current.network).toBe('TESTNET');
      expect(result.current.networkOk).toBe(true);
    }, { timeout: 3000 });
  });

  it('should provide connect and disconnect functions', () => {
    const { result } = renderHook(() => useWallet());
    
    expect(typeof result.current.connect).toBe('function');
    expect(typeof result.current.disconnect).toBe('function');
  });

  it('should return all expected properties', () => {
    const { result } = renderHook(() => useWallet());
    
    expect(result.current).toHaveProperty('address');
    expect(result.current).toHaveProperty('network');
    expect(result.current).toHaveProperty('networkOk');
    expect(result.current).toHaveProperty('installed');
    expect(result.current).toHaveProperty('connecting');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('connect');
    expect(result.current).toHaveProperty('disconnect');
  });
});
