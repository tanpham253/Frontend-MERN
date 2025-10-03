import type { Product } from "@/services/productService";
import { Button } from "./ui/button";
import { useShoppingCartStore } from "@/stores/useShoppingCartStore";
import { toast } from "sonner"
import { formatCurrency } from '@/lib/utils'

const ButtonAddToCart = ({ product }: { product: Product }) => {
   const {  addItem } = useShoppingCartStore((state) => state);
  return (
    <Button
      onClick={() => {
        const discount = product.discount || 0;
        const price = discount > 0 ? product.price * (1 - discount / 100) : product.price;
        addItem({
            id: product._id,
            product_name: product.product_name,
            price,
            thumbnail: product.thumbnail,
            quantity: 1,
        });
        toast.success(`Added ${product.product_name} — ${formatCurrency(price)}`);
      }}
    >
      Add to cart
    </Button>
  );
};

export default ButtonAddToCart;
