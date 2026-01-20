import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);

  // console.log()

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=3");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=3");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=3");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top */}
      <div className="py-28 px-3 max-w-6xl mx-auto flex flex-col gap-6">
        <p className="text-slate-700 text-3xl sm:text-6xl font-bold">
          Find your next <span className="text-slate-500">perfect</span>
          <br /> place with ease
        </p>
        <p className="text-gray-400 sm:text-sm text-xs">
          Fares Estate will help you find your home fast, easy and comfortable.
          <br /> Our expert support are always available.
        </p>
        <Link
          to={"/search"}
          className="text-blue-800 hover:underline text-xs sm:text-sm"
        >
          Let's Start now...
        </Link>
      </div>
      {/* Swiper */}
      {offerListings && offerListings.length > 0 && (
        <Swiper navigation>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* Recent cards of listings */}
      <div className="flex flex-col gap-8 p-3 my-10 max-w-6xl mx-auto">
        {/* for offer Listings */}
        <div>
          <div className="my-3">
            <h2 className="text-3xl font-semibold text-slate-600">
              Recent Offers
            </h2>
            <Link
              className="text-blue-700 hover:underline"
              to={"/search?offer=true"}
            >
              Show more offers
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {offerListings &&
              offerListings.length > 0 &&
              offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
        {/* for rent Listings */}
        <div>
          <div className="my-3">
            <h2 className="text-3xl font-semibold text-slate-600">
              Recent places for rent
            </h2>
            <Link
              className="text-blue-700 hover:underline"
              to={"/search?type=rent"}
            >
              Show more places for rent
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {rentListings &&
              rentListings.length > 0 &&
              rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
        {/* for sale Listings */}
        <div>
          <div className="my-3">
            <h2 className="text-3xl font-semibold text-slate-600">
              Recent places for sale
            </h2>
            <Link
              className="text-blue-700 hover:underline"
              to={"/search?offer=sale"}
            >
              Show more places for sale
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {saleListings &&
              saleListings.length > 0 &&
              saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
