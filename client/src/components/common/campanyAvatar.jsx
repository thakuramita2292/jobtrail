const SIZES = {
  sm: 'w-8 h-8 text-xs rounded-lg',
  md: 'w-10 h-10 text-sm rounded-lg',
  lg: 'w-14 h-14 text-xl rounded-xl',
};

const CompanyAvatar = ({ company = '', size = 'sm' }) => {
  const initials = company.trim().slice(0, 2).toUpperCase() || 'NA';
  const sizeClasses = SIZES[size] || SIZES.sm;

  return (
    <span
      className={`${sizeClasses} bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center border border-indigo-100 shrink-0`}
    >
      {initials}
    </span>
  );
};

export default CompanyAvatar;