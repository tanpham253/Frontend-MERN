import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services/productService";
import { Loader2, Tag, ShoppingCart } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import RelatedProducts from "@/components/RelatedProducts";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });

  // Format number with commas every 3 digits
  const formatPrice = (price: number) => {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="text-center text-gray-500 mt-20">
        Product not found.
      </div>
    );
  }

  const discountedPrice =
    product.price - product.price * (product.discount / 100);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.product_name },
        ]}
      />

      {/* Product Section */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden group relative">
          <img
            src={product.thumbnail}
            alt={product.product_name}
            className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold shadow">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {product.product_name}
            </h1>
            <p className="text-gray-500 mt-2">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            {product.discount > 0 ? (
              <>
                <span className="text-3xl font-semibold text-green-600">
                  {formatPrice(discountedPrice)}đ
                </span>
                <span className="line-through text-gray-400 text-lg">
                  {formatPrice(product.price)}đ
                </span>
                <Tag className="w-5 h-5 text-red-500" />
              </>
            ) : (
              <span className="text-3xl font-semibold text-gray-900">
                {formatPrice(product.price)}đ
              </span>
            )}
          </div>

          {/* Model Info */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-700">
              <strong>Model Year:</strong> {product.model_year}
            </p>
          </div>

          {/* Add to Cart */}
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition w-full md:w-auto shadow">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {/* <div>
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <RelatedProducts categorySlug={product.slug.split("-")[0]} />
      </div> */}
    </div>
  );
}