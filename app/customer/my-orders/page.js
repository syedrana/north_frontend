// "use client";

// import apiServer from "@/lib/apiServer";
// import { useEffect, useState } from "react";
// import OrderTimeline from "../../components/OrderTimeline";

// export default function MyOrdersPage() {

//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     apiServer.get("/order/my")
//       .then((res) => setOrders(res.data.orders));
//   }, []);

//   return (
//     <div className="max-w-5xl mx-auto p-6">

//       <h1 className="text-2xl font-semibold mb-6">
//         My Orders
//       </h1>

//       <div className="space-y-6">

//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="border rounded-xl p-5"
//           >
//             <div className="flex justify-between">

//               <div>
//                 <p className="font-medium">
//                   {order.orderNumber}
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   ৳ {order.pricing.total}
//                 </p>
//               </div>

//               <div className="text-sm capitalize">
//                 {order.orderStatus}
//               </div>

//             </div>

//             <OrderTimeline status={order.orderStatus} />

//           </div>
//         ))}

//       </div>

//     </div>
//   );
// }


















// "use client";

// import apiServer from "@/lib/apiServer";
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Stack,
//   Step,
//   StepLabel,
//   Stepper,
//   Typography,
// } from "@mui/material";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// const statusColors = {
//   pending: "warning",
//   confirmed: "info",
//   shipped: "primary",
//   delivered: "success",
//   cancelled: "error",
// };

// const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];

// function TrackingTimeline({ status }) {
//   const activeStep = steps.findIndex(
//     (s) => s.toLowerCase() === status?.toLowerCase()
//   );

//   return (
//     <Stepper activeStep={activeStep === -1 ? 0 : activeStep} sx={{ mt: 2 }}>
//       {steps.map((label) => (
//         <Step key={label}>
//           <StepLabel>{label}</StepLabel>
//         </Step>
//       ))}
//     </Stepper>
//   );
// }

// export default function MyOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await apiServer.get("/order/my");
//       setOrders(data.orders || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReorder = async (orderId) => {
//     try {
//       await apiServer.post(`/orders/${orderId}/reorder`);
//       alert("Added to cart!");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <Box p={4}>
//         <Typography>Loading orders...</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Box maxWidth="900px" mx="auto" p={3}>
//       <Typography variant="h4" fontWeight="bold" mb={3}>
//         My Orders
//       </Typography>

//       {orders.length === 0 && (
//         <Typography>No orders found.</Typography>
//       )}

//       <Stack spacing={3}>
//         {orders.map((order) => (
//           <Card key={order._id} sx={{ borderRadius: 3 }}>
//             <CardContent>
//               {/* Header */}
//               <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//                 flexWrap="wrap"
//               >
//                 <Typography fontWeight="bold">
//                   Order #{order.orderNumber}
//                 </Typography>

//                 <Chip
//                   label={order.orderStatus}
//                   color={statusColors[order.orderStatus] || "default"}
//                   sx={{ textTransform: "capitalize" }}
//                 />
//               </Stack>

//               <Divider sx={{ my: 2 }} />

//               {/* Items */}
//               <Stack spacing={2}>
//                 {order.items.map((item) => (
//                   <Stack
//                     key={item._id}
//                     direction="row"
//                     spacing={2}
//                     alignItems="center"
//                   >
//                     <Image
//                       src={item.image}
//                       alt={item.name}
//                       width={70}
//                       height={70}
//                       fill
//                       style={{ borderRadius: 10 }}
//                     />

//                     <Box flex={1}>
//                       <Typography fontWeight={600}>
//                         {item.name}
//                       </Typography>

//                       <Typography variant="body2" color="text.secondary">
//                         Qty: {item.quantity}
//                       </Typography>
//                     </Box>

//                     <Typography fontWeight={600}>
//                       ৳{item.price}
//                     </Typography>
//                   </Stack>
//                 ))}
//               </Stack>

//               {/* Tracking */}
//               <TrackingTimeline status={order.status} />

//               <Divider sx={{ my: 2 }} />

//               {/* Actions */}
//               <Stack
//                 direction="row"
//                 spacing={2}
//                 justifyContent="space-between"
//                 flexWrap="wrap"
//               >
//                 <Typography fontWeight="bold">
//                   Total: ৳{order.pricing?.total}
//                 </Typography>

//                 <Stack direction="row" spacing={2}>
//                   <Button
//                     variant="outlined"
//                     onClick={() =>
//                       window.open(
//                         `${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}/invoice`,
//                         "_blank"
//                       )
//                     }
//                   >
//                     Invoice
//                   </Button>

//                   <Button
//                     variant="contained"
//                     onClick={() => handleReorder(order._id)}
//                   >
//                     Reorder
//                   </Button>
//                 </Stack>
//               </Stack>
//             </CardContent>
//           </Card>
//         ))}
//       </Stack>
//     </Box>
//   );
// }













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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const statusColors = {
  pending: "warning",
  confirmed: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const steps = ["Pending", "Confirmed", "Shipped", "Delivered"];

function TrackingTimeline({ status }) {
  const activeStep = steps.findIndex(
    (s) => s.toLowerCase() === status?.toLowerCase()
  );

  return (
    <Stepper
      activeStep={activeStep === -1 ? 0 : activeStep}
      sx={{ mt: 2 }}
      alternativeLabel
    >
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const fetchOrders = async () => {
      try {
        const { data } = await apiServer.get("/order/my");
        if (mounted) setOrders(data.orders || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []);

  const handleReorder = async (orderId) => {
    try {
      await apiServer.post(`/orders/${orderId}/reorder`);
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <Typography>Loading orders...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="1000px" mx="auto" p={{ xs: 2, md: 3 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Orders
      </Typography>

      {orders.length === 0 && (
        <Typography>No orders found.</Typography>
      )}

      <Stack spacing={3}>
        {orders.map((order) => (
          <Card
            key={order._id}
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>

              {/* Header */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                spacing={1}
              >
                <Typography fontWeight="bold">
                  Order #{order.orderNumber}
                </Typography>

                <Chip
                  label={order.orderStatus}
                  color={statusColors[order.orderStatus] || "default"}
                  sx={{ textTransform: "capitalize", width: "fit-content" }}
                />
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Items */}
              <Stack spacing={2}>
                {order.items.map((item) => (
                  <Stack
                    key={item._id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </Box>

                    <Box flex={1}>
                      <Typography fontWeight={600} fontSize={{ xs: 14, md: 15 }}>
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        fontSize={{ xs: 12, md: 13 }}
                      >
                        Qty: {item.quantity}
                      </Typography>
                    </Box>

                    <Typography fontWeight={600}>
                      ৳{item.lineTotal || item.price}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              {/* Tracking */}
              <TrackingTimeline status={order.status} />

              <Divider sx={{ my: 2 }} />

              {/* Footer */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ sm: "center" }}
                spacing={2}
              >
                <Typography fontWeight="bold">
                  Total: ৳ {order.pricing?.total}
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  width={{ xs: "100%", sm: "auto" }}
                >
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      router.push(`/customer/my-orders/details/${order._id}`)
                    }
                  >
                    Details
                  </Button>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      window.open(
                        `${process.env.NEXT_PUBLIC_API_URL}/order/myorder/invoice/${order._id}`,
                        "_blank"
                      )
                    }
                  >
                    Invoice
                  </Button>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => handleReorder(order._id)}
                  >
                    Reorder
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
