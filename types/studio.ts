import Link from "next/link";

/* ---------- Types ---------- */
interface Studio {
  _id: string;
  title: string;
  category: string;
  address: string;
  city: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  image: string;
  gallery: string;
  amenities: string;
  overview: string;
}