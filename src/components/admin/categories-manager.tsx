"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PageHeader } from "@/components/admin/page-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/actions/admin";
import { useDictionary, useLocale } from "@/i18n/client";
import type { Category } from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const dict = useDictionary();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const [form, setForm] = useState({
    nameFr: "",
    nameAr: "",
    slug: "",
    descriptionFr: "",
    descriptionAr: "",
    displayOrder: "0",
    isActive: true,
  });

  function openCreate() {
    setEditing(null);
    setSlugTouched(false);
    setForm({
      nameFr: "",
      nameAr: "",
      slug: "",
      descriptionFr: "",
      descriptionAr: "",
      displayOrder: "0",
      isActive: true,
    });
    setError(null);
    setDialogOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setSlugTouched(true);
    setForm({
      nameFr: category.name_fr,
      nameAr: category.name_ar,
      slug: category.slug,
      descriptionFr: category.description_fr ?? "",
      descriptionAr: category.description_ar ?? "",
      displayOrder: String(category.display_order),
      isActive: category.is_active,
    });
    setError(null);
    setDialogOpen(true);
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "nameFr" && !slugTouched) next.slug = slugify(value as string);
      return next;
    });
  }

  function handleSave() {
    setError(null);
    const values = {
      nameFr: form.nameFr,
      nameAr: form.nameAr,
      slug: form.slug,
      descriptionFr: form.descriptionFr,
      descriptionAr: form.descriptionAr,
      displayOrder: Number(form.displayOrder),
      isActive: form.isActive,
      imageUrl: "",
    };
    startTransition(async () => {
      const result = editing
        ? await updateCategory(editing.id, values)
        : await createCategory(values);
      if (result.ok) {
        setDialogOpen(false);
        router.refresh();
      } else if (result.error === "slugTaken") {
        setError(dict.admin.slugTaken);
      } else {
        setError(dict.admin.genericError);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result.ok) {
        router.refresh();
      } else {
        setError(dict.admin.genericError);
      }
    });
  }

  return (
    <div>
      <PageHeader
        title={dict.admin.categories}
        actions={
          <Button onClick={openCreate}>
            <Plus data-icon="inline-start" />
            {dict.admin.addCategory}
          </Button>
        }
      />

      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"Nom"}</TableHead>
              <TableHead className="hidden sm:table-cell">{dict.admin.slug}</TableHead>
              <TableHead>{dict.admin.active}</TableHead>
              <TableHead className="text-end">{dict.admin.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="font-medium">
                    {locale === "ar" ? category.name_ar : category.name_fr}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {locale === "ar" ? category.name_fr : category.name_ar}
                  </div>
                </TableCell>
                <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
                  {category.slug}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={category.is_active}
                    onCheckedChange={(checked) => {
                      startTransition(async () => {
                        await updateCategory(category.id, {
                          nameFr: category.name_fr,
                          nameAr: category.name_ar,
                          slug: category.slug,
                          descriptionFr: category.description_fr ?? "",
                          descriptionAr: category.description_ar ?? "",
                          displayOrder: category.display_order,
                          isActive: checked,
                          imageUrl: "",
                        });
                        router.refresh();
                      });
                    }}
                  />
                </TableCell>
                <TableCell className="text-end">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEdit(category)}
                      aria-label={dict.common.edit}
                    >
                      <Pencil />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={dict.common.delete}
                          >
                            <Trash2 />
                          </Button>
                        }
                      />
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{dict.common.delete}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {dict.common.delete}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{dict.common.cancel}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            disabled={isPending}
                          >
                            {dict.common.delete}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? dict.admin.editCategory : dict.admin.addCategory}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="catNameFr">Nom (FR)</Label>
                <Input
                  id="catNameFr"
                  value={form.nameFr}
                  onChange={(event) => update("nameFr", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="catNameAr">Nom (AR)</Label>
                <Input
                  id="catNameAr"
                  dir="rtl"
                  value={form.nameAr}
                  onChange={(event) => update("nameAr", event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="catSlug">{dict.admin.slug}</Label>
              <Input
                id="catSlug"
                dir="ltr"
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  update("slug", slugify(event.target.value));
                }}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="catDescFr">Description (FR)</Label>
                <Textarea
                  id="catDescFr"
                  rows={3}
                  value={form.descriptionFr}
                  onChange={(event) => update("descriptionFr", event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="catDescAr">Description (AR)</Label>
                <Textarea
                  id="catDescAr"
                  dir="rtl"
                  rows={3}
                  value={form.descriptionAr}
                  onChange={(event) => update("descriptionAr", event.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="catActive">{dict.admin.active}</Label>
              <Switch
                id="catActive"
                checked={form.isActive}
                onCheckedChange={(checked) => update("isActive", checked)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? dict.common.loading : dict.common.saveChanges}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}