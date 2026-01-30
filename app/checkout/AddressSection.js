"use client";

import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import AddressForm from "./AddressForm";

export default function AddressSection({
  addresses,
  selected,
  onCreate,
  onUpdate,
  onSelect,
  loading,
}) {
  const [editing, setEditing] = useState(null);
  const [forceShowForm, setForceShowForm] = useState(false);

  const showForm =
    forceShowForm || addresses.length === 0 || editing !== null;

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Shipping Address
      </Typography>

      {!showForm && (
        <Box className="space-y-3">
          {addresses.map((addr) => (
            <Box
              key={addr._id}
              onClick={() => onSelect(addr)}
              sx={{
                border:
                  selected?._id === addr._id
                    ? "2px solid black"
                    : "1px solid #ddd",
                borderRadius: 2,
                p: 2,
                cursor: "pointer",
              }}
            >
              <strong>{addr.fullName}</strong> — {addr.phone}
              <div>
                {addr.addressLine}, {addr.area}, {addr.district}
              </div>

              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(addr);
                  setForceShowForm(true);
                }}
              >
                Edit
              </Button>
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={() => setForceShowForm(true)}
          >
            + Add New Address
          </Button>
        </Box>
      )}

      {showForm && (
        <AddressForm
          initialData={editing}
          loading={loading}
          onSubmit={(data) => {
            if (editing) {
              onUpdate(editing._id, data);
            } else {
              onCreate(data);
            }
            setEditing(null);
            setForceShowForm(false);
          }}
        />
      )}
    </Box>
  );
}
