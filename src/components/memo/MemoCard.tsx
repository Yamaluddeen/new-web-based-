import { Memo } from '../../types/types';
import  CategoryBadge  from '../category/CategoryBadge';

type MemoCardProps = {
  memo: Memo;
  categoryName: string;
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
};

export const MemoCard = ({ memo, categoryName, onEdit, onDelete }: MemoCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {memo.image_url && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={memo.image_url}
            alt={memo.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 truncate">{memo.title}</h3>
          <CategoryBadge name={categoryName} active={false} />
        </div>
        <p className="text-gray-600 mb-4 text-sm line-clamp-3">{memo.content}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(memo.created_at).toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(memo)}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              แก้ไข
            </button>
            <button
              onClick={() => onDelete(memo.id)}
              className="text-xs text-red-600 hover:text-red-800"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};