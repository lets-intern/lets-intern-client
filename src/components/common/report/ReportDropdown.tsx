import { ReactNode, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';

interface ReportDropdownProps {
  title: string;
  children?: ReactNode;
  initialOpenState?: boolean;
  labelId?: string;
}

function ReportDropdown({
  title,
  children,
  initialOpenState = true,
  labelId,
}: ReportDropdownProps) {
  const [isOpen, setIsOpen] = useState(initialOpenState);

  return (
    <div className="overflow-hidden rounded-xs border border-neutral-80">
      <div
        className="flex cursor-pointer items-center justify-between bg-neutral-100 p-3 text-xsmall14 font-semibold text-static-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <label id={labelId}>{title}</label>
        {isOpen ? (
          <HiChevronUp className="h-auto w-5" color="#ACAFB6" />
        ) : (
          <HiChevronDown className="h-auto w-5" color="#ACAFB6" />
        )}
      </div>

      {isOpen && children}
    </div>
  );
}

export default ReportDropdown;
