import 'package:flutter/material.dart';

class SafePanel extends StatelessWidget {
  const SafePanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        Text('BigInt (stellar_address_kit)', style: TextStyle(fontWeight: FontWeight.bold)),
        Text('Placeholder for safe panel content'),
      ],
    );
  }
}
