import sys
from collections import Counter


def print_summary(rows: list[dict]) -> None:
    total = len(rows)
    by_type = Counter(r.get("address_type", "UNKNOWN") for r in rows)
    by_risk = Counter(r.get("risk_label", "UNKNOWN") for r in rows)

    def _row(label: str, value) -> str:
        return f"| {label:<28} {str(value):<20} |"

    width = 52
    border = "+" + "-" * (width - 2) + "+"
    header = "| {:^{w}} |".format("COMPLIANCE SUMMARY", w=width - 4)

    lines = [
        border,
        header,
        border,
        _row("Total transactions:", total),
        border,
        _row("ADDRESS TYPE", "COUNT"),
        border,
    ]
    for addr_type, count in sorted(by_type.items()):
        lines.append(_row(addr_type, count))
    lines += [
        border,
        _row("RISK LABEL", "COUNT"),
        border,
    ]
    for risk, count in sorted(by_risk.items()):
        lines.append(_row(risk, count))
    lines.append(border)

    print("\n".join(lines), file=sys.stderr)
