# React Native Example App

This example demonstrates how to use `@use-africa-pay/react-native` with all four payment providers.

## Setup

### 1. Install Dependencies

```bash
cd packages/react-native/example
npm install
# or
yarn install
```

### 2. Install iOS Pods

```bash
cd ios
pod install
cd ..
```

### 3. Configure API Keys

Edit `App.tsx` and replace the placeholder API keys with your actual keys:

```typescript
// Paystack
publicKey: 'pk_test_xxx' // Your Paystack public key

// Flutterwave
publicKey: 'FLWPUBK_TEST-xxx' // Your Flutterwave public key

// Monnify
publicKey: 'MK_TEST_xxx' // Your Monnify API key
contractCode: 'xxx' // Your Monnify contract code

// Remita
publicKey: 'pk_test_xxx' // Your Remita public key
merchantId: 'xxx' // Your Remita merchant ID
serviceTypeId: 'xxx' // Your Remita service type ID
```

## Running the App

### iOS

```bash
npm run ios
# or
npx react-native run-ios
```

### Android

```bash
npm run android
# or
npx react-native run-android
```

## Features Demonstrated

- ✅ Paystack payment (Native SDK)
- ✅ Flutterwave payment (Native SDK)
- ✅ Monnify payment (WebView)
- ✅ Remita payment (WebView)
- ✅ Error handling
- ✅ Success callbacks
- ✅ Cancel handling
- ✅ Loading states

## Testing

Use the test/sandbox keys provided by each payment provider:

- **Paystack**: [Test Cards](https://paystack.com/docs/payments/test-payments)
- **Flutterwave**: [Test Cards](https://developer.flutterwave.com/docs/integration-guides/testing-helpers)
- **Monnify**: Contact Monnify for test credentials
- **Remita**: Use Remita demo environment

## Troubleshooting

### iOS Build Errors

- Run `pod install` in the `ios` directory
- Clean build folder: `cd ios && xcodebuild clean`

### Android Build Errors

- Clean gradle: `cd android && ./gradlew clean`
- Check minimum SDK version is 21

### Payment Not Showing

- Verify API keys are correct
- Check console for errors
- Ensure internet connection is active

## Learn More

- [Main Documentation](../README.md)
- [use-africa-pay Core](../../core/README.md)
