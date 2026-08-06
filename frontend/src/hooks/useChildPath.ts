import { useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/useAppStore';

export function useChildPath() {
  const { childId } = useParams();
  const activeChildId = useAppStore((state) => state.activeChildId);
  const resolvedChildId = childId ?? activeChildId ?? 'patient-an';

  return (path = '') => `/child/${resolvedChildId}/${path}`.replace(/\/$/, '');
}
