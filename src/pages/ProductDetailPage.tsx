import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug, type Product } from "@/services/productService";
import sampleProduct from '@/mocks/productMock'
import ProductsGrid from "@/components/ProductsGrid";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useShoppingCartStore } from "@/stores/useShoppingCartStore";
import { formatCurrency } from '@/lib/utils'

interface ExtendedProduct extends Product {
  description?: string;
  specs?: Record<string, string>;
  images?: string[];
  reviews?: { user: string; rating: number; comment: string }[];
  relatedProducts?: Product[];
}

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useShoppingCartStore();

  const { data: product, isLoading, isError } = useQuery<ExtendedProduct>({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug as string),
    enabled: true,
  });
  const displayProduct = product || (sampleProduct as ExtendedProduct);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const inStock = (displayProduct as unknown as { inStock?: number })?.inStock ?? undefined;

  useEffect(() => {
    if (displayProduct?.thumbnail) {
      setActiveImage(displayProduct.thumbnail);
    }
  }, [displayProduct]);

  if (isLoading) return <p className="p-6">Loading product...</p>;
  if (isError && !displayProduct) return <p className="p-6">Product not found.</p>;

  const discount = displayProduct.discount || 0;
  const discountedPrice = discount > 0 ? displayProduct.price * (1 - discount / 100) : displayProduct.price;

  const fmt = (v: number) =>
    formatCurrency(v);

  const handleAddToCart = () => {
    if (!displayProduct) return;
    addItem({
      id: displayProduct._id,
      product_name: displayProduct.product_name,
      price: discountedPrice,
      thumbnail: displayProduct.thumbnail,
      quantity,
    });
    toast.success(`${quantity} item(s) added to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart();
    navigate("/cart/checkout");
  };

  const reviewsCount = displayProduct.reviews?.length ?? 0;
  const averageRating = reviewsCount
    ? (displayProduct.reviews!.reduce((acc, rev) => acc + rev.rating, 0) / reviewsCount).toFixed(1)
    : "No reviews";

  const relatedCount = displayProduct.relatedProducts?.length ?? 0;

  return (
    <div className="p-6">
      {/* Main Grid: Image + Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Thumbnails column */}
        <aside className="md:col-span-1 hidden md:block">
          <div className="space-y-2">
            {[displayProduct.thumbnail, ...(displayProduct.images || [])].map((img, idx) => (
              <button key={idx} onClick={() => setActiveImage(img)} className="w-full">
                <img src={img} alt={`thumb-${idx}`} className="w-full h-20 object-contain border rounded" />
              </button>
            ))}
          </div>
        </aside>

        {/* Main image */}
        <div className="md:col-span-5 border rounded-lg p-4">
          {activeImage && (
            <img
              src={activeImage}
              alt={displayProduct.product_name}
              className="w-full h-[420px] object-contain mb-4"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="md:col-span-6">
          <h1 className="text-2xl font-bold mb-2">{displayProduct.product_name}</h1>
          <p className="text-gray-500 mb-2">Model Year: {displayProduct.model_year}</p>
          <div className="flex items-center mb-4">
            <p className="text-red-600 text-2xl font-semibold mr-3">{fmt(discountedPrice)}</p>
            {discount > 0 && (
              <p className="text-gray-500 line-through">{fmt(displayProduct.price)} <span className="text-sm">(-{discount}%)</span></p>
            )}
          </div>
          {/* Availability / shipping */}
          <div className="mb-4">
            <span className={`font-medium ${inStock === 0 ? 'text-red-600' : 'text-green-600'}`}>
              {inStock === undefined ? 'Availability: Check' : inStock > 0 ? `In stock (${inStock})` : 'Out of stock'}
            </span>
            <div className="text-sm text-gray-500">Free delivery within 3-5 business days (est.)</div>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-yellow-500 mr-2">★ {averageRating}</span>
            <span>({reviewsCount} reviews)</span>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mb-4">
            <label className="mr-2">Quantity:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 border rounded p-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-6">
            <Button onClick={handleAddToCart} disabled={inStock === 0}>Add to Cart</Button>
            <Button variant="secondary" onClick={handleBuyNow} disabled={inStock === 0}>Buy Now</Button>
          </div>
        </div>
      </div>

      {/* Tabbed content: Description / Specs / Reviews */}
      <section className="my-8">
        <div className="flex gap-4 mb-4">
          <button className={`px-3 py-2 rounded ${activeTab === 'description' ? 'bg-primary text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('description')}>Description</button>
          <button className={`px-3 py-2 rounded ${activeTab === 'specs' ? 'bg-primary text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('specs')}>Specifications</button>
          <button className={`px-3 py-2 rounded ${activeTab === 'reviews' ? 'bg-primary text-white' : 'bg-gray-100'}`} onClick={() => setActiveTab('reviews')}>Reviews ({reviewsCount})</button>
        </div>

        {activeTab === 'description' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Product description</h3>
            <p className="text-gray-700">{displayProduct.description || "No description available."}</p>
          </div>
        )}

        {activeTab === 'specs' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Specifications</h3>
            {displayProduct.specs && Object.keys(displayProduct.specs).length > 0 ? (
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(displayProduct.specs).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="p-2 font-semibold">{key}</td>
                      <td className="p-2">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No specification available.</p>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
            {(displayProduct.reviews || []).length > 0 ? (
              (displayProduct.reviews || []).map((rev, idx) => (
                <div key={idx} className="border-b py-4">
                  <div className="flex items-center mb-2">
                    <span className="font-bold mr-2">{rev.user}</span>
                    <span className="text-yellow-500">★ {rev.rating}</span>
                  </div>
                  <p>{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No reviews yet.</p>
            )}
          </div>
        )}
      </section>

      {/* Specs Section */}
      {displayProduct.specs && Object.keys(displayProduct.specs).length > 0 && (
        <section className="my-8">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <table className="w-full border-collapse">
            <tbody>
              {Object.entries(displayProduct.specs).map(([key, value]) => (
                <tr key={key} className="border-b">
                  <td className="p-2 font-semibold">{key}</td>
                  <td className="p-2">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Reviews Section */}
      {reviewsCount > 0 && (
        <section className="my-8">
          <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
          {(displayProduct.reviews || []).map((rev, idx) => (
            <div key={idx} className="border-b py-4">
              <div className="flex items-center mb-2">
                <span className="font-bold mr-2">{rev.user}</span>
                <span className="text-yellow-500">★ {rev.rating}</span>
              </div>
              <p>{rev.comment}</p>
            </div>
          ))}
        </section>
      )}

      {/* Related Products */}
      {relatedCount > 0 && (
        <section className="my-8">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <ProductsGrid products={displayProduct.relatedProducts || []} />
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;