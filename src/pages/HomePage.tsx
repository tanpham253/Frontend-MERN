import { useQuery } from "@tanstack/react-query";
import { getCategoryTree } from "@/services/categoryService";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductGridHome from "@/components/ProductGridHome";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
    title: "Welcome to Our Store",
    subtitle: "Discover the best products for your needs",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    title: "Latest Tech Deals",
    subtitle: "Find laptops, phones, and accessories at great prices",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
    title: "Garden & Home Essentials",
    subtitle: "Everything you need for a cozy home",
  },
];

const HomePage = () => {
  const queryCategories = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoryTree,
  });

  return (
    <main className="home-page container mx-auto my-6 space-y-14">
      {/* === Horizontal Category Bar (Centered, Non-Sticky) === */}
      <section className="section-category-bar bg-white border-y border-gray-200 py-3">
        {queryCategories.isLoading ? (
          <div className="flex justify-center items-center py-4">
            <span className="animate-pulse text-gray-500">
              Đang tải danh mục...
            </span>
          </div>
        ) : (
          <div className="flex justify-center items-center flex-wrap gap-1 md:gap-2">
            {queryCategories.data?.map((cat, index, arr) => (
              <div key={cat._id} className="flex items-center">
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-none border-none px-5 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  <Link to={`/category/${cat.slug}`}>{cat.category_name}</Link>
                </Button>
                {index < arr.length - 1 && (
                  <div className="h-5 w-[1px] bg-gray-300" />
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* === Slideshow Banner === */}
      <section className="section-banner">
        <Carousel
          plugins={[Autoplay({ delay: 4000 })]}
          className="w-full overflow-hidden rounded-2xl shadow-md"
        >
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id}>
                <Card className="border-0">
                  <CardContent className="relative p-0">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-[350px] w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
                      <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">
                        {slide.title}
                      </h2>
                      <p className="text-lg md:text-xl opacity-90">
                        {slide.subtitle}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* === Featured Product Grids === */}
      <section className="section-products space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-indigo-50 to-white rounded-2xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-bold text-indigo-700 tracking-tight">
              Featured Collection
            </h2>
            <Link
              to="/category/garden"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              View All →
            </Link>
          </div>
          <ProductGridHome
            title=""
            linkMore="/category/garden"
            catId="68da5c68743e19f4f41d64e5"
          />
        </motion.div>
      </section>
    </main>
  );
};

export default HomePage;
