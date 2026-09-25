package address

import (
	"errors"
	"strings"
	"testing"
)

func TestParseMuxedAddress(t *testing.T) {
	const baseG = "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI"

	tests := []struct {
		name       string
		mAddress   string
		wantBaseG  string
		wantMuxed  uint64
		shouldFail bool
	}{
		{
			name:      "decode id=0 boundary case",
			mAddress:  "MAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQACAAAAAAAAAAAAD672",
			wantBaseG: baseG,
			wantMuxed: 0,
		},
		{
			name:      "decode id=1 small positive case",
			mAddress:  "MAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQACAAAAAAAAAAAAHOO2",
			wantBaseG: baseG,
			wantMuxed: 1,
		},
		{
			name:      "decode id=2^53 precision boundary",
			mAddress:  "MAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQACABAAAAAAAAAAAFZG",
			wantBaseG: baseG,
			wantMuxed: 9007199254740992,
		},
		{
			name:      "decode id=2^53+1 interop canary",
			mAddress:  "MAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQACABAAAAAAAAAAEVIG",
			wantBaseG: baseG,
			wantMuxed: 9007199254740993,
		},
		{
			name:      "decode id=2^64-1 max uint64",
			mAddress:  "MAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQAD7777777777774OFW",
			wantBaseG: baseG,
			wantMuxed: 18446744073709551615,
		},
		{
			name:       "invalid M-address should return error",
			mAddress:   "MZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
			shouldFail: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			addr, err := Parse(tt.mAddress)

			if tt.shouldFail {
				if err == nil {
					t.Fatalf("expected error, got none")
				}
				return
			}

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if addr.Kind != KindM {
				t.Fatalf("expected KindM, got %v", addr.Kind)
			}

			if addr.Raw != tt.mAddress {
				t.Errorf("Raw = %s, want %s", addr.Raw, tt.mAddress)
			}

			if addr.BaseG != tt.wantBaseG {
				t.Errorf("BaseG = %s, want %s", addr.BaseG, tt.wantBaseG)
			}

			if addr.MuxedID != tt.wantMuxed {
				t.Errorf("MuxedID = %d, want %d", addr.MuxedID, tt.wantMuxed)
			}
		})
	}
}

const (
	benchG = "GAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQADRSI"
	benchM = "MAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQACABAAAAAAAAAAEVIG"
	// benchC is the contract address for an all-zero 32-byte payload.
	benchC = "CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4"
)

// benchSink keeps benchmark results live so the compiler cannot elide calls.
var benchSink interface{}

func benchmarkDetect(b *testing.B, addr string) {
	b.Helper()
	if _, err := Detect(addr); err != nil {
		b.Fatalf("Detect(%q) unexpected error: %v", addr, err)
	}
	b.ReportAllocs()
	b.ResetTimer()
	var kind AddressKind
	for i := 0; i < b.N; i++ {
		kind, _ = Detect(addr)
	}
	benchSink = kind
}

func BenchmarkDetect_G(b *testing.B) { benchmarkDetect(b, benchG) }
func BenchmarkDetect_M(b *testing.B) { benchmarkDetect(b, benchM) }
func BenchmarkDetect_C(b *testing.B) { benchmarkDetect(b, benchC) }

func benchmarkParse(b *testing.B, addr string, wantErr bool) {
	b.Helper()
	if _, err := Parse(addr); (err != nil) != wantErr {
		b.Fatalf("Parse(%q) error = %v, wantErr %v", addr, err, wantErr)
	}
	b.ReportAllocs()
	b.ResetTimer()
	var parsed *Address
	for i := 0; i < b.N; i++ {
		parsed, _ = Parse(addr)
	}
	benchSink = parsed
}

func BenchmarkParse_G(b *testing.B)          { benchmarkParse(b, benchG, false) }
func BenchmarkParse_M(b *testing.B)          { benchmarkParse(b, benchM, false) }
func BenchmarkParse_C(b *testing.B)          { benchmarkParse(b, benchC, false) }
func BenchmarkParse_LowercaseG(b *testing.B) { benchmarkParse(b, strings.ToLower(benchG), false) }

// BenchmarkParse_BadChecksum exercises the validation-failure path.
func BenchmarkParse_BadChecksum(b *testing.B) {
	benchmarkParse(b, benchG[:len(benchG)-1]+"J", true)
}

// BenchmarkParse_UnknownPrefix exercises the early prefix rejection.
func BenchmarkParse_UnknownPrefix(b *testing.B) {
	benchmarkParse(b, "S"+benchG[1:], true)
}

func TestParseErrorCodes(t *testing.T) {
	tests := []struct {
		name  string
		input string
		code  ErrorCode
	}{
		{name: "empty", input: "", code: ErrInvalidLength},
		{name: "too short", input: "GA", code: ErrInvalidLength},
		{name: "seed key prefix", input: "S" + benchG[1:], code: ErrUnknownPrefix},
		{name: "unknown prefix", input: "INVALID", code: ErrUnknownPrefix},
		{name: "bad checksum", input: benchG[:len(benchG)-1] + "J", code: ErrInvalidChecksum},
		{name: "bad base32", input: "G1111", code: ErrInvalidBase32},
		{name: "non-zero trailing bits", input: "MAYCUYT553C5LHVE2XPW5GMEJT4BXGM7AHMJWLAPZP53KJO7EIQACAAAAAAAAAAAAD673", code: ErrInvalidBase32},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := Parse(tt.input)
			if err == nil {
				t.Fatalf("Parse(%q) expected error", tt.input)
			}
			var re RoutingError
			if !errors.As(err, &re) {
				t.Fatalf("Parse(%q) error %T is not RoutingError", tt.input, err)
			}
			if re.Code != tt.code {
				t.Errorf("Parse(%q) code = %s, want %s", tt.input, re.Code, tt.code)
			}
			if re.Input != tt.input {
				t.Errorf("Parse(%q) Input = %q", tt.input, re.Input)
			}
		})
	}
}

func TestDecodeStrKeyErrorsMatchSentinels(t *testing.T) {
	tests := []struct {
		input string
		want  error
	}{
		{input: "", want: ErrInvalidLengthError},
		{input: "S" + benchG[1:], want: ErrUnknownPrefixError},
		{input: benchG[:len(benchG)-1] + "J", want: ErrInvalidChecksumError},
		{input: "G1111", want: ErrInvalidBase32Error},
	}
	for _, tt := range tests {
		_, _, err := DecodeStrKey(tt.input)
		if !errors.Is(err, tt.want) {
			t.Errorf("DecodeStrKey(%q) = %v, want errors.Is %v", tt.input, err, tt.want)
		}
	}
}

func TestParseLowercaseReturnsCanonicalRaw(t *testing.T) {
	addr, err := Parse(strings.ToLower(benchM))
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if addr.Raw != benchM {
		t.Errorf("Raw = %s, want %s", addr.Raw, benchM)
	}
	if addr.BaseG != benchG || addr.MuxedID != 9007199254740993 {
		t.Errorf("BaseG/MuxedID = %s/%d", addr.BaseG, addr.MuxedID)
	}
}
