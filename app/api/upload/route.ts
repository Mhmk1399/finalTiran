import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface BlogData {
  title: string;
  excerpt: string;
  seoTitle: string;
  contentHtml: string;
  images: string[];
  coverImage?: string;
  tags: string[];
}

interface ResponseData {
  success: boolean;
  message?: string;
  error?: string;
  status?: number;
  blogId?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ResponseData>> {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication token required" },
        { status: 401 }
      );
    }

    // Parse the incoming JSON data
    const blogData: BlogData = await request.json();

    // Validate required fields
    if (
      !blogData.title ||
      !blogData.excerpt ||
      !blogData.seoTitle ||
      !blogData.contentHtml
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const accessKey = process.env.ARVAN_ACCESS_KEY;
    const secretKey = process.env.ARVAN_SECRET_KEY;
    const bucketName = process.env.ARVAN_BUCKET_NAME || "mamad";

    if (!accessKey || !secretKey) {
      return NextResponse.json(
        { success: false, error: "Missing ArvanCloud credentials" },
        { status: 500 }
      );
    }

    // Generate a unique object name for the blog JSON
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(8).toString("hex");
    const objectName = `blogs/${timestamp}-${randomString}.json`;

    const dateValue = new Date().toUTCString();
    const contentType = "application/json";
    const resource = `/${bucketName}/${objectName}`;

    // Create the string to sign for AWS-compatible S3 authentication
    const stringToSign = `PUT\n\n${contentType}\n${dateValue}\nx-amz-acl:public-read\n${resource}`;
    const signature = crypto
      .createHmac("sha1", secretKey)
      .update(stringToSign)
      .digest("base64");

    const uploadUrl = `https://${bucketName}.s3.ir-thr-at1.arvanstorage.ir/${objectName}`;

    // Convert blogData to JSON string
    const blogJson = JSON.stringify(blogData);
    const fileContent = Buffer.from(blogJson);

    // Upload the JSON to ArvanCloud S3
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Host: `${bucketName}.s3.ir-thr-at1.arvanstorage.ir`,
        Date: dateValue,
        "Content-Type": contentType,
        "Content-Length": fileContent.length.toString(),
        "x-amz-acl": "public-read",
        Authorization: `AWS ${accessKey}:${signature}`,
      },
      body: fileContent,
    });

    if (response.ok) {
      const jsonUrl = `https://${bucketName}.s3.ir-thr-at1.arvanstorage.ir/${objectName}`;
      return NextResponse.json({
        success: true,
        message: "Blog JSON uploaded successfully",
        blogId: `${timestamp}-${randomString}`,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to upload blog JSON to ArvanCloud",
          status: response.status,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Blog upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const accessKey = process.env.ARVAN_ACCESS_KEY;
    const secretKey = process.env.ARVAN_SECRET_KEY;
    const bucketName = process.env.ARVAN_BUCKET_NAME || "mamad";

    if (!accessKey || !secretKey) {
      return NextResponse.json(
        { success: false, error: "Missing ArvanCloud credentials" },
        { status: 500 }
      );
    }

    // For simplicity, we'll assume you have a way to list blog JSONs or fetch a specific one
    // ArvanCloud S3 doesn't directly support listing objects via fetch, so you might need to maintain a list of blog IDs elsewhere
    // Here, we'll return a placeholder response
    return NextResponse.json({
      success: true,
      message:
        "Blog fetching not fully implemented. Use specific blog ID or maintain a database.",
    });
  } catch (error) {
    console.error("Blog fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
