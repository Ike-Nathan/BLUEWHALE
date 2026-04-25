package firewall

// Stats returns placeholder firewall statistics.
func Stats() map[string]int {
	return map[string]int{
		"processed": 0,
		"flagged":   0,
	}
}
