import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const { projectName, category, description, targetUsers, selectedTech } = body;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert Software Architect. Analyze the following project requirements and generate a comprehensive software blueprint:
      - Project Name: ${projectName}
      - Category: ${category}
      - Description: ${description}
      - Target Users: ${targetUsers}
      - Technology Stack: ${selectedTech.length > 0 ? selectedTech.join(", ") : "Suggest the best modern tech stack"}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING, description: "A high-level architectural overview of the system." },
            modules: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 4 core features or operational modules to build."
            },
            fileStructure: {
              type: Type.STRING,
              description: "A text-based clean directory tree structure (like VS Code file tree)."
            },
            schemaDesign: {
              type: Type.STRING,
              description: "Database schema design or table structures in simple DBML or text format."
            }
          },
          required: ["overview", "modules", "fileStructure", "schemaDesign"],
        },
      },
    });

    const blueprintData = JSON.parse(response.text);

    return new Response(JSON.stringify({ success: true, blueprint: blueprintData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini AI Error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}