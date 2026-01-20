import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [messege, setMessege] = useState("");
  console.log(messege);

  useEffect(() => {
    const fetchLandloard = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandloard();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold">
              {landlord.username.toLowerCase()}
            </span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            onChange={(e) => setMessege(e.target.value)}
            className="w-full border rounded-lg p-3 outline-none"
            name="messege"
            id="messege"
            rows="2"
            placeholder="Please write your messege here..."
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${messege}`}
            className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95 text-center"
          >
            Send messege
          </Link>
        </div>
      )}
    </>
  );
}
