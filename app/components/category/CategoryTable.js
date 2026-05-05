"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Avatar, IconButton, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../../lib/api";

export default function CategoryTable({ data, onEdit, refresh }) {
  const handleDelete = async id => {
    await api.delete(`/categorys/${id}`);
    refresh();
  };

  const getImageUrl = (row) => {
    const image = row?.image;

    if (typeof image === "string") return image;
    if (!image || typeof image !== "object") return "";

    return image.url || image.secure_url || image.path || image.src || "";
  };

  const columns = [
    { field: "name", headerName: "Category", flex: 1 },
    { field: "slug", headerName: "Slug", flex: 1 },
    {
      field: "image",
      headerName: "Image",
      width: 90,
      sortable: false,
      renderCell: (params) => {
        const imageUrl = getImageUrl(params.row);
        return imageUrl ? <Avatar src={imageUrl} variant="rounded" /> : "-";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: params => (
        <Stack direction="row" spacing={1}>
          <IconButton onClick={() => onEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <DataGrid
      autoHeight
      rows={data}
      columns={columns}
      getRowId={row => row._id}
      pageSize={10}
    />
  );
}

