"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import prisma from "@/lib/db";

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value.length ? value : null;
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function centsValue(formData: FormData, key: string) {
  const raw = stringValue(formData, key).replace(/[$,]/g, "");
  const dollars = Number.parseFloat(raw || "0");
  if (!Number.isFinite(dollars) || dollars < 0) return 0;
  return Math.round(dollars * 100);
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const parsed = Number.parseInt(stringValue(formData, key), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function listValue(formData: FormData, key: string) {
  return stringValue(formData, key)
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function productImageFiles(formData: FormData) {
  return formData
    .getAll("imageFiles")
    .filter((value): value is File => value instanceof File && value.size > 0 && value.type.startsWith("image/"));
}

async function uploadImages(files: File[]) {
  if (!files.length) return [];

  const utapi = new UTApi();
  const uploads = await utapi.uploadFiles(files, { concurrency: 3 });

  return uploads.map((upload) => {
    if (upload.error) {
      throw new Error(upload.error.message || "Image upload failed");
    }

    return upload.data.ufsUrl;
  });
}

async function productImageUrls(formData: FormData) {
  const existingUrls = listValue(formData, "images");
  const uploadedUrls = await uploadImages(productImageFiles(formData));

  return [...existingUrls, ...uploadedUrls];
}

async function collectionImageUrl(formData: FormData) {
  const existingUrl = optionalString(formData, "image");
  const file = formData.get("collectionImageFile");

  if (!(file instanceof File) || file.size === 0 || !file.type.startsWith("image/")) {
    return existingUrl;
  }

  const [uploadedUrl] = await uploadImages([file]);
  return uploadedUrl ?? existingUrl;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function refreshShop() {
  revalidatePath("/admin");
  revalidatePath("/admin/shop");
  revalidatePath("/shop");
  revalidatePath("/shop/[collection]", "page");
  revalidatePath("/shop/product/[slug]", "page");
}

export async function createCollection(formData: FormData) {
  const name = stringValue(formData, "name");
  if (!name) return;

  const slug = stringValue(formData, "slug") || slugify(name);
  const image = await collectionImageUrl(formData);

  await prisma.collection.create({
    data: {
      name,
      slug,
      description: optionalString(formData, "description"),
      image,
      order: intValue(formData, "order"),
      featured: boolValue(formData, "featured"),
    },
  });

  refreshShop();
  redirect("/admin/shop");
}

export async function updateCollection(id: string, formData: FormData) {
  const name = stringValue(formData, "name");
  if (!name) return;

  const image = await collectionImageUrl(formData);

  await prisma.collection.update({
    where: { id },
    data: {
      name,
      slug: stringValue(formData, "slug") || slugify(name),
      description: optionalString(formData, "description"),
      image,
      order: intValue(formData, "order"),
      featured: boolValue(formData, "featured"),
    },
  });

  refreshShop();
  redirect("/admin/shop");
}

export async function deleteCollection(id: string) {
  await prisma.collection.delete({ where: { id } });
  refreshShop();
  redirect("/admin/shop");
}

export async function createProduct(formData: FormData) {
  const name = stringValue(formData, "name");
  if (!name) return;

  const slug = stringValue(formData, "slug") || slugify(name);
  const collectionId = stringValue(formData, "collectionId");
  const images = await productImageUrls(formData);

  await prisma.product.create({
    data: {
      name,
      slug,
      description: optionalString(formData, "description"),
      price: centsValue(formData, "price"),
      comparePrice: stringValue(formData, "comparePrice") ? centsValue(formData, "comparePrice") : null,
      images,
      sizes: listValue(formData, "sizes"),
      materials: optionalString(formData, "materials"),
      inStock: boolValue(formData, "inStock"),
      inventory: intValue(formData, "inventory"),
      featured: boolValue(formData, "featured"),
      collectionId: collectionId || null,
    },
  });

  refreshShop();
  redirect("/admin/shop");
}

export async function updateProduct(id: string, formData: FormData) {
  const name = stringValue(formData, "name");
  if (!name) return;

  const collectionId = stringValue(formData, "collectionId");
  const images = await productImageUrls(formData);

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug: stringValue(formData, "slug") || slugify(name),
      description: optionalString(formData, "description"),
      price: centsValue(formData, "price"),
      comparePrice: stringValue(formData, "comparePrice") ? centsValue(formData, "comparePrice") : null,
      images,
      sizes: listValue(formData, "sizes"),
      materials: optionalString(formData, "materials"),
      inStock: boolValue(formData, "inStock"),
      inventory: intValue(formData, "inventory"),
      featured: boolValue(formData, "featured"),
      collectionId: collectionId || null,
    },
  });

  refreshShop();
  redirect("/admin/shop");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  refreshShop();
  redirect("/admin/shop");
}
