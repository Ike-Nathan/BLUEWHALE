package firewall

import "testing"

func TestFilterDeposit(t *testing.T) {
	// Placeholder test
	decision := FilterDeposit("G...")
	if decision != AutoCredit {
		t.Errorf("expected AutoCredit, got %s", decision)
	}
}
