import { useState } from 'react';
import { PaymentProvider, AdapterConfig, AdapterInterface, PaymentResponse } from './types';
import { PaystackAdapter } from './adapters/paystack';
import { FlutterwaveAdapter } from './adapters/flutterwave';
import { MonnifyAdapter } from './adapters/monnify';

const ADAPTERS: Record<PaymentProvider, AdapterInterface> = {
  paystack: PaystackAdapter,
  flutterwave: FlutterwaveAdapter,
  monnify: MonnifyAdapter,
};

export interface InitializePaymentProps extends Omit<AdapterConfig, 'onSuccess' | 'onClose'> {
  provider: PaymentProvider;
  onSuccess?: (response: PaymentResponse) => void;
  onClose?: () => void;
}

export const useAfricaPay = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializePayment = async (props: InitializePaymentProps) => {
    setLoading(true);
    setError(null);

    const { provider, ...config } = props;
    const adapter = ADAPTERS[provider];

    if (!adapter) {
      setLoading(false);
      setError(`Invalid provider: ${provider}`);
      return;
    }

    try {
      // Lazy load the script
      await adapter.loadScript();

      // Validation
      if (provider === 'monnify' && !config.contractCode) {
        throw new Error('Contract Code is required for Monnify');
      }
      if (provider === 'flutterwave' && !config.user.phonenumber) {
        throw new Error('Phone number is required for Flutterwave');
      }

      adapter.initialize({
        ...config,
        onSuccess: (response) => {
          setLoading(false);
          if (props.onSuccess) props.onSuccess(response);
        },
        onClose: () => {
          setLoading(false);
          if (props.onClose) props.onClose();
        },
      });
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Payment initialization failed');
      console.error(err);
    }
  };

  return { initializePayment, loading, error };
};
