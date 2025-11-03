import CartSteps from "@/components/CartSteps"
import { useShoppingCartStore } from "@/stores/useShoppingCartStore"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

const CartDonePage = () => {
  const navigate = useNavigate()
  const { orderInfo, clearCart } = useShoppingCartStore((state) => state)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  if (!orderInfo?.orderId) {
    return (
      <main className="container mx-auto py-10">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">
              Không có thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/cart")} className="mt-2">
              Quay lại giỏ hàng
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="container mx-auto py-10">
      <CartSteps />
      <Card className="max-w-2xl mx-auto shadow-md border border-gray-100">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              Cảm ơn bạn đã đặt hàng! 🎉
            </div>
            <p className="text-gray-600">
              Đơn hàng số{" "}
              <Badge variant="outline" className="font-semibold text-red-500 border-red-400">
                {orderInfo.orderId}
              </Badge>{" "}
              của bạn đã được đặt thành công.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
            </p>
          </div>
        </CardHeader>

        <Separator className="my-2" />

        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Thông tin đơn hàng</h2>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tổng tiền:</span>
            <span className="font-bold text-blue-600">
              {orderInfo.totalAmount.toLocaleString()}đ
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phương thức thanh toán:</span>
            <span className="font-medium">
              {(() => {
                switch (orderInfo.paymentType) {
                  case 1:
                    return "Thẻ tín dụng"
                  case 2:
                    return "PayPal"
                  case 3:
                    return "Chuyển khoản ngân hàng"
                  default:
                    return "Không xác định"
                }
              })()}
            </span>
          </div>

          <Separator className="my-2" />

          <div>
            <h3 className="font-medium text-gray-700 mb-2">Thông tin khách hàng</h3>
            <div className="ml-2 text-sm space-y-1 text-gray-600">
              <div>
                <span className="font-medium">Họ tên:</span>{" "}
                {orderInfo.customer.last_name} {orderInfo.customer.first_name}
              </div>
              <div>
                <span className="font-medium">Điện thoại:</span> {orderInfo.customer.phone}
              </div>
              <div>
                <span className="font-medium">Email:</span> {orderInfo.customer.email}
              </div>
              <div>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {orderInfo.customer.street}, {orderInfo.customer.city},{" "}
                {orderInfo.customer.state} {orderInfo.customer.zip_code}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center mt-6">
        <Button onClick={() => navigate("/")} size="lg">
          Quay lại trang chủ
        </Button>
      </div>
    </main>
  )
}

export default CartDonePage
