import React from 'react';
import { View } from 'react-native';
import { useAfricaPayRN } from './useAfricaPayRN';
import { PaystackPayment } from './adapters/paystack';
import { FlutterwavePayment } from './adapters/flutterwave';
import { WebViewPayment } from './components/WebViewPayment';
import { PaymentConfig, PaymentProvider } from './types';

interface AfricaPayProviderProps {
    children: React.ReactNode;
}

export const AfricaPayProvider: React.FC<AfricaPayProviderProps> = ({ children }) => {
    return <View style={{ flex: 1 }}>{children}</View>;
};

// Re-export everything
export { useAfricaPayRN } from './useAfricaPayRN';
export { PaystackPayment } from './adapters/paystack';
export { FlutterwavePayment } from './adapters/flutterwave';
export { WebViewPayment } from './components/WebViewPayment';
export * from './types';

// Payment component that handles all providers
interface PaymentGatewayProps {
    config: PaymentConfig;
    provider: PaymentProvider;
    visible: boolean;
    onDismiss: () => void;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({
    config,
    provider,
    visible,
    onDismiss,
}) => {
    if (!visible || !config) return null;

    switch (provider) {
        case 'paystack':
            return <PaystackPayment config={config} />;
        case 'flutterwave':
            return <FlutterwavePayment config={config} />;
        case 'monnify':
        case 'remita':
            return (
                <WebViewPayment
                    config={config}
                    provider={provider}
                    visible={visible}
                    onDismiss={onDismiss}
                />
            );
        default:
            return null;
    }
};
