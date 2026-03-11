'use client';

import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from './formStyles';

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  name,
  defaultValue = '',
  label = 'Imagem de Capa',
}) => {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar imagem');
        return;
      }

      setUrl(data.url);
    } catch {
      setError('Falha na conexao. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) uploadFile(file);
  };

  const handleRemove = () => {
    setUrl('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      <label className={ADMIN_LABEL_CLASS}>{label}</label>

      <input type="hidden" name={name} value={url} />

      <div className="flex items-start gap-4">
        {url && (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-border bg-bg">
            <Image src={url} alt="Preview" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center bg-state-error text-[10px] text-white"
              title="Remover imagem"
            >
              x
            </button>
          </div>
        )}

        <div
          className={`flex flex-1 cursor-pointer flex-col items-center justify-center border-2 border-dashed p-6 transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-primary !text-[20px]">
                progress_activity
              </span>
              <span className="text-text-muted text-xs">Enviando...</span>
            </div>
          ) : (
            <>
              <span className="material-symbols-outlined text-text-muted mb-2 !text-[28px]">
                cloud_upload
              </span>
              <span className="text-text-2 text-xs font-medium">
                Toque para escolher ou arraste
              </span>
              <span className="text-text-muted mt-1 text-[10px]">JPG, PNG, WebP · max 5MB</span>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-text-muted shrink-0 text-[10px]">ou cole URL:</span>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className={`${ADMIN_INPUT_CLASS} p-2 text-xs`}
        />
      </div>

      {error && <p className="text-state-error text-xs">{error}</p>}
    </div>
  );
};
