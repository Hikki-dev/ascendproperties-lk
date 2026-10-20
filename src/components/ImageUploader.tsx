import { useRef, useState } from 'react';

type Props = { name: string; initial?: string[]; multiple?: boolean; label?: string };

// Resize in the browser (max 1600px, WebP) so uploads stay small and R2 storage lasts.
async function toWebp(file: File): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas');
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d')!.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/webp', 0.85));
}

export default function ImageUploader({ name, initial = [], multiple = true, label = 'Drop photos here or browse' }: Props) {
  const [keys, setKeys] = useState<string[]>(initial);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState('');
  const input = useRef<HTMLInputElement>(null);

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setErr('');
    for (const f of Array.from(multiple ? files : [files[0]])) {
      setBusy((b) => b + 1);
      try {
        const blob = await toWebp(f);
        const fd = new FormData();
        fd.set('file', new File([blob], 'img.webp', { type: 'image/webp' }));
        const r = await fetch('/admin/api/upload', { method: 'POST', body: fd });
        if (!r.ok) throw new Error('upload');
        const { key } = (await r.json()) as { key: string };
        setKeys((k) => (multiple ? [...k, key] : [key]));
      } catch { setErr('One image failed to upload. Try a JPG/PNG/WebP under 8 MB.'); }
      setBusy((b) => b - 1);
    }
    if (input.current) input.current.value = '';
  }

  const move = (i: number) => setKeys((k) => [k[i], ...k.filter((_, j) => j !== i)]);
  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(keys)} />
      <button type="button" className="upload-zone" style={{ width: '100%' }} onClick={() => input.current?.click()}
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files); }}>
        <strong>{busy ? `Uploading ${busy}…` : label}</strong>
        <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>Auto-resized to WebP, stored on Cloudflare R2</div>
      </button>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} hidden onChange={(e) => add(e.target.files)} />
      {err && <p className="notice err" role="alert" style={{ marginTop: 8 }}>{err}</p>}
      {keys.length > 0 && (
        <div className="thumbs">
          {keys.map((k, i) => (
            <div key={k}>
              <img src={`/media/${k}`} alt="" />
              {multiple && i === 0 && <span className="cover">COVER</span>}
              <button type="button" onClick={() => setKeys(keys.filter((x) => x !== k))} aria-label="Remove image">Remove</button>
              {multiple && i > 0 && <button type="button" style={{ top: 'auto', bottom: 4, right: 4 }} onClick={() => move(i)}>Make cover</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
