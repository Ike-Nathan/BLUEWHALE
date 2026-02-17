import '../address/codes.dart';

class RoutingInput {
  final String destination;
  final String memoType;
  final String? memoValue;
  final String? sourceAccount;

  RoutingInput({
    required this.destination,
    required this.memoType,
    this.memoValue,
    this.sourceAccount,
  });
}

class RoutingResult {
  final String? destinationBaseAccount;
  final String? routingId; // decimal uint64 string — spec level
  final String routingSource; // 'muxed' | 'memo' | 'none'
  final List<Warning> warnings;
  final DestinationError? destinationError;

  RoutingResult({
    this.destinationBaseAccount,
    this.routingId,
    required this.routingSource,
    required this.warnings,
    this.destinationError,
  });

  BigInt? get routingIdAsBigInt =>
      routingId != null ? BigInt.parse(routingId!) : null;
}

class DestinationError {
  final String code; // ErrorCode constant
  final String message;

  DestinationError({required this.code, required this.message});
}
