import { twMerge } from '@/lib/twMerge';
import { MdOutlineArrowBack } from 'react-icons/md';
import { Link } from 'react-router-dom';

interface HeaderProps {
  to?: string;
  programTitle: string;
  className?: string;
  onClick?: () => void;
}

const Header = ({ programTitle, className, to, onClick }: HeaderProps) => {
  return (
    <header className={twMerge('my-5 flex items-center gap-3', className)}>
      <Link to={to ?? '#'} className="text-[1.5rem]" onClick={onClick}>
        <MdOutlineArrowBack />
      </Link>
      <h1 className="text-lg font-medium">{programTitle}</h1>
    </header>
  );
};

export default Header;
