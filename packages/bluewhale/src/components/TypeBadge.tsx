import React, { CSSProperties } from 'react';

export type AddressType = 'G' | 'M' | 'C' | 'UNKNOWN';

interface TypeBadgeProps {
  type: AddressType;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
  /** Inline styles applied to the root element. */
  style?: CSSProperties;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className, style }) => {
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

  const rootClass = ['bw-type-badge', `bw-type-badge--${type.toLowerCase()}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={rootClass}
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
        ...style,
      }}
      title={`${type}-address`}
    >
      {type}
    </div>
  );
};
