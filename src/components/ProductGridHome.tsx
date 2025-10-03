import { getProductHome } from "@/services/productService"
import { useQuery } from "@tanstack/react-query"
import ProductsGrid from "./ProductsGrid"
import sampleProduct from '@/mocks/productMock'

const ProductGridHome = ({
    title,
    linkMore,
    catId,
    limit = 5
}: {title: string, linkMore: string, catId: string, limit?: number}) => {

    const productsHomeQuery = useQuery({
        queryKey: ["products", catId],
        queryFn: () => getProductHome({ catId, limit })
    })

    console.log('<<=== 🚀  productsHomeQuery ===>>',productsHomeQuery.data);

  const fallbackProducts = Array.from({ length: limit }).map((_, i) => ({
    ...sampleProduct,
    _id: `${sampleProduct._id}-home-${i}`,
    slug: `${sampleProduct.slug}-home-${i}`,
    product_name: `${sampleProduct.product_name} ${i + 1}`,
  }));

  const productsToShow = (productsHomeQuery.data && productsHomeQuery.data.length > 0)
    ? productsHomeQuery.data
    : fallbackProducts;

  return (
    <section className="products-grid my-5">
          <div className="section-header flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <div className="section-more">
              <a href={linkMore} className="text-sm text-blue-500">See More</a>
            </div>
          </div>
          <ProductsGrid products={productsToShow || []} />
      </section>
  )
}

export default ProductGridHome