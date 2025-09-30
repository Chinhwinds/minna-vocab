import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  leftLabel?: string;
  rightLabel?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, leftLabel, rightLabel }) => {
  return (
    <div className="flex items-center gap-3">
      {leftLabel && <span className="text-xs text-muted select-none">{leftLabel}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={
          `relative inline-flex h-6 w-11 items-center rounded-full transition-colors border border-border ` +
          (checked ? 'bg-gray-900' : 'bg-card')
        }
      >
        <span
          className={
            `inline-block h-5 w-5 transform rounded-full bg-white transition-transform ` +
            (checked ? 'translate-x-5' : 'translate-x-1')
          }
        />
      </button>
      {rightLabel && <span className="text-xs text-muted select-none">{rightLabel}</span>}
    </div>
  );
};

export default Toggle;


