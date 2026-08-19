"use client";

import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";

import { PageHeader } from "@/components/admin/page-header";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateDeliveryRate } from "@/lib/actions/admin";
import { useDictionary, useLocale } from "@/i18n/client";
import type { DeliveryRateWithWilaya } from "@/lib/types";

export function DeliveryManager({
  rates,
}: {
  rates: DeliveryRateWithWilaya[];
}) {
  const dict = useDictionary();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<DeliveryRateWithWilaya | null>(null);
  const [form, setForm] = useState({
    homeFee: "0",
    stopDeskFee: "0",
    etaMin: "1",
    etaMax: "5",
    isActive: true,
  });

  function openEdit(rate: DeliveryRateWithWilaya) {
    setEditing(rate);
    setForm({
      homeFee: String(rate.home_fee),
      stopDeskFee: String(rate.stop_desk_fee),
      etaMin: String(rate.estimated_days_min),
      etaMax: String(rate.estimated_days_max),
      isActive: rate.is_active,
    });
    setError(null);
  }

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSave() {
    if (!editing) return;
    setError(null);
    startTransition(async () => {
      const result = await updateDeliveryRate(editing.id, {
        homeFee: Number(form.homeFee),
        stopDeskFee: Number(form.stopDeskFee),
        estimatedDaysMin: Number(form.etaMin),
        estimatedDaysMax: Number(form.etaMax),
        isActive: form.isActive,
      });
      if (result.ok) {
        setEditing(null);
      } else if (result.fieldErrors) {
        setError(dict.admin.genericError);
      } else {
        setError(dict.admin.genericError);
      }
    });
  }

  return (
    <div>
      <PageHeader title={dict.admin.delivery} subtitle={String(rates.length)} />

      {error ? (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{dict.admin.wilaya}</TableHead>
              <TableHead>{dict.admin.homeFee}</TableHead>
              <TableHead>{dict.admin.stopDeskFee}</TableHead>
              <TableHead className="hidden sm:table-cell">ETA</TableHead>
              <TableHead>{dict.admin.active}</TableHead>
              <TableHead className="text-end">{dict.admin.editRate}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((rate) => (
              <TableRow key={rate.id}>
                <TableCell>
                  <span className="font-medium">
                    {locale === "ar" ? rate.wilaya.name_ar : `${rate.wilaya.code} — ${rate.wilaya.name_fr}`}
                  </span>
                </TableCell>
                <TableCell className="tabular-nums">
                  {Number(rate.home_fee).toLocaleString("fr-FR")} DA
                </TableCell>
                <TableCell className="tabular-nums">
                  {Number(rate.stop_desk_fee).toLocaleString("fr-FR")} DA
                </TableCell>
                <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                  {rate.estimated_days_min}–{rate.estimated_days_max}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={rate.is_active}
                    onCheckedChange={(checked) => {
                      startTransition(async () => {
                        await updateDeliveryRate(rate.id, {
                          homeFee: rate.home_fee,
                          stopDeskFee: rate.stop_desk_fee,
                          estimatedDaysMin: rate.estimated_days_min,
                          estimatedDaysMax: rate.estimated_days_max,
                          isActive: checked,
                        });
                      });
                    }}
                    aria-label={dict.admin.active}
                  />
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => openEdit(rate)}
                    aria-label={dict.admin.editRate}
                  >
                    <Pencil />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing
                ? locale === "ar"
                  ? editing.wilaya.name_ar
                  : `${editing.wilaya.code} — ${editing.wilaya.name_fr}`
                : dict.admin.editRate}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="homeFee">{dict.admin.homeFee} (DA)</Label>
              <Input
                id="homeFee"
                type="number"
                min={0}
                dir="ltr"
                value={form.homeFee}
                onChange={(event) => update("homeFee", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="stopDeskFee">{dict.admin.stopDeskFee} (DA)</Label>
              <Input
                id="stopDeskFee"
                type="number"
                min={0}
                dir="ltr"
                value={form.stopDeskFee}
                onChange={(event) => update("stopDeskFee", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="etaMin">{dict.admin.etaMin}</Label>
              <Input
                id="etaMin"
                type="number"
                min={1}
                max={30}
                dir="ltr"
                value={form.etaMin}
                onChange={(event) => update("etaMin", event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="etaMax">{dict.admin.etaMax}</Label>
              <Input
                id="etaMax"
                type="number"
                min={1}
                max={30}
                dir="ltr"
                value={form.etaMax}
                onChange={(event) => update("etaMax", event.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="rateActive">{dict.admin.active}</Label>
            <Switch
              id="rateActive"
              checked={form.isActive}
              onCheckedChange={(checked) => update("isActive", checked)}
            />
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