import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Users,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

import { motion } from "motion/react";
import { apiUrl } from "../lib/api";
import { getHighResImage } from "../lib/image";
import LoadingSpinner from "./LoadingSpinner";


const PackageCard = ({ pkg }) => {

  const rawPrice = pkg?.price;


  const parsePrice = (val) => {

    if (val == null) return NaN;

    if (typeof val === "number") {
      return val;
    }

    const cleaned = String(val)
      .replace(/[^0-9.-]+/g, "");

    const number = Number(cleaned);

    return Number.isFinite(number)
      ? number
      : NaN;
  };


  const price = parsePrice(rawPrice);


  const priceDisplay = Number.isFinite(price)
    ? `Rs ${price.toLocaleString()}`
    : "Price unavailable";


  const packageId = pkg?.id || pkg?._id;


  return (

    <Link
      to={packageId ? `/package/${packageId}` : "/package"}
      className="block h-full"
    >

      <motion.div

        initial={{
          opacity:0,
          y:50
        }}

        whileInView={{
          opacity:1,
          y:0
        }}

        transition={{
          duration:0.5
        }}

        className="
        h-full
        rounded-lg
        border
        border-[var(--color-primary)]
        p-4
        "
      >


        <div className="
          overflow-hidden
          rounded-lg
          hover:shadow-2xl
          duration-300
        ">


          <img

            src={
              getHighResImage(pkg?.image,800)
              ||
              "https://via.placeholder.com/800x533?text=No+Image"
            }

            alt={pkg?.title}

            className="
            h-80
            w-full
            object-cover
            "
          />



          <div className="
            px-4
            py-5
            text-center
          ">


            <h3 className="
              text-xl
              font-bold
            ">
              {pkg?.title}
            </h3>



            <div className="
              mx-auto
              mt-4
              max-w-72
              rounded-full
              bg-white
              px-4
              py-2
              text-xl
              font-medium
            ">
              {priceDisplay}
            </div>



            <div className="
              mt-4
              space-y-2
              text-sm
              text-gray-600
            ">


              <div className="
                flex
                justify-center
                items-center
                gap-2
              ">
                <MapPin size={16}/>
                {pkg?.location}
              </div>



              <div className="
                flex
                justify-center
                items-center
                gap-2
              ">
                <Clock size={16}/>
                {pkg?.duration}
              </div>



              <div className="
                flex
                justify-center
                items-center
                gap-2
              ">
                <Users size={16}/>
                Group Size: {pkg?.groupSize}
              </div>


            </div>



            <button

              className="
              mt-5
              rounded-full
              bg-[var(--color-primary)]
              px-6
              py-2
              text-white
              font-semibold
              hover:bg-[var(--color-primary-dark)]
              duration-300
              "

            >

              Explore

            </button>


          </div>


        </div>


      </motion.div>


    </Link>

  );
};




function Packages(){


  const [packages,setPackages]=useState([]);

  const [loading,setLoading]=useState(true);


  const prevRef=useRef(null);

  const nextRef=useRef(null);



  useEffect(()=>{


    let mounted=true;


    async function fetchPackages(){

      try{


        const res=await fetch(
          apiUrl("/api/packages")
        );


        if(!res.ok)
          throw new Error(
            "Failed to fetch packages"
          );


        const data=await res.json();



        if(mounted)
          setPackages(data);



      }catch(error){

        console.error(error);

      }
      finally{

        if(mounted)
          setLoading(false);

      }

    }



    fetchPackages();



    return ()=>{
      mounted=false;
    };


  },[]);





  return (

<section className="bg-white py-16">


<div className="mx-auto max-w-7xl px-6">



<div className="text-center">


<h2 className="
text-4xl
font-bold
md:text-5xl
">

Tour Packages

</h2>



<p className="
mt-5
text-gray-600
">

Discover our curated packages for unforgettable journeys.

</p>


</div>






<div className="relative mt-8">



<button

ref={prevRef}

className="
absolute
left-4
top-1/2
-translate-y-1/2
z-50

flex
h-10
w-10
md:h-12
md:w-12

items-center
justify-center

rounded-full

bg-[var(--color-primary)]

text-white

shadow-xl

hover:bg-[var(--color-primary-dark)]

duration-300
"

>

<ChevronLeft/>

</button>





<button

ref={nextRef}

className="
absolute
right-4
top-1/2
-translate-y-1/2
z-50

flex
h-10
w-10
md:h-12
md:w-12

items-center
justify-center

rounded-full

bg-[var(--color-primary)]

text-white

shadow-xl

hover:bg-[var(--color-primary-dark)]

duration-300
"

>

<ChevronRight/>

</button>







<Swiper


modules={[Navigation]}


slidesPerView={1}

spaceBetween={24}


observer={true}

observeParents={true}



navigation={{
 prevEl:prevRef.current,
 nextEl:nextRef.current,
}}



onBeforeInit={(swiper)=>{

swiper.params.navigation.prevEl=
prevRef.current;

swiper.params.navigation.nextEl=
nextRef.current;

}}



onSwiper={(swiper)=>{

setTimeout(()=>{

if(swiper?.navigation){

swiper.navigation.destroy?.();

swiper.navigation.init?.();

swiper.navigation.update?.();

}

},0);

}}



breakpoints={{

768:{
slidesPerView:2,
},


1024:{
slidesPerView:3,
}

}}


className="mt-5"

>




{
loading ? (

<SwiperSlide>

<LoadingSpinner
label="Loading packages..."
className="py-10"
/>

</SwiperSlide>


)

:

packages.length===0 ? (

<SwiperSlide>

<div className="py-10 text-center">

No packages available.

</div>

</SwiperSlide>


)

:


packages.map((pkg)=>(

<SwiperSlide

key={
pkg.id ||
pkg._id ||
pkg.title
}

className="h-auto"

>


<PackageCard pkg={pkg}/>


</SwiperSlide>


))


}





</Swiper>



</div>



</div>


</section>

  );

}



export default Packages;