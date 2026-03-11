import { useEffect, useMemo, useState } from 'react';

interface ChecklistProgressState {
  checkedIds: string[];
  isLoaded: boolean;
}

function parseStoredIds(storageKey: string, validIds: Set<string>) {
  const saved = localStorage.getItem(storageKey);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === 'string' && validIds.has(id));
  } catch (error) {
    console.error('Failed to load checklist progress', error);
    return [];
  }
}

export function useChecklistProgress(slug: string, itemIds: string[]) {
  const [state, setState] = useState<ChecklistProgressState>({
    checkedIds: [],
    isLoaded: false,
  });

  const storageKey = `checklist:${slug}`;
  const validIds = useMemo(() => new Set(itemIds), [itemIds]);
  const totalItems = itemIds.length;

  useEffect(() => {
    setState({
      checkedIds: parseStoredIds(storageKey, validIds),
      isLoaded: true,
    });
  }, [storageKey, validIds]);

  useEffect(() => {
    if (state.isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(state.checkedIds));
    }
  }, [state, storageKey]);

  const toggleItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      checkedIds: prev.checkedIds.includes(id)
        ? prev.checkedIds.filter((itemId) => itemId !== id)
        : [...prev.checkedIds, id],
    }));
  };

  const progress = totalItems > 0 ? (state.checkedIds.length / totalItems) * 100 : 0;
  const isCompleted = state.checkedIds.length === totalItems && totalItems > 0;

  return {
    checkedIds: state.checkedIds,
    toggleItem,
    progress,
    isCompleted,
    isLoaded: state.isLoaded,
    completedCount: state.checkedIds.length,
  };
}
