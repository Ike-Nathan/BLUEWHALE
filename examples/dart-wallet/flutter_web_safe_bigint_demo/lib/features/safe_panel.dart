import 'package:flutter/material.dart';

class SafePanel extends StatelessWidget {
  const SafePanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        Text('BigInt (bluewhale_core)', style: TextStyle(fontWeight: FontWeight.bold)),
        Text('Placeholder for safe panel content'),
      ],
    );
  }
}
