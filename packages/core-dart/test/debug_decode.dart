import 'package:stellar_address_kit/stellar_address_kit.dart';

void main() {
  const baseG = 'GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI';
  try {
    print('Testing decode on G address...');
    final result = MuxedAddress.decode(baseG);
    print('Result: $result');
  } catch (e) {
    print('Caught expected error: $e');
  }
}
