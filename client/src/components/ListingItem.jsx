import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300 w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="Listing cover"
          className="h-[320px] sm:h-[220px] w-full hover:scale-105 transition-scale duration-300 object-cover"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="truncate text-lg text-slate-700 font-semibold ">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-green-700" />
            <p className="text-gray-600 text-sm truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>
          <div className="flex items-center gap-1 text-slate-500 font-semibold mt-2">
            <span>
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
            </span>
            <span>{listing.type === "rent" && "/month"}</span>
          </div>
          <div className="font-bold text-green-700 text-xs flex gap-4">
            <div>
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </div>
            <div>
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
