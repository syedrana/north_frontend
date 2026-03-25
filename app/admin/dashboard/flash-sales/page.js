"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    deleteAdminFlashSale,
    getAdminFlashSales,
} from "@/lib/flashSaleApi";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTimingLabel(timing = {}) {
  if (timing.isLive) return { text: "Live", className: "bg-red-100 text-red-700" };
  if (timing.isUpcoming) return { text: "Upcoming", className: "bg-amber-100 text-amber-700" };
  if (timing.hasEnded) return { text: "Ended", className: "bg-slate-100 text-slate-700" };
  return { text: "Scheduled", className: "bg-blue-100 text-blue-700" };
}

export default function AdminFlashSalesPage() {
  const [flashSales, setFlashSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(false);

  const loadFlashSales = async () => {
    try {
      setLoading(true);
      const response = await getAdminFlashSales({ page: 1, limit: 50 });
      setFlashSales(response.items || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to load flash sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlashSales();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    try {
      setPendingDelete(true);
      await deleteAdminFlashSale(deleteTarget.id);
      toast.success("Flash sale deleted");
      setDeleteTarget(null);
      await loadFlashSales();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to delete flash sale");
    } finally {
      setPendingDelete(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Flash Sales</h1>
          <p className="text-sm text-slate-500">Manage storefront campaigns and homepage-ready sale windows.</p>
        </div>
        <Link href="/admin/dashboard/flash-sales/create">
          <Button className="gap-2">
            <Plus size={18} /> Create Flash Sale
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Schedule</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Products</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">Loading flash sales...</td>
                </tr>
              ) : flashSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">No flash sales found.</td>
                </tr>
              ) : (
                flashSales.map((sale) => {
                  const timing = getTimingLabel(sale.timing);
                  return (
                    <tr key={sale.id} className="border-t align-top">
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">{sale.title}</p>
                          <p className="text-xs text-slate-500">ID: {sale.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Badge className={sale.status === "active" ? "bg-emerald-600" : "bg-slate-500"}>
                            {sale.status}
                          </Badge>
                          <span className={`inline-flex w-fit rounded-full px-2 py-1 text-xs font-medium ${timing.className}`}>
                            {timing.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <div>{formatDateTime(sale.startsAt)}</div>
                        <div className="text-xs text-slate-400">to {formatDateTime(sale.endsAt)}</div>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {sale.discountType === "percentage"
                          ? `${sale.discountValue}% off`
                          : `$${sale.discountValue} off`}
                      </td>
                      <td className="px-4 py-4 text-slate-600">{sale.productCount ?? sale.products?.length ?? 0}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/dashboard/flash-sales/${sale.id}/edit`}>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Pencil size={16} /> Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-2"
                            onClick={() => setDeleteTarget(sale)}
                          >
                            <Trash2 size={16} /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete flash sale?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.title}</strong> and invalidate the homepage cache.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pendingDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pendingDelete}
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {pendingDelete ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
