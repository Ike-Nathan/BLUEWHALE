package address

type ErrorCode string

const (
	ErrInvalidChecksum               ErrorCode = "INVALID_CHECKSUM"
	ErrInvalidLength                 ErrorCode = "INVALID_LENGTH"
	ErrInvalidBase32                 ErrorCode = "INVALID_BASE32"
	ErrRejectedSeedKey               ErrorCode = "REJECTED_SEED_KEY"
	ErrRejectedPreauth               ErrorCode = "REJECTED_PREAUTH"
	ErrRejectedHashX                 ErrorCode = "REJECTED_HASH_X"
	ErrFederationAddressNotSupported ErrorCode = "FEDERATION_ADDRESS_NOT_SUPPORTED"
	ErrUnknownPrefix                 ErrorCode = "UNKNOWN_PREFIX"
)
