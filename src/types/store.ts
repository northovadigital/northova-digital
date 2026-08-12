export type StoreContact = {
  phone: string;
  whatsapp: string;
  email: string;
};

export type StoreSocialLinks = {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
};

export type StoreConfig = {
  name: string;
  shortName: string;
  description: string;
  currency: "PKR";
  locale: string;
  country: string;
  city: string;
  contact: StoreContact;
  socials: StoreSocialLinks;
};
