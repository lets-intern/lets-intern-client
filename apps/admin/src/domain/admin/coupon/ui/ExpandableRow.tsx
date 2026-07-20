import { Checkbox, FormControlLabel } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  label: string;
  isOpen: boolean;
  badge?: ReactNode;
  onToggleExpand: () => void;
  onToggleCheck: () => void;
  className?: string;
}

export default function ExpandableRow({
  checked,
  indeterminate = false,
  disabled = false,
  label,
  isOpen,
  badge,
  onToggleExpand,
  onToggleCheck,
  className = '',
}: Props) {
  return (
    <div
      role="button"
      onClick={onToggleExpand}
      className={`flex cursor-pointer items-center justify-between hover:bg-gray-50 ${className}`}
    >
      <FormControlLabel
        onClick={(e) => e.stopPropagation()}
        control={
          <Checkbox
            checked={checked}
            indeterminate={indeterminate}
            disabled={disabled}
            onChange={onToggleCheck}
            size="small"
          />
        }
        label={label}
      />
      <div className="flex items-center gap-2">
        {badge}
        <img
          src="/icons/arrow-right.svg"
          alt=""
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        />
      </div>
    </div>
  );
}
