import React from 'react';
import { FlutterwaveButton, FlutterwaveInitOptions } from 'react-native-flutterwave';
import { PaymentConfig, PaymentResponse, AdapterInterface } from '../types';

export const FlutterwaveAdapter: AdapterInterface = {
    initialize: async (config: PaymentConfig) => {
        return new Promise((resolve) => {
            // Component-based approach
            resolve();
        });
    },
};

interface FlutterwavePaymentProps {
    config: PaymentConfig;
}

export const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({ config }) => {
    const handleOnRedirect = (data: any) => {
        if (data.status === 'successful' || data.status === 'completed') {
            const paymentResponse: PaymentResponse = {
                status: 'success',
                message: 'Payment completed successfully',
                reference: data.tx_ref || config.reference,
                transactionId: data.transaction_id,
                amount: config.amount,
                currency: config.currency,
                paidAt: new Date().toISOString(),
                customer: {
                    email: config.user.email,
                    name: config.user.name,
                    phone: config.user.phonenumber || config.user.phone,
                },
                provider: 'flutterwave',
                metadata: config.metadata,
                raw: data,
            };
            config.onSuccess(paymentResponse);
        } else if (data.status === 'cancelled') {
            config.onClose();
        } else {
            if (config.onError) {
                config.onError({
                    name: 'PaymentError',
                    message: 'Payment failed',
                    code: 'PAYMENT_FAILED',
                    provider: 'flutterwave',
                } as any);
            }
        }
    };

    const flutterwaveOptions: FlutterwaveInitOptions = {
        tx_ref: config.reference,
        authorization: config.publicKey,
        amount: config.amount / 100, // Convert to Naira
        currency: config.currency,
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: config.user.email,
            name: config.user.name || '',
            phonenumber: config.user.phonenumber || config.user.phone || '',
        },
        customizations: {
            title: config.metadata?.title || 'Payment',
            description: config.metadata?.description || 'Payment',
            logo: config.metadata?.logo,
        },
        meta: config.metadata,
    };

    return (
        <FlutterwaveButton
            style={{
                backgroundColor: '#5cb85c',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 8,
            }}
            buttonText="Pay Now"
            options={flutterwaveOptions}
            onRedirect={handleOnRedirect}
        />
    );
};
