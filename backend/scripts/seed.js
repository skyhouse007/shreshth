import 'dotenv/config';
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Property from '../models/Property.js';

const demoImages = (i) => [
  `https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80`,
  `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80`,
  `https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80`,
].map((u) => `${u}&sig=${i}`);

const sample = [
  {
    title: 'Shresth Bodh Gaya — The Mahabodhi Residences (2 BHK, upcoming)',
    slug: 'shresth-bodh-gaya-2bhk-upcoming',
    description:
      'Corner-light 2 BHK in our upcoming Bodh Gaya project — calm palettes, cross-ventilation, and concierge-ready lobby near the spiritual precinct.',
    location: 'Bodh Gaya, Bihar',
    city: 'Bodh Gaya',
    state: 'Bihar',
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 2,
    bathrooms: 2,
    area: 1180,
    price: 7200000,
    amenities: ['Cross ventilation', 'Landscaped podium', 'EV-ready parking', 'Visitor lounge'],
    featured: true,
    status: 'pending',
  },
  {
    title: 'Shresth Bodh Gaya — The Mahabodhi Residences (3 BHK, upcoming)',
    slug: 'shresth-bodh-gaya-3bhk-upcoming',
    description:
      'Expansive 3 BHK for families seeking room to breathe — separate work alcove, modular kitchen scope, and sky-framed master suite.',
    location: 'Bodh Gaya, Bihar',
    city: 'Bodh Gaya',
    state: 'Bihar',
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 1580,
    price: 10400000,
    amenities: ['Three sides open', 'Club lounge', 'Rainwater recharge', 'Smart home ready'],
    featured: true,
    status: 'pending',
  },
  {
    title: 'Skyline Penthouse — Bandra West',
    slug: 'skyline-penthouse-bandra',
    description:
      'Floor-to-ceiling glass, private terrace, and uninterrupted sea views. A rare corner residence with concierge service and two parking slots.',
    location: 'Bandra West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 4,
    bathrooms: 4,
    area: 3200,
    price: 125000000,
    amenities: ['Sea view', 'Smart home', 'Clubhouse', 'Private terrace', 'EV charging'],
    featured: true,
    status: 'active',
  },
  {
    title: 'Garden Villa — Alibaug',
    slug: 'garden-villa-alibaug',
    description:
      ' gated community villa with landscaped gardens, pool deck, and open-plan living. Ideal weekend home or boutique rental.',
    location: 'Alibaug',
    city: 'Alibaug',
    state: 'Maharashtra',
    type: 'villa',
    purpose: 'sale',
    bedrooms: 5,
    bathrooms: 5,
    area: 4800,
    price: 89000000,
    amenities: ['Private pool', 'Gated community', 'Garden', 'Staff quarters'],
    featured: true,
    status: 'active',
  },
  {
    title: 'Royal Orchid Apartments — Koregaon Park',
    slug: 'royal-orchid-koregaon-park',
    description:
      'Designer interiors, imported marble flooring, and a dedicated work suite. Walking distance to cafes and retail.',
    location: 'Koregaon Park, Pune',
    city: 'Pune',
    state: 'Maharashtra',
    type: 'apartment',
    purpose: 'rent',
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
    price: 185000,
    amenities: ['Modular kitchen', 'Power backup', 'Lift', 'Clubhouse'],
    featured: true,
    status: 'active',
  },
  {
    title: 'Hillcrest Plot — Lonavala',
    slug: 'hillcrest-plot-lonavala',
    description: 'Clear-title gated plot with contour lighting and road access. Ideal for a bespoke villa development.',
    location: 'Lonavala',
    city: 'Lonavala',
    state: 'Maharashtra',
    type: 'plot',
    purpose: 'sale',
    bedrooms: 0,
    bathrooms: 0,
    area: 8000,
    price: 42000000,
    amenities: ['Gated', 'Road access', 'Corner plot', 'Hill view'],
    featured: false,
    status: 'active',
  },
  {
    title: 'Marina Bay Residences',
    slug: 'marina-bay-residences',
    description: 'Water-front inspired architecture with resort amenities and private marina access.',
    location: 'Worli, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    type: 'apartment',
    purpose: 'sale',
    bedrooms: 3,
    bathrooms: 3,
    area: 2400,
    price: 78000000,
    amenities: ['Infinity pool', 'Spa', 'Concierge', 'Sky lounge'],
    featured: false,
    status: 'pending',
  },
];

async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('Set MONGO_URI in .env');
    process.exit(1);
  }
  await mongoose.connect(uri);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@shresthproperties.com';
  const adminPass = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';

  const removed = await Admin.deleteMany({});
  console.log(`Removed ${removed.deletedCount} existing admin account(s).`);

  await Admin.create({
    name: 'Shresth Admin',
    email: adminEmail,
    password: adminPass,
  });
  console.log('Created admin:', adminEmail, '(password from SEED_ADMIN_PASSWORD)');

  let created = 0;
  for (let i = 0; i < sample.length; i += 1) {
    const row = sample[i];
    const exists = await Property.findOne({ slug: row.slug });
    if (exists) continue;
    await Property.create({
      ...row,
      images: demoImages(i),
    });
    created += 1;
  }

  console.log(`Seeded ${created} new properties (${sample.length} total sample definitions).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
