import { useState, useRef } from 'react';
import { toBase64 } from '../../utils/helpers';

export default function ImageUpload({ value, onChange, label = 'Upload Image', accept = 'image/*', error }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const b64 = await toBase64(file);
    onChange(b64);
  };

  return (
    <div>
      <div
        className={`img-upload-area ${drag ? 'drag-over' : ''} ${error ? 'input-error' : ''}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        style={{ cursor: 'pointer' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
        {value ? (
          <div>
            <img src={value} alt="preview" className="img-preview" />
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '8px' }}>Click to change</div>
          </div>
        ) : (
          <>
            <div className="img-upload-icon">🖼️</div>
            <div className="img-upload-text">{label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-3)', marginTop: '4px' }}>Drag & drop or click</div>
          </>
        )}
      </div>
      {error && <div className="form-error">⚠ {error}</div>}
    </div>
  );
}
