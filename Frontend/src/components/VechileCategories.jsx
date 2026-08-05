import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import { useBooking } from "../context/BookingContext";
import LoadingSpinner from "./LoadingSpinner";

const VehicleCard = ({ vehicle, onBookNow }) => {
  const rawPrice = vehicle?.price ?? vehicle?.pricePerDay;
  const priceNum = Number(rawPrice);

  const priceDisplay = Number.isFinite(priceNum)
    ? `Rs ${priceNum.toLocaleString()} / Day`
    : "Price unavailable";

  return (
    <motion.div
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="h-full rounded-lg border border-[var(--color-primary)] p-4"
    >
      <div className="overflow-hidden rounded-lg hover:shadow-2xl duration-300">
        <img
          src={
            getHighResImage(vehicle.image, 800) ||
            "https://via.placeholder.com/800x533?text=No+Image"
          }
          alt={vehicle.name}
          className="h-80 w-full object-cover"
        />

        <div className="px-4 py-5 text-center">
          <h3 className="text-xl font-bold">{vehicle.name}</h3>

          <div className="mx-auto mt-4 max-w-72 rounded-full bg-white px-4 py-2 text-xl font-medium">
            {priceDisplay}
          </div>

          <button
            onClick={() => onBookNow(vehicle?.name || "")}
            className="mt-5 rounded-full bg-[var(--color-primary)] px-6 py-2 text-white font-semibold hover:bg-[var(--color-primary-dark)] duration-300"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const VechileCategories = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { openBookingForm } = useBooking();

  useEffect(() => {
    let mounted = true;

    async function fetchBikes() {
      try {
        const res = await fetch(apiUrl("/api/bikes"));

        if (!res.ok) throw new Error("Failed to fetch bikes");

        const data = await res.json();

        if (mounted) setBikes(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchBikes();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Vehicle Categories
          </h2>

          <p className="mt-5 text-gray-600">
            Browse our selection of vehicles across various categories to find
            the perfect match for your needs.
          </p>
        </div>

        {/* Navigation Buttons */}



      <div className="relative mt-8">

  {/* Previous Button */}
  <button
    ref={prevRef}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-xl hover:bg-[var(--color-primary-dark)] transition-all duration-300"
    aria-label="Previous"
  >
    <ChevronLeft size={22} />
  </button>

  {/* Next Button */}
  <button
    ref={nextRef}
   className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-xl hover:bg-[var(--color-primary-dark)] transition-all duration-300"
    aria-label="Next"
  >
    <ChevronRight size={22} />
  </button>

  <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          spaceBetween={24}
          observer={true}
          observeParents={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
   onSwiper={(swiper) => {
  setTimeout(() => {
    if (swiper?.navigation) {
      swiper.navigation.destroy?.();
      swiper.navigation.init?.();
      swiper.navigation.update?.();
    }
  }, 0);
}}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {loading ? (
            <SwiperSlide>
              <LoadingSpinner
                label="Loading bikes..."
                className="py-10"
              />
            </SwiperSlide>
          ) : bikes.length === 0 ? (
            <SwiperSlide>
              <div className="py-10 text-center">
                No bikes available.
              </div>
            </SwiperSlide>
          ) : (
            bikes.map((vehicle) => (
              <SwiperSlide
                key={vehicle.id || vehicle._id || vehicle.name}
                className="h-auto"
              >
                <VehicleCard
                  vehicle={vehicle}
                  onBookNow={openBookingForm}
                />
              </SwiperSlide>
            ))
          )}
                </Swiper>

      </div>

    </div>

    </section>
  );
};

export default VechileCategories;