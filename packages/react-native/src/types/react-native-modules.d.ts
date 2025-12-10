// Type declarations for react-native-flutterwave
declare module 'react-native-flutterwave' {
  import { Component } from 'react';
  import { StyleProp, ViewStyle, TextStyle } from 'react-native';

  export interface FlutterwaveInitOptions {
    tx_ref: string;
    authorization: string;
    amount: number;
    currency: string;
    payment_options?: string;
    customer: {
      email: string;
      name: string;
      phonenumber: string;
    };
    customizations?: {
      title?: string;
      description?: string;
      logo?: string;
    };
    meta?: Record<string, any>;
  }

  export interface FlutterwaveButtonProps {
    style?: StyleProp<ViewStyle>;
    buttonText?: string;
    options: FlutterwaveInitOptions;
    onRedirect: (data: any) => void;
    textStyle?: StyleProp<TextStyle>;
  }

  export class FlutterwaveButton extends Component<FlutterwaveButtonProps> {}
}

// Type declarations for react-native-paystack-webview
declare module 'react-native-paystack-webview' {
  import { Component } from 'react';

  export namespace paystackProps {
    export interface PayStackRef {
      startTransaction: () => void;
      endTransaction: () => void;
    }

    export interface PayStackProps {
      paystackKey: string;
      amount: number;
      billingEmail: string;
      billingName?: string;
      billingMobile?: string;
      channels?: string[];
      currency?: string;
      refNumber?: string;
      onCancel: () => void;
      onSuccess: (response: any) => void;
      autoStart?: boolean;
    }
  }

  export class Paystack extends Component<paystackProps.PayStackProps> {
    startTransaction: () => void;
    endTransaction: () => void;
  }
}
