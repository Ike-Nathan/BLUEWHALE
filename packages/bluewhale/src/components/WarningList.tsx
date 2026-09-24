import React from 'react';
import { WarningBadge, WARNING_STYLES, isHighRiskWarningCode } from './TypeBadge';

/** Structured warning, compatible with the Warning objects from @redishfish/bluewhale-core. */
export interface BluewhaleWarning {
  code?: string;
  message?: string;
  severity?: 'info' | 'warn' | 'error';
}

export type WarningItem = string | BluewhaleWarning;

interface WarningListProps {
  warnings: WarningItem[];
  /** DOM id so inputs can reference this list via aria-describedby. */
  id?: string;
}

const normalize = (warning: WarningItem): BluewhaleWarning =>
  typeof warning === 'string' ? { message: warning } : warning;

export const WarningList: React.FC<WarningListProps> = ({ warnings, id }) => {
  if (!warnings || warnings.length === 0) return null;

  const items = warnings.map(normalize);
  // Escalate the container to red if a contract sender is involved.
  const hasContractSender = items.some((w) => w.code === 'CONTRACT_SENDER_DETECTED');
  const containerStyle = hasContractSender
    ? WARNING_STYLES.CONTRACT_SENDER_DETECTED
    : { backgroundColor: '#fffbeb', borderColor: '#fde68a', color: '#92400e' };

  return (
    <div
      id={id}
      role="alert"
      style={{
        marginTop: '0.5rem',
        padding: '0.75rem',
        backgroundColor: containerStyle.backgroundColor,
        border: `1px solid ${containerStyle.borderColor}`,
        borderRadius: '0.375rem',
        color: containerStyle.color,
        fontSize: '0.875rem'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
        <span aria-hidden="true">⚠️ </span>Warnings:
      </div>
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        {items.map((warning, idx) => {
          if (isHighRiskWarningCode(warning.code)) {
            const style = WARNING_STYLES[warning.code];
            return (
              <li key={idx} style={{ marginBottom: '0.5rem', color: style.color }}>
                <WarningBadge code={warning.code} />
                <div style={{ marginTop: '0.25rem' }}>{style.advice}</div>
                {warning.message && warning.message !== style.advice && (
                  <div style={{ marginTop: '0.125rem', fontSize: '0.75rem', opacity: 0.85 }}>
                    {warning.message}
                  </div>
                )}
              </li>
            );
          }
          return (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>
              {warning.message ?? warning.code}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
