import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");
  const fileName = searchParams.get("name") || "document.pdf";

  if (!fileUrl) {
    return new NextResponse("Missing file URL", { status: 400 });
  }

  try {
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const headers = new Headers();
    
    // Ensure filename ends with .pdf if it's a PDF
    let safeFileName = fileName;
    if (!safeFileName.toLowerCase().endsWith(".pdf")) {
      safeFileName += ".pdf";
    }

    headers.set("Content-Type", response.headers.get("Content-Type") || "application/pdf");
    
    // Modern way to handle UTF-8 filenames in Content-Disposition
    const encodedName = encodeURIComponent(safeFileName);
    headers.set("Content-Disposition", `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`);

    return new NextResponse(blob, { headers });
  } catch (error: any) {
    console.error("[DOWNLOAD_API_ERROR]", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
