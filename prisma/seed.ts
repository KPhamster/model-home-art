import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL || "admin@modelhomeart.com";
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || "changeme123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });
  console.log(`✓ Admin user created: ${adminUser.email}`);

  // Create collections
  const collections = await Promise.all([
    prisma.collection.upsert({
      where: { slug: "modern" },
      update: {},
      create: {
        slug: "modern",
        name: "Modern Frames",
        description: "Clean lines and contemporary styles for today's spaces.",
        featured: true,
        order: 1,
      },
    }),
    prisma.collection.upsert({
      where: { slug: "classic" },
      update: {},
      create: {
        slug: "classic",
        name: "Classic Frames",
        description: "Timeless traditional frames that never go out of style.",
        featured: true,
        order: 2,
      },
    }),
    prisma.collection.upsert({
      where: { slug: "gallery-sets" },
      update: {},
      create: {
        slug: "gallery-sets",
        name: "Gallery Sets",
        description: "Curated frame collections for stunning gallery walls.",
        featured: true,
        order: 3,
      },
    }),
    prisma.collection.upsert({
      where: { slug: "shadow-boxes" },
      update: {},
      create: {
        slug: "shadow-boxes",
        name: "Shadow Boxes",
        description: "Deep frames perfect for 3D displays and memorabilia.",
        featured: false,
        order: 4,
      },
    }),
    prisma.collection.upsert({
      where: { slug: "floating" },
      update: {},
      create: {
        slug: "floating",
        name: "Floating Frames",
        description: "Modern floating edge designs for a contemporary look.",
        featured: false,
        order: 5,
      },
    }),
  ]);
  console.log(`✓ ${collections.length} collections created`);

  // Create products
  const products = await Promise.all([
    // Modern collection
    prisma.product.upsert({
      where: { slug: "modern-black-8x10" },
      update: {},
      create: {
        slug: "modern-black-8x10",
        name: "Modern Black Frame",
        description: "A sleek, contemporary frame with clean lines. Perfect for modern spaces.",
        price: 2499,
        images: [],
        sizes: ["5×7", "8×10", "11×14", "16×20"],
        materials: "Solid wood with matte black finish, glass front",
        inStock: true,
        inventory: 50,
        featured: true,
        collectionId: collections[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "modern-white-8x10" },
      update: {},
      create: {
        slug: "modern-white-8x10",
        name: "Modern White Frame",
        description: "Clean white frame perfect for bright, airy spaces.",
        price: 2499,
        images: [],
        sizes: ["5×7", "8×10", "11×14", "16×20"],
        materials: "Solid wood with matte white finish, glass front",
        inStock: true,
        inventory: 45,
        featured: true,
        collectionId: collections[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "slim-metal-black" },
      update: {},
      create: {
        slug: "slim-metal-black",
        name: "Slim Metal Frame",
        description: "Ultra-thin metal profile for a minimalist look.",
        price: 1999,
        images: [],
        sizes: ["5×7", "8×10", "11×14"],
        materials: "Aluminum with anodized finish, glass front",
        inStock: true,
        inventory: 60,
        featured: false,
        collectionId: collections[0].id,
      },
    }),
    // Classic collection
    prisma.product.upsert({
      where: { slug: "classic-walnut-11x14" },
      update: {},
      create: {
        slug: "classic-walnut-11x14",
        name: "Classic Walnut Frame",
        description: "Rich walnut finish with traditional profile. Perfect for diplomas and certificates.",
        price: 3499,
        images: [],
        sizes: ["8×10", "11×14", "16×20"],
        materials: "Solid walnut wood, UV-protective glass, acid-free backing",
        inStock: true,
        inventory: 35,
        featured: true,
        collectionId: collections[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: "gold-ornate-8x10" },
      update: {},
      create: {
        slug: "gold-ornate-8x10",
        name: "Gold Ornate Frame",
        description: "Elegant gold frame with decorative details.",
        price: 3999,
        images: [],
        sizes: ["5×7", "8×10", "11×14"],
        materials: "Composite wood with gold leaf finish",
        inStock: true,
        inventory: 25,
        featured: false,
        collectionId: collections[1].id,
      },
    }),
    // Shadow boxes
    prisma.product.upsert({
      where: { slug: "shadow-box-8x8" },
      update: {},
      create: {
        slug: "shadow-box-8x8",
        name: "Shadow Box Frame",
        description: "Deep frame for displaying 3D items, memorabilia, and keepsakes.",
        price: 4299,
        images: [],
        sizes: ["8×8", "12×12", "16×16"],
        materials: "Solid wood construction, 2\" depth, glass front",
        inStock: true,
        inventory: 20,
        featured: true,
        collectionId: collections[3].id,
      },
    }),
    // Floating frames
    prisma.product.upsert({
      where: { slug: "floating-12x12" },
      update: {},
      create: {
        slug: "floating-12x12",
        name: "Floating Frame",
        description: "Modern floating design that showcases your art with a contemporary edge.",
        price: 3799,
        images: [],
        sizes: ["8×8", "12×12", "16×16", "20×20"],
        materials: "Wood frame with acrylic panels",
        inStock: true,
        inventory: 30,
        featured: false,
        collectionId: collections[4].id,
      },
    }),
    // Gallery set
    prisma.product.upsert({
      where: { slug: "gallery-set-5pc" },
      update: {},
      create: {
        slug: "gallery-set-5pc",
        name: "Gallery Wall Set - 5 Pieces",
        description: "Curated set of 5 coordinating frames for a stunning gallery wall.",
        price: 8999,
        images: [],
        sizes: ["Set of 5 (various sizes)"],
        materials: "Solid wood frames, glass fronts, hanging hardware included",
        inStock: true,
        inventory: 15,
        featured: true,
        collectionId: collections[2].id,
      },
    }),
  ]);
  console.log(`✓ ${products.length} products created`);

  // Create gallery items
  const galleryItems = await Promise.all([
    prisma.galleryItem.create({
      data: {
        title: "Lakers Championship Jersey",
        description: "Custom shadow box framing for a signed Lakers jersey",
        category: "jerseys",
        images: [],
        featured: true,
        order: 1,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: "Law School Diploma",
        description: "Classic walnut frame with double matting",
        category: "diplomas",
        images: [],
        featured: true,
        order: 2,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: "Original Oil Painting",
        description: "Ornate gold frame for a vintage oil painting",
        category: "fine-art",
        images: [],
        featured: true,
        order: 3,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: "Vintage Movie Poster",
        description: "Modern black frame with UV-protective glass",
        category: "posters",
        images: [],
        featured: false,
        order: 4,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: "Military Medal Display",
        description: "Custom shadow box for service medals and ribbons",
        category: "shadowboxes",
        images: [],
        featured: true,
        order: 5,
      },
    }),
    prisma.galleryItem.create({
      data: {
        title: "Office Installation",
        description: "20 matching frames installed in a corporate lobby",
        category: "installations",
        images: [],
        featured: true,
        order: 6,
      },
    }),
  ]);
  console.log(`✓ ${galleryItems.length} gallery items created`);

  // Create sample reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        name: "Sarah M.",
        rating: 5,
        text: "Absolutely fantastic work! They framed my daughter's diploma beautifully and the price was very reasonable. Will definitely be back.",
        source: "google",
        featured: true,
      },
    }),
    prisma.review.create({
      data: {
        name: "Michael T.",
        rating: 5,
        text: "Had several jerseys framed here. The quality is top-notch and they really took the time to help me pick the perfect frames. Highly recommend!",
        source: "google",
        featured: true,
      },
    }),
    prisma.review.create({
      data: {
        name: "Jennifer L.",
        rating: 5,
        text: "Great experience from start to finish. The staff was knowledgeable and helped me stay within my budget. My art looks amazing!",
        source: "google",
        featured: true,
      },
    }),
    prisma.review.create({
      data: {
        name: "David K.",
        rating: 5,
        text: "They installed 12 frames in our office and it looks incredible. Professional, on-time, and fairly priced. Will use again for sure.",
        source: "google",
        featured: true,
      },
    }),
  ]);
  console.log(`✓ ${reviews.length} reviews created`);

  console.log("\n✨ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
