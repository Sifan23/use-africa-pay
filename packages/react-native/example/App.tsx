import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useAfricaPayRN, PaymentGateway, PaymentProvider } from '@use-africa-pay/react-native';

const App = () => {
    const { initializePayment, paymentConfig, showPayment, hidePayment, loading, error } =
        useAfricaPayRN();
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null);

    const handlePayment = (provider: PaymentProvider) => {
        setSelectedProvider(provider);

        const baseConfig = {
            amount: 500000, // ₦5,000 in kobo
            currency: 'NGN' as const,
            reference: `${provider.toUpperCase()}_${Date.now()}`,
            user: {
                email: 'customer@example.com',
                name: 'John Doe',
                phonenumber: '08012345678',
            },
            onSuccess: (response: any) => {
                Alert.alert(
                    'Payment Successful!',
                    `Transaction ID: ${response.transactionId}\\nReference: ${response.reference}`,
                    [{ text: 'OK' }]
                );
            },
            onClose: () => {
                Alert.alert('Payment Cancelled', 'You closed the payment window', [{ text: 'OK' }]);
            },
            onError: (error: any) => {
                Alert.alert('Payment Error', error.message, [{ text: 'OK' }]);
            },
        };

        switch (provider) {
            case 'paystack':
                initializePayment({
                    ...baseConfig,
                    provider: 'paystack',
                    publicKey: 'pk_test_xxx', // Replace with your key
                });
                break;

            case 'flutterwave':
                initializePayment({
                    ...baseConfig,
                    provider: 'flutterwave',
                    publicKey: 'FLWPUBK_TEST-xxx', // Replace with your key
                });
                break;

            case 'monnify':
                initializePayment({
                    ...baseConfig,
                    provider: 'monnify',
                    publicKey: 'MK_TEST_xxx', // Replace with your key
                    contractCode: 'xxx', // Replace with your contract code
                });
                break;

            case 'remita':
                initializePayment({
                    ...baseConfig,
                    provider: 'remita',
                    publicKey: 'pk_test_xxx', // Replace with your key
                    merchantId: 'xxx', // Replace with your merchant ID
                    serviceTypeId: 'xxx', // Replace with your service type ID
                });
                break;
        }
    };

    const PaymentButton = ({ provider, title }: { provider: PaymentProvider; title: string }) => (
        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => handlePayment(provider)}
            disabled={loading}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>use-africa-pay</Text>
                    <Text style={styles.subtitle}>React Native Payment Demo</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Native SDK Providers</Text>
                    <PaymentButton provider="paystack" title="Pay with Paystack" />
                    <PaymentButton provider="flutterwave" title="Pay with Flutterwave" />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>WebView Providers</Text>
                    <PaymentButton provider="monnify" title="Pay with Monnify" />
                    <PaymentButton provider="remita" title="Pay with Remita" />
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {error.message}</Text>
                        {error.suggestion && <Text style={styles.errorSuggestion}>{error.suggestion}</Text>}
                    </View>
                )}

                <View style={styles.info}>
                    <Text style={styles.infoText}>Amount: ₦5,000</Text>
                    <Text style={styles.infoText}>Test Mode</Text>
                </View>
            </ScrollView>

            {paymentConfig && selectedProvider && (
                <PaymentGateway
                    config={paymentConfig}
                    provider={selectedProvider}
                    visible={showPayment}
                    onDismiss={hidePayment}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    errorContainer: {
        backgroundColor: '#fee',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#f00',
    },
    errorText: {
        color: '#c00',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    errorSuggestion: {
        color: '#666',
        fontSize: 12,
    },
    info: {
        backgroundColor: '#e3f2fd',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    infoText: {
        color: '#1976d2',
        fontSize: 14,
        marginBottom: 4,
    },
});

export default App;
