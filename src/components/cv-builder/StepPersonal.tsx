"use client";

import Input from "@/components/ui/Input";
import { type CVData } from "@/components/CVPDF";
import { type ToastType } from "@/components/ui/Toast";

type Props = {
  cvData: CVData;
  setCvData: (d: CVData) => void;
  isCreative: boolean;
  showToast: (msg: string, type?: ToastType) => void;
};

export default function StepPersonal({ cvData, setCvData, isCreative, showToast }: Props) {
  const pi = cvData.personalInfo;
  const set = (patch: Partial<typeof pi>) =>
    setCvData({ ...cvData, personalInfo: { ...pi, ...patch } });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Informasi Pribadi</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Nama Lengkap</label>
          <Input value={pi.fullName} onChange={(e) => set({ fullName: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <Input type="email" value={pi.email} onChange={(e) => set({ email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Nomor Telepon</label>
          <Input value={pi.phone} onChange={(e) => set({ phone: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">LinkedIn URL</label>
          <Input value={pi.linkedin} onChange={(e) => set({ linkedin: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Portfolio / Website (Opsional)</label>
          <Input value={pi.portfolio} onChange={(e) => set({ portfolio: e.target.value })} />
        </div>

        {isCreative && (
          <>
            <div className="col-span-2">
              <label className="block text-sm mb-1">Headline / Jabatan (mis. Frontend Developer)</label>
              <Input value={pi.headline ?? ""} onChange={(e) => set({ headline: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Lokasi (mis. Jakarta, Indonesia)</label>
              <Input value={pi.location ?? ""} onChange={(e) => set({ location: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Foto Profil (Opsional)</label>
              <div className="flex items-center gap-3">
                {pi.photo && (
                  <img
                    src={pi.photo}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  📷 {pi.photo ? "Ganti Foto" : "Upload Foto"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) {
                        showToast("Ukuran foto maksimal 2MB.", "error");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => set({ photo: reader.result as string });
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                {pi.photo && (
                  <button
                    type="button"
                    className="text-xs text-red-500 font-semibold hover:underline"
                    onClick={() => set({ photo: "" })}
                  >
                    Hapus
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">JPG, PNG, atau WebP. Maks 2MB.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
