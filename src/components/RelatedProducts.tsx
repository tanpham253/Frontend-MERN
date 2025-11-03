import { useQuery } from "@tanstack/react-query";
import { getProductByCategorySlug } from "@/services/productService";
import { Link } from "react-router";
import type { Product } from "@/services/productService";
import { Loader2 } from "lucide-react";

export default function RelatedProducts({ categorySlug }: { categorySlug: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["related-products", categorySlug],
    queryFn: () => getProductByCategorySlug(categorySlug),
    enabled: !!categorySlug,
  });

  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
      </div>
    );

  const related = data?.products ?? [];

  if (!related.length) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((item: Product) => (
          <Link
            key={item._id}
            to={`/products/${item.slug}`}
            className="border rounded-xl overflow-hidden hover:shadow-md transition bg-white"
          >
            <img
              src={item.thumbnail}
              alt={item.product_name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-gray-800 line-clamp-1">{item.product_name}</h3>
              <p className="text-blue-600 font-semibold">${item.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}