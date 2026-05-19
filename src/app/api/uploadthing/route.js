import { createUploadthing, createRouteHandler } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),
};

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});