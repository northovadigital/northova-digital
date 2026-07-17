const restaurantData = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Bella Vista Italian Kitchen",
  description:
    "Authentic Italian cuisine, fresh ingredients and warm hospitality in Houston, Texas.",
  servesCuisine: "Italian",
  priceRange: "$$",
  telephone: "+1-713-555-0198",
  email: "hello@bellavistakitchen.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "1800 Westheimer Road",
    addressLocality: "Houston",
    addressRegion: "TX",
    postalCode: "77098",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "11:00",
      closes: "22:00",
    },
  ],
  acceptsReservations: true,
};

export default function RestaurantJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(restaurantData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
