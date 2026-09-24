import React, { useState, useMemo, useRef } from 'react';
import { TypeBadge, AddressType } from './components/TypeBadge';
import { WarningList } from './components/WarningList';
import { MemoField } from './components/MemoField';

// React 17 has no useId, so generate a per-instance id that stays stable
// across renders for the aria-* relationships below.
let idCounter = 0;
const useStableId = (prefix: string): string => {
  const ref = useRef<string>();
  if (!ref.current) ref.current = `${prefix}-${++idCounter}`;
  return ref.current;
};

const TYPE_ANNOUNCEMENTS: Record<AddressType, string> = {
  G: 'Standard account address (G) detected.',
  M: 'Muxed account address (M) detected.',
  C: 'Contract address (C) detected.',
  UNKNOWN: 'Unrecognized address format.',
};

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export const AddressInput: React.FC = () => {
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');

  const baseId = useStableId('bluewhale-address');
  const inputId = `${baseId}-input`;
  const warningsId = `${baseId}-warnings`;
  const statusId = `${baseId}-status`;

  const type = useMemo<AddressType>(() => {
    if (!address) return 'UNKNOWN';
    const firstChar = address.charAt(0).toUpperCase();
    if (firstChar === 'M') return 'M';
    if (firstChar === 'G') return 'G';
    if (firstChar === 'C') return 'C';
    return 'UNKNOWN';
  }, [address]);

  const showMemo = type === 'G' || type === 'UNKNOWN';

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (type === 'C') {
      list.push('Contract addresses cannot be used for standard payments.');
    }
    return list;
  }, [type]);

  // Invalid = unrecognized prefix; unroutable = contract destination.
  const isInvalid = !!address && (type === 'UNKNOWN' || type === 'C');

  return (
    <div style={{ maxWidth: '32rem', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <label htmlFor={inputId} style={visuallyHidden}>
        Stellar destination address
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {type !== 'UNKNOWN' && (
          <div style={{ position: 'absolute', left: '0.5rem' }} aria-hidden="true">
            <TypeBadge type={type} />
          </div>
        )}
        <input
          id={inputId}
          type="text"
          placeholder="Paste Stellar address (G..., M..., C...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          aria-invalid={isInvalid}
          aria-describedby={warnings.length > 0 ? warningsId : undefined}
          style={{
            width: '100%',
            padding: `0.75rem 0.75rem 0.75rem ${type !== 'UNKNOWN' ? '3rem' : '0.75rem'}`,
            border: `1px solid ${isInvalid ? '#f87171' : '#cbd5e1'}`,
            borderRadius: '0.5rem',
            fontSize: '1rem',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'padding 0.2s ease'
          }}
        />
      </div>

      {/* Screen-reader announcement of the detected address type. */}
      <div id={statusId} aria-live="polite" aria-atomic="true" style={visuallyHidden}>
        {address ? TYPE_ANNOUNCEMENTS[type] : ''}
      </div>

      <MemoField isVisible={showMemo && !!address} value={memo} onChange={setMemo} />

      <WarningList id={warningsId} warnings={warnings} />
    </div>
  );
};
