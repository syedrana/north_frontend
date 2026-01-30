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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";
import { Boxes, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [publishLoading, setPublishLoading] = useState(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/admin/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/products/admin/deleteproduct/${deleteId}`);
      setDeleteId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (product) => {
  try {
    setPublishLoading(product._id);

    await api.patch(
      `/products/admin/product/publish/${product._id}`
    );

    fetchProducts();
  } catch (err) {
    alert(err.response?.data?.message || "Action failed");
  } finally {
    setPublishLoading(null);
  }
};


  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/dashboard/products/create">
          <Button className="gap-2 w-full sm:w-auto">
            <Plus size={18} /> Create Product
          </Button>
        </Link>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {loading && (
          <div className="text-center py-10 text-muted-foreground">
            Loading products...
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No products found
          </div>
        )}

        {products.map((product) => {
          const noVariant = product.variantsCount === 0;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl border shadow-sm p-4 space-y-3"
            >
              {/* Title */}
              <div>
                <p className="font-semibold text-base">{product.name}</p>
                <p className="text-xs text-muted-foreground">
                  {product.category?.name || "—"} · {product.brand}
                </p>
              </div>

              {/* Status Row */}
              <div className="flex flex-wrap gap-2">
                {product.isPublished ? (
                  <Badge className="bg-green-600">Published</Badge>
                ) : (
                  <Badge variant="secondary">Draft</Badge>
                )}

                {noVariant ? (
                  <Badge variant="destructive">No Variant</Badge>
                ) : (
                  <Badge className="bg-blue-600">
                    {product.variantsCount} Variants
                  </Badge>
                )}
              </div>

              {/* Warning */}
              {noVariant && (
                <p className="text-xs text-red-500">
                  ⚠ Add at least one variant to publish
                </p>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  size="sm"
                  onClick={() =>
                    router.push(
                      `/admin/dashboard/products/variant/${product._id}`
                    )
                  }
                >
                  Variants
                </Button>

                <Button
                  size="sm"
                  variant={product.isPublished ? "outline" : "default"}
                  disabled={noVariant}
                  onClick={() => togglePublish(product)}
                >
                  {product.isPublished ? "Unpublish" : "Publish"}
                </Button>

                <Link
                  href={`/admin/dashboard/products/edit/${product._id}`}
                  className="col-span-1"
                >
                  <Button size="sm" variant="outline" className="w-full">
                    Edit
                  </Button>
                </Link>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setDeleteId(product._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block rounded-2xl border shadow-sm overflow-x-auto bg-white">
        {/* Table */}
        <div className="rounded-2xl border shadow-sm overflow-x-auto bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Loading products...
                  </TableCell>
                </TableRow>
              )}

              {!loading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No products found
                  </TableCell>
                </TableRow>
              )}

              {products.map((product) => {
                const noVariant = product.variantsCount === 0;

                return (
                  <TableRow key={product._id} className="hover:bg-muted/50">
                    {/* Product */}
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.category?.name || "—"} · {product.brand}
                        </p>
                      </div>
                    </TableCell>

                    {/* Draft / Published */}
                    <TableCell>
                      {product.isPublished ? (
                        <Badge className="bg-green-600">Published</Badge>
                      ) : (
                        <Badge variant="secondary">Draft</Badge>
                      )}
                    </TableCell>

                    {/* Variant Count */}
                    <TableCell>
                      {noVariant ? (
                        <Badge variant="destructive" className="gap-1">
                          <EyeOff size={14} /> No Variant
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-600 gap-1">
                          <Boxes size={14} /> {product.variantsCount}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Visibility */}
                    <TableCell>
                      <Button
                        size="sm"
                        variant={product.isPublished ? "outline" : "default"}
                        disabled={noVariant || publishLoading === product._id}
                        onClick={() => togglePublish(product)}
                        className="w-full sm:w-auto"
                      >
                        {product.isPublished ? "Unpublish" : "Publish"}
                      </Button>

                      {noVariant && (
                        <p className="text-xs text-red-500 mt-1">
                          Add variant to publish
                        </p>
                      )}
                    </TableCell>

                    {/* Created */}
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right space-x-2 whitespace-nowrap">
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/products/variant/${product._id}`
                          )
                        }
                      >
                        Variants
                      </Button>

                      <Link href={`/admin/dashboard/products/edit/${product._id}`}>
                        <Button size="icon" variant="outline">
                          <Pencil size={16} />
                        </Button>
                      </Link>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeleteId(product._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Delete Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the product and all its variants.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>



      
    </div>
  );
}
