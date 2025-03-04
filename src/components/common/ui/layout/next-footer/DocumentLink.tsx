'use client';

import Link from 'next/link';

interface DocumentLinkProps {
  to: string;
  children?: React.ReactNode;
}

const DocumentLink = ({ to, children }: DocumentLinkProps) => {
  return (
    <Link
      href={to}
      className="text-0.75-medium lg:text-0.875-medium"
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </Link>
  );
};

export default DocumentLink;
