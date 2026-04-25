import 'package:flutter/material.dart';

class UnsafePanel extends StatelessWidget {
  const UnsafePanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: const [
        Text('Standard int', style: TextStyle(fontWeight: FontWeight.bold)),
        Text('Placeholder for unsafe panel content'),
      ],
    );
  }
}
