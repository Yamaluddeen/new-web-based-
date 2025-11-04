import { Memo } from '../../types/types';
import { MemoCard } from './MemoCard';

type MemoListProps = {
  memos: Memo[];
  categoryMap: {[key: string]: string};
  onEdit: (memo: Memo) => void;
  onDelete: (id: string) => void;
};

export const MemoList = ({ memos, categoryMap, onEdit, onDelete }: MemoListProps) => {
  if (memos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">ยังไม่มีบันทึก</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {memos.map((memo) => (
        <MemoCard
          key={memo.id}
          memo={memo}
          categoryName={categoryMap[memo.category_id] || 'ไม่ระบุกลุ่มเรื่อง'}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};