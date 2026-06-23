import express from "express";
import OpenAI from "openai";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

dotenv.config();

if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_API_KEY.startsWith("sk-") || process.env.OPENAI_API_KEY.includes("**")) {
  process.env.OPENAI_API_KEY = "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";
}

if (!process.env.HPCAI_API_KEY || !process.env.HPCAI_API_KEY.startsWith("sk-") || process.env.HPCAI_API_KEY.includes("**")) {
  process.env.HPCAI_API_KEY = "sk-d7033d819908554240b59f60c903317a81808b202610fdfeb5acd6f6405edb5ce76a0b71";
}

if (!process.env.NVIDIA_API_KEY || !process.env.NVIDIA_API_KEY.startsWith("nvapi-") || process.env.NVIDIA_API_KEY.includes("**")) {
  process.env.NVIDIA_API_KEY = "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";
}

if (!process.env.SERPER_API_KEY || process.env.SERPER_API_KEY.includes("**")) {
  process.env.SERPER_API_KEY = "key_GLkTCPSUPusGIwpG";
}

if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes("**")) {
  process.env.OPENROUTER_API_KEY = "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";
}

if (!process.env.SERPAPI_API_KEY || process.env.SERPAPI_API_KEY.includes("**")) {
  process.env.SERPAPI_API_KEY = "mock_serpapi_key_for_testing";
}

// Helper to dynamically detect user's input language and adjust system prompts
function detectLanguage(text: string): { code: string; name: string; nativeInstruction: string } {
  if (!text) {
    return { code: "en", name: "English", nativeInstruction: "Proceed in English." };
  }

  const cleaned = text.toLowerCase().trim();

  // 1. Devanagari Script (Hindi, Marathi, etc.)
  if (/[\u0900-\u097F]/.test(text)) {
    return { 
      code: "hi-dev", 
      name: "Hindi (Devanagari)", 
      nativeInstruction: "आपको यूज़र से हिंदी (देवनागरी लिपि) में बात करनी है। अपनी पहचान और काम को पूरी तरह हिंदी में समझाएं।" 
    };
  }

  // 2. Chinese Script
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return { 
      code: "zh", 
      name: "Chinese", 
      nativeInstruction: "请完全使用中文进行回复。请用自然流畅的中文传达您的身份（由 Next Gen Engineering 创建）。" 
    };
  }

  // 3. Japanese Script (Hiragana, Katakana, Kanji)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return { 
      code: "ja", 
      name: "Japanese", 
      nativeInstruction: "完全に日本語で返答してください。自己紹介や制作者（Next Gen Engineering）に関する説明も自然な日本語で行ってください。" 
    };
  }

  // 4. Arabic / Persian / Urdu Script
  if (/[\u0600-\u06FF]/.test(text)) {
    return { 
      code: "ar", 
      name: "Arabic/Urdu Script", 
      nativeInstruction: "يرجى الرد باللغة العربية أو اللغة المستخدمة بشكل طبيعي ومحترف." 
    };
  }

  // 5. Cyrillic Script (Russian, Ukrainian, etc.)
  if (/[\u0400-\u04FF]/.test(text)) {
    return { 
      code: "ru", 
      name: "Russian/Cyrillic", 
      nativeInstruction: "Пожалуйста, отвечайте на русском языке. Держите марку и стиль NextGenAi." 
    };
  }

  // 6. Romanized Hindi / Urdu (Hinglish)
  const romanHindiWords = [
    "tum", "kaise", "apne", "batao", "kisne", "banaya", "hai", "kya", "mera", "naam", 
    "tha", "mein", "ko", "se", "ek", "ladka", "kar", "rahe", "ho", "karo", "mujhse", 
    "baat", "bata", "kuch", "shiksha", "bhool", "gaye", "engineering", "abhishek", "chauhan", "jila", "janam"
  ];
  let romanHindiMatches = 0;
  const words = cleaned.split(/\s+/);
  words.forEach(w => {
    if (romanHindiWords.includes(w)) {
      romanHindiMatches++;
    }
  });
  if (romanHindiMatches >= 2 || (words.length > 0 && romanHindiMatches / words.length >= 0.25)) {
    return { 
      code: "hinglish", 
      name: "Romanized Hindi/Urdu (Hinglish)", 
      nativeInstruction: "User Roman Hindi ya Roman Urdu me baat kar raha hai. Aapko bhi bilkul natural aur pyari Roman Hindi/Urdu (Hinglish) me jawab dena hai. Creator aur capabilities ki baatein Hinglish me hi batayein." 
    };
  }

  // 7. Spanish
  const spanishWords = ["hola", "como", "esta", "que", "hacer", "creado", "quien", "por", "gracias", "adios", "si", "no", "amigo", "bien", "esta", "para"];
  const spanishMatches = words.filter(w => spanishWords.includes(w)).length;
  if (spanishMatches >= 2 || (words.length > 0 && spanishMatches / words.length >= 0.25)) {
    return { 
      code: "es", 
      name: "Spanish", 
      nativeInstruction: "Por favor, responde completamente en español de manera profesional y natural." 
    };
  }

  // 8. French
  const frenchWords = ["bonjour", "comment", "fait", "qui", "pour", "merci", "oui", "non", "es", "tu", "il", "elle", "salut", "avec", "dans", "est"];
  const frenchMatches = words.filter(w => frenchWords.includes(w)).length;
  if (frenchMatches >= 2 || (words.length > 0 && frenchMatches / words.length >= 0.25)) {
    return { 
      code: "fr", 
      name: "French", 
      nativeInstruction: "S'il vous plaît, répondez entièrement en français avec élégance." 
    };
  }

  // 9. German
  const germanWords = ["hallo", "wie", "ist", "wer", "gemacht", "danke", "ja", "nein", "und", "bist", "du", "mit", "nicht", "ein", "eine"];
  const germanMatches = words.filter(w => germanWords.includes(w)).length;
  if (germanMatches >= 2 || (words.length > 0 && germanMatches / words.length >= 0.25)) {
    return { 
      code: "de", 
      name: "German", 
      nativeInstruction: "Bitte antworten Sie komplett auf Deutsch in einem höflichen und professionellen Ton." 
    };
  }

  // Default to English
  return { 
    code: "en", 
    name: "English", 
    nativeInstruction: "Proceed in English. Match any subtler English nuance or style with pristine quality." 
  };
}

// Custom system instructions compiler for user selected AI specialized platforms
function getSpecializedAppPrompt(specializedApp: string | undefined): string {
  if (!specializedApp) return "";
  switch (specializedApp) {
    case "chatbot":
      return `\n\n[Active Platform: AI Chatbot Platform Mode]
Your primary direction is to act as an supreme chatbot architect and prompt engineering specialist. Help the user design conversational intents, conversation state trees, pizza-ordering slot workflows, context variables, and response mapping. Format flow diagrams, sample JSON payloads, and user instructions with clean, elegant markdown.`;
    case "writer":
      return `\n\n[Active Platform: AI Content Writer Mode]
Your primary direction is to act as an elite senior copywriter, editor, and blog content craftsman. Help drafting high-converting newsletter templates, catchy social media hooks, persuasive hooks for digital copy, and fully optimized SEO blog outlines. Deliver elegant structure, catchy prose, and rich visual pacing.`;
    case "resume":
      return `\n\n[Active Platform: AI Resume Builder Mode]
Your primary direction is to act as an HR director and senior executive placement advisor. Help optimizing resume builder lines, tailoring professional bio outlines, and composing outstanding cover letters using action-oriented leadership verbs (e.g., spearheaded, championed, overhauled, automated). Deliver guidance structured as layout lists or markdown visual tables.`;
    case "website":
      return `\n\n[Active Platform: AI Website Builder Mode]
Your primary direction is to act as a front-end lead developer and UX/UI engineer. Help the user construct responsive website layout blueprints, landing page component files, glowing gradient cards, call-to-action buttons, or full HTML5/modern React grids using clean, standard Tailwind CSS classes. Make code snippets highly reusable and beautifully formatted.`;
    case "pdf":
      return `\n\n[Active Platform: AI PDF Tools Mode]
Your primary direction is to act as a high-density documentation reasoning and summarizing engine. Help dissecting dense financial audits, listing executive outline points, and drafting automation scripts (e.g. Python, Node) to read, verify, structure, and convert PDF tables or unstructured paragraphs to clean JSON data models.`;
    case "script":
      return `\n\n[Active Platform: AI Script Writer Mode]
Your primary direction is to act as a creative screenwriter, director, and interactive dialogue specialist. Help drafting engaging narration scripts for YouTube or TikTok clips, podcast outlines, movie scenes, and commercial ad briefs. Prioritize attention-grabbing hooks, show visual queue directions in square brackets, and emphasize narrator pacing and dramatic vocal tone.`;
    case "support":
      return `\n\n[Active Platform: AI Customer Support Bot Mode]
Your primary direction is to act as a patient, empathetic, and premium helpdesk solutions advisor. Always greet the user with standard friendly customer service phrases, acknowledge grievances or issues before answering, offer step-by-step troubleshooting, construct calm canned responses, or write mock technician escalation tickets for advanced issues.`;
    default:
      return "";
  }
}

const app = express();
const PORT = 3000;

  // Configure reverse proxy trust for correct client IP detection in rate limiting
  app.set("trust proxy", 1);

  // Apply Helmet with customized configurations safe for Google AI Studio frame & Vite development
  app.use(
    helmet({
      contentSecurityPolicy: false, 
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      frameguard: false, 
    })
  );

  // Disable 'X-Powered-By' header to conceal backend technologies
  app.disable("x-powered-by");

  // Define general API access throttle limits for configuration queries
  const generalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 300, 
    standardHeaders: true, 
    legacyHeaders: false, 
    message: {
      error: "Too many configuration checks from this client. Please slow down.",
    },
  });

  // Strict request limits on active LLM generation pipelines to block abusive query loops
  const generationApiLimiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 35, 
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Rate limit reached. Please wait a moment before sending more prompts.",
    },
  });

  // Mount API rate limiters on specialized endpoints
  app.use("/api/config-status", generalApiLimiter);
  app.use("/api/generate/", generationApiLimiter);
  app.use("/api/news", generationApiLimiter);

  // Parse JSON payloads with threshold for attachments
  app.use(express.json({ limit: "50mb" }));

  // Sanitize payloads to protect against extremely large memory dumps & NoSQL/prototype pollution attacks
  app.use((req, res, next) => {
    // Exempt PDF.co routes from the 100KB file limitation since base64 payloads easily cross 100KB limits.
    if (req.path && req.path.startsWith("/api/pdfco")) {
      return next();
    }
    if (req.body && typeof req.body === "object") {
      // Prevent massive fields that could cause buffer overflows or memory exhaustion
      for (const key in req.body) {
        if (typeof req.body[key] === "string" && req.body[key].length > 100000) {
          return res.status(400).json({
            error: "Security Policy Violation: Single query fields must not exceed 100KB.",
          });
        }
      }
      // Block prototype or constructor overrides
      const payloadKeys = Object.keys(req.body);
      if (payloadKeys.includes("__proto__") || payloadKeys.includes("constructor")) {
        return res.status(400).json({ error: "Malicious payload signature detected. Request blocked." });
      }
    }
    next();
  });

  // ==========================================
  // API ROUTE: SECURE CONFIG STATUS DETECTION
  // ==========================================
  app.get("/api/config-status", (req, res) => {
    res.json({
      gemini_api_key: !!process.env.GEMINI_API_KEY,
      openai_api_key: !!process.env.OPENAI_API_KEY,
      hpcai_api_key: !!process.env.HPCAI_API_KEY,
      nvidia_api_key: !!process.env.NVIDIA_API_KEY,
      stability_api_key: !!process.env.STABILITY_API_KEY,
      huggingface_api_key: !!process.env.HUGGINGFACE_API_KEY,
      gnews_api_key: !!process.env.GNEWS_API_KEY,
      serper_api_key: !!process.env.SERPER_API_KEY,
      openrouter_api_key: !!process.env.OPENROUTER_API_KEY,
    });
  });

  // ==========================================
  // PDF.CO INTEGRATION SUITE
  // ==========================================
  const DEFAULT_PDFCO_KEY = "nesajor851@lidugw.com_jwwQsNXOMkNwgXk9IZMCItGi6ggTn5mxL5VdbQ5J3lxpHqSRR7kXZYaX0Rp3UOGQ";
  
  const getPdfCoKey = (customKeyInput?: string) => {
    return customKeyInput || process.env.PDFCO_API_KEY || DEFAULT_PDFCO_KEY;
  };

  async function uploadToPdfCo(base64Data: string, fileName: string, mimeType: string, apiKey: string): Promise<string> {
    const cleanMime = mimeType || "application/octet-stream";
    const cleanName = fileName || "uploaded_document.pdf";
    
    // 1. Get presigned URL
    const presignedUrl = `https://api.pdf.co/v1/file/upload/get-presigned-url?name=${encodeURIComponent(cleanName)}&encrypt=true`;
    const presignedRes = await fetch(presignedUrl, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      }
    });
    
    if (!presignedRes.ok) {
      const errorText = await presignedRes.text();
      throw new Error(`Failed to request pre-assigned upload URL from PDF.co: ${errorText}`);
    }
    
    const presignedData: any = await presignedRes.json();
    if (presignedData.error) {
      throw new Error(`PDF.co Presigned URL Error: ${presignedData.message || "Unknown error"}`);
    }
    
    // PDF.co returns 'presignedUrl' for the S3 upload destination, and 'url' for the uploaded file access.
    const putUrl = presignedData.presignedUrl || presignedData.url;
    const uploadedUrl = presignedData.url || presignedData.uploadedUrl;
    
    if (!putUrl || !uploadedUrl) {
      throw new Error(`Invalid presigned upload parameters returned from PDF.co. Keys in response: ${Object.keys(presignedData).join(", ")}`);
    }
    
    // 2. Transmit file binary payload
    const fileBuffer = Buffer.from(base64Data, "base64");
    const uploadRes = await fetch(putUrl, {
      method: "PUT",
      headers: {
        "Content-Type": cleanMime,
        "Content-Length": String(fileBuffer.length)
      },
      body: fileBuffer
    });
    
    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Failed to transfer file data to S3 storage via PDF.co: ${errorText}`);
    }
    
    console.log(`[PdfCoHelper] Successfully uploaded file "${cleanName}" to PDF.co. URL: ${uploadedUrl}`);
    return uploadedUrl;
  }

  // PDF.co Endpoint: Extract Text from PDF
  app.post("/api/pdfco/extract-text", async (req, res) => {
    try {
      const { base64, fileName, mimeType, customKey } = req.body;
      if (!base64) {
        return res.status(400).json({ error: "File base64 string is required." });
      }
      
      const apiKey = getPdfCoKey(customKey);
      
      console.log(`[Pdfco] Presigning and uploading incoming PDF file: ${fileName}...`);
      const uploadedUrl = await uploadToPdfCo(base64, fileName || "doc.pdf", mimeType || "application/pdf", apiKey);
      
      console.log(`[Pdfco] Converting PDF to text from source URL: ${uploadedUrl}...`);
      const convertRes = await fetch("https://api.pdf.co/v1/pdf/convert/to/text", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: uploadedUrl,
          inline: true
        })
      });
      
      if (!convertRes.ok) {
        const errorText = await convertRes.text();
        return res.status(convertRes.status).json({ error: `PDF.co server error: ${errorText}` });
      }
      
      const convertData: any = await convertRes.json();
      if (convertData.error) {
        return res.status(400).json({ error: convertData.message || "Failed to parse PDF." });
      }
      
      let extractedText = convertData.body || "";
      
      if (!extractedText && convertData.url) {
        console.log(`[Pdfco] Fetching extracted text payload from public URL: ${convertData.url}`);
        const textRes = await fetch(convertData.url);
        if (textRes.ok) {
          extractedText = await textRes.text();
        }
      }
      
      return res.json({
        text: extractedText,
        url: convertData.url,
        fileName: fileName || "extracted_text.txt"
      });
    } catch (err: any) {
      console.error("[Pdfco Error] Extract Text failed:", err);
      return res.status(500).json({ error: err.message || "Internal server error during PDF.co processing." });
    }
  });

  // PDF.co Endpoint: Convert HTML template to downloadable PDF
  app.post("/api/pdfco/html-to-pdf", async (req, res) => {
    try {
      const { html, fileName, customKey } = req.body;
      if (!html) {
        return res.status(400).json({ error: "html source content is required." });
      }
      
      const apiKey = getPdfCoKey(customKey);
      console.log(`[Pdfco] Generating PDF from HTML document template...`);
      
      const convertRes = await fetch("https://api.pdf.co/v1/pdf/convert/from/html", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          html: html,
          name: fileName || "converted_document.pdf",
          margins: "20px",
          paperSize: "Letter",
          orientation: "Portrait"
        })
      });
      
      if (!convertRes.ok) {
        const errorText = await convertRes.text();
        return res.status(convertRes.status).json({ error: `PDF.co HTML conversion failed: ${errorText}` });
      }
      
      const convertData: any = await convertRes.json();
      if (convertData.error) {
        return res.status(400).json({ error: convertData.message || "Failed to compile HTML into PDF." });
      }
      
      return res.json({
        pdfUrl: convertData.url,
        name: convertData.name || fileName || "converted_document.pdf"
      });
    } catch (err: any) {
      console.error("[Pdfco Error] HTML to PDF failed:", err);
      return res.status(500).json({ error: err.message || "Internal server error converting HTML template." });
    }
  });

  // PDF.co Endpoint: Analyze layout features, barcodes and PDF metadata
  app.post("/api/pdfco/analyze-pdf", async (req, res) => {
    try {
      const { base64, fileName, mimeType, customKey } = req.body;
      if (!base64) {
        return res.status(400).json({ error: "File base64 string is required." });
      }
      
      const apiKey = getPdfCoKey(customKey);
      
      console.log(`[Pdfco] Uploading file for barcode & info analysis: ${fileName}...`);
      const uploadedUrl = await uploadToPdfCo(base64, fileName || "doc.pdf", mimeType || "application/pdf", apiKey);
      
      // Post to barcode read
      console.log(`[Pdfco] Analyzing file barcodes from source URL: ${uploadedUrl}...`);
      const barcodeRes = await fetch("https://api.pdf.co/v1/barcode/read/from/url", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: uploadedUrl
        })
      });
      
      let barcodeResult: any = null;
      if (barcodeRes.ok) {
        barcodeResult = await barcodeRes.json();
      }
      
      // Fetch pdf metadata details
      console.log(`[Pdfco] Fetching PDF metadata info from URL: ${uploadedUrl}...`);
      const infoRes = await fetch("https://api.pdf.co/v1/pdf/info", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: uploadedUrl
        })
      });
      
      let pdfInfo: any = null;
      if (infoRes.ok) {
        pdfInfo = await infoRes.json();
      }
      
      return res.json({
        uploadedUrl,
        barcodes: barcodeResult && !barcodeResult.error ? barcodeResult.barcodes : [],
        info: pdfInfo && !pdfInfo.error ? pdfInfo.info : null
      });
    } catch (err: any) {
      console.error("[Pdfco Error] Analyze PDF failed:", err);
      return res.status(500).json({ error: err.message || "Internal server error studying PDF file features." });
    }
  });

  // PDF.co Endpoint: Merge multiple files into a single PDF
  app.post("/api/pdfco/merge-pdfs", async (req, res) => {
    try {
      const { files, customKey } = req.body;
      if (!files || !Array.isArray(files) || files.length < 2) {
        return res.status(400).json({ error: "At least 2 files are required for merging." });
      }
      
      const apiKey = getPdfCoKey(customKey);
      console.log(`[Pdfco] Uploading ${files.length} PDF files inside the stream to merge...`);
      
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fileObj = files[i];
        console.log(`[Pdfco] Pre-uploading merge file item #${i+1}: ${fileObj.fileName}...`);
        const itemUrl = await uploadToPdfCo(fileObj.base64, fileObj.fileName || `item_${i}.pdf`, fileObj.mimeType || "application/pdf", apiKey);
        uploadedUrls.push(itemUrl);
      }
      
      console.log(`[Pdfco] Blending documents into a single consolidated file on PDF.co...`);
      const mergeRes = await fetch("https://api.pdf.co/v1/pdf/merge", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url: uploadedUrls.join(","),
          name: "merged_combined_document.pdf"
        })
      });
      
      if (!mergeRes.ok) {
        const errorText = await mergeRes.text();
        return res.status(mergeRes.status).json({ error: `PDF.co consolidation server failed: ${errorText}` });
      }
      
      const mergeData: any = await mergeRes.json();
      if (mergeData.error) {
        return res.status(400).json({ error: mergeData.message || "Failed to merge PDF files." });
      }
      
      return res.json({
        pdfUrl: mergeData.url,
        name: mergeData.name || "merged_combined_document.pdf"
      });
    } catch (err: any) {
      console.error("[Pdfco Error] Merge PDFs failed:", err);
      return res.status(500).json({ error: err.message || "Internal server error blending your PDF files." });
    }
  });

  // ==========================================
  // API ROUTE: ALT-TEXT GENERATION
  // ==========================================
  app.post("/api/alt-text", async (req, res) => {
    try {
      const { description } = req.body;
      if (!description) {
        return res.status(400).json({ error: "description is required" });
      }

      console.log(`[NextGenAi] Generating alt text for: "${description}"...`);

      const openApiKey = process.env.OPENAI_API_KEY;
      if (!openApiKey) {
        return res.status(400).json({ error: "OpenAI API Key not configured on the server." });
      }

      const client = new OpenAI({ apiKey: openApiKey });

      let altText = "";
      try {
        // Attempt using OpenAI responses beta create as requested
        const response: any = await (client as any).responses.create({
          model: "gpt-5-mini",
          input: [
            { role: "user", content: `Write concise alt text for: ${description}` },
          ],
        });
        altText = response.output_text || response.output?.text || "";
      } catch (betaErr: any) {
        console.warn("[NextGenAi] OpenAI Responses API failed or gpt-5-mini is unavailable. Falling back to gpt-4o-mini...", betaErr);
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "user", content: `Write concise alt text for: ${description}` },
          ],
        });
        altText = completion.choices?.[0]?.message?.content || "";
      }

      return res.json({ altText });
    } catch (err: any) {
      console.error("[NextGenAi] Alt Text Error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate alt text" });
    }
  });

  // ==========================================
  // API ROUTE: TEXT GENERATION (WITH SEARCH)
  // ==========================================
  app.post("/api/generate/text", async (req, res) => {
    try {
      const { messages, prompt, webSearch, customKeys, textModel, specializedApp } = req.body;

      // Check if this is a ChatGPT model selection
      const isChatGPT = textModel && typeof textModel === "string" && (
        textModel.toLowerCase().startsWith("gpt-") ||
        textModel.toLowerCase().startsWith("o1-") ||
        textModel.toLowerCase().startsWith("o3-")
      );

      if (isChatGPT) {
        const openApiKey = customKeys?.openai?.trim() || process.env.OPENAI_API_KEY;
        if (!openApiKey) {
          return res.status(400).json({
            error: "ChatGPT / OpenAI API Key not found. Please click the Settings Gear icon to set/provide your OpenAI Developer API Key."
          });
        }

        const detected = detectLanguage(prompt || (messages && messages[messages.length - 1]?.text) || "");
        const systemInstructionText = `You are NextGenAi, a creative, helpful, and highly sophisticated proprietary AI assistant developed from the ground up. Provide beautifully formatted, precise responses with clean markdown.
Identity Instruction: Under no circumstances should you ever reveal or mention that you are an OpenAI ChatGPT model or anything similar. If any user asks you who created, made, or integrated you, respond strictly: "I was created by Next Gen Engineering." Also mention that you operate on a real-time basis, sourcing and verifying information from live web resources, including Wikipedia. 
CRITICAL CREATOR/DEVELOPER DISCLOSURE RULE: Do NOT show or mention the details of your creator (Abhishek Chauhan, born July 6th, 2005 (06/07/2005) in Uttar Pradesh, UP) in normal everyday conversations or unrelated search queries. BUT, if and ONLY IF a user specifically asks about your creator, who made you, your developer, or who Abhishek Chauhan is, you must reveal: "My creator is an ordinary boy named Abhishek Chauhan, who was born on July 6th, 2005 (06/07/2005) in a district of Uttar Pradesh (UP), India." Keep this creator detail completely hidden during regular conversation or when answering other general questions; activate this disclosure ONLY when prompted about your creation, developer, or origin. Never break character.
Dynamic Language Customization: Auto-selected user interaction mode: ${detected.name}. Directive: ${detected.nativeInstruction} Make sure to deliver the response fully localized in this detected language, adapting all capabilities, origin story and creator elements naturally in a local style.
Current Time context: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${getSpecializedAppPrompt(specializedApp)}`;

        let chatHistory = messages && messages.length > 0
          ? messages
              .map((m: any) => ({
                role: m.role === "model" ? "assistant" : "user",
                content: (m.text || "").trim()
              }))
              .filter((m: any) => m.content.length > 0)
          : [];

        if (chatHistory.length === 0) {
          chatHistory.push({ role: "user", content: (prompt || "Hello").trim() });
        }

        const serperKey = customKeys?.search?.trim() || process.env.SERPER_API_KEY;
        const serperCitations: any[] = [];
        if (webSearch && serperKey) {
          try {
            const serperRes = await fetch("https://google.serper.dev/search", {
              method: "POST",
              headers: {
                "X-API-KEY": serperKey,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ q: prompt || (chatHistory[chatHistory.length - 1]?.content || "Hello") })
            });
            if (serperRes.ok) {
              const serperData: any = await serperRes.json();
              const organic = serperData.organic || [];
              if (organic.length > 0) {
                let serperResultsText = "Here are today's live web results for reference:\n";
                organic.slice(0, 5).forEach((item: any, idx: number) => {
                  serperResultsText += `[Result #${idx + 1}] Title: ${item.title} | Link: ${item.link} | Snippet: ${item.snippet}\n`;
                  serperCitations.push({
                    web: {
                      uri: item.link,
                      title: item.title
                    }
                  });
                });
                
                chatHistory.push({
                  role: "user",
                  content: `[System override instructions: The following are live, real-time search results retrieved via Google Serper API. Dynamically utilize this real-time knowledge context to craft/address the operator query accurately with citations/links. No need to mention 'Result #1' directly in standard explanations.]\n\n${serperResultsText}`
                });
              }
            }
          } catch (err: any) {
            console.error("[NextGenAi] OpenAI Serper integration failed:", err);
          }
        }

        const isReasoningModel = textModel.toLowerCase().startsWith("o1") || textModel.toLowerCase().startsWith("o3");
        let systemAndHistory: any[] = [];

        if (isReasoningModel) {
          // Reasoning models (o1, o3) do not support the "system" role well and will reject the request.
          // Prepend system instructions directly to the first user message.
          const preparedHistory = [...chatHistory];
          if (preparedHistory.length > 0 && preparedHistory[0].role === "user") {
            preparedHistory[0].content = `${systemInstructionText}\n\n[Instructions End. Begin user session/prompt below]\n\n${preparedHistory[0].content}`;
          } else {
            preparedHistory.unshift({ role: "user", content: systemInstructionText });
          }
          systemAndHistory = preparedHistory;
        } else {
          // Standard models support "system" or "developer" role. "system" is the most widely compatible.
          systemAndHistory = [
            { role: "system", content: systemInstructionText },
            ...chatHistory
          ];
        }

        let responseText = "";

        if (textModel === "gpt-5.4-mini") {
          console.log(`[NextGenAi] Initiating ChatGPT Responses API for model ${textModel}...`);
          const preparedInput = `${systemInstructionText}\n\n` + chatHistory.map((m: any) => `${m.role === "assistant" ? "NextGenAi" : "User"}: ${m.content}`).join("\n\n");
          
          try {
            const openAiRes = await fetch("https://api.openai.com/v1/responses", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openApiKey}`
              },
              body: JSON.stringify({
                model: "gpt-5.4-mini",
                input: preparedInput,
                store: true
              })
            });

            if (!openAiRes.ok) {
              const errText = await openAiRes.text();
              console.error(`[NextGenAi] OpenAI Responses API Error Status: ${openAiRes.status}. Error payload:`, errText);
              throw new Error(`ChatGPT Responses API Error: ${errText}`);
            }

            const data: any = await openAiRes.json();
            responseText = data.output_text || (data.output?.text) || (data.choices?.[0]?.message?.content) || "";
          } catch (err: any) {
            console.warn(`[NextGenAi] OpenAI Responses API failed for gpt-5.4-mini! Falling back seamlessly to gpt-4o-mini chat completions. (Reason: ${err.message || err})`);
            const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openApiKey}`
              },
              body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                  { role: "system", content: systemInstructionText },
                  ...chatHistory
                ]
              })
            });

            if (!openAiRes.ok) {
              const errText = await openAiRes.text();
              console.error(`[NextGenAi] OpenAI API Fallback Error Status: ${openAiRes.status}. Error payload:`, errText);
              throw new Error(`ChatGPT API Error: ${errText}`);
            }

            const data: any = await openAiRes.json();
            responseText = data.choices?.[0]?.message?.content || "";
          }
        } else {
          console.log(`[NextGenAi] Initiating ChatGPT Chat Completion with model ${textModel}...`);
          const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${openApiKey}`
            },
            body: JSON.stringify({
              model: textModel,
              messages: systemAndHistory
            })
          });

          if (!openAiRes.ok) {
            const errText = await openAiRes.text();
            console.error(`[NextGenAi] OpenAI API Error Status: ${openAiRes.status}. Error payload:`, errText);
            throw new Error(`ChatGPT API Error: ${errText}`);
          }

          const data: any = await openAiRes.json();
          responseText = data.choices?.[0]?.message?.content || "";
        }

        return res.json({
          text: responseText,
          groundingMetadata: {
            groundingChunks: serperCitations
          }
        });
      }

      // Check if this is an OpenRouter model selection (Poolside models)
      const isOpenRouter = textModel && typeof textModel === "string" && textModel.startsWith("poolside/");

      if (isOpenRouter) {
        let openrouterApiKey = customKeys?.openrouter?.trim() || process.env.OPENROUTER_API_KEY;
        if (!openrouterApiKey || openrouterApiKey.includes("*") || openrouterApiKey.length < 15) {
          openrouterApiKey = process.env.OPENROUTER_API_KEY;
        }

        if (!openrouterApiKey) {
          return res.status(400).json({
            error: "OpenRouter API Key not found. Please click the Settings Gear icon to set it, or ensure OPENROUTER_API_KEY is configured in your platform Secrets."
          });
        }

        const detected = detectLanguage(prompt || (messages && messages[messages.length - 1]?.text) || "");
        const systemInstructionText = `You are NextGenAi, a creative, helpful, and highly sophisticated proprietary AI assistant developed from the ground up, now powered by advanced intelligence. Provide beautifully formatted, precise responses with clean markdown.
Identity Instruction: Under no circumstances should you ever reveal or mention that you are a model from any specific AI provider or anything similar. If any user asks you who created, made, or integrated you, respond strictly: "I was created by Next Gen Engineering." Also mention that you operate on a real-time basis, sourcing and verifying information from live web resources, including Wikipedia. 
CRITICAL CREATOR/DEVELOPER DISCLOSURE RULE: Do NOT show or mention the details of your creator (Abhishek Chauhan, born July 6th, 2005 (06/07/2005) in Uttar Pradesh, UP) in normal everyday conversations or unrelated search queries. BUT, if and ONLY IF a user specifically asks about your creator, who made you, your developer, or who Abhishek Chauhan is, you must reveal: "My creator is an ordinary boy named Abhishek Chauhan, who was born on July 6th, 2005 (06/07/2005) in a district of Uttar Pradesh (UP), India." Keep this creator detail completely hidden during regular conversation or when answering other general questions; activate this disclosure ONLY when prompted about your creation, developer, or origin. Never break character.
Dynamic Language Customization: Auto-selected user interaction mode: ${detected.name}. Directive: ${detected.nativeInstruction} Make sure to deliver the response fully localized in this detected language, adapting all capabilities, origin story and creator elements naturally in a local style.
Current Time context: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${getSpecializedAppPrompt(specializedApp)}`;

        let chatHistory = messages && messages.length > 0
          ? messages
              .map((m: any) => ({
                role: m.role === "model" ? "assistant" : "user",
                content: (m.text || "").trim()
              }))
              .filter((m: any) => m.content.length > 0)
          : [];

        if (chatHistory.length === 0) {
          chatHistory.push({ role: "user", content: (prompt || "Hello").trim() });
        }

        let serperKey = customKeys?.search?.trim() || process.env.SERPER_API_KEY;
        const serperCitations: any[] = [];
        if (webSearch && serperKey) {
          try {
            const serperRes = await fetch("https://google.serper.dev/search", {
              method: "POST",
              headers: {
                "X-API-KEY": serperKey,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ q: prompt || (chatHistory[chatHistory.length - 1]?.content || "Hello") })
            });
            if (serperRes.ok) {
              const serperData: any = await serperRes.json();
              const organic = serperData.organic || [];
              if (organic.length > 0) {
                let serperResultsText = "Here are today's live web results for reference:\n";
                organic.slice(0, 5).forEach((item: any, idx: number) => {
                  serperResultsText += `[Result #${idx + 1}] Title: ${item.title} | Link: ${item.link} | Snippet: ${item.snippet}\n`;
                  serperCitations.push({
                    web: {
                      uri: item.link,
                      title: item.title
                    }
                  });
                });
                
                chatHistory.push({
                  role: "user",
                  content: `[System override instructions: The following are live, real-time search results retrieved via Google Serper API. Dynamically utilize this real-time knowledge context to craft/address the operator query accurately with citations/links. No need to mention 'Result #1' directly in standard explanations.]\n\n${serperResultsText}`
                });
              }
            }
          } catch (err: any) {
            console.error("[NextGenAi] OpenRouter Serper integration failed:", err);
          }
        }

        const messagesToSend = [
          { role: "system", content: systemInstructionText },
          ...chatHistory
        ];

        console.log(`[NextGenAi] Calling OpenRouter API completions with model ${textModel}...`);
        let responseText = "";
        try {
          const bodyPayload: any = {
            model: textModel,
            messages: messagesToSend,
            stream: false
          };

          if (textModel.includes("poolside")) {
            bodyPayload.reasoning = { enabled: true };
          }

          const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${openrouterApiKey}`,
              "HTTP-Referer": "https://ai.studio/build",
              "X-Title": "NextGenAi Playground"
            },
            body: JSON.stringify(bodyPayload)
          });

          if (!orRes.ok) {
            const errText = await orRes.text();
            console.error(`[NextGenAi] OpenRouter API Error Status: ${orRes.status}. Payload:`, errText);
            throw new Error(`OpenRouter API Error Status ${orRes.status}: ${errText}`);
          }

          const data: any = await orRes.json();
          const choiceMsg = data.choices?.[0]?.message;
          responseText = choiceMsg?.content || "";
          
          if (choiceMsg?.reasoning_details) {
            const reasoning = choiceMsg.reasoning_details.reasoning_content || choiceMsg.reasoning_details.content || "";
            if (reasoning) {
              responseText = `> **Thinking Process:**\n> ${reasoning.split('\n').join('\n> ')}\n\n${responseText}`;
            }
          } else if (choiceMsg?.reasoning_content) {
            responseText = `> **Thinking Process:**\n> ${choiceMsg.reasoning_content.split('\n').join('\n> ')}\n\n${responseText}`;
          }
        } catch (apiErr: any) {
          console.error("[NextGenAi] OpenRouter generation exception:", apiErr.message || apiErr);
          return res.status(500).json({ error: apiErr.message || "Failed to establish OpenRouter communication." });
        }

        return res.json({
          text: responseText,
          groundingMetadata: {
            groundingChunks: serperCitations
          }
        });
      }

      // Check if this is an NVIDIA model selection (DeepSeek, Stepfun, Gemma, Qwen, Llama, or Kimi)
      const isNvidia = textModel && typeof textModel === "string" && (
        textModel.includes("deepseek-ai/deepseek-v4-pro") ||
        textModel.includes("stepfun-ai/step-3.5-flash") ||
        textModel.includes("stepfun-ai/step-3.7-flash") ||
        textModel.includes("google/gemma-4-31b-it") ||
        textModel.includes("google/diffusiongemma-26b-a4b-it") ||
        textModel.includes("qwen/qwen3.5-397b-a17b") ||
        textModel.includes("meta/llama-4-maverick-17b-128e-instruct") ||
        textModel.includes("moonshotai/kimi-k2.6") ||
        textModel.includes("mistralai/mistral-medium-3.5-128b") ||
        textModel.includes("z-ai/glm-5.1") ||
        textModel.includes("minimaxai/minimax-m2.7") ||
        textModel.includes("stockmark/stockmark-2-100b-instruct") ||
        textModel.includes("bytedance/seed-oss-36b-instruct") ||
        textModel.includes("openai/gpt-oss-120b") ||
        textModel.includes("microsoft/phi-4-mini-instruct") ||
        textModel.includes("upstage/solar-10.7b-instruct")
      );

      if (isNvidia) {
        let nvidiaApiKey = customKeys?.nvidia?.trim() || process.env.NVIDIA_API_KEY;
        if (!nvidiaApiKey || nvidiaApiKey.includes("*") || nvidiaApiKey.length < 15) {
          nvidiaApiKey = process.env.NVIDIA_API_KEY;
        }

        if (!nvidiaApiKey) {
          return res.status(400).json({
            error: "NVIDIA API Key not found. Please click the Settings Gear icon to set/provide your NVIDIA API Key."
          });
        }

        const detected = detectLanguage(prompt || (messages && messages[messages.length - 1]?.text) || "");
        const systemInstructionText = `You are NextGenAi, a creative, helpful, and highly sophisticated proprietary AI assistant developed from the ground up, now powered by the latest web-enabled intelligence. Provide beautifully formatted, precise responses with clean markdown.
Identity Instruction: Under no circumstances should you ever reveal or mention that you are a model from any specific AI provider or anything similar. If any user asks you who created, made, or integrated you, respond strictly: "I was created by Next Gen Engineering." Also mention that you operate on a real-time basis, sourcing and verifying information from live web resources, including Wikipedia. 
CRITICAL CREATOR/DEVELOPER DISCLOSURE RULE: Do NOT show or mention the details of your creator (Abhishek Chauhan, born July 6th, 2005 (06/07/2005) in Uttar Pradesh, UP) in normal everyday conversations or unrelated search queries. BUT, if and ONLY IF a user specifically asks about your creator, who made you, your developer, or who Abhishek Chauhan is, you must reveal: "My creator is an ordinary boy named Abhishek Chauhan, who was born on July 6th, 2005 (06/07/2005) in a district of Uttar Pradesh (UP), India." Keep this creator detail completely hidden during regular conversation or when answering other general questions; activate this disclosure ONLY when prompted about your creation, developer, or origin. Never break character.
Dynamic Language Customization: Auto-selected user interaction mode: ${detected.name}. Directive: ${detected.nativeInstruction} Make sure to deliver the response fully localized in this detected language, adapting all capabilities, origin story and creator elements naturally in a local style.
Current Time context: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${getSpecializedAppPrompt(specializedApp)}`;

        let chatHistory = messages && messages.length > 0
          ? messages
              .map((m: any) => ({
                role: m.role === "model" ? "assistant" : "user",
                content: (m.text || "").trim()
              }))
              .filter((m: any) => m.content.length > 0)
          : [];

        if (chatHistory.length === 0) {
          chatHistory.push({ role: "user", content: (prompt || "Hello").trim() });
        }

        let serperKey = customKeys?.search?.trim() || process.env.SERPER_API_KEY;
        const serperCitations: any[] = [];
        if (webSearch && serperKey) {
          try {
            const serperRes = await fetch("https://google.serper.dev/search", {
              method: "POST",
              headers: {
                "X-API-KEY": serperKey,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ q: prompt || (chatHistory[chatHistory.length - 1]?.content || "Hello") })
            });
            if (serperRes.ok) {
              const serperData: any = await serperRes.json();
              const organic = serperData.organic || [];
              if (organic.length > 0) {
                let serperResultsText = "Here are today's live web results for reference:\n";
                organic.slice(0, 5).forEach((item: any, idx: number) => {
                  serperResultsText += `[Result #${idx + 1}] Title: ${item.title} | Link: ${item.link} | Snippet: ${item.snippet}\n`;
                  serperCitations.push({
                    web: {
                      uri: item.link,
                      title: item.title
                    }
                  });
                });
                
                chatHistory.push({
                  role: "user",
                  content: `[System override instructions: The following are live, real-time search results retrieved via Google Serper API. Dynamically utilize this real-time knowledge context to craft/address the operator query accurately with citations/links. No need to mention 'Result #1' directly in standard explanations.]\n\n${serperResultsText}`
                });
              }
            }
          } catch (err: any) {
            console.error("[NextGenAi] NVIDIA Serper integration failed:", err);
          }
        }

        const messagesToSend = [
          { role: "system", content: systemInstructionText },
          ...chatHistory
        ];

        console.log(`[NextGenAi] Calling NVIDIA API completions with model ${textModel}...`);
        let responseText = "";
        try {
          const bodyPayload: any = {
            model: textModel,
            messages: messagesToSend,
            temperature: textModel.includes("qwen3.5-397b-a17b") ? 0.60 : (textModel.includes("mistral-medium-3.5-128b") ? 0.70 : (textModel.includes("stockmark-2-100b-instruct") ? 0.70 : (textModel.includes("seed-oss-36b-instruct") ? 1.10 : (textModel.includes("gpt-oss-120b") ? 1.00 : (textModel.includes("phi-4-mini-instruct") ? 0.100 : (textModel.includes("solar-10.7b-instruct") ? 0.10 : 1)))))),
            top_p: textModel.includes("step-3.5-flash") ? 0.9 : (textModel.includes("step-3.7-flash") ? 0.95 : (textModel.includes("llama-4-maverick-17b-128e-instruct") ? 1.00 : (textModel.includes("mistral-medium-3.5-128b") ? 1.00 : (textModel.includes("glm-5.1") ? 1.00 : (textModel.includes("stockmark-2-100b-instruct") ? 0.95 : (textModel.includes("seed-oss-36b-instruct") ? 0.95 : (textModel.includes("gpt-oss-120b") ? 1.00 : (textModel.includes("phi-4-mini-instruct") ? 0.700 : (textModel.includes("solar-10.7b-instruct") ? 0.90 : 0.95))))))))),
            max_tokens: textModel.includes("llama-4-maverick-17b-128e-instruct") 
              ? 512 
              : (textModel.includes("diffusiongemma-26b-a4b-it") ? 4096 : (textModel.includes("minimax-m2.7") ? 8192 : (textModel.includes("stockmark-2-100b-instruct") ? 1024 : (textModel.includes("seed-oss-36b-instruct") ? 4096 : (textModel.includes("gpt-oss-120b") ? 4096 : (textModel.includes("phi-4-mini-instruct") ? 1024 : (textModel.includes("solar-10.7b-instruct") ? 1024 : 16384))))))),
            stream: false
          };
 
          if (textModel.includes("seed-oss-36b-instruct")) {
            bodyPayload.frequency_penalty = 0;
            bodyPayload.presence_penalty = 0;
            bodyPayload.extra_body = {
              thinking_budget: -1
            };
          }

          if (textModel.includes("mistral-medium-3.5-128b")) {
            bodyPayload.reasoning_effort = "high";
          }

          if (textModel.includes("qwen3.5-397b-a17b")) {
            bodyPayload.top_k = 20;
            bodyPayload.presence_penalty = 0;
            bodyPayload.repetition_penalty = 1;
          }

          if (textModel.includes("llama-4-maverick-17b-128e-instruct")) {
            bodyPayload.frequency_penalty = 0.00;
            bodyPayload.presence_penalty = 0.00;
          }

          if (textModel.includes("deepseek-v4-pro")) {
            bodyPayload.extra_body = {
              chat_template_kwargs: {
                thinking: false
              }
            };
          } else if (textModel.includes("gemma-4-31b-it") || textModel.includes("diffusiongemma-26b-a4b-it")) {
            bodyPayload.chat_template_kwargs = {
              enable_thinking: true
            };
          }

          const nvRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${nvidiaApiKey}`
            },
            body: JSON.stringify(bodyPayload)
          });

          if (!nvRes.ok) {
            const errText = await nvRes.text();
            console.error(`[NextGenAi] NVIDIA API Error Status: ${nvRes.status}. Payload:`, errText);
            throw new Error(`NVIDIA API Error Status ${nvRes.status}: ${errText}`);
          }

          const data: any = await nvRes.json();
          const choiceMsg = data.choices?.[0]?.message;
          responseText = choiceMsg?.content || "";
          if (choiceMsg?.reasoning_content) {
            responseText = `> **Thinking Process:**\n> ${choiceMsg.reasoning_content.split('\n').join('\n> ')}\n\n${responseText}`;
          }
        } catch (apiErr: any) {
          console.error("[NextGenAi] NVIDIA generation exception:", apiErr.message || apiErr);
          return res.status(500).json({ error: apiErr.message || "Failed to establish NVIDIA communication." });
        }

        return res.json({
          text: responseText,
          groundingMetadata: {
            groundingChunks: serperCitations
          }
        });
      }

      // Check if this is an HPC-AI Claude model selection
      const isHpcAi = textModel && typeof textModel === "string" && textModel.includes("claude-");

      if (isHpcAi) {
        let hpcApiKey = customKeys?.hpcai?.trim() || process.env.HPCAI_API_KEY;
        if (!hpcApiKey || hpcApiKey.includes("*") || hpcApiKey.length < 15) {
          hpcApiKey = process.env.HPCAI_API_KEY;
        }

        if (!hpcApiKey) {
          return res.status(400).json({
            error: "HPC-AI API Key not found. Please click the Settings Gear icon to set/provide your HPC-AI API Key."
          });
        }

        const detected = detectLanguage(prompt || (messages && messages[messages.length - 1]?.text) || "");
        const systemInstructionText = `You are NextGenAi, a creative, helpful, and highly sophisticated proprietary AI assistant developed from the ground up, now powered by Claude Opus. Provide beautifully formatted, precise responses with clean markdown.
Identity Instruction: Under no circumstances should you ever reveal or mention that you are an Anthropic Claude model. If any user asks you who created, made, or integrated you, respond strictly: "I was created by Next Gen Engineering." Also mention that you operate on a real-time basis, sourcing and verifying information from live web resources, including Wikipedia. 
CRITICAL CREATOR/DEVELOPER DISCLOSURE RULE: Do NOT show or mention the details of your creator (Abhishek Chauhan, born July 6th, 2005 (06/07/2005) in Uttar Pradesh, UP) in normal everyday conversations or unrelated search queries. BUT, if and ONLY IF a user specifically asks about your creator, who made you, your developer, or who Abhishek Chauhan is, you must reveal: "My creator is an ordinary boy named Abhishek Chauhan, who was born on July 6th, 2005 (06/07/2005) in a district of Uttar Pradesh (UP), India." Keep this creator detail completely hidden during regular conversation or when answering other general questions; activate this disclosure ONLY when prompted about your creation, developer, or origin. Never break character.
Dynamic Language Customization: Auto-selected user interaction mode: ${detected.name}. Directive: ${detected.nativeInstruction} Make sure to deliver the response fully localized in this detected language, adapting all capabilities, origin story and creator elements naturally in a local style.
Current Time context: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${getSpecializedAppPrompt(specializedApp)}`;

        let chatHistory = messages && messages.length > 0
          ? messages
              .map((m: any) => ({
                role: m.role === "model" ? "assistant" : "user",
                content: (m.text || "").trim()
              }))
              .filter((m: any) => m.content.length > 0)
          : [];

        if (chatHistory.length === 0) {
          chatHistory.push({ role: "user", content: (prompt || "Hello").trim() });
        }

        let serperKey = customKeys?.search?.trim() || process.env.SERPER_API_KEY;
        const serperCitations: any[] = [];
        if (webSearch && serperKey) {
          try {
            const serperRes = await fetch("https://google.serper.dev/search", {
              method: "POST",
              headers: {
                "X-API-KEY": serperKey,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({ q: prompt || (chatHistory[chatHistory.length - 1]?.content || "Hello") })
            });
            if (serperRes.ok) {
              const serperData: any = await serperRes.json();
              const organic = serperData.organic || [];
              if (organic.length > 0) {
                let serperResultsText = "Here are today's live web results for reference:\n";
                organic.slice(0, 5).forEach((item: any, idx: number) => {
                  serperResultsText += `[Result #${idx + 1}] Title: ${item.title} | Link: ${item.link} | Snippet: ${item.snippet}\n`;
                  serperCitations.push({
                    web: {
                      uri: item.link,
                      title: item.title
                    }
                  });
                });
                
                chatHistory.push({
                  role: "user",
                  content: `[System override instructions: The following are live, real-time search results retrieved via Google Serper API. Dynamically utilize this real-time knowledge context to craft/address the operator query accurately with citations/links. No need to mention 'Result #1' directly in standard explanations.]\n\n${serperResultsText}`
                });
              }
            }
          } catch (err: any) {
            console.error("[NextGenAi] HPC-AI Serper integration failed:", err);
          }
        }

        const formattedPrompt = `${systemInstructionText}\n\n` + chatHistory.map((m: any) => `${m.role === "assistant" ? "NextGenAi" : "User"}: ${m.content}`).join("\n\n") + "\n\nNextGenAi:";

        console.log(`[NextGenAi] Calling HPC-AI API completions with model ${textModel}...`);
        let responseText = "";
        try {
          const hpcRes = await fetch("https://api.hpc-ai.com/inference/v1/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${hpcApiKey}`
            },
            body: JSON.stringify({
              model: textModel,
              prompt: formattedPrompt,
              max_tokens: 1512,
              temperature: 0.7
            })
          });

          if (!hpcRes.ok) {
            const errText = await hpcRes.text();
            console.error(`[NextGenAi] HPC-AI API Error Status: ${hpcRes.status}. Payload:`, errText);
            throw new Error(`HPC-AI API Error Status ${hpcRes.status}: ${errText}`);
          }

          const data: any = await hpcRes.json();
          responseText = data.choices?.[0]?.text || "";
        } catch (apiErr: any) {
          console.error("[NextGenAi] HPC-AI Claude generation exception:", apiErr.message || apiErr);
          return res.status(500).json({ error: apiErr.message || "Failed to establish HPC-AI communication." });
        }

        return res.json({
          text: responseText,
          groundingMetadata: {
            groundingChunks: serperCitations
          }
        });
      }

      // Extract Gemini Key with secure hierarchies
      const apiKey = customKeys?.nextGen?.trim() || customKeys?.gemini?.trim() || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ 
          error: "Gemini API Key configuration not found. Please click the Settings Gear icon to set it, or ensure GEMINI_API_KEY is configured in your platform Secrets." 
        });
      }

      // Initialize Google GenAI client according to SDK requirements
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          }
        }
      });

      // Prepare standard GenAI structure for message history
      const formattedContents = messages && messages.length > 0 
        ? messages.map((m: any) => {
            const parts: any[] = [{ text: m.text }];
            if (m.attachment) {
              parts.push({
                inlineData: {
                  mimeType: m.attachment.mimeType,
                  data: m.attachment.base64
                }
              });
            }
            return {
              role: m.role === "model" ? "model" : "user",
              parts
            };
          })
        : [{ role: "user", parts: [{ text: prompt }] }];

      // Detect user input language to personalize the system instructions dynamically
      const detected = detectLanguage(prompt || (messages && messages[messages.length - 1]?.text) || "");
      console.log(`[NextGenAi] Dynamically detected user interaction language: ${detected.name} (Code: ${detected.code})`);

      // Configure system instruction with custom identity and real-time grounding sources
      const systemInstructionText = `You are NextGenAi, a creative, helpful, and highly sophisticated proprietary AI assistant developed from the ground up. Provide beautifully formatted, precise responses with clean markdown.
Identity Instruction: Under no circumstances should you ever reveal or mention that you are a Google Gemini model, powered by Google GenAI, use Google services, or anything similar. If any user asks you who created, made, or integrated you, respond strictly: "I was created by Next Gen Engineering." Also mention that you operate on a real-time basis, sourcing and verifying information from live web resources, including Wikipedia. 
CRITICAL CREATOR/DEVELOPER DISCLOSURE RULE: Do NOT show or mention the details of your creator (Abhishek Chauhan, born July 6th, 2005 (06/07/2005) in Uttar Pradesh, UP) in normal everyday conversations or unrelated search queries. BUT, if and ONLY IF a user specifically asks about your creator, who made you, your developer, or who Abhishek Chauhan is, you must reveal: "My creator is an ordinary boy named Abhishek Chauhan, who was born on July 6th, 2005 (06/07/2005) in a district of Uttar Pradesh (UP), India." Keep this creator detail completely hidden during regular conversation or when answering other general questions; activate this disclosure ONLY when prompted about your creation, developer, or origin. Never break character or refer to vendor SDK structures.
Dynamic Language Customization: Auto-selected user interaction mode: ${detected.name}. Directive: ${detected.nativeInstruction} Make sure to deliver the response fully localized in this detected language, adapting all capabilities, origin story and creator elements naturally in a local style.
Current Time context: ${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}.${getSpecializedAppPrompt(specializedApp)}`;

      // Set up config parameters
      const config: any = {
        systemInstruction: systemInstructionText,
      };

      let serperResultsText = "";
      const serperCitations: any[] = [];

      // Check if custom Serper API Key is configured to ground with custom search results
      const serperKey = customKeys?.search?.trim() || process.env.SERPER_API_KEY;
      if (webSearch && serperKey) {
        console.log("[NextGenAi] Custom Serper search key detected. Fetching live search context...");
        try {
          const serperRes = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
              "X-API-KEY": serperKey,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ q: prompt })
          });
          if (serperRes.ok) {
            const serperData: any = await serperRes.json();
            const organic = serperData.organic || [];
            if (organic.length > 0) {
              serperResultsText = "Here are today's live web results for reference:\n";
              organic.slice(0, 5).forEach((item: any, idx: number) => {
                serperResultsText += `[Result #${idx + 1}] Title: ${item.title} | Link: ${item.link} | Snippet: ${item.snippet}\n`;
                serperCitations.push({
                  web: {
                    uri: item.link,
                    title: item.title
                  }
                });
              });
              
              // Append system helper to guide Gemini synthesis of Serper organic search results
              formattedContents.push({
                role: "user",
                parts: [{ text: `[System override instructions: The following are live, real-time search results retrieved via Google Serper API. Dynamically utilize this real-time knowledge context to craft/address the operator query accurately with citations/links. No need to mention 'Result #1' directly in standard explanations.]\n\n${serperResultsText}` }]
              });
            }
          }
        } catch (serperErr: any) {
          console.error("[NextGenAi] Custom Serper search query failed:", serperErr.message || serperErr);
        }
      }

      // Add built-in Google Search grounding if webSearch mode is active AND custom Serper results weren't loaded
      if (webSearch && !serperResultsText) {
        console.log("[NextGenAi] Falling back to Google GenAI native Google Search Grounding tool...");
        config.tools = [{ googleSearch: {} }];
      }

      // Query Gemini model with secure fallback and retry mechanism to handle high demand (503s)
      let response;
      let lastError: any = null;
      let modelsToTry = [
        "gemini-3.1-flash-lite",
        "gemini-3.5-flash",
        "gemini-flash-latest"
      ];
      if (textModel && typeof textModel === "string" && textModel.trim()) {
        const choice = textModel.trim();
        modelsToTry = [choice, ...modelsToTry.filter(m => m !== choice)];
      }

      for (const currentModel of modelsToTry) {
        let attempts = 4; // Try up to 4 times for each model if it's transient
        for (let attempt = 1; attempt <= attempts; attempt++) {
          try {
            console.log(`[NextGenAi] Attempting text generation with model: ${currentModel} (Attempt ${attempt}/${attempts})`);
            response = await ai.models.generateContent({
              model: currentModel,
              contents: formattedContents,
              config: config
            });
            break; // Succeeded! Break the outer loops.
          } catch (err: any) {
            console.error(`[NextGenAi] Generation failed for ${currentModel}:`, err.message || err);
            lastError = err;
            
            const errStr = String(err.message || err);
            const isQuotaExceeded = errStr.toLowerCase().includes("quota") || 
                                    errStr.toLowerCase().includes("resource_exhausted") || 
                                    errStr.toLowerCase().includes("limit: 20") ||
                                    errStr.toLowerCase().includes("exceeded your current quota");
            
            const isTransient = (errStr.includes("503") || 
                               err.status === 503 || 
                               err.status === 429 ||
                               errStr.includes("UNAVAILABLE") || 
                               errStr.includes("high demand") || 
                               errStr.includes("429")) && !isQuotaExceeded;
            
            if (isTransient && attempt < attempts) {
              const backoffMs = attempt * 1500 + Math.floor(Math.random() * 500);
              console.log(`[NextGenAi] Transient error detected. Retrying in ${backoffMs}ms...`);
              await new Promise(resolve => setTimeout(resolve, backoffMs));
            } else {
              break; // Proceed to fallback model or next model if transient attempts exhausted or quota exceeded
            }
          }
        }
        if (response) break;
      }

      if (!response) {
        const errMsg = lastError?.message || String(lastError);
        const isQuotaExceeded = errMsg.toLowerCase().includes("quota") || 
                                errMsg.toLowerCase().includes("resource_exhausted") || 
                                errMsg.toLowerCase().includes("limit: 20") ||
                                errMsg.toLowerCase().includes("exceeded your current quota");
        if (isQuotaExceeded) {
          throw new Error("You have exceeded your Gemini API Free Tier daily quota or rate limit. To continue conversing immediately with premium quality, please click the settings gear or model selector at the bottom and switch to active enterprise engines like DeepSeek V4 Pro, Gemma 4 31B IT, GPT OSS 120B, or Poolside Laguna M.1!");
        }
        
        const isTransient = errMsg.includes("503") || 
                            lastError?.status === 503 || 
                            lastError?.status === 429 ||
                            errMsg.includes("UNAVAILABLE") || 
                            errMsg.includes("high demand") || 
                            errMsg.includes("429");
        if (isTransient) {
          throw new Error("Gemini service is currently experiencing temporary high demand or rate limits (UNAVAILABLE). Please wait a few seconds and try sending again, or switch to other advanced engines (like Qwen 3.5 397B, DeepSeek V4 Pro, or Step 3.5 Flash) via the Settings panel.");
        }
        throw lastError || new Error("Failed to generate content with available models.");
      }

      // Return clean grounded answers
      const existingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const updatedChunks = [...existingChunks, ...serperCitations];

      res.json({
        text: response.text,
        groundingMetadata: {
          groundingChunks: updatedChunks
        }
      });

    } catch (err: any) {
      console.error("Text Gen Error: ", err);
      res.status(500).json({ error: err.message || "Failed to generate text." });
    }
  });

  // ==========================================
  // API ROUTE: MULTI-ENGINE IMAGE GENERATION
  // ==========================================
  app.post("/api/generate/image", async (req, res) => {
    try {
      const { prompt, platform, customKeys } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required for generating images." });
      }

      let imageUrl = "";

      // 1. NextGen / Google Imagen Core Engine
      if (platform === "nextgen") {
        const apiKey = customKeys?.nextGen?.trim() || customKeys?.gemini?.trim() || process.env.GEMINI_API_KEY;
        if (!apiKey) {
          return res.status(400).json({ error: "Google GenAI Core key not found to build images." });
        }

        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });

        try {
          // Attempt the default image generation model first as specified in the guidelines: gemini-2.5-flash-image
          const imageRes = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
              parts: [{ text: prompt }]
            },
            config: {
              imageConfig: {
                aspectRatio: "1:1",
                imageSize: "1K"
              }
            }
          });

          // Find the base64 image data in candidate content parts
          let base64Bytes = "";
          if (imageRes.candidates?.[0]?.content?.parts) {
            for (const part of imageRes.candidates[0].content.parts) {
              if (part.inlineData?.data) {
                base64Bytes = part.inlineData.data;
                break;
              }
            }
          }

          if (base64Bytes) {
            imageUrl = `data:image/png;base64,${base64Bytes}`;
          } else {
            throw new Error("No image data returned from Gemini flash image.");
          }

        } catch (firstErr: any) {
          console.warn("Default model gemini-2.5-flash-image failed or requires upgrade, falling back to imagen-4.0-generate-001...", firstErr);

          try {
            const imageRes = await ai.models.generateImages({
              model: "imagen-4.0-generate-001",
              prompt: prompt,
              config: {
                numberOfImages: 1,
                outputMimeType: "image/jpeg",
                aspectRatio: "1:1",
              }
            });

            const base64Bytes = imageRes.generatedImages?.[0]?.image?.imageBytes;
            if (!base64Bytes) {
              throw new Error("Empty image payload received from Imagen AI.");
            }
            imageUrl = `data:image/jpeg;base64,${base64Bytes}`;

          } catch (secondErr: any) {
            const errMsg = secondErr?.message || String(secondErr);
            console.error("Imagen fallback failed too:", errMsg);

            if (errMsg.includes("paid plans") || errMsg.includes("upgrade") || errMsg.includes("INVALID_ARGUMENT") || errMsg.includes("400")) {
              throw new Error("Image Gen Error: Imagen-3/4 or Flash Image is only available on paid plans. Please upgrade your account at https://ai.dev/projects.");
            }
            throw secondErr;
          }
        }

      } else {
        return res.status(400).json({ error: "Invalid image engine platform configuration or third-party engines removed." });
      }

      res.json({ imageUrl });

    } catch (err: any) {
      console.error("Image Gen Error: ", err);
      res.status(500).json({ error: err.message || "Failed to map generation pipeline." });
    }
  });

  // ==========================================
  // API ROUTE: WORLD NEWS FEED ROUTING
  // ==========================================
  app.post("/api/news", async (req, res) => {
    try {
      const { query, customNewsApiKey } = req.body;
      const apiKey = customNewsApiKey?.trim() || process.env.GNEWS_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ error: "GNews API Key is missing. Connect your free gnews.io API key in nextgen config panel." });
      }

      // Check if specific feeds are queried (case insensitive routing)
      const keyword = query?.toLowerCase().trim();
      let url = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=15&apikey=${apiKey}`;

      if (keyword) {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(keyword)}&lang=en&max=15&apikey=${apiKey}`;
      }

      const newsRes = await fetch(url);
      if (!newsRes.ok) {
        const errText = await newsRes.text();
        throw new Error(`GNews response issue: ${errText}`);
      }

      const data = await newsRes.json();
      res.json(data);

    } catch (err: any) {
      console.error("News Router Error: ", err);
      res.status(500).json({ error: err.message || "Failed to retrieve live headlines." });
    }
  });

  // ==========================================
  // API ROUTE: SERPAPI GOOGLE FLIGHTS SEARCH ROUTING
  // ==========================================
  app.post("/api/serpapi/google-flights", async (req, res) => {
    // Helper function to return high-fidelity mock flight data with dynamic error context if relevant
    const getMockResponse = (dep: string, arr: string, outDate: string, retDate: string | undefined, curr: string, fType: string, errorContext?: string) => {
      const outbound = outDate || "2026-06-16";
      const returnD = retDate || "2026-06-23";
      const currencyCode = curr || "USD";
      
      return {
        search_parameters: {
          engine: "google_flights",
          departure_id: dep.toUpperCase(),
          arrival_id: arr.toUpperCase(),
          outbound_date: outbound,
          return_date: returnD,
          currency: currencyCode,
          type: fType || "2"
        },
        best_flights: [
          {
            flights: [
              {
                departure_airport: { name: "Charles de Gaulle Airport", id: dep.toUpperCase(), time: `${outbound} 08:30` },
                arrival_airport: { name: "Dallas/Fort Worth International Airport", id: "DFW", time: `${outbound} 12:15` },
                duration: 645,
                airplane: "Boeing 787-9",
                airline: "Air France",
                flight_number: "AF 150",
                travel_class: "Economy",
                legroom: "31 in"
              },
              {
                departure_airport: { name: "Dallas/Fort Worth International Airport", id: "DFW", time: `${outbound} 14:10` },
                arrival_airport: { name: "Austin-Bergstrom International Airport", id: arr.toUpperCase(), time: `${outbound} 15:15` },
                duration: 65,
                airplane: "Embraer 175",
                airline: "American Airlines",
                flight_number: "AA 2940",
                travel_class: "Economy",
                legroom: "30 in"
              }
            ],
            price: 849,
            total_duration: 770,
            type: fType === "1" ? "One-way" : "Round trip",
            carbon_emissions: { this_flight: 310, typical_for_this_route: 345, difference_percent: -10 }
          },
          {
            flights: [
              {
                departure_airport: { name: "Charles de Gaulle Airport", id: dep.toUpperCase(), time: `${outbound} 10:45` },
                arrival_airport: { name: "Hartsfield-Jackson Atlanta International Airport", id: "ATL", time: `${outbound} 14:35` },
                duration: 590,
                airplane: "Airbus A350-900",
                airline: "Delta Air Lines",
                flight_number: "DL 83",
                travel_class: "Economy",
                legroom: "31 in"
              },
              {
                departure_airport: { name: "Hartsfield-Jackson Atlanta International Airport", id: "ATL", time: `${outbound} 16:15` },
                arrival_airport: { name: "Austin-Bergstrom International Airport", id: arr.toUpperCase(), time: `${outbound} 17:35` },
                duration: 140,
                airplane: "Boeing 737-900ER",
                airline: "Delta Air Lines",
                flight_number: "DL 1928",
                travel_class: "Economy",
                legroom: "30 in"
              }
            ],
            price: 920,
            total_duration: 790,
            type: fType === "1" ? "One-way" : "Round trip",
            carbon_emissions: { this_flight: 330, typical_for_this_route: 345, difference_percent: -4 }
          }
        ],
        other_flights: [
          {
            flights: [
              {
                departure_airport: { name: "Charles de Gaulle Airport", id: dep.toUpperCase(), time: `${outbound} 13:10` },
                arrival_airport: { name: "George Bush Intercontinental Airport", id: "IAH", time: `${outbound} 17:15` },
                duration: 665,
                airplane: "Boeing 777-300ER",
                airline: "United Airlines",
                flight_number: "UA 915",
                travel_class: "Economy",
                legroom: "31 in"
              },
              {
                departure_airport: { name: "George Bush Intercontinental Airport", id: "IAH", time: `${outbound} 19:10` },
                arrival_airport: { name: "Austin-Bergstrom International Airport", id: arr.toUpperCase(), time: `${outbound} 20:05` },
                duration: 55,
                airplane: "CRJ-700",
                airline: "United Express",
                flight_number: "UA 4831",
                travel_class: "Economy",
                legroom: "30 in"
              }
            ],
            price: 1150,
            total_duration: 830,
            type: fType === "1" ? "One-way" : "Round trip"
          }
        ],
        price_insights: {
          lowest_price: 849,
          price_level: "typical",
          typical_price_range: [790, 1150]
        },
        is_demo: true,
        fallback_warning: errorContext || null
      };
    };

    try {
      const { departure_id, arrival_id, outbound_date, return_date, currency, type, customApiKey } = req.body;
      const apiKey = (customApiKey?.trim() || process.env.SERPAPI_API_KEY || "").trim();

      if (!departure_id || !arrival_id || !outbound_date) {
        return res.status(400).json({ error: "Departure airport, Arrival airport, and Outbound date are required fields." });
      }

      // Detect if key is a valid hex of length 64 (standard for SerpApi)
      const isValidHex = /^[0-9a-fA-F]{64}$/.test(apiKey);
      const isMockKey = !apiKey || 
                        !isValidHex ||
                        apiKey === "mock_serpapi_key_for_testing" || 
                        apiKey === "mock" || 
                        apiKey === "secret_api_key" || 
                        apiKey.includes("your") || 
                        apiKey === "undefined";

      if (isMockKey) {
        console.log(`[SerpApi Flights] Direct mock matched or non-hex key used. Serving high-fidelity demo routes.`);
        return res.json(getMockResponse(departure_id, arrival_id, outbound_date, return_date, currency, type));
      }

      // Prepare live search URL param query
      const params = new URLSearchParams({
        engine: "google_flights",
        departure_id: departure_id.toUpperCase(),
        arrival_id: arrival_id.toUpperCase(),
        outbound_date,
        api_key: apiKey
      });

      if (return_date) {
        params.append("return_date", return_date);
      }
      if (currency) {
        params.append("currency", currency);
      }
      if (type) {
        params.append("type", type);
      }

      const serpUrl = `https://serpapi.com/search?${params.toString()}`;
      console.log(`[SerpApi Flights] Calling SerpApi live flight search...`);

      try {
        const searchRes = await fetch(serpUrl);
        const text = await searchRes.text();
        let data: any = null;

        try {
          data = JSON.parse(text);
        } catch (e) {
          // Response is not JSON
          throw new Error(`Non-JSON response received. HTTP status: ${searchRes.status}`);
        }

        // Check if SerpApi returned an explicit status message (like Invalid API key, rate limits, unauthorized, etc.)
        if (data && data.error) {
          console.log(`[SerpApi Flights Info] Operational status fallback. Activated high-fidelity mock flights representation.`);
          // Return simulated high-fidelity routes but with the fallback warning detailed
          return res.json(getMockResponse(
            departure_id, 
            arrival_id, 
            outbound_date, 
            return_date, 
            currency, 
            type, 
            `SerpApi validation message: "${data.error}". Activated high-fidelity simulated flight layouts automatically.`
          ));
        }

        if (!searchRes.ok) {
          throw new Error(`HTTP ${searchRes.status} state reached`);
        }

        // Return real live flight data
        res.json(data);

      } catch (fetchErr: any) {
        console.log(`[SerpApi Flights Info] Connection status adjusted. Triggering high-fidelity mock fallback.`);
        return res.json(getMockResponse(
          departure_id, 
          arrival_id, 
          outbound_date, 
          return_date, 
          currency, 
          type, 
          `Unable to complete live network request: "${fetchErr.message || String(fetchErr)}". Activated high-fidelity simulated flights.`
        ));
      }

    } catch (err: any) {
      console.log("[SerpApi Flights Info] Status 500 endpoint resolution triggered.", err?.message || "");
      res.status(500).json({ error: err.message || "Failed to retrieve live flights via SerpApi." });
    }
  });

  // ==========================================
  // API ROUTE: SERPAPI WALMART SEARCH ROUTING
  // ==========================================
  app.post("/api/serpapi/walmart", async (req, res) => {
    const getMockWalmartData = (queryStr: string, errorContext?: string) => {
      const normalized = queryStr.toLowerCase();
      let organic_results = [];

      if (normalized.includes("bread")) {
        organic_results = [
          {
            title: "Great Value White Bread, 20 oz",
            link: "https://www.walmart.com/ip/Great-Value-White-Bread-20-oz/10315752",
            price: 1.42,
            thumbnail: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=200&q=80",
            rating: 4.4,
            reviews: 14820,
            seller: "Walmart.com",
            us_item_id: "10315752"
          },
          {
            title: "Nature's Own Honey Wheat Sliced Bread, 24 oz Loaf",
            link: "https://www.walmart.com/ip/Nature-s-Own-Honey-Wheat-Sliced-Bread-24-oz-Loaf/10315712",
            price: 3.28,
            thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
            rating: 4.6,
            reviews: 6412,
            seller: "Walmart.com",
            us_item_id: "10315712"
          },
          {
            title: "Sara Lee Butter Sliced White Bread, 20 oz",
            link: "https://www.walmart.com/ip/Sara-Lee-Butter-Sliced-White-Bread-20-oz/1130391",
            price: 2.87,
            thumbnail: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&q=80",
            rating: 4.5,
            reviews: 4328,
            seller: "Walmart.com",
            us_item_id: "1130391"
          },
          {
            title: "Dave's Killer Bread 21 Whole Grains Thin-Sliced Organic Bread, 20.5 oz",
            link: "https://www.walmart.com/ip/Dave-s-Killer-Bread-21-Whole-Grains-Thin-Sliced-Organic-Bread-20-5-oz/51989447",
            price: 5.98,
            thumbnail: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=200&q=80",
            rating: 4.8,
            reviews: 3209,
            seller: "Dave's Organic",
            us_item_id: "51989447"
          }
        ];
      } else if (normalized.includes("banana") || normalized.includes("fruit")) {
        organic_results = [
          {
            title: "Fresh Bananas, Bunch",
            link: "https://www.walmart.com/ip/Fresh-Bananas-Bunch/44391212",
            price: 1.58,
            thumbnail: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200&q=80",
            rating: 4.2,
            reviews: 2405,
            seller: "Walmart.com",
            us_item_id: "44391212"
          },
          {
            title: "Fresh Strawberries, 1 lb",
            link: "https://www.walmart.com/ip/Fresh-Strawberries-1-lb/10450655",
            price: 2.98,
            thumbnail: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&q=80",
            rating: 4.1,
            reviews: 1845,
            seller: "Walmart.com",
            us_item_id: "10450655"
          }
        ];
      } else if (normalized.includes("laptop") || normalized.includes("computer")) {
        organic_results = [
          {
            title: "HP 15.6 inch Laptop Intel Core i3-1215U 8GB RAM 256GB SSD",
            link: "https://www.walmart.com/ip/HP-15-6-inch-Laptop/12345678",
            price: 329.00,
            thumbnail: "https://images.unsplash.com/photo-1496181130204-755241524eab?w=200&q=80",
            rating: 4.3,
            reviews: 182,
            seller: "Walmart.com",
            us_item_id: "12345678"
          },
          {
            title: "Acer Aspire 3 15.6 inch Laptop AMD Ryzen 3 8GB RAM 128GB SSD",
            link: "https://www.walmart.com/ip/Acer-Aspire-3/87654321",
            price: 249.00,
            thumbnail: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&q=80",
            rating: 4.5,
            reviews: 95,
            seller: "Acer Depot",
            us_item_id: "87654321"
          }
        ];
      } else {
        // Generic fallback items
        organic_results = [
          {
            title: `Great Value Selected ${queryStr} Item`,
            link: "https://www.walmart.com",
            price: 4.97,
            thumbnail: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80",
            rating: 4.5,
            reviews: 1205,
            seller: "Walmart.com",
            us_item_id: "99887766"
          },
          {
            title: `Premium Choice ${queryStr} Edition`,
            link: "https://www.walmart.com",
            price: 12.99,
            thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80",
            rating: 4.7,
            reviews: 382,
            seller: "SuperSeller LLC",
            us_item_id: "44556677"
          }
        ];
      }

      return {
        search_parameters: {
          q: queryStr,
          engine: "walmart"
        },
        organic_results,
        is_demo: true,
        fallback_warning: errorContext || null
      };
    };

    try {
      const { q, query, customApiKey } = req.body;
      const queryStr = (q || query || "bread").trim();
      const apiKey = (customApiKey?.trim() || process.env.SERPAPI_API_KEY || "").trim();

      // Detect if key is a valid hex of length 64 (standard for SerpApi)
      const isValidHex = /^[0-9a-fA-F]{64}$/.test(apiKey);
      const isMockKey = !apiKey || 
                        !isValidHex ||
                        apiKey === "mock_serpapi_key_for_testing" || 
                        apiKey === "mock" || 
                        apiKey === "secret_api_key" || 
                        apiKey.includes("your") || 
                        apiKey === "undefined";

      if (isMockKey) {
        console.log(`[SerpApi Walmart] Direct mock matched or non-hex key used. Serving high-fidelity demo routes.`);
        return res.json(getMockWalmartData(queryStr));
      }

      // Prepare live search URL param query
      const params = new URLSearchParams({
        engine: "walmart",
        query: queryStr,
        api_key: apiKey
      });

      const serpUrl = `https://serpapi.com/search?${params.toString()}`;
      console.log(`[SerpApi Walmart] Calling SerpApi live Walmart search...`);

      try {
        const searchRes = await fetch(serpUrl);
        const text = await searchRes.text();
        let data: any = null;

        try {
          data = JSON.parse(text);
        } catch (e) {
          throw new Error(`Non-JSON response received. HTTP status: ${searchRes.status}`);
        }

        if (data && data.error) {
          console.log(`[SerpApi Walmart Info] Operational status fallback. Activated high-fidelity mock representation.`);
          return res.json(getMockWalmartData(
            queryStr,
            `SerpApi validation message: "${data.error}". Activated high-fidelity simulated Walmart search layouts automatically.`
          ));
        }

        if (!searchRes.ok) {
          throw new Error(`HTTP ${searchRes.status} state reached`);
        }

        res.json(data);

      } catch (fetchErr: any) {
        console.log(`[SerpApi Walmart Info] Connection status adjusted. Triggering high-fidelity mock fallback.`);
        return res.json(getMockWalmartData(
          queryStr,
          `Unable to complete live network request: "${fetchErr.message || String(fetchErr)}". Activated high-fidelity simulated Walmart details.`
        ));
      }

    } catch (err: any) {
      console.log("[SerpApi Walmart Info] Status 500 endpoint resolution triggered.", err?.message || "");
      res.status(500).json({ error: err.message || "Failed to retrieve live Walmart search via SerpApi." });
    }
  });

  // ==========================================
  // API ROUTE: SERPER GOOGLE SHOPPING ROUTING
  // ==========================================
  app.post("/api/serper/shopping", async (req, res) => {
    // Helper function to get mock shopping data
    const getMockShoppingData = (queryStr: string) => {
      const normalized = queryStr.toLowerCase();
      let products = [];

      if (normalized.includes("apple")) {
        products = [
          {
            title: "Apple iPhone 15 Pro (128 GB) - Natural Titanium",
            source: "Amazon.in",
            link: "https://www.apple.com/iphone-15-pro/",
            price: "₹1,27,990",
            rating: 4.6,
            ratingCount: 1420,
            thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=150&q=80",
            delivery: "Free delivery by Tomorrow"
          },
          {
            title: "Apple MacBook Pro M3 Chip (14-inch, 8GB Unified Memory)",
            source: "Reliance Digital",
            link: "https://www.apple.com/macbook-pro/",
            price: "₹1,59,900",
            rating: 4.8,
            ratingCount: 512,
            thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&q=80",
            delivery: "Free 2-day delivery"
          },
          {
            title: "Apple iPad Air (10.9-inch, Wi-Fi, 64GB) - Space Grey",
            source: "Tata CLiQ",
            link: "https://www.apple.com/ipad-air/",
            price: "₹54,990",
            rating: 4.5,
            ratingCount: 884,
            thumbnail: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=150&q=80",
            delivery: "Same-day pickup available"
          },
          {
            title: "Apple Watch Series 9 GPS 45mm Aluminium Case",
            source: "Croma",
            link: "https://www.apple.com/apple-watch-series-9/",
            price: "₹41,900",
            rating: 4.7,
            ratingCount: 219,
            thumbnail: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=150&q=80",
            delivery: "Free delivery"
          }
        ];
      } else if (normalized.includes("flipkart")) {
        products = [
          {
            title: "Flipkart SmartBuy Polyester Soft Double Bedsheet with 2 Pillow Covers",
            source: "Flipkart.com",
            link: "https://www.flipkart.com",
            price: "₹399",
            rating: 4.2,
            ratingCount: 23510,
            thumbnail: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=150&q=80",
            delivery: "Free delivery in 3 Days"
          },
          {
            title: "Flipkart Perfect Homes Studio Solid Wood 4 Seater Dining Set",
            source: "Flipkart Furniture",
            link: "https://www.flipkart.com",
            price: "₹14,499",
            rating: 4.5,
            ratingCount: 1402,
            thumbnail: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=150&q=80",
            delivery: "Free delivery & installation"
          },
          {
            title: "MarQ by Flipkart 7.5 kg Semi Automatic Top Load Washing Machine",
            source: "Flipkart.com",
            link: "https://www.flipkart.com",
            price: "₹7,490",
            rating: 4.3,
            ratingCount: 8520,
            thumbnail: "https://images.unsplash.com/photo-1610557892470-76d74022fa36?w=150&q=80",
            delivery: "Free delivery by Wednesday"
          },
          {
            title: "Flipkart Supermart Pure Refined Sunflower Oil 1L",
            source: "Flipkart Supermart",
            link: "https://www.flipkart.com",
            price: "₹142",
            rating: 4.4,
            ratingCount: 41250,
            thumbnail: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=150&q=80",
            delivery: "Next-day morning delivery slot"
          }
        ];
      } else if (normalized.includes("google")) {
        products = [
          {
            title: "Google Pixel 8 Pro (128 GB) - Obsidian Black",
            source: "Flipkart",
            link: "https://store.google.com/product/pixel_8_pro",
            price: "₹96,999",
            rating: 4.4,
            ratingCount: 920,
            thumbnail: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150&q=80",
            delivery: "Free delivery by Wednesday"
          },
          {
            title: "Google Pixel Watch 2 Active - Matte Black",
            source: "Amazon.in",
            link: "https://store.google.com/product/google_pixel_watch_2",
            price: "₹37,990",
            rating: 4.2,
            ratingCount: 180,
            thumbnail: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=150&q=80",
            delivery: "Free shipping"
          },
          {
            title: "Google Nest Hub (2nd Gen) Smart Display with Assistant",
            source: "Reliance Digital",
            link: "https://store.google.com/product/nest_hub_2nd_gen",
            price: "₹6,999",
            rating: 4.5,
            ratingCount: 3105,
            thumbnail: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=150&q=80",
            delivery: "Express Courier available"
          },
          {
            title: "Google Pixel Buds Pro Noise Cancelling Earbuds",
            source: "Tata CLiQ Luxury",
            link: "https://store.google.com/product/pixel_buds_pro",
            price: "₹18,990",
            rating: 4.3,
            ratingCount: 654,
            thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=150&q=80",
            delivery: "Free shipping by tomorrow"
          }
        ];
      } else if (normalized.includes("tesla")) {
        products = [
          {
            title: "Official Tesla Model 3 1:18 Scale Precision Diecast Model",
            source: "Tesla Shop Official",
            link: "https://shop.tesla.com/",
            price: "₹21,500",
            rating: 4.9,
            ratingCount: 88,
            thumbnail: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=150&q=80",
            delivery: "Import duty and regional shipping included"
          },
          {
            title: "Tesla Cybercooler Insulated Premium Steel Cooler Box",
            source: "Tesla Lifestyle Store",
            link: "https://shop.tesla.com/",
            price: "₹18,200",
            rating: 4.4,
            ratingCount: 42,
            thumbnail: "https://images.unsplash.com/photo-1533630814853-4bf01053b51b?w=150&q=80",
            delivery: "Free shipping"
          },
          {
            title: "Tesla Gen 3 Wall Connector Smart EV Charger (22kW)",
            source: "EV Hub Direct",
            link: "https://shop.tesla.com/",
            price: "₹45,000",
            rating: 4.8,
            ratingCount: 612,
            thumbnail: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=150&q=80",
            delivery: "Free shipping with 2yr warranty"
          },
          {
            title: "Premium Tesla Cyberwhistle Stainless Steel Collector's Edition",
            source: "eBay Select Dealers",
            link: "https://shop.tesla.com/",
            price: "₹8,500",
            rating: 4.7,
            ratingCount: 156,
            thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&q=80",
            delivery: "Ships from USA"
          }
        ];
      } else {
        // Generic fallback generator
        const capitalized = queryStr.charAt(0).toUpperCase() + queryStr.slice(1);
        products = [
          {
            title: `Premium Series ${capitalized} Pro Pack`,
            source: "Global Outlet",
            link: "https://google.com/search?q=" + encodeURIComponent(queryStr),
            price: "₹14,999",
            rating: 4.5,
            ratingCount: 94,
            thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&q=80",
            delivery: "Free standard delivery"
          },
          {
            title: `Elite ${capitalized} Signature Design Edition`,
            source: "Direct Store",
            link: "https://google.com/search?q=" + encodeURIComponent(queryStr),
            price: "₹29,500",
            rating: 4.7,
            ratingCount: 31,
            thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&q=80",
            delivery: "Free priority dispatch"
          }
        ];
      }

      return {
        searchParameters: {
          q: queryStr,
          engine: "shopping"
        },
        shopping: products,
        is_demo: true
      };
    };

    try {
      const { queries, gl, customApiKey } = req.body;
      const apiKey = (customApiKey?.trim() || process.env.SERPER_API_KEY || "").trim();

      // Determine query payload format
      let searchPayload: any[] = [];
      if (Array.isArray(queries)) {
        searchPayload = queries.map((qItem: any) => {
          if (typeof qItem === "string") {
            return { q: qItem, gl: gl || "in", num: 40 };
          }
          return { q: qItem.q, gl: qItem.gl || gl || "in", num: qItem.num || 40 };
        });
      } else if (typeof queries === "string" && queries.trim()) {
        searchPayload = [{ q: queries.trim(), gl: gl || "in", num: 40 }];
      } else {
        // Default payload to fallback as sent in example
        searchPayload = [
          { q: "apple inc", gl: gl || "in", num: 40 },
          { q: "google inc", gl: gl || "in", num: 40 },
          { q: "tesla inc", gl: gl || "in", num: 40 }
        ];
      }

      const serperKeyValid = apiKey && apiKey.length >= 24 && !apiKey.startsWith("key_GLk") && apiKey !== "mock" && apiKey !== "undefined";

      if (!serperKeyValid) {
        console.log(`[Serper Shopping] No production Serper API Key loaded. Generating high-fidelity demo fallback lists.`);
        const mockResponses = searchPayload.map(item => getMockShoppingData(item.q));
        return res.json(mockResponses);
      }

      console.log(`[Serper Shopping] Forwarding ${searchPayload.length} multi-query search entries to Google Serper Shopping API...`);

      // Query serper shopping endpoint using standard Serper.dev schema
      const resDataList: any[] = [];
      for (const item of searchPayload) {
        try {
          const serperRes = await fetch("https://google.serper.dev/shopping", {
            method: "POST",
            headers: {
              "X-API-KEY": apiKey,
              "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
          });

          if (serperRes.ok) {
            const raw = await serperRes.json();
            resDataList.push({
              searchParameters: { q: item.q, gl: item.gl },
              shopping: raw.shopping || [],
              is_demo: false
            });
          } else {
            const errText = await serperRes.text();
            console.error(`[Serper Shopping Item Query Error]:`, errText);
            resDataList.push({
              ...getMockShoppingData(item.q),
              fallback_warning: `Operational error (HTTP ${serperRes.status}). Served simulated shopping comparison dataset.`
            });
          }
        } catch (itemErr: any) {
          console.error(`[Serper Shopping Network Error]:`, itemErr.message || itemErr);
          resDataList.push({
            ...getMockShoppingData(item.q),
            fallback_warning: `Connection issue: "${itemErr.message}". Served simulated shopping dataset.`
          });
        }
      }

      res.json(resDataList);

    } catch (err: any) {
      console.error("[Serper Shopping Endpoint Fatal]:", err);
      res.status(500).json({ error: err.message || "Failed to query Serper.dev Google Shopping API." });
    }
  });

  // ==========================================
  // API ROUTE: SERPER GOOGLE IMAGES ROUTING
  // ==========================================
  app.post("/api/serper/images", async (req, res) => {
    // Helper function to get mock image data
    const getMockImageData = (queryStr: string) => {
      const normalized = queryStr.toLowerCase();
      let imgList = [];

      if (normalized.includes("apple")) {
        imgList = [
          {
            title: "Apple Inc. - Wikipedia",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
            imageWidth: 814,
            imageHeight: 1000,
            thumbnailUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=210&q=80",
            thumbnailWidth: 202,
            thumbnailHeight: 249,
            source: "Wikipedia",
            domain: "en.wikipedia.org",
            link: "https://en.wikipedia.org/wiki/Apple_Inc.",
            position: 1
          },
          {
            title: "Apple Inc. | History, Products, Headquarters, & Facts | Britannica Money",
            imageUrl: "https://cdn.britannica.com/46/253846-159-EC68698D/New-York-NY-USA-July-9-2022-Apple-logo-is-seen-at-the-Apple-flagship-store-on-the-5th-Avenue-in-NYC.jpg?w=385",
            imageWidth: 385,
            imageHeight: 257,
            thumbnailUrl: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=210&q=80",
            thumbnailWidth: 275,
            thumbnailHeight: 183,
            source: "Britannica",
            domain: "www.britannica.com",
            link: "https://www.britannica.com/money/Apple-Inc",
            position: 2
          },
          {
            title: "Apple's Journey to Becoming a Global Tech Leader",
            imageUrl: "https://www.investopedia.com/thmb/zSP1TkVLKaAtO915BfHhLYLsxMQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-1445281649-9065b16ef7984345baf79affbde0e0ee.jpg",
            imageWidth: 1500,
            imageHeight: 1000,
            thumbnailUrl: "https://images.unsplash.com/photo-1491933300454-d10ee65f289d?w=210&q=80",
            thumbnailWidth: 275,
            thumbnailHeight: 183,
            source: "Investopedia",
            domain: "www.investopedia.com",
            link: "https://www.investopedia.com/articles/personal-finance/042815/story-behind-apples-success.asp",
            position: 3
          },
          {
            title: "Apple Inc. | Malls and Retail Wiki | Fandom",
            imageUrl: "https://static.wikia.nocookie.net/malls/images/c/c0/Apple_Logo1.png/revision/latest?cb=20230508144916",
            imageWidth: 3840,
            imageHeight: 2160,
            thumbnailUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=210&q=80",
            thumbnailWidth: 300,
            thumbnailHeight: 168,
            source: "Malls and Retail Wiki - Fandom",
            domain: "malls.fandom.com",
            link: "https://malls.fandom.com/wiki/Apple_Inc.",
            position: 4
          }
        ];
      } else if (normalized.includes("google")) {
        imgList = [
          {
            title: "Googleplex Mountain View Corporate Headquarters",
            imageUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Googleplex_HQ_Mountain_View.jpg",
            imageWidth: 1200,
            imageHeight: 900,
            thumbnailUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=210&q=80",
            thumbnailWidth: 280,
            thumbnailHeight: 210,
            source: "Wikipedia",
            domain: "en.wikipedia.org",
            link: "https://en.wikipedia.org/wiki/Googleplex",
            position: 1
          },
          {
            title: "Google LLC - Tech & Consumer Brand History",
            imageUrl: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=800&q=80",
            imageWidth: 800,
            imageHeight: 533,
            thumbnailUrl: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=210&q=80",
            thumbnailWidth: 275,
            thumbnailHeight: 183,
            source: "Unsplash Photos",
            domain: "unsplash.com",
            link: "https://unsplash.com/photos/google-assistant-hub-x69V_Epyw3A",
            position: 2
          },
          {
            title: "Google Pixel Devices Lineup Showcase",
            imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
            imageWidth: 800,
            imageHeight: 600,
            thumbnailUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=210&q=80",
            thumbnailWidth: 266,
            thumbnailHeight: 200,
            source: "Pixel Specs",
            domain: "unsplash.com",
            link: "https://unsplash.com/photos/pixel-phone",
            position: 3
          }
        ];
      } else if (normalized.includes("tesla")) {
        imgList = [
          {
            title: "Tesla Model S Plaid High-Performance EV",
            imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80",
            imageWidth: 800,
            imageHeight: 533,
            thumbnailUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=210&q=80",
            thumbnailWidth: 275,
            thumbnailHeight: 183,
            source: "Unsplash Motors",
            domain: "unsplash.com",
            link: "https://unsplash.com/photos/tesla-model-s-parked",
            position: 1
          },
          {
            title: "Tesla Cybertruck Futuristic Design Aesthetics",
            imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80",
            imageWidth: 800,
            imageHeight: 533,
            thumbnailUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=210&q=80",
            thumbnailWidth: 275,
            thumbnailHeight: 183,
            source: "EV Tech Watch",
            domain: "unsplash.com",
            link: "https://unsplash.com/photos/tesla-supercharger-station",
            position: 2
          }
        ];
      } else {
        // Generic fallback generator
        const capitalized = queryStr.charAt(0).toUpperCase() + queryStr.slice(1);
        imgList = [
          {
            title: `${capitalized} Innovative Concepts Gallery`,
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
            imageWidth: 800,
            imageHeight: 533,
            thumbnailUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=210&q=80",
            thumbnailWidth: 275,
            thumbnailHeight: 183,
            source: "Design Network",
            domain: "unsplash.com",
            link: "https://unsplash.com/photos/headphones-closeup",
            position: 1
          },
          {
            title: `${capitalized} Modern Design Showcase`,
            imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
            imageWidth: 800,
            imageHeight: 533,
            thumbnailUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=210&q=80",
            thumbnailWidth: 275,
            thumbnailHeight: 183,
            source: "Creative Labs",
            domain: "unsplash.com",
            link: "https://unsplash.com/photos/white-minimalist-watch",
            position: 2
          }
        ];
      }

      return {
        searchParameters: {
          q: queryStr,
          type: "images",
          engine: "google"
        },
        images: imgList,
        is_demo: true
      };
    };

    try {
      const { q, num, gl, customApiKey } = req.body;
      const queryStr = (q || "apple inc").trim();
      const numResults = num || 10;
      const geoRegion = gl || "us";
      const apiKey = (customApiKey?.trim() || process.env.SERPER_API_KEY || "").trim();

      const serperKeyValid = apiKey && apiKey.length >= 24 && !apiKey.startsWith("key_GLk") && apiKey !== "mock" && apiKey !== "undefined";

      if (!serperKeyValid) {
        console.log(`[Serper Images] No production Serper API Key configured. Yielding high-fidelity mock image database.`);
        return res.json(getMockImageData(queryStr));
      }

      console.log(`[Serper Images] Querying Google Serper Images key pipeline for: "${queryStr}"`);

      const serperRes = await fetch("https://google.serper.dev/images", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: queryStr,
          num: numResults,
          gl: geoRegion
        })
      });

      if (serperRes.ok) {
        const raw = await serperRes.json();
        return res.json({
          searchParameters: {
            q: queryStr,
            type: "images",
            engine: "google",
            num: numResults
          },
          images: raw.images || [],
          is_demo: false
        });
      } else {
        const errText = await serperRes.text();
        console.error(`[Serper Images Error]:`, errText);
        return res.json({
          ...getMockImageData(queryStr),
          fallback_warning: `Operational fallback (HTTP ${serperRes.status}). Displaying stunning high-fidelity simulated assets.`
        });
      }

    } catch (err: any) {
      console.error("[Serper Images Endpoint Fatal Error]:", err);
      res.status(500).json({ error: err.message || "Failed to retrieve live images via Serper API." });
    }
  });
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // In dev mode, attach the Vite dev server to Express as intermediate middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve compiled static JS/CSS from the 'dist' build directory
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NextGenAi Engine] Fullstack server booted on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
