# Handling Incoming Payments in your Wallet

When your Flutter wallet application needs to track incoming payments, it must listen to the Stellar network (Horizon or Soroban RPC) and appropriately identify the destination of the incoming funds.

This guide outlines how to use the Dart implementation of `stellar-address-kit` to reconcile incoming payments.

## Listening for Payments

Typically, your application backend listens to the network and sends push notifications or WebSocket events to your Flutter app. However, if your Flutter app queries Horizon directly for its transaction history, it needs to parse the results.

### Querying Horizon in Dart

Assume you are using the official `stellar_flutter_sdk` to query a user's transaction history. The user's deposit address is a Muxed Address.

```dart
import 'package:stellar_flutter_sdk/stellar_flutter_sdk.dart';
import 'package:stellar_address_kit/stellar_address_kit.dart';

Future<void> fetchPayments(String userMuxedAddress) async {
  final server = StellarSDK.TESTNET;
  
  // We extract the base address to query Horizon, as Horizon requires the base G-address.
  final decoded = AddressDecoder.decodeMuxedAddress(userMuxedAddress);
  
  // Query payments for the pooled account
  Page<OperationResponse> payments = await server.payments.forAccount(decoded.baseAddress).execute();

  for (var payment in payments.records) {
    if (payment is PaymentOperationResponse) {
       // Reconcile the payment
       _reconcilePayment(payment, decoded.id);
    }
  }
}
```

## Reconciling the Payment

When an incoming payment arrives at the pooled `G` address, you must determine if it was intended for the specific user by matching the Memo ID or the Muxed ID.

```dart
void _reconcilePayment(PaymentOperationResponse payment, int expectedId) async {
  int? paymentId;

  // 1. Check if the payment was sent to a Muxed Address
  if (payment.to != null && payment.to!.startsWith('M')) {
     final decodedTo = AddressDecoder.decodeMuxedAddress(payment.to!);
     paymentId = decodedTo.id;
  } 
  // 2. Check if the transaction has a Memo ID
  else {
     // You'll need to fetch the transaction details to read the memo
     final tx = await StellarSDK.TESTNET.transactions.transaction(payment.transactionHash);
     if (tx.memo is MemoId) {
        paymentId = (tx.memo as MemoId).getId();
     }
  }

  // 3. Match against the user's expected ID
  if (paymentId == expectedId) {
    print('Found a deposit of ${payment.amount} ${payment.assetCode} for the user!');
  }
}
```

## Dealing with Missing Memos

A common issue is users sending funds to the pooled address but forgetting to attach the required memo.

The standard best practice is:
1. Identify payments where `payment.to` is the base `G` address.
2. Confirm the transaction `Memo` is `Memo.none`.
3. Route these to a "Suspense" or "Requires Manual Intervention" ledger on your backend.
4. Provide a UI in your Flutter app where users can "Claim a lost deposit" by pasting the transaction hash.

## BigInt Considerations

Remember that Stellar Memo IDs and Muxed IDs are 64-bit integers. Dart represents these accurately on native platforms (iOS/Android), but if you compile to Flutter Web, Dart's `int` maps to JavaScript's `Number` which loses precision for large 64-bit integers.

Always verify you are handling large IDs correctly if targeting the web. See the [Flutter Web BigInt Guide](flutter-web-bigint.md) for more details.
