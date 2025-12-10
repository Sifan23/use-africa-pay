# React Native Support Implementation Plan

## Overview
This document outlines the implementation of React Native support for use-africa-pay.

## Architecture

### Package Structure
```
packages/react-native/
├── src/
│   ├── adapters/
│   │   ├── paystack.tsx      # Native SDK wrapper
│   │   ├── flutterwave.tsx   # Native SDK wrapper
│   ├── components/
│   │   └── WebViewPayment.tsx # WebView for Monnify/Remita
│   ├── types.ts               # Shared types
│   ├── useAfricaPayRN.ts      # Main hook
│   └── index.tsx              # Exports
├── example/
│   ├── App.tsx                # Demo app
│   └── README.md
├── package.json
├── tsconfig.json
└── README.md
```

## Implementation Details

### 1. Native SDK Providers

#### Paystack
- **Library**: `react-native-paystack-webview`
- **Approach**: Component-based
- **Features**: Full native SDK support
- **Platforms**: iOS & Android

#### Flutterwave
- **Library**: `react-native-flutterwave`
- **Approach**: Button component
- **Features**: Full native SDK support
- **Platforms**: iOS & Android

### 2. WebView Providers

#### Monnify
- **Approach**: WebView with Monnify SDK script
- **Communication**: postMessage API
- **Features**: Full web SDK in WebView
- **Platforms**: iOS & Android

#### Remita
- **Approach**: WebView with Remita SDK script
- **Communication**: postMessage API
- **Features**: Full web SDK in WebView
- **Platforms**: iOS & Android

### 3. API Design

The React Native API mirrors the web version:

```typescript
const { initializePayment, paymentConfig, showPayment } = useAfricaPayRN();

initializePayment({
  provider: 'paystack',
  publicKey: 'pk_test_xxx',
  amount: 500000,
  currency: 'NGN',
  reference: 'txn_123',
  user: { email: 'user@example.com' },
  onSuccess: (response) => {},
  onClose: () => {},
  onError: (error) => {}
});
```

## Differences from Web Version

### 1. Component-Based Rendering
- Web: Script injection
- RN: Component rendering

### 2. Payment UI Display
- Web: Modal/iframe
- RN: Modal with native components or WebView

### 3. State Management
- Added `showPayment` and `hidePayment` for UI control
- Added `paymentConfig` to pass to PaymentGateway component

## Testing Strategy

### Unit Tests (Future)
- Hook state management
- Validation logic
- Error handling

### Integration Tests (Future)
- Paystack native SDK
- Flutterwave native SDK
- WebView communication

### Manual Testing
- iOS simulator
- Android emulator
- Physical devices

## Known Limitations

1. **WebView Performance**: Monnify and Remita use WebView which may be slower than native
2. **Platform-Specific Setup**: Requires additional setup for iOS (pods) and Android (permissions)
3. **SDK Versions**: Dependent on third-party SDK updates
4. **Network Dependency**: All payments require internet connection

## Future Enhancements

1. **Native Modules**: Create true native modules for Monnify and Remita
2. **Offline Support**: Queue payments when offline
3. **Biometric Auth**: Add fingerprint/face ID for payment confirmation
4. **Payment History**: Local storage of payment attempts
5. **Analytics**: Track payment success rates

## Migration from Web

For apps using the web version, migration is straightforward:

```diff
- import { useAfricaPay } from '@use-africa-pay/core';
+ import { useAfricaPayRN, PaymentGateway } from '@use-africa-pay/react-native';

- const { initializePayment } = useAfricaPay();
+ const { initializePayment, paymentConfig, showPayment, hidePayment } = useAfricaPayRN();

+ // Add PaymentGateway component
+ <PaymentGateway
+   config={paymentConfig}
+   provider={provider}
+   visible={showPayment}
+   onDismiss={hidePayment}
+ />
```

## Dependencies

### Required
- `react-native-webview`: ^13.0.0

### Provider-Specific
- `react-native-paystack-webview`: ^4.0.0 (Paystack)
- `react-native-flutterwave`: ^1.0.0 (Flutterwave)

### Peer Dependencies
- `react`: >=16.8.0
- `react-native`: >=0.64.0

## Platform Requirements

### iOS
- iOS 11.0+
- CocoaPods

### Android
- minSdkVersion 21
- Internet permission

## Conclusion

The React Native implementation provides feature parity with the web version while leveraging native SDKs where available and falling back to WebView for providers without native support. The API remains consistent, making it easy for developers to use across platforms.
