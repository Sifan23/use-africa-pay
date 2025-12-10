import React from 'react';
import { Paystack, paystackProps } from 'react-native-paystack-webview';
import { PaymentConfig, PaymentResponse, AdapterInterface } from '../types';

export const PaystackAdapter: AdapterInterface = {
    initialize: async (config: PaymentConfig) => {
        return new Promise((resolve, reject) => {
            // This will be used with the PaystackPayment component
            // The component handles the actual payment flow
            resolve();
        });
    },
};

interface PaystackPaymentProps {
    config: PaymentConfig;
}

export const PaystackPayment: React.FC<PaystackPaymentProps> = ({ config }) => {

    const handleSuccess = (response: any) => {
        const paymentResponse: PaymentResponse = {
            status: 'success',
            message: 'Payment completed successfully',
            reference: response.reference || config.reference,
            transactionId: response.trans || response.transaction,
            amount: config.amount,
            currency: config.currency,
            paidAt: new Date().toISOString(),
            customer: {
                email: config.user.email,
                name: config.user.name,
                phone: config.user.phonenumber || config.user.phone,
            },
            provider: 'paystack',
            metadata: config.metadata,
            raw: response,
        };
        config.onSuccess(paymentResponse);
    };

    const handleCancel = () => {
        config.onClose();
    };

    return (
        <Paystack
            paystackKey={config.publicKey}
            amount={config.amount / 100} // Paystack RN expects Naira
            billingEmail={config.user.email}
            billingName={config.user.name}
            billingMobile={config.user.phonenumber || config.user.phone}
            channels={['card', 'bank', 'ussd', 'qr', 'mobile_money']}
            currency={config.currency}
            refNumber={config.reference}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
            autoStart={true}
        />
    );
};
