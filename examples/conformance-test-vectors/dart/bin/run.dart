import 'dart:convert';
import 'dart:io';
import 'package:stellar_address_kit/stellar_address_kit.dart';

void main() {
  final file = File('../../../spec/vectors.json');
  if (!file.existsSync()) {
    print('Error: vectors.json not found at ${file.path}');
    exit(1);
  }
  final content = file.readAsStringSync();
  final json = jsonDecode(content);
  final cases = json['cases'] as List;

  int passed = 0;
  int failed = 0;

  for (final testCase in cases) {
    final module = testCase['module'];
    final desc = testCase['description'];
    final input = testCase['input'];
    final expected = testCase['expected'];

    bool success = false;
    String errorMsg = '';

    try {
      if (module == 'muxed_encode') {
        success = runMuxedEncode(input, expected);
      } else if (module == 'muxed_decode') {
        success = runMuxedDecode(input, expected);
      } else if (module == 'detect') {
        success = runDetect(input, expected);
      } else if (module == 'extract_routing') {
        success = runExtractRouting(input, expected);
      } else {
        success = false;
        errorMsg = 'Unknown module: $module';
      }
    } catch (e) {
      if (expected.containsKey('expected_error')) {
        success = true;
      } else {
        success = false;
        errorMsg = 'Unexpected exception: $e';
      }
    }

    if (success) {
      passed++;
    } else {
      failed++;
      print('FAILED: [$module] $desc');
      if (errorMsg.isNotEmpty) print('  Reason: $errorMsg');
    }
  }

  print('');
  print('Passed: $passed, Failed: $failed');
  if (failed > 0) {
    exit(1);
  }
}

bool runMuxedEncode(Map input, Map expected) {
  final baseG = input['base_g'];
  final id = BigInt.parse(input['id']);
  try {
    final encoded = MuxedAddress.encode(baseG: baseG, id: id);
    if (expected.containsKey('mAddress')) {
      if (encoded != expected['mAddress']) {
        print('  Expected mAddress ${expected['mAddress']}, got $encoded');
        return false;
      }
    }
  } catch (e) {
    if (expected.containsKey('expected_error')) {
      return true;
    }
    rethrow;
  }
  return true;
}

bool runMuxedDecode(Map input, Map expected) {
  final mAddress = input['mAddress'];
  try {
    final decoded = MuxedAddress.decode(mAddress);
    if (expected.containsKey('expected_error')) {
      print('  Expected error ${expected['expected_error']}, but succeeded');
      return false;
    }
    // Handle both 'base_g' and 'baseG' from test vectors
    final expectedBaseG = expected['base_g'] ?? expected['baseG'];
    if (expectedBaseG != null && decoded.baseG != expectedBaseG) {
      print('  Expected baseG $expectedBaseG, got ${decoded.baseG}');
      return false;
    }
    if (expected.containsKey('id') && decoded.id.toString() != expected['id']) {
      print('  Expected id ${expected['id']}, got ${decoded.id}');
      return false;
    }
  } catch (e) {
    if (expected.containsKey('expected_error')) {
      return true;
    }
    rethrow;
  }
  return true;
}

bool runDetect(Map input, Map expected) {
  final address = input['address'];
  final result = detect(address);
  
  if (expected.containsKey('kind')) {
    final expectedKindStr = expected['kind'].toString().toLowerCase();
    if (result == null) {
      print('  Expected kind ${expected['kind']}, got null');
      return false;
    }
    if (result.name.toLowerCase() != expectedKindStr) {
      print('  Expected kind $expectedKindStr, got ${result.name.toLowerCase()}');
      return false;
    }
  } else if (expected.containsKey('expected_error')) {
    if (result != null) {
      print('  Expected null/error, got $result');
      return false;
    }
  }
  return true;
}

bool runExtractRouting(Map input, Map expected) {
  final routingInput = RoutingInput(
    destination: input['destination'],
    memoType: input['memoType'] ?? 'none',
    memoValue: input['memoValue']?.toString(),
  );
  
  RoutingResult result;
  try {
    result = extractRouting(routingInput);
  } catch (e) {
    if (expected.containsKey('expected_error')) return true;
    print('  Unexpected exception: $e');
    rethrow;
  }
  
  if (expected.containsKey('destinationBaseAccount')) {
    if (result.destinationBaseAccount != expected['destinationBaseAccount']) {
      print('  Expected destinationBaseAccount ${expected['destinationBaseAccount']}, got ${result.destinationBaseAccount}. Full result: $result');
      return false;
    }
  }
  
  if (expected.containsKey('routingId')) {
    final expectedId = expected['routingId']?.toString();
    final actualId = result.id?.toString();
    if (actualId != expectedId) {
      print('  Expected routingId $expectedId, got $actualId');
      return false;
    }
  }
  
  if (expected.containsKey('routingSource')) {
    if (result.source.name != expected['routingSource']) {
      print('  Expected routingSource ${expected['routingSource']}, got ${result.source.name}');
      return false;
    }
  }
  
  if (expected.containsKey('warnings')) {
    final expectedWarnings = expected['warnings'] as List;
    if (expectedWarnings.length != result.warnings.length) {
      print('  Expected ${expectedWarnings.length} warnings, got ${result.warnings.length}');
      return false;
    }
    
    for (int i = 0; i < expectedWarnings.length; i++) {
      final ew = expectedWarnings[i];
      final rw = result.warnings[i];
      
      if (ew['code'] != rw.code || ew['severity'] != rw.severity) {
        print('  Warning mismatch at index $i. Expected ${ew['code']}/${ew['severity']}, got ${rw.code}/${rw.severity}');
        return false;
      }
    }
  }
  
  return true;
}
