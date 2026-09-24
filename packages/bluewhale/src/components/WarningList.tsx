import React from 'react';

interface WarningListProps {
  warnings: string[];
  /** DOM id so inputs can reference this list via aria-describedby. */
  id?: string;
}

export const WarningList: React.FC<WarningListProps> = ({ warnings, id }) => {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div
      id={id}
      role="alert"
      style={{
        marginTop: '0.5rem',
        padding: '0.75rem',
        backgroundColor: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '0.375rem',
        color: '#92400e',
        fontSize: '0.875rem'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
        <span aria-hidden="true">⚠️ </span>Warnings:
      </div>
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        {warnings.map((warning, idx) => (
          <li key={idx} style={{ marginBottom: '0.25rem' }}>
            {warning}
          </li>
        ))}
      </ul>
    </div>
  );
};
