import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const adminUploadRouter = {
  shopImageUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 8,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "admin" };
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.ufsUrl,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type AdminUploadRouter = typeof adminUploadRouter;
