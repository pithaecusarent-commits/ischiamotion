"use client";

import { useEffect, useState } from "react";

type Props = {
  currentImageUrl?: string | null;
};

export function ImageUploadField({ currentImageUrl }: Props) {
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || "");

  useEffect(() => {
    setPreviewUrl(currentImageUrl || "");
  }, [currentImageUrl]);

  return (
    <div className="grid gap-4 rounded-[28px] border border-ink/10 bg-white/60 p-5 md:grid-cols-[180px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-3xl border border-ink/10 bg-cream">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={previewUrl} alt="Preview veicolo" className="h-36 w-full object-cover" />
        ) : (
          <div className="grid h-36 place-items-center px-4 text-center text-xs font-bold uppercase tracking-[0.12em] text-ink/40">
            Nessuna foto
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-ink/70">
          Foto veicolo
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-base font-normal text-ink outline-none file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-sm file:font-bold file:text-white focus:border-sea/50"
            name="image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0];
              if (!file) {
                setPreviewUrl(currentImageUrl || "");
                return;
              }
              setPreviewUrl(URL.createObjectURL(file));
            }}
          />
          <span className="text-xs font-semibold text-ink/50">Carica JPG, PNG o WebP. Max 5 MB.</span>
        </label>

        <label className="grid gap-2 text-xs font-bold text-ink/50">
          URL immagine esistente
          <input
            className="rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm font-normal text-ink/70 outline-none focus:border-sea/50"
            name="image_url"
            defaultValue={currentImageUrl || ""}
            placeholder="Compilato automaticamente dopo upload"
          />
        </label>
      </div>
    </div>
  );
}
