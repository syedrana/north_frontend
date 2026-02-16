"use client";

import apiServer from "@/lib/apiServer";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const statusColors = {
  pending: "warning",
  confirmed: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];

function Tracking({ status }) {
  const active = steps.findIndex(
    (s) => s.toLowerCase() === status?.toLowerCase()
  );

  return (
    <Stepper activeStep={active === -1 ? 0 : active} sx={{ mt: 2 }}>
      {steps.map((s) => (
        <Step key={s}>
          <StepLabel>{s}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  /* ✅ SAFE DATA FETCH */
  useEffect(() => {
    let mounted = true;

    const loadOrder = async () => {
      try {
        const { data } = await apiServer.get(`/order/${id}`);
        if (mounted) setOrder(data.order);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) loadOrder();

    return () => {
      mounted = false;
    };
  }, [id]);

  const refreshOrder = async () => {
    const { data } = await apiServer.get(`/order/${id}`);
    setOrder(data.order);
  };

  const cancelOrder = async () => {
    if (!confirm("Cancel this order?")) return;

    await apiServer.post(`/orders/${id}/cancel`);
    refreshOrder();
  };

  const returnOrder = async () => {
    await apiServer.post(`/orders/${id}/return`);
    alert("Return request submitted");
    refreshOrder();
  };

  if (!order) return <Typography p={4}>Loading...</Typography>;

  return (
    <Box maxWidth="900px" mx="auto" p={3}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Order #{order.orderNumber}
      </Typography>

      <Chip
        label={order.orderStatus}
        color={statusColors[order.orderStatus] || "default"}
        sx={{ mb: 2, textTransform: "capitalize" }}
      />

      <Tracking status={order.orderStatus} />

      <Card sx={{ mt: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography fontWeight="bold" mb={2}>
            Items
          </Typography>

          <Stack spacing={2}>
            {order.items.map((item) => (
              <Stack
                key={item._id}
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <Image
                  src={item.image}
                  width={70}
                  height={70}
                  alt={item.name}
                  style={{ borderRadius: 10 }}
                />

                <Box flex={1}>
                  <Typography fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2">
                    Qty: {item.quantity}
                  </Typography>
                </Box>

                <Typography fontWeight="bold">
                  ৳{item.lineTotal}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography>
            <b>Total:</b> ৳{order.pricing?.total}
          </Typography>

          <Typography>
            <b>Payment:</b> {order.paymentMethod}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              onClick={() =>
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/order/myorder/invoice/${order._id}`
                )
              }
            >
              Invoice
            </Button>

            {order.orderStatus === "pending" && (
              <Button
                variant="contained"
                color="error"
                onClick={cancelOrder}
              >
                Cancel Order
              </Button>
            )}

            {order.orderStatus === "delivered" && (
              <Button
                variant="contained"
                onClick={returnOrder}
              >
                Return / Refund
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
