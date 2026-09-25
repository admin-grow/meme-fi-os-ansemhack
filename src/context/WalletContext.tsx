import React, { createContext, useContext, useState, useEffect } from 'react';

export type WalletType = 'phantom' | 'solflare' | 'burner';

export interface WalletState {
  connected: boolean;
  address: string;
  shortAddress: string;
  balanceSol: number;
  walletType: WalletType;
  walletName: string;
  network: 'devnet' | 'mainnet';
  isConnecting: boolean;
  error: string | null;
}

export interface WalletContextType {
  wallet: WalletState;
  connectWallet: (type: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  rotateBurnerKey: () => void;
  airdropDevnetSol: () => Promise<boolean>;
  setNetwork: (network: 'devnet' | 'mainnet') => void;
  isWalletModalOpen: boolean;
  openWalletModal: () => void;
  closeWalletModal: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Generate random Solana base58-like burner address
function generateBurnerAddress(): string {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${result}burn`;
}

function truncateAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [burnerAddress, setBurnerAddress] = useState<string>(() => {
    const saved = localStorage.getItem('memefi_burner_wallet');
    if (saved) return saved;
    const generated = generateBurnerAddress();
    localStorage.setItem('memefi_burner_wallet', generated);
    return generated;
  });

  const [wallet, setWallet] = useState<WalletState>({
    connected: true, // Default to instant sandbox burner so user can immediately test
    address: burnerAddress,
    shortAddress: truncateAddress(burnerAddress),
    balanceSol: 0.50,
    walletType: 'burner',
    walletName: 'Burner Sandbox Keypair',
    network: 'devnet',
    isConnecting: false,
    error: null,
  });

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const openWalletModal = () => setIsWalletModalOpen(true);
  const closeWalletModal = () => setIsWalletModalOpen(false);

  // Sync balance or address when burner changes
  useEffect(() => {
    if (wallet.walletType === 'burner') {
      setWallet((prev) => ({
        ...prev,
        address: burnerAddress,
        shortAddress: truncateAddress(burnerAddress),
      }));
    }
  }, [burnerAddress]);

  const connectWallet = async (type: WalletType) => {
    setWallet((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (type === 'burner') {
        setWallet({
          connected: true,
          address: burnerAddress,
          shortAddress: truncateAddress(burnerAddress),
          balanceSol: 0.50,
          walletType: 'burner',
          walletName: 'Burner Sandbox Keypair',
          network: wallet.network,
          isConnecting: false,
          error: null,
        });
        closeWalletModal();
        return;
      }

      if (type === 'phantom') {
        const anyWindow = typeof window !== 'undefined' ? (window as any) : null;
        const provider = anyWindow?.phantom?.solana || anyWindow?.solana;

        if (!provider || !provider.isPhantom) {
          throw new Error('Phantom extension not detected in browser. Please install Phantom or use the Burner Sandbox Keypair for instant testing.');
        }

        const resp = await provider.connect();
        const pubKeyStr = resp.publicKey.toString();

        setWallet({
          connected: true,
          address: pubKeyStr,
          shortAddress: truncateAddress(pubKeyStr),
          balanceSol: 1.25,
          walletType: 'phantom',
          walletName: 'Phantom Wallet',
          network: wallet.network,
          isConnecting: false,
          error: null,
        });
        closeWalletModal();
        return;
      }

      if (type === 'solflare') {
        const anyWindow = typeof window !== 'undefined' ? (window as any) : null;
        const provider = anyWindow?.solflare;

        if (!provider || !provider.isSolflare) {
          throw new Error('Solflare extension not detected in browser. Please install Solflare or use the Burner Sandbox Keypair for instant testing.');
        }

        await provider.connect();
        const pubKeyStr = provider.publicKey ? provider.publicKey.toString() : 'SolflareConnected1111111111111111111111111';

        setWallet({
          connected: true,
          address: pubKeyStr,
          shortAddress: truncateAddress(pubKeyStr),
          balanceSol: 2.10,
          walletType: 'solflare',
          walletName: 'Solflare Wallet',
          network: wallet.network,
          isConnecting: false,
          error: null,
        });
        closeWalletModal();
        return;
      }
    } catch (err: any) {
      console.warn('Wallet connection error:', err);
      setWallet((prev) => ({
        ...prev,
        isConnecting: false,
        error: err?.message || 'Failed to connect wallet.',
      }));
    }
  };

  const disconnectWallet = () => {
    // Fallback to burner keypair
    setWallet({
      connected: false,
      address: '',
      shortAddress: '',
      balanceSol: 0,
      walletType: 'burner',
      walletName: 'Disconnected',
      network: wallet.network,
      isConnecting: false,
      error: null,
    });
  };

  const rotateBurnerKey = () => {
    const newAddr = generateBurnerAddress();
    localStorage.setItem('memefi_burner_wallet', newAddr);
    setBurnerAddress(newAddr);
    setWallet((prev) => ({
      ...prev,
      connected: true,
      address: newAddr,
      shortAddress: truncateAddress(newAddr),
      balanceSol: 0.50,
      walletType: 'burner',
      walletName: 'Burner Sandbox Keypair',
    }));
  };

  const airdropDevnetSol = async (): Promise<boolean> => {
    try {
      setWallet((prev) => ({
        ...prev,
        balanceSol: Number((prev.balanceSol + 0.50).toFixed(2)),
      }));
      return true;
    } catch (e) {
      return false;
    }
  };

  const setNetwork = (network: 'devnet' | 'mainnet') => {
    setWallet((prev) => ({ ...prev, network }));
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connectWallet,
        disconnectWallet,
        rotateBurnerKey,
        airdropDevnetSol,
        setNetwork,
        isWalletModalOpen,
        openWalletModal,
        closeWalletModal,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const SolanaWalletProvider = WalletProvider;

export const useSolanaWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useSolanaWallet must be used within a WalletProvider');
  }
  return context;
};
