import { FiX } from 'react-icons/fi';

type CategoryBadgeProps = {
  name: string;
  active:boolean;
  onRemove?: () => void;
  onClick?: () => void;
  color?: string;
};

const CategoryBadge = ({ name, active, onRemove, onClick, color = 'bg-blue-100 text-blue-800' }: CategoryBadgeProps) => {
  return (
    <div 
      className={`inline-flex items-center ${color} rounded-full px-3 py-1 text-sm ${onClick ? 'cursor-pointer' : ''} ${active ? 'text-red-600 font-semibold' : ''} `}
      onClick={onClick}
    >
      <span>{name}</span>
      
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-sm focus:outline-none hover:text-red-500"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default CategoryBadge;