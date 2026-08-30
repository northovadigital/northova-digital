import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  try {
    const { key } = await params;
    const objectKey = key.join("/");

    if (!objectKey.startsWith("products/") || objectKey.includes("..")) {
      return new NextResponse("Not found", { status: 404 });
    }

    const { env } = await getCloudflareContext();
<<<<<<< HEAD
    const object = await env.cakeybakey_products.get(objectKey);
=======
    const object = await env.fk_boutique_products.get(objectKey);
>>>>>>> 5455781af8973d5af7f3babcd118fd551cdde8e2

    if (!object) {
      return new NextResponse("Not found", { status: 404 });
    }

    const headers = new Headers();

    const contentType = object.httpMetadata?.contentType;

    if (contentType) {
      headers.set("content-type", contentType);
    }

    const contentLanguage = object.httpMetadata?.contentLanguage;

    if (contentLanguage) {
      headers.set("content-language", contentLanguage);
    }

    const contentDisposition = object.httpMetadata?.contentDisposition;

    if (contentDisposition) {
      headers.set("content-disposition", contentDisposition);
    }

    const contentEncoding = object.httpMetadata?.contentEncoding;

    if (contentEncoding) {
      headers.set("content-encoding", contentEncoding);
    }

    const contentLength = object.size;

    if (typeof contentLength === "number") {
      headers.set("content-length", String(contentLength));
    }

    headers.set("etag", object.httpEtag);
    headers.set(
      "cache-control",
      "public, max-age=31536000, immutable",
    );

    return new NextResponse(object.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Product image delivery failed:", error);
    return new NextResponse("Unable to load image.", { status: 500 });
  }
}
