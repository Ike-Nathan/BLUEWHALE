import React, { CSSProperties } from 'react';

interface MemoFieldProps {
  isVisible: boolean;
  value: string;
  onChange: (value: string) => void;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Inline styles applied to the root element. */
  style?: CSSProperties;
}

export const MemoField: React.FC<MemoFieldProps> = ({
  isVisible,
  value,
  onChange,
  className,
  style,
}) => {
  if (!isVisible) return null;

  const rootClass = ['bw-memo-field', className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClass}
      style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', ...style }}
    >
      <label
        htmlFor="memo-input"
        className="bw-memo-field__label"
        style={{ fontSize: '0.875rem', fontWeight: '500', color: '#475569', marginBottom: '0.25rem' }}
      >
        Memo (Optional)
      </label>
      <input
        id="memo-input"
        type="text"
        placeholder="Enter memo here"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bw-memo-field__input"
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          border: '1px solid #cbd5e1',
          borderRadius: '0.375rem',
          fontSize: '1rem',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />
      <div
        className="bw-memo-field__hint"
        style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}
      >
        A memo is sometimes required by exchanges.
      </div>
    </div>
  );
};
