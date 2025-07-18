import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ICategory } from '@/services/home';
import Drag, { IProps as IDrag } from '../Drag';
import styles from './index.module.css';
import Iconify from '../Iconify';
import { apiSortCategory } from '@/requests';
import { useRouter } from 'next/navigation';

interface ISortCategoryProps {
  open: boolean;
  onClose: () => void;
  categories?: ICategory[];
  configKey?: string;
}
interface ICategoryItem {
  id: string;
  title?: string;
  position?: number;
}

const SortCategory = (props: ISortCategoryProps) => {
  const { open, onClose, categories, configKey } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ICategoryItem[]>([]);

  const [vIndex, setVIndex] = useState<number>(-1);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const submitSortResult = () => {
    setLoading(true);
    // 提交排序结果
    const mapping: { [key: string]: number } = {};
    list.forEach((item, index) => {
      mapping[item.id] = index;
    });
    apiSortCategory({
      key: configKey || '',
      mapping: mapping,
    })
      .then((res) => {
        console.log('排序结果提交成功:', res);
        router.refresh();
        onClose();
      })
      .catch((error) => {
        console.error('排序结果提交失败:', error);
      })
      .finally(() => setLoading(false));
  };

  const moveItem: IDrag['moveItem'] = (current, target) => {
    if (showPlaceholder !== true) setShowPlaceholder(true);
    if (showPlaceholder === false) setShowPlaceholder(true);
    if (vIndex !== target.index) setVIndex(target.index);
  };

  const onEnd = (category: ICategoryItem & { index: number }) => {
    setVIndex(-1);
    setShowPlaceholder(false);
    // 这里可以处理拖拽结束后的逻辑，比如更新状态或发送请求
    console.log('拖拽结束，当前类目:', category);
    const result = JSON.parse(JSON.stringify(list));
    const currentIndex = result.findIndex((item: ICategoryItem, index: any) => item.id === category.id);
    const targetIndex = category.index;
    if (currentIndex === targetIndex) return;
    
    // 移除当前项
    const [currentItem] = result.splice(currentIndex, 1);
    // 在目标位置插入
    result.splice(targetIndex, 0, currentItem);
    setList(result);
  };

  const renderItem = useCallback((category: any, opacity = 1) => {
    return (
      <div
        className={styles.item}
        key={category.id}
        style={{ opacity: opacity || 1 }}
      >
        <Iconify
          icon="line-md:menu"
          width="1rem"
          height="1rem"
          style={{ marginRight: '8px' }}
        />
        <span>{category.title || ''}</span>
      </div>
    );
  }, []);

  useEffect(() => {
    setList(categories?.map((it) => ({ id: it.id, title: it.title, position: it.position })) || []);
  }, []);

  return (
    <Modal
      open={open}
      title="类目排序"
      onClose={onClose}
      onCancel={onClose}
      onOk={submitSortResult}
      okButtonProps={{ loading: loading }}
    >
      <div style={{ marginBottom: '16px', color: '#888' }}>拖动类目进行排序。点击“确定”保存更改。</div>
      <DndProvider backend={HTML5Backend}>
        {/* 这里可以放置排序的组件 */}
        {list.map((category, index) => (
          <Drag
            item={category}
            index={index}
            key={category.id}
            moveItem={moveItem}
            onEnd={onEnd}
          >
            {vIndex === index && showPlaceholder ? renderItem({}, 0.5) : null}
            {renderItem(category)}
          </Drag>
        ))}
      </DndProvider>
    </Modal>
  );
};
export default SortCategory;
