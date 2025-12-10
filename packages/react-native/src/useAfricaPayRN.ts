import { useState, useCallback } from 'react';
import {
  PaymentProvider,
  PaymentConfig,
  PaymentResponse,
  PaymentError,
  ValidationError,
} from './types';

interface InitializePaymentProps extends Omit<PaymentConfig, 'onSuccess' | 'onClose' | 'onError'> {
  provider: PaymentProvider;
  onSuccess?: (response: PaymentResponse) => void;
  onClose?: () => void;
  onError?: (error: PaymentError) => void;
}

interface UseAfricaPayRNReturn {
  initializePayment: (props: InitializePaymentProps) => void;
  loading: boolean;
  error: PaymentError | null;
  reset: () => void;
  paymentConfig: PaymentConfig | null;
  showPayment: boolean;
  hidePayment: () => void;
}

export const useAfricaPayRN = (): UseAfricaPayRNReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PaymentError | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setPaymentConfig(null);
    setShowPayment(false);
  }, []);

  const hidePayment = useCallback(() => {
    setShowPayment(false);
    setLoading(false);
  }, []);

  const validateConfig = (props: InitializePaymentProps): void => {
    const { provider, user, amount, publicKey, contractCode, merchantId, serviceTypeId } = props;

    // Basic validation
    if (!publicKey) {
      throw new ValidationError('Public key is required', 'Please provide your payment provider public key');
    }

    if (!user.email) {
      throw new ValidationError('Customer email is required', 'Please provide a valid customer email address');
    }

    if (amount <= 0) {
      throw new ValidationError('Amount must be greater than 0', 'Please provide a valid payment amount');
    }

    // Provider-specific validation
    if (provider === 'monnify') {
      if (!contractCode) {
        throw new ValidationError(
          'Contract Code is required for Monnify',
          'Please provide your Monnify contract code'
        );
      }
      if (!user.name) {
        throw new ValidationError(
          'Customer name is required for Monnify',
          'Please provide the customer name'
        );
      }
    }

    if (provider === 'flutterwave') {
      if (!user.phonenumber && !user.phone) {
        throw new ValidationError(
          'Phone number is required for Flutterwave',
          'Please provide the customer phone number'
        );
      }
    }

    if (provider === 'remita') {
      if (!merchantId) {
        throw new ValidationError(
          'Merchant ID is required for Remita',
          'Please provide your Remita merchant ID'
        );
      }
      if (!serviceTypeId) {
        throw new ValidationError(
          'Service Type ID is required for Remita',
          'Please provide your Remita service type ID'
        );
      }
      if (!user.name) {
        throw new ValidationError(
          'Customer name is required for Remita',
          'Please provide the customer name'
        );
      }
    }
  };

  const initializePayment = useCallback((props: InitializePaymentProps) => {
    setLoading(true);
    setError(null);

    try {
      validateConfig(props);

      const config: PaymentConfig = {
        ...props,
        onSuccess: (response) => {
          setLoading(false);
          setShowPayment(false);
          if (props.onSuccess) props.onSuccess(response);
        },
        onClose: () => {
          setLoading(false);
          setShowPayment(false);
          if (props.onClose) props.onClose();
        },
        onError: (error) => {
          setLoading(false);
          setError(error);
          setShowPayment(false);
          if (props.onError) props.onError(error);
        },
      };

      setPaymentConfig(config);
      setShowPayment(true);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      const paymentError = err instanceof PaymentError ? err : new PaymentError(
        err.message || 'Payment initialization failed',
        'UNKNOWN_ERROR',
        props.provider
      );
      setError(paymentError);
      if (props.onError) props.onError(paymentError);
    }
  }, []);

  return {
    initializePayment,
    loading,
    error,
    reset,
    paymentConfig,
    showPayment,
    hidePayment,
  };
};
