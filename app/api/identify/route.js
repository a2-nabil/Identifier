import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the API with the key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Helper function to format response
function formatResponse(text) {
  try {
    console.log(text);
    return JSON.parse(text);
  } catch {
    // Extract information if JSON parsing fails
    const name = text.split("\n")[0] || "Unknown Object";
    const description = text.split("\n\n").slice(0, 2).join("\n") || "No description provided";
    
    // Clean up and ensure attributes is always an array
    const rawAttributes = text
      .split("\n\n")
      .slice(2)
      .map((attr) => attr.trim())
      .filter(Boolean);

    // Remove any lines that start with a bullet point or unnecessary characters
    const attributes = rawAttributes
      .map(attr => attr)
      .filter(Boolean);

    return {
      name,
      description,
      attributes: Array.isArray(attributes) ? attributes : [attributes], // Ensure attributes is an array
    };
  }
}



export async function POST(request) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
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

    const prompt = `Please analyze the image and provide the following: 
Identify the subject of the image (e.g., if it's a person, provide their name; if it's an object, provide its name).
Provide a brief but detailed description of what the image depicts. Include important visual details such as colors, shapes, context, or surroundings.
in attributes only provide List notable attributes related to the image. This could include physical characteristics (for a person: height, hair color, clothing; for an object: size, material, usage) or other relevant traits depending on the context of the image. 
    (remember do not add or mention  Name, Description, Attributes on the response)`;

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

    // Extract response text
    const response = await result.response;
    const text = response.text();

    // Log the response to check its structure
    console.log("a2n Response:", text);
    console.log("API Response:", result);

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
