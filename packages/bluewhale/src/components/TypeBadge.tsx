import React from 'react';

export type AddressType = 'G' | 'M' | 'C' | 'UNKNOWN';

/**
 * Warning codes emitted by @redishfish/bluewhale-core that get dedicated
 * styling because ignoring them can lead to lost funds.
 */
export type HighRiskWarningCode = 'CONTRACT_SENDER_DETECTED' | 'MISSING_REQUIRED_MEMO';

interface WarningStyle {
  label: string;
  advice: string;
  backgroundColor: string;
  borderColor: string;
  color: string;
}

export const WARNING_STYLES: Record<HighRiskWarningCode, WarningStyle> = {
  CONTRACT_SENDER_DETECTED: {
    label: 'Contract sender',
    advice:
      'The sender is a smart contract (C-address). Contracts cannot attach memos, so exchange deposits from it may not be credited. Double-check the sending wallet before transferring.',
    backgroundColor: '#fee2e2', // red
    borderColor: '#fca5a5',
    color: '#991b1b',
  },
  MISSING_REQUIRED_MEMO: {
    label: 'Memo required',
    advice:
      'Exchange deposit requires memo. Enter the memo or deposit ID given by the recipient, or the funds may be lost.',
    backgroundColor: '#fef3c7', // amber
    borderColor: '#fcd34d',
    color: '#92400e',
  },
};

export const isHighRiskWarningCode = (code: string | undefined): code is HighRiskWarningCode =>
  !!code && Object.prototype.hasOwnProperty.call(WARNING_STYLES, code);

interface WarningBadgeProps {
  code: HighRiskWarningCode;
}

/** Small colored pill flagging a high-risk warning (red for contract sender, amber for memo). */
export const WarningBadge: React.FC<WarningBadgeProps> = ({ code }) => {
  const style = WARNING_STYLES[code];
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.125rem 0.5rem',
        borderRadius: '9999px',
        backgroundColor: style.backgroundColor,
        border: `1px solid ${style.borderColor}`,
        color: style.color,
        fontWeight: 'bold',
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
      }}
      data-warning-code={code}
    >
      {style.label}
    </span>
  );
};

interface TypeBadgeProps {
  type: AddressType;
  /**
   * Warning codes for the current address. CONTRACT_SENDER_DETECTED turns the
   * badge red and MISSING_REQUIRED_MEMO turns it amber (red wins if both).
   */
  warningCodes?: string[];
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, warningCodes = [] }) => {
  if (type === 'UNKNOWN') return null;

  let backgroundColor = '#e2e8f0'; // default gray
  let color = '#1e293b';

  switch (type) {
    case 'M':
      backgroundColor = '#d8b4fe'; // purple
      color = '#581c87';
      break;
    case 'G':
      backgroundColor = '#bfdbfe'; // blue
      color = '#1e3a8a';
      break;
    case 'C':
      backgroundColor = '#fdba74'; // orange
      color = '#9a3412';
      break;
  }

  const riskCode: HighRiskWarningCode | undefined = warningCodes.includes('CONTRACT_SENDER_DETECTED')
    ? 'CONTRACT_SENDER_DETECTED'
    : warningCodes.includes('MISSING_REQUIRED_MEMO')
      ? 'MISSING_REQUIRED_MEMO'
      : undefined;

  let title = `${type}-address`;
  if (riskCode) {
    backgroundColor = WARNING_STYLES[riskCode].backgroundColor;
    color = WARNING_STYLES[riskCode].color;
    title += ` – ${WARNING_STYLES[riskCode].label}`;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        backgroundColor,
        color,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        marginRight: '0.5rem',
        minWidth: '2rem',
        userSelect: 'none',
        boxShadow: riskCode ? `0 0 0 2px ${WARNING_STYLES[riskCode].borderColor}` : undefined
      }}
      title={title}
    >
      {type}
    </div>
  );
};
