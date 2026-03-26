import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeToast } from '../../store/slices/uiSlice';

const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
const COLORS = {
  success: 'var(--green)',
  error: 'var(--red)',
  warning: 'var(--yellow)',
  info: 'var(--blue)',
};

function Toast({ toast }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(toast.id)), 3500);
    return () => clearTimeout(t);
  }, [toast.id, dispatch]);

  return (
    <div style={{
      background: 'var(--bg-2)',
      border: `1px solid ${COLORS[toast.type || 'success']}`,
      borderRadius: 'var(--radius)',
      padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: '10px',
      boxShadow: 'var(--shadow-lg)',
      animation: 'slideUp 0.2s ease',
      maxWidth: '360px',
      fontSize: '14px',
      color: 'var(--text)',
    }}>
      <span style={{ color: COLORS[toast.type || 'success'], fontWeight: 700 }}>
        {ICONS[toast.type || 'success']}
      </span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: '14px' }}
      >✕</button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector(s => s.ui.toasts);
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      zIndex: 1000,
    }}>
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
