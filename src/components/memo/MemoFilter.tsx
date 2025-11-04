import  CategoryBadge  from '../category/CategoryBadge';
import { Category } from '../../types/types';

type MemoFilterProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export const MemoFilter = ({ 
  categories, 
  selectedCategoryId, 
  onSelectCategory 
}: MemoFilterProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">กลุ่มเรื่อง</h3>
      <div className="flex flex-wrap gap-2">
        <CategoryBadge 
          name="ทั้งหมด" 
          active={selectedCategoryId === null}
          onClick={() => onSelectCategory(null)}
        />
        {categories.map((category) => (
          <CategoryBadge
            key={category.id}
            name={category.name}
            active={selectedCategoryId === category.id}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
};