import React, { useState, useMemo, useRef } from 'react';
import { extractRoutingFromURI } from '@redishfish/bluewhale-core';
import { TypeBadge, AddressType } from './components/TypeBadge';
import { WarningList, WarningItem } from './components/WarningList';
import { MemoField } from './components/MemoField';

// React 17 has no useId, so generate a per-instance id that stays stable
// across renders for the aria-* relationships below.
let idCounter = 0;
const useStableId = (prefix: string): string => {
  const ref = useRef<string>();
  if (!ref.current) ref.current = `${prefix}-${++idCounter}`;
  return ref.current;
};

const EMPTY_WARNINGS: WarningItem[] = [];

const SEP7_SCHEME = 'web+stellar:';

const isSep7URI = (value: string): boolean =>
  value.trim().toLowerCase().startsWith(SEP7_SCHEME);

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

export interface AddressInputProps {
  /**
   * Extra warnings from the host app, e.g. core Warning objects such as
   * MISSING_REQUIRED_MEMO (from checkMemoRequirement) or CONTRACT_SENDER_DETECTED.
   */
  warnings?: WarningItem[];
}

export const AddressInput: React.FC<AddressInputProps> = ({ warnings: externalWarnings = EMPTY_WARNINGS }) => {
  const [address, setAddress] = useState('');
  const [memo, setMemo] = useState('');
  // Set when the current address/memo came from a decoded SEP-0007 URI.
  const [decodedFromURI, setDecodedFromURI] = useState(false);
  const [uriWarnings, setUriWarnings] = useState<WarningItem[]>(EMPTY_WARNINGS);

  /**
   * Handle raw input. A pasted/scanned `web+stellar:pay?...` URI is parsed
   * with extractRoutingFromURI and its destination and memo populate the
   * fields; anything else is taken as a plain address.
   */
  const handleInput = (raw: string) => {
    if (!isSep7URI(raw)) {
      setAddress(raw);
      setDecodedFromURI(false);
      setUriWarnings(EMPTY_WARNINGS);
      return;
    }

    const trimmed = raw.trim();
    // The core parser matches the scheme case-sensitively; normalize it.
    const result = extractRoutingFromURI(SEP7_SCHEME + trimmed.slice(SEP7_SCHEME.length));
    if (result.success) {
      setAddress(result.rawParams.destination);
      setMemo(result.rawParams.memo ?? '');
      setDecodedFromURI(true);
      setUriWarnings(result.routing.warnings);
    } else {
      // Error text from core is already sanitized of sensitive query values.
      setAddress(trimmed);
      setDecodedFromURI(false);
      setUriWarnings([{ code: result.code, message: `Could not decode Stellar URI: ${result.error}`, severity: 'error' }]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (isSep7URI(pasted)) {
      e.preventDefault();
      handleInput(pasted);
    }
  };

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

  const warnings = useMemo(() => {
    const list: WarningItem[] = [];
    if (type === 'C') {
      list.push('Contract addresses cannot be used for standard payments.');
    }
    return [...list, ...uriWarnings, ...externalWarnings];
  }, [type, uriWarnings, externalWarnings]);

  const warningCodes = useMemo(
    () => warnings.flatMap((w) => (typeof w !== 'string' && w.code ? [w.code] : [])),
    [warnings]
  );

  // A memo-required destination must always expose the memo field.
  const showMemo = type === 'G' || type === 'UNKNOWN' || warningCodes.includes('MISSING_REQUIRED_MEMO');

  // Invalid = unrecognized prefix; unroutable = contract destination.
  const isInvalid =
    !!address &&
    (type === 'UNKNOWN' ||
      type === 'C' ||
      uriWarnings.some((w) => typeof w !== 'string' && w.severity === 'error'));

  return (
    <div style={{ maxWidth: '32rem', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <label htmlFor={inputId} style={visuallyHidden}>
        Stellar destination address
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {type !== 'UNKNOWN' && (
          <div style={{ position: 'absolute', left: '0.5rem' }} aria-hidden="true">
            <TypeBadge type={type} warningCodes={warningCodes} />
          </div>
        )}
        <input
          id={inputId}
          type="text"
          placeholder="Paste Stellar address (G..., M..., C...)"
          value={address}
          onChange={(e) => handleInput(e.target.value)}
          onPaste={handlePaste}
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

      {decodedFromURI && (
        <div style={{ marginTop: '0.5rem' }}>
          <span
            role="status"
            style={{
              display: 'inline-block',
              padding: '0.125rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              color: '#166534',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}
          >
            Stellar payment URI auto-decoded
            {memo ? ' – destination and memo filled in' : ' – destination filled in'}
          </span>
        </div>
      )}

      {/* Screen-reader announcement of the detected address type. */}
      <div id={statusId} aria-live="polite" aria-atomic="true" style={visuallyHidden}>
        {address ? TYPE_ANNOUNCEMENTS[type] : ''}
      </div>

      <MemoField isVisible={showMemo && !!address} value={memo} onChange={setMemo} />

      <WarningList id={warningsId} warnings={warnings} />
    </div>
  );
};
