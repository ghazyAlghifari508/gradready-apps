"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/Toast";

export type CrudMode = "create" | "edit";

export function useCrud<TForm extends Record<string, unknown>>(
  apiBase: string,
  emptyForm: TForm,
  successCreate: string,
  successUpdate: string,
) {
  const { showToast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<TForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const mode: CrudMode = editId ? "edit" : "create";

  const openCreate = useCallback(() => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  }, [emptyForm]);

  const openEdit = useCallback((id: string, data: TForm) => {
    setForm(data);
    setEditId(id);
    setShowForm(true);
  }, []);

  const close = useCallback(() => setShowForm(false), []);

  const handleSave = useCallback(async (
    validate?: () => string | null,
  ) => {
    const err = validate?.();
    if (err) { showToast(err, "warning"); return; }

    setSaving(true);
    try {
      const url = editId ? `${apiBase}/${editId}` : apiBase;
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast(editId ? successUpdate : successCreate, "success");
      setShowForm(false);
      return true;
    } catch {
      showToast("Gagal menyimpan", "error");
      return false;
    } finally {
      setSaving(false);
    }
  }, [apiBase, editId, form, showToast, successCreate, successUpdate]);

  const handleDelete = useCallback(async (id: string) => {
    if (confirmDeleteId !== id) { setConfirmDeleteId(id); return null; }
    setConfirmDeleteId(null);
    setDeleting(id);
    try {
      const res = await fetch(`${apiBase}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showToast("Berhasil dihapus", "info");
      return id;
    } catch {
      showToast("Gagal menghapus", "error");
      return null;
    } finally {
      setDeleting(null);
    }
  }, [apiBase, confirmDeleteId, showToast]);

  return {
    showForm, editId, form, mode, saving, deleting, confirmDeleteId,
    setForm, openCreate, openEdit, close, handleSave, handleDelete,
    setConfirmDeleteId, showToast,
  };
}
