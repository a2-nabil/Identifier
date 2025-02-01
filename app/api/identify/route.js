import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with the key
const genAI = new GoogleGenerativeAI("AIzaSyCuvmXvjJny7xhRcG4Br2_sItGGG9PRGyE");

// Helper function to format response
function formatResponse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    // Extract information if JSON parsing fails
    const name = text.split("\n")[0] || "Unknown Object";
    const description = text.split("\n")[1] || text.substring(0, 200);
    const attributes = text
      .split("\n")
      .slice(2)
      .map((attr) => attr.trim())
      .filter(Boolean);

    return {
      name,
      description,
      attributes,
    };
  }
}

export async function POST(request) {
  try {
    if (!"AIzaSyCuvmXvjJny7xhRcG4Br2_sItGGG9PRGyE") {
      throw new Error("API key not configured");
    }

    const formData = await request.formData();
    const image = formData.get("image");

    if (!image) {
      throw new Error("No image provided");
    }

    // Get the image data as array buffer
    const imageData = await image.arrayBuffer();

    // Initialize the model (using the correct model name)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Analyze this image and provide:
 Name of the main object/subject,
 Brief description at least (1-2 sentences),
 Three key characteristics or attributes, 
 dont need point give the text`;

    // Generate content using the new format
    const result = await model.generateContent([
      {
        inlineData: {
          data: Buffer.from(imageData).toString("base64"),
          mimeType: image.type,
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const text = response.text();

    // Format and return the response
    const formattedResponse = formatResponse(text);
    return Response.json(formattedResponse);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error: "Failed to process image: " + error.message,
        details:
          process.env.NODE_ENV === "development" ? error.toString() : undefined,
      },
      { status: 500 }
    );
  }
}
