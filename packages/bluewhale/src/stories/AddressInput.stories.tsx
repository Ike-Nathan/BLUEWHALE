/**
 * Ladle stories for AddressInput.
 *
 * Run:  npm run ladle
 * Build: npm run build-storybook
 */
import React, { useState } from 'react';
import type { Story } from '@ladle/react';
import { AddressInput, RoutingResult } from '../AddressInput';

// ─── Default (empty) ──────────────────────────────────────────────────────────

export const Default: Story = () => <AddressInput />;
Default.storyName = 'Default (empty)';

// ─── G-address ────────────────────────────────────────────────────────────────

export const GAddress: Story = () => {
  const [value, setValue] = useState(
    'GA7QYNF7SOWQ3GLR2BGMZEHXAVIRZA4KVWLT7AV7Y6S33Z6YXUFHBZP'
  );
  return (
    <div>
      <p style={{ fontFamily: 'sans-serif', marginBottom: '1rem', color: '#475569' }}>
        Classic G-address — memo field is visible.
      </p>
      <AddressInput />
    </div>
  );
};
GAddress.storyName = 'G-address';

// ─── M-address (muxed) ────────────────────────────────────────────────────────

export const MAddress: Story = () => (
  <div>
    <p style={{ fontFamily: 'sans-serif', marginBottom: '1rem', color: '#475569' }}>
      Muxed M-address — routing ID is encoded in the address; memo field is hidden.
    </p>
    <AddressInput />
  </div>
);
MAddress.storyName = 'M-address (muxed)';

// ─── C-address ────────────────────────────────────────────────────────────────

export const CAddress: Story = () => (
  <div>
    <p style={{ fontFamily: 'sans-serif', marginBottom: '1rem', color: '#475569' }}>
      Contract address — triggers an error warning and marks the input as invalid.
    </p>
    <AddressInput />
  </div>
);
CAddress.storyName = 'C-address (contract – invalid)';

// ─── Memo warnings ────────────────────────────────────────────────────────────

export const MemoWarning: Story = () => (
  <div>
    <p style={{ fontFamily: 'sans-serif', marginBottom: '1rem', color: '#475569' }}>
      Enter an M-address, then type something in the memo field to see the memo-ignored warning.
    </p>
    <AddressInput />
  </div>
);
MemoWarning.storyName = 'Memo warning (M-address + memo)';

// ─── With copy buttons ────────────────────────────────────────────────────────

export const WithCopyButtons: Story = () => (
  <div>
    <p style={{ fontFamily: 'sans-serif', marginBottom: '1rem', color: '#475569' }}>
      <code>showCopyButton=true</code> — one-click copy for base account and routing ID.
    </p>
    <AddressInput showCopyButton />
  </div>
);
WithCopyButtons.storyName = 'With copy buttons';

// ─── onValidationChange callback ──────────────────────────────────────────────

export const ValidationCallback: Story = () => {
  const [status, setStatus] = useState<{ valid: boolean; result: RoutingResult } | null>(null);

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <p style={{ marginBottom: '1rem', color: '#475569' }}>
        Type an address to see the <code>onValidationChange</code> callback fire in real-time.
      </p>
      <AddressInput
        onValidationChange={(isValid, result) => setStatus({ valid: isValid, result })}
      />
      {status && (
        <pre
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: status.valid ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${status.valid ? '#86efac' : '#fca5a5'}`,
            borderRadius: '0.375rem',
            fontSize: '0.8125rem',
            color: '#1e293b',
            overflow: 'auto',
          }}
        >
          {JSON.stringify({ isValid: status.valid, ...status.result }, null, 2)}
        </pre>
      )}
    </div>
  );
};
ValidationCallback.storyName = 'onValidationChange callback';

// ─── Custom className (Tailwind-style) ────────────────────────────────────────

export const CustomStyling: Story = () => (
  <div>
    <p style={{ fontFamily: 'sans-serif', marginBottom: '1rem', color: '#475569' }}>
      Custom <code>className</code> and <code>style</code> override via BEM class hooks.
    </p>
    <style>{`
      .demo-custom {
        border: 2px dashed #6366f1;
        border-radius: 1rem;
        padding: 1rem;
        background: #f5f3ff;
      }
    `}</style>
    <AddressInput className="demo-custom" style={{ maxWidth: '28rem' }} />
  </div>
);
CustomStyling.storyName = 'Custom className / style';

// ─── Dark mode ────────────────────────────────────────────────────────────────

export const DarkMode: Story = () => (
  <div
    style={{
      backgroundColor: '#0f172a',
      padding: '2rem',
      borderRadius: '0.75rem',
      minHeight: '200px',
    }}
  >
    <p style={{ fontFamily: 'sans-serif', marginBottom: '1rem', color: '#94a3b8' }}>
      Dark mode layout — override inline styles via <code>style</code> prop or CSS classes.
    </p>
    <AddressInput
      showCopyButton
      style={{ maxWidth: '30rem' }}
      className="bw-dark"
    />
    <style>{`
      .bw-dark .bw-address-input__input {
        background-color: #1e293b;
        color: #e2e8f0;
        border-color: #334155;
      }
      .bw-dark .bw-memo-field__input {
        background-color: #1e293b;
        color: #e2e8f0;
        border-color: #334155;
      }
      .bw-dark .bw-routing-summary {
        background-color: #1e293b;
        border-color: #334155;
        color: #e2e8f0;
      }
    `}</style>
  </div>
);
DarkMode.storyName = 'Dark mode';
