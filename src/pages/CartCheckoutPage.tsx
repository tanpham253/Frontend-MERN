import CartSteps from "@/components/CartSteps";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useShoppingCartStore } from "@/stores/useShoppingCartStore";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/services/orderSerivce";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const schema = yup.object().shape({
  last_name: yup.string().required("Vui lòng nhập họ"),
  first_name: yup.string().required("Vui lòng nhập tên"),
  phone: yup.string().required("Vui lòng nhập số điện thoại"),
  email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
  street: yup.string().required("Vui lòng nhập địa chỉ"),
  city: yup.string().required("Vui lòng nhập thành phố"),
  state: yup.string().required("Vui lòng nhập tỉnh/thành"),
  zip_code: yup.string().max(5, "Tối đa 5 ký tự").optional().default(""),
  payment_type: yup.number().required("Vui lòng chọn phương thức thanh toán").default(1),
  order_note: yup.string().optional().default(""),
});

const CartCheckoutPage = () => {
  const navigate = useNavigate();
  const { items, totalAmount, setCartSteps, setOrderInfo } = useShoppingCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const mutationCreateOrder = useMutation({
    mutationFn: createOrder,
    onError: () => toast.error("Đã xảy ra lỗi khi tạo đơn hàng"),
    onSuccess: (data) => {
      setCartSteps(4);
      setOrderInfo({
        customer: {
          last_name: data.last_name,
          first_name: data.first_name,
          phone: data.phone,
          email: data.email,
          street: data.street,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
        },
        orderId: data._id,
        paymentType: data.payment_type,
        items,
        totalAmount,
      });
      navigate("/cart/done");
    },
  });

  const onSubmit = async (data: any) => {
    const orderPayload = {
      customer: {
        last_name: data.last_name,
        first_name: data.first_name,
        phone: data.phone,
        email: data.email,
        street: data.street,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
      },
      order_items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
      payment_type: data.payment_type || 1,
      order_note: data.order_note || "",
    };
    await mutationCreateOrder.mutateAsync(orderPayload);
  };

  return (
    <main className="container mx-auto py-8 max-w-6xl">
      <CartSteps />
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Thanh toán</h1> */}

      <form
        className="flex flex-col lg:flex-row gap-6"
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* === LEFT SIDE: CUSTOMER FORM === */}
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Thông tin khách hàng</CardTitle>
              <a
                href="/login?callbackUrl=/cart/checkout"
                className="text-sm text-blue-600 hover:underline"
              >
                Đã có tài khoản? Đăng nhập
              </a>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Họ *</Label>
                  <Input {...register("last_name")} />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Tên *</Label>
                  <Input {...register("first_name")} />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Số điện thoại *</Label>
                  <Input {...register("phone")} />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Địa chỉ *</Label>
                <Input {...register("street")} />
                {errors.street && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.street.message as string}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Thành phố *</Label>
                  <Input {...register("city")} />
                </div>
                <div>
                  <Label>Tỉnh/Thành *</Label>
                  <Input {...register("state")} />
                </div>
                <div>
                  <Label>Mã bưu điện</Label>
                  <Input maxLength={5} {...register("zip_code")} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="1">
                <div className="flex flex-col gap-2">
                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="1" {...register("payment_type")} />
                    <span>Thẻ tín dụng</span>
                  </Label>
                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="2" {...register("payment_type")} />
                    <span>PayPal</span>
                  </Label>
                  <Label className="flex items-center space-x-2">
                    <RadioGroupItem value="3" {...register("payment_type")} />
                    <span>Chuyển khoản ngân hàng</span>
                  </Label>
                </div>
              </RadioGroup>
              {errors.payment_type && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.payment_type.message as string}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ghi chú đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={4}
                placeholder="Nhập ghi chú cho đơn hàng của bạn"
                {...register("order_note")}
              />
            </CardContent>
          </Card>
        </div>

        {/* === RIGHT SIDE: CART SUMMARY === */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Giỏ hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.product_name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <div className="font-medium">{item.product_name}</div>
                      <div className="text-sm text-gray-500">
                        {item.price} x {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {(item.price * item.quantity).toFixed(2)}đ
                  </span>
                </div>
              ))}
              <div className="flex mt-3">
                <Input placeholder="Nhập mã giảm giá" className="rounded-r-none" />
                <Button type="button" className="rounded-l-none">
                  Áp dụng
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tạm tính</span>
                <span className="font-medium">{totalAmount.toFixed(2)}đ</span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span>Phí vận chuyển</span>
                <span className="font-medium">0đ</span>
              </div> */}
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-lg font-semibold">Tổng cộng</span>
                <span className="text-lg font-bold text-blue-600">
                  {totalAmount.toFixed(2)}đ
                </span>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full text-lg py-3 font-semibold"
          >
            Đặt hàng
          </Button>
        </div>
      </form>
    </main>
  );
};

export default CartCheckoutPage;
