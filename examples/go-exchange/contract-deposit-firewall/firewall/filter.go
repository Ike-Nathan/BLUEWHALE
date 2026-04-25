package firewall

// Decision represents the action to take for a deposit.
type Decision string

const (
	AutoCredit    Decision = "auto-credit"
	ManualReview  Decision = "manual-review"
	Quarantine    Decision = "quarantine"
)

// FilterDeposit evaluates a deposit address and returns a routing decision.
func FilterDeposit(address string) Decision {
	// Placeholder logic
	return AutoCredit
}
