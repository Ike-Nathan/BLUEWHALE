# Displaying Deposit Addresses in Flutter

When building a Stellar wallet in Flutter, one of the first features you'll need is the ability to generate and display a deposit address for your users. If you are using a pooled account architecture, you must provide the user with both the base address and a unique memo or muxed ID.

This guide explains how to leverage the `stellar-address-kit` to safely format and display deposit addresses in a Flutter UI.

## Prerequisites

Make sure you have added the `core-dart` package to your `pubspec.yaml`:

```yaml
dependencies:
  stellar_address_kit: ^1.0.0
```

## Muxed Addresses vs. Base Address + Memo

You have two primary ways to display a deposit address to a user:
1. **Muxed Address (M-Address):** A single string starting with `M` that encodes both the base `G` address and a 64-bit integer ID.
2. **Base Address + Memo:** Displaying the `G` address and a separate `Memo` field (often a Memo ID or Memo Text).

The `stellar-address-kit` helps you easily convert between these representations to support whatever UI format you prefer.

## Displaying a Muxed Address

If your backend issues a user ID (e.g., `123456789`) and your pooled account is `GA...`, you can encode this into a Muxed Address.

```dart
import 'package:stellar_address_kit/stellar_address_kit.dart';

// Your pooled account base address
final String baseAddress = 'GA7QYNF7SOWQ3GLR2B6RS22TBGZAOR6KLYH4PA5ZAM73A3H4K2HZZSQU';
final int userId = 123456789;

// Generate the Muxed Address
final String muxedAddress = AddressEncoder.encodeMuxedAddress(baseAddress, userId);

print('Your Deposit Address is: $muxedAddress');
```

You can now feed this `muxedAddress` string directly into a QR code generator plugin (like `qr_flutter`).

## Displaying Base Address and Memo Separately

Many exchanges and wallets still prompt users for a Memo explicitly. If you prefer or need to display them separately, you can extract the components from a Muxed address or just display them directly.

```dart
import 'package:flutter/material.dart';
import 'package:stellar_address_kit/stellar_address_kit.dart';

class DepositScreen extends StatelessWidget {
  final String baseAddress = 'GA7QYNF7SOWQ3GLR2B6RS22TBGZAOR6KLYH4PA5ZAM73A3H4K2HZZSQU';
  final int userId = 123456789;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Send XLM to this address:'),
        SelectableText(baseAddress, style: TextStyle(fontWeight: FontWeight.bold)),
        SizedBox(height: 20),
        Text('IMPORTANT: You must include this Memo ID:'),
        SelectableText(userId.toString(), style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold)),
      ],
    );
  }
}
```

## Validating User Input for Withdrawals

When a user wants to withdraw funds, they might paste a destination address. You can use the kit to validate it and optionally decode it to show them exactly where it's going.

```dart
String userInput = 'MA7QYNF7SOWQ3GLR2B6RS22TBGZAOR6KLYH4PA5ZAM73A3H4K2HZZSQU...';

if (AddressValidator.isValid(userInput)) {
  if (AddressValidator.isMuxed(userInput)) {
    final decoded = AddressDecoder.decodeMuxedAddress(userInput);
    print('Sending to Base: ${decoded.baseAddress}');
    print('With Memo ID: ${decoded.id}');
  } else {
    print('Sending to standard account: $userInput');
  }
} else {
  print('Invalid Stellar Address');
}
```

## Summary
Using `stellar-address-kit` in Flutter ensures that whenever you display or parse an address, you are strictly following standard Stellar SEP specifications, drastically reducing the risk of lost user funds.
