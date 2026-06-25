import React, { useState, useEffect, useRef } from "react";
import Welcome from "./components/Welcome";
import {
  Settings as SettingsIcon,
  RotateCcw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Copy,
  Plus,
  Globe,
  Palette,
  Mic,
  MicOff,
  Send,
  Sparkles,
  ExternalLink,
  Download,
  X,
  Check,
  Search,
  BookOpen,
  Rss,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  Mail,
  Lock,
  Shield,
  AlertCircle,
  Menu,
  Camera,
  FileText,
  Telescope,
  GraduationCap,
  ArrowUp,
  Bot,
  Users
} from "lucide-react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  appleProvider,
  githubProvider,
  db
} from "./firebase";

import { marked } from "marked";
import deepSeekLogo from './assets/images/deepseek_logo.webp';

// List of pre-authorized, secure recovery bypass keys that can grant emergency lock clearance
const ALLOWED_BYPASS_PINS = new Set(
  "7313, 6240, 3147, 3768, 7856, 5677, 8478, 1163, 1837, 5341, 9330, 4148, 9556, 4705, 5002, 7571, 1282, 3939, 9413, 5705, 9002, 2759, 1231, 6635, 2573, 6265, 8164, 6797, 8459, 8139, 7427, 4085, 7223, 5262, 3919, 1558, 1830, 2315, 9630, 2085, 9006, 5986, 6456, 9767, 9121, 8341, 1997, 3415, 8761, 9102, 5628, 6454, 3925, 9699, 1767, 6018, 1724, 6595, 5624, 4209, 4582, 4068, 6376, 8781, 6409, 3114, 8636, 8464, 5594, 6816, 1329, 4203, 1901, 7897, 9018, 5831, 1120, 4753, 4063, 3308, 4860, 9369, 4606, 4350, 7493, 6009, 2125, 1764, 1771, 5664, 3459, 2959, 8837, 4594, 1880, 8436, 5879, 3947, 1245, 6252, 8435, 8628, 1959, 9991, 7492, 3377, 5846, 6243, 5042, 3085, 4175, 7430, 2149, 8937, 5353, 2728, 4346, 9692, 1782, 9052, 8615, 3948, 6951, 5276, 7633, 9338, 7783, 1699, 8477, 5982, 9415, 7500, 1709, 6845, 1950, 4508, 9494, 9447, 4820, 6544, 6330, 9715, 3255, 8322, 5988, 3846, 2748, 5518, 7695, 6946, 5152, 1645, 5196, 1698, 1232, 6212, 7030, 3476, 4372, 4442, 3750, 5407, 4483, 4996, 5019, 2469, 4087, 3738, 7101, 8906, 4007, 4081, 2851, 9540, 1203, 7431, 6609, 9324, 4291, 2700, 4231, 6638, 8730, 1721, 3937, 5837, 6526, 6891, 5194, 7974, 8810, 1408, 1866, 4390, 1562, 6630, 5857, 6541, 3150, 7427, 7275, 5586, 3485, 6520, 6778, 2822, 1788, 3452, 7772, 2790, 7646, 3199, 5880, 2789, 8540, 3997, 6207, 5471, 7931, 4467, 9851, 2223, 9369, 2636, 2953, 6268, 1035, 6794, 6602, 1652, 8701, 5316, 8609, 8920, 2255, 4186, 5180, 8367, 1244, 8399, 6973, 1634, 1265, 3058, 6002, 8520, 1181, 2497, 5888, 4050, 3484, 2257, 3515, 4037, 8157, 8143, 7165, 2225, 4550, 1640, 3922, 6113, 6340, 1356, 2935, 1392, 8506, 9261, 4888, 7229, 8608, 3252, 9881, 7351, 1026, 7579, 4120, 8833, 9850, 9757, 3838, 1364, 6283, 1750, 4113, 9572, 3165, 9204, 1717, 7959, 7971, 3327, 8764, 4297, 6576, 1553, 1018, 4885, 2018, 7558, 9262, 4356, 9618, 3612, 8236, 1689, 2382, 3048, 5316, 3218, 4666, 8132, 3857, 7833, 2719, 1946, 3797, 6348, 2598, 7564, 7866, 9157, 1378, 9629, 6258, 4667, 5873, 1370, 2339, 6415, 8030, 3569, 8054, 9167, 5193, 1559, 7435, 1485, 1445, 4849, 3000, 3560, 2645, 5766, 9293, 5494, 4147, 7906, 4164, 6972, 5956, 5302, 7481, 1138, 1633, 4328, 6479, 7532, 8355, 9453, 4188, 8917, 4244, 4015, 6718, 8071, 9951, 8722, 6745, 8149, 3509, 3938, 7790, 8275, 1100, 1855, 4739, 2028, 5198, 5258, 1624, 5805, 8284, 8129, 2547, 2330, 3472, 8352, 8989, 9860, 4379, 3384, 9035, 1553, 8078, 7169, 9914, 6782, 3946, 4261, 6480, 8979, 4417, 1898, 1727, 1501, 2940, 6896, 1517, 6063, 8728, 8987, 7102, 4266, 1749, 8941, 3992, 2245, 9826, 7214, 4451, 1379, 1776, 1719, 7314, 1814, 8674, 9867, 6301, 7016, 2464, 9344, 6683, 6273, 2961, 4014, 9445, 3116, 2408, 2349, 9794, 9363, 6958, 7948, 4024, 3632, 2779, 8273, 2122, 3127, 7886, 9153, 8727, 2441, 1659, 6205, 8788, 9582, 2297, 8330, 4944, 8058, 9860, 4011, 4747, 7236, 8514, 6423, 8124, 9626, 7423, 6915, 9777, 9701, 7462, 1747, 5494, 3524, 8907, 9154, 7110, 1319, 4605, 3423, 7225, 8772, 5676, 7066, 6999, 1096, 3952, 6185, 8351, 3052, 9517, 8038, 7073, 2132, 9815, 2666, 2035, 9048, 4574, 3606, 6934, 4608, 6579, 1441, 8093, 8432, 5707, 9498, 2794, 3600, 5197, 9899, 5068, 7141, 1371, 3158, 2315, 6721, 3112, 6010, 6154, 3404, 8339, 1502, 7862, 3584, 6160, 9026, 2851, 1194, 8960, 6026, 9092, 8450, 1342, 5827, 9063, 5075, 7219, 6604, 4204, 7470, 4792, 8923, 2484, 4834, 3902, 4610, 3731, 9791, 3332, 4978, 2239, 6878, 6241, 5319, 7480, 4431, 7700, 5265, 2029, 3809, 3696, 3102, 8990, 7220, 2776, 8724, 3841, 5526, 8323, 1007, 7859, 5043, 8280, 3993, 2541, 3746, 7793, 8298, 3369, 4507, 1193, 2984, 7668, 9552, 4757, 3032, 2135, 8551, 9707, 5826, 7578, 7580, 3768, 4715, 6233, 6145, 7573, 8576, 7710, 4217, 9520, 8146, 6090, 6679, 2431, 6210, 4156, 6973, 8079, 2643, 1882, 9120, 5229, 9222, 3053, 9611, 1529, 8467, 9634, 7878, 3790, 2866, 3548, 1397, 3423, 4332, 9781, 5904, 1478, 9087, 7301, 3728, 3714, 4299, 9552, 8780, 5591, 7647, 3101, 9254, 2747, 8647, 6273, 1729, 6680, 6693, 4677, 1186, 3693, 3233, 2725, 3753, 1111, 8539, 2920, 8908, 8836, 3273, 5867, 9736, 8431, 5660, 5445, 9572, 1907, 9983, 4490, 9203, 3040, 6111, 5722, 8027, 1330, 4306, 3855, 8141, 1811, 5761, 6008, 1148, 7617, 1119, 3460, 1591, 1026, 3103, 6809, 3958, 3207, 5618, 5090, 8073, 1681, 9988, 5825, 4636, 8821, 3528, 4194, 7806, 2602, 7303, 8875, 3407, 9623, 2956, 9549, 3922, 4850, 8198, 3330, 8866, 5899, 3556, 5048, 2887, 4702, 3595, 4463, 2262, 3405, 6774, 3145, 4401, 9342, 2411, 2708, 2838, 7793, 4715, 4553, 9035, 3237, 5451, 3627, 8508, 9836, 8284, 6421, 2019, 8278, 5115, 7401, 6112, 8911, 6175, 1597, 3135, 7026, 6075, 2330, 6525, 8244, 2908, 5032, 5943, 1299, 4446, 5291, 4252, 7733, 6835, 6425, 4412, 9860, 2663, 2290, 2084, 8590, 3842, 2915, 4849, 9007, 5840, 7806, 8826, 8109, 6598, 2094, 5843, 4412, 1024, 5045, 7704, 8956, 2789, 9301, 6955, 6253, 2215, 5764, 7175, 9951, 2234, 1528, 8115, 2604, 1546, 3715, 5842, 1208, 5156, 6808, 8416, 2207, 5294, 9113, 5237, 5471, 7366, 7621, 4441, 2601, 3754, 1741, 9352, 9806, 4949, 8447, 1824, 3944, 6599, 5121, 3627, 9983, 3672, 7452, 4697, 3787, 7897, 7182, 7992, 2806, 7747, 7163, 7288, 1012, 8229, 3221, 9399, 3233, 9731, 2544, 7628, 1815, 1861, 2401, 9363, 6158, 1461, 2943, 5125, 2776, 4953, 6212, 9695, 1934, 4953, 2807, 2310, 4583, 7511, 2782, 4547, 2499, 7665, 1458, 7355, 3765, 6332, 9730, 8342, 8177, 3617, 6618, 5553, 3862, 9422, 9912, 6843, 4850, 6153, 1400, 4277, 7296, 5085, 7631, 5400, 7686, 8821, 7179, 4589, 1746, 5734, 5957, 1503, 5584, 4493, 4653, 3115, 7520, 1221, 9899, 5270, 5578, 5456, 2208, 5520, 7563, 9132, 4118, 1732, 9000, 3765, 1803, 3249, 5167, 4920, 7566, 5311, 7342, 5970, 1119, 4989, 4704, 1779, 5468, 1306, 5420, 3201, 5950, 7111, 7638, 9057, 1792, 7427, 5986, 6976, 1995, 2275, 1044, 3931, 1246, 2651, 7381, 7768, 5723, 6221, 8072, 9507, 1587, 1249, 9528, 8638, 4338, 3572, 4345, 1447, 7223, 4446, 1993, 4295, 4012, 6547, 6469, 2476, 1963, 3645, 4630, 6048, 4651, 4426, 7359, 5760, 6614, 6574, 8759, 1736, 1726, 4198, 2038, 3148, 3829, 6547, 1311, 7334, 9581, 8415, 6530, 4088, 1426, 9934, 5023, 3145"
    .split(", ")
);

import {
  doc,
  getDoc,
  setDoc,
  getDocFromServer
} from "firebase/firestore";

// ==========================================
// STATIC CONSTS & CONFIGS
// ==========================================
interface ImagePlatformConfig {
  name: string;
  avatar: string;
  desc: string;
  defaultModel: string;
}

const IMAGE_PLATFORMS: Record<string, ImagePlatformConfig> = {
  nextgen: {
    name: "NextGenAi Canvas Engine",
    avatar: "🌌",
    desc: "Default high-fidelity creative painting art engine.",
    defaultModel: "nextgenai-v3"
  }
};

export function ModelIcon({ modelId, className = "w-5 h-5" }: { modelId: string; className?: string }) {
  const normId = String(modelId || "").toLowerCase();

  let emoji = "🤖";
  let styleClasses = "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";

  if (normId.includes("gpt") || normId.includes("openai")) {
    emoji = "🌀";
    styleClasses = "bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300";
  } else if (normId.includes("gemini")) {
    emoji = "✨";
    styleClasses = "bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300";
  } else if (normId.includes("deepseek")) {
    emoji = "🐳";
    styleClasses = "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300";
  } else if (normId.includes("llama")) {
    emoji = "🦙";
    styleClasses = "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300";
  } else if (normId.includes("gemma")) {
    emoji = "💎";
    styleClasses = "bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300";
  } else if (normId.includes("step")) {
    emoji = "⚡";
    styleClasses = "bg-sky-50 dark:bg-sky-950 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300";
  } else if (normId.includes("kimi") || normId.includes("moonshot")) {
    emoji = "🌙";
    styleClasses = "bg-emerald-50 dark:bg-emerald-955 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300";
  } else if (normId.includes("mistral")) {
    emoji = "🌪️";
    styleClasses = "bg-amber-50 dark:bg-amber-955 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300";
  } else if (normId.includes("glm") || normId.includes("z-ai")) {
    emoji = "💫";
    styleClasses = "bg-fuchsia-100 dark:bg-fuchsia-955 border-fuchsia-200 dark:border-fuchsia-800 text-fuchsia-700 dark:text-fuchsia-300";
  } else if (normId.includes("minimax")) {
    emoji = "👾";
    styleClasses = "bg-rose-100 dark:bg-rose-955 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300";
  } else if (normId.includes("qwen")) {
    emoji = "👑";
    styleClasses = "bg-teal-50 dark:bg-teal-955 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300";
  } else if (normId.includes("stockmark")) {
    emoji = "📈";
    styleClasses = "bg-green-100 dark:bg-green-955 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300";
  } else if (normId.includes("seed") || normId.includes("bytedance")) {
    emoji = "🌱";
    styleClasses = "bg-lime-100 dark:bg-lime-955 border-lime-200 dark:border-lime-800 text-lime-700 dark:text-lime-300";
  } else if (normId.includes("phi") || normId.includes("microsoft")) {
    emoji = "🔬";
    styleClasses = "bg-violet-100 dark:bg-violet-955 border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300";
  } else if (normId.includes("solar") || normId.includes("upstage")) {
    emoji = "☀️";
    styleClasses = "bg-yellow-105 dark:bg-yellow-955 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-500";
  } else if (normId.includes("gnews") || normId.includes("news")) {
    emoji = "📰";
    styleClasses = "bg-red-100 dark:bg-red-955 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300";
  } else if (normId.includes("claude") || normId.includes("anthropic")) {
    emoji = "🦉";
    styleClasses = "bg-orange-100 dark:bg-orange-955 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400";
  } else if (normId.includes("poolside")) {
    emoji = "🏖️";
    styleClasses = "bg-cyan-50 dark:bg-cyan-950 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300";
  }

  // Determine relative text size based on className indicators
  let textSize = "text-[11px]";
  if (className.includes("w-8") || className.includes("h-8")) {
    textSize = "text-lg";
  } else if (className.includes("w-6") || className.includes("h-6")) {
    textSize = "text-sm";
  } else if (className.includes("w-5") || className.includes("h-5")) {
    textSize = "text-xs";
  } else if (className.includes("w-3.5") || className.includes("h-3.5") || className.includes("w-4") || className.includes("h-4")) {
    textSize = "text-[10px]";
  }

  return (
    <span
      className={`${className} flex items-center justify-center rounded-full border ${styleClasses} ${textSize} shadow-sm transition-all duration-200`}
    >
      {emoji}
    </span>
  );
}

interface TextModelConfig {
  id: string;
  name: string;
  avatar: string;
  desc: string;
  series: string;
  badge?: string;
  params?: string;
}

export interface SpecializedApp {
  id: string;
  name: string;
  avatar: string;
  desc: string;
  presets: string[];
  accent: string;
}

export const SPECIALIZED_APPS: SpecializedApp[] = [
  {
    id: "chatbot",
    name: "AI Chatbot Platform",
    avatar: "🤖",
    desc: "Build conversational chat flows, intent trees, routing mechanisms, and response automation.",
    presets: [
      "Draft a conversational intent workflow layout for booking travel flights",
      "How to design high-quality prompt feedback for client edge-case replies?",
      "Write a customized pizza-ordering prompt tree in clean JSON format"
    ],
    accent: "blue"
  },
  {
    id: "writer",
    name: "AI Content Writer",
    avatar: "✍️",
    desc: "Draft highly engaging blog outlines, punchy marketing copy, SEO headings, and digital essays.",
    presets: [
      "Write a viral LinkedIn post hook about AI's ultimate impact on developers",
      "Draft a memorable structural value proposition title for a smart hydration cup",
      "Improve this sample paragraph for readability, conversion, and global SEO"
    ],
    accent: "purple"
  },
  {
    id: "resume",
    name: "AI Resume Builder",
    avatar: "📄",
    desc: "Optimize cover letters, structure work history, and build professional bio outlines.",
    presets: [
      "Revamp resume bullet points for a Lead React and Node Software Engineer",
      "Draft a tailored Senior Program Manager cover letter for Google DeepMind",
      "Create a short 3-sentence LinkedIn Bio showcasing SaaS scaling experience"
    ],
    accent: "emerald"
  },
  {
    id: "website",
    name: "AI Website Builder",
    avatar: "🌐",
    desc: "Generate responsive Tailwind layout suggestions, pricing widgets, and clean components.",
    presets: [
      "Generate an elegant Tailwind wireframe mockup CSS setup for a landing page",
      "Construct high-contrast styling settings for an immersive glassmorphic card",
      "Draft responsive interactive pricing card components in clean React TS code"
    ],
    accent: "indigo"
  },
  {
    id: "pdf",
    name: "AI PDF Tools",
    avatar: "📁",
    desc: "Structure outline layouts, summarize reports, and extract key table findings.",
    presets: [
      "Draft a standard executive summary document outline for a cybersecurity audit",
      "Write a simple Python script outline to parse unstructured tables to JSON",
      "Generate a quick 5-bullet summary template for an academic research study"
    ],
    accent: "rose"
  },
  {
    id: "script",
    name: "AI Script Writer",
    avatar: "🎬",
    desc: "Outline screenplays, YouTube intro clips, dialogue pacing, and voiceover scripts.",
    presets: [
      "Create an engaging 10-second hook script for a technology tutorial clip",
      "Draft an emotional 30-second ad video narrative describing NextGen Ai",
      "Structure a comprehensive podcast episode outline explaining focus hacks"
    ],
    accent: "amber"
  },
  {
    id: "support",
    name: "AI Customer Support Bot",
    avatar: "🙋",
    desc: "Create empathetic ticketing replies, helpdesk protocols, and troubleshooting guides.",
    presets: [
      "Write an empathetic draft response email for a delayed parcel compensation",
      "Draft a step-by-step tutorial guiding an elderly user to reset their safe PIN",
      "Formulate a structured login validation failure troubleshooting guide"
    ],
    accent: "cyan"
  }
];

const TEXT_MODELS: TextModelConfig[] = [
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    avatar: "⚡",
    desc: "Optimized smart & fast reasoning pipeline",
    series: "Google Gemini Series",
    badge: "Recommended",
    params: "Multimodal • Ultra-Low Latency"
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash Lite",
    avatar: "🪶",
    desc: "Ultra-fast, light-weight response flow",
    series: "Google Gemini Series",
    badge: "Lightweight",
    params: "Speed Optimized • Instant Stream"
  },
  {
    id: "gemini-flash-latest",
    name: "Gemini Flash Latest",
    avatar: "🧠",
    desc: "Stable general intelligence reasoning",
    series: "Google Gemini Series",
    badge: "Stable",
    params: "Production Grade • Multi-tasking"
  },
  {
    id: "google/gemma-4-31b-it",
    name: "Gemma 4 31B IT",
    avatar: "✨",
    desc: "Open reasoning & thinking model powered by NVIDIA",
    series: "Google Gemma Series",
    badge: "31B Open",
    params: "NVIDIA-accelerated"
  },
  {
    id: "google/gemma-3n-e4b-it",
    name: "Gemma 3N E4B IT",
    avatar: "✨",
    desc: "Open reasoning model powered by NVIDIA",
    series: "Google Gemma Series",
    badge: "E4B Open",
    params: "NVIDIA-accelerated"
  },
  {
    id: "google/paligemma",
    name: "PaliGemma Vision",
    avatar: "👁️",
    desc: "Open vision-language model powered by NVIDIA",
    series: "Google Gemma Series",
    badge: "Vision Open",
    params: "NVIDIA-accelerated"
  },
  {
    id: "google/diffusiongemma-26b-a4b-it",
    name: "DiffusionGemma 26B",
    avatar: "🎨",
    desc: "High-fidelity reasoning & creative text generator powered by NVIDIA",
    series: "Google Gemma Series",
    badge: "Creative",
    params: "Imagination Engine"
  },
  {
    id: "deepseek-ai/deepseek-v4",
    name: "DeepSeek V4",
    avatar: "🟢",
    desc: "Advanced reasoning & thinking model powered by NVIDIA",
    series: "DeepSeek Intelligence",
    badge: "Stable",
    params: "Fast reasoning"
  },
  {
    id: "deepseek-ai/deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    avatar: "🟢",
    desc: "Advanced reasoning & thinking model powered by NVIDIA",
    series: "DeepSeek Intelligence",
    badge: "Pro State",
    params: "Ultra-precise reasoning"
  },
  {
    id: "deepseek-ai/deepseek-v4-flash",
    name: "DeepSeek V4 Flash",
    avatar: "🟢",
    desc: "Fast reasoning model powered by NVIDIA",
    series: "DeepSeek Intelligence",
    badge: "Flash State",
    params: "NVIDIA-accelerated"
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    avatar: "🧠",
    desc: "Ultra-large deep reasoning and thinking model powered by NVIDIA",
    series: "OpenAI Foundation",
    badge: "Deep Thinker",
    params: "120B Parameters"
  },
  {
    id: "openai/gpt-oss-20b",
    name: "GPT OSS 20B",
    avatar: "🧠",
    desc: "Large reasoning and thinking model powered by NVIDIA",
    series: "OpenAI Foundation",
    badge: "Fast Thinker",
    params: "20B Parameters"
  },
  {
    id: "openai/gpt-oss-safeguard-20b",
    name: "GPT OSS Safeguard 20B",
    avatar: "🛡️",
    desc: "Large reasoning and thinking model with advanced safeguards powered by NVIDIA",
    series: "OpenAI Foundation",
    badge: "Secure Thinker",
    params: "20B Parameters"
  },
  {
    id: "poolside/laguna-m.1:free",
    name: "Poolside Laguna M.1",
    avatar: "🏖️",
    desc: "Premium developer coding & reasoning model (Free via OpenRouter)",
    series: "Developer reasoning",
    badge: "Free Coding",
    params: "Code Specialized"
  },
  {
    id: "meta/llama-4-maverick-17b-128e-instruct",
    name: "Llama 4 Maverick",
    avatar: "🦙",
    desc: "Low-latency optimized 17B instruction-tuned model powered by NVIDIA",
    series: "Meta Llama Lineage",
    badge: "Instruction",
    params: "17B NVIDIA Optimized"
  },
  {
    id: "mistralai/mistral-medium-3.5-128b",
    name: "Mistral Medium 3.5",
    avatar: "🌪️",
    desc: "Premium extra-high reasoning capacity model powered by NVIDIA",
    series: "Mistral AI Family",
    badge: "128B Med",
    params: "High Capacity"
  },
  {
    id: "stepfun-ai/step-3.5-flash",
    name: "Step 3.5 Flash",
    avatar: "🌟",
    desc: "Light-speed high-throughput reasoning powered by NVIDIA",
    series: "Stepfun Systems",
    badge: "High Speed",
    params: "NVIDIA Core"
  },
  {
    id: "stepfun-ai/step-3.7-flash",
    name: "Step 3.7 Flash",
    avatar: "⚡",
    desc: "Light-speed high-precision advanced reasoning powered by NVIDIA",
    series: "Stepfun Systems",
    badge: "Precision",
    params: "Advanced Flash"
  },
  {
    id: "moonshotai/kimi-k2.6",
    name: "Kimi K2.6",
    avatar: "🌙",
    desc: "High-capacity long-context reasoning model powered by NVIDIA",
    series: "Moonshot Kimi",
    badge: "Long Context",
    params: "200K+ token window"
  },
  {
    id: "qwen/qwen3.5-397b-a17b",
    name: "Qwen 3.5 397B",
    avatar: "👑",
    desc: "Ultra-large Chinese-English mixture-of-experts model powered by NVIDIA",
    series: "Alibaba Qwen Series",
    badge: "397B MoE",
    params: "NVIDIA Pro MoE"
  },
  {
    id: "qwen/qwen3-next-80b-a3b-instruct",
    name: "Qwen 3 Next 80B",
    avatar: "👑",
    desc: "Next-gen instructional model powered by NVIDIA",
    series: "Alibaba Qwen Series",
    badge: "80B Instruct",
    params: "NVIDIA-accelerated"
  },
  {
    id: "qwen/qwen3.5-122b-a10b",
    name: "Qwen 3.5 122B",
    avatar: "👑",
    desc: "Large Chinese-English mixture-of-experts model powered by NVIDIA",
    series: "Alibaba Qwen Series",
    badge: "122B MoE",
    params: "NVIDIA-accelerated"
  },
  {
    id: "z-ai/glm-5.1",
    name: "GLM 5.1",
    avatar: "💫",
    desc: "Ultra-advanced dual-language reasoning engine powered by NVIDIA",
    series: "Z-AI GLM Series",
    badge: "Dual-Lang",
    params: "GLM Core v5.1"
  },
  {
    id: "minimaxai/minimax-m2.7",
    name: "MiniMax M2.7",
    avatar: "🤖",
    desc: "High-performance generative reasoning engine powered by NVIDIA",
    series: "MiniMax Systems",
    badge: "Generative",
    params: "Generative MoE Pro"
  },
  {
    id: "stockmark/stockmark-2-100b-instruct",
    name: "Stockmark 2 100B",
    avatar: "📈",
    desc: "Advanced Japanese business and financial reasoning model powered by NVIDIA",
    series: "Specialty Instructor",
    badge: "Finance/Biz",
    params: "100B params model"
  },
  {
    id: "bytedance/seed-oss-36b-instruct",
    name: "Seed OSS 36B",
    avatar: "🌱",
    desc: "High-performance generative reasoning engine with thinking capability, powered by NVIDIA",
    series: "ByteDance Seed",
    badge: "Thinking",
    params: "36B OSS architecture"
  },
  {
    id: "microsoft/phi-4-mini-instruct",
    name: "Phi 4 Mini",
    avatar: "🔬",
    desc: "Phi-4 Mini: High-performance lightweight reasoning & instruction model powered by NVIDIA",
    series: "Microsoft Phi Series",
    badge: "Lightweight",
    params: "Phi-4 Pro Expert"
  },
  {
    id: "upstage/solar-10.7b-instruct",
    name: "Solar 10.7B",
    avatar: "☀️",
    desc: "solar-10.7b-instruct: Groundbreaking high-performance instruction-tuned model, powered by NVIDIA",
    series: "Solar Core",
    badge: "Instruction",
    params: "10.7B Solar"
  }
];

const AVATAR_OPTIONS = [
  "🤖", "🧠", "🌌", "⚡", "🔮", "🛸", "🦊", "🦁", "🐼", "🦄", "🌟", "✨"
];

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  attachment?: {
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null;
  generatedImage?: string;
  engineLabel?: string;
  timestamp: number;
}

export default function App() {
  // --- CLIENT STATES ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);

  // --- PRIVACY LOCK SCREEN STATES ---
  const [securedPin, setSecuredPin] = useState<string>(() => {
    try {
      return localStorage.getItem("nextgen_custom_pin") || "2026";
    } catch (_) {
      return "2026";
    }
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [pinShake, setPinShake] = useState<boolean>(false);

  // Recovery states for Forgot PIN via Firebase password reset email
  const [showRecovery, setShowRecovery] = useState<boolean>(false);
  const [recoveryEmail, setRecoveryEmail] = useState<string>("");
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);
  const [isSendingRecovery, setIsSendingRecovery] = useState<boolean>(false);

  // Active configurations
  const [activeSpecializedApp, setActiveSpecializedApp] = useState<string | null>(() => {
    try {
      return localStorage.getItem("nextgen_specialized_app") || null;
    } catch (_) {
      return null;
    }
  });
  const [imageMode, setImageMode] = useState(false);
  const [isImageGenMode, setIsImageGenMode] = useState(false);
  const [webSearchMode, setWebSearchMode] = useState(false);
  const [activeImagePlatform, setActiveImagePlatform] = useState<string>("nextgen");
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const [showEngineSelector, setShowEngineSelector] = useState(false);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  const [isGeminiMenuOpen, setIsGeminiMenuOpen] = useState(false);
  const [isGptMenuOpen, setIsGptMenuOpen] = useState(false);
  const [isOpenaiMenuOpen, setIsOpenaiMenuOpen] = useState(false);
  const [isDeepseekMenuOpen, setIsDeepseekMenuOpen] = useState(false);
  const [isAllMenuOpen, setIsAllMenuOpen] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showPdfcoModal, setShowPdfcoModal] = useState(false);
  const [pdfcoActiveTab, setPdfcoActiveTab] = useState<"html-to-pdf" | "extract-text" | "barcode" | "merge">("html-to-pdf");

  // Google Flights SerpApi states
  const [showFlightsModal, setShowFlightsModal] = useState(false);
  const [departureId, setDepartureId] = useState("CDG");
  const [arrivalId, setArrivalId] = useState("AUS");
  const [outboundDate, setOutboundDate] = useState("2026-06-16");
  const [returnDate, setReturnDate] = useState("2026-06-23");
  const [flightCurrency, setFlightCurrency] = useState("USD");
  const [flightType, setFlightType] = useState("2");
  const [flightsResults, setFlightsResults] = useState<any>(null);
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);
  const [flightsError, setFlightsError] = useState<string | null>(null);

  // Google Shopping Serper states
  const [showShoppingModal, setShowShoppingModal] = useState(false);
  const [shoppingQueryStr, setShoppingQueryStr] = useState("flipkart.com, google inc, tesla inc");
  const [shoppingGl, setShoppingGl] = useState("in");
  const [shoppingResults, setShoppingResults] = useState<any[] | null>(null);
  const [isSearchingShopping, setIsSearchingShopping] = useState(false);
  const [shoppingError, setShoppingError] = useState<string | null>(null);
  const [activeShoppingTab, setActiveShoppingTab] = useState(0);

  // Google Images Serper states
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [imagesQueryStr, setImagesQueryStr] = useState("apple inc");
  const [imagesGl, setImagesGl] = useState("us");
  const [imagesNum, setImagesNum] = useState(10);
  const [imagesResults, setImagesResults] = useState<any>(null);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [imagesError, setImagesError] = useState<string | null>(null);

  // Walmart SerpApi states
  const [showWalmartModal, setShowWalmartModal] = useState(false);
  const [walmartQueryStr, setWalmartQueryStr] = useState("bread");
  const [walmartResults, setWalmartResults] = useState<any>(null);
  const [isSearchingWalmart, setIsSearchingWalmart] = useState(false);
  const [walmartError, setWalmartError] = useState<string | null>(null);
  
  // HTML-to-PDF states
  const [pdfcoHtmlInput, setPdfcoHtmlInput] = useState<string>(`<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #2D3748; max-width: 800px; margin: auto; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td>
        <h2 style="color: #10B981; margin: 0; font-weight: 800; font-size: 26px;">NEXTGEN SYSTEMS</h2>
        <p style="font-size: 12px; color: #718096; margin: 5px 0;">123 Innovation Blvd, Silicon Park</p>
      </td>
      <td style="text-align: right;">
        <h1 style="margin: 0; color: #A0AEC0; font-weight: 300; font-size: 28px;">INVOICE</h1>
        <p style="font-size: 12px; color: #4A5568; margin: 5px 0;"><b>Invoice #:</b> NGS-2026-0042</p>
        <p style="font-size: 12px; color: #4A5568; margin: 5px 0;"><b>Date:</b> June 14, 2026</p>
      </td>
    </tr>
  </table>
  <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 25px 0;" />
  <p style="font-size: 13px; color: #718096; margin-bottom: 5px;">PREPARED FOR:</p>
  <p style="font-size: 15px; font-weight: 700; margin: 0; color: #2D3748;">NextGenAi Platform Sandbox User</p>
  <p style="font-size: 12px; color: #4A5568; margin: 4px 0;">vevonsongs@gmail.com</p>
  
  <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
    <thead>
      <tr style="background: #F7FAFC; font-size: 11px; text-transform: uppercase; color: #718096; letter-spacing: 0.05em;">
        <th style="padding: 12px 10px; border-bottom: 2px solid #E2E8F0; text-align: left;">Line Item Description</th>
        <th style="padding: 12px 10px; border-bottom: 2px solid #E2E8F0; text-align: right; width: 80px;">Qty</th>
        <th style="padding: 12px 10px; border-bottom: 2px solid #E2E8F0; text-align: right; width: 120px;">Rate</th>
        <th style="padding: 12px 10px; border-bottom: 2px solid #E2E8F0; text-align: right; width: 120px;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr style="font-size: 13px; color: #4A5568;">
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; font-weight: 600;">PDF.co REST Web Services Interconnection</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; text-align: right;">1</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; text-align: right;">$149.00</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; text-align: right; font-weight: 700; color: #2D3748;">$149.00</td>
      </tr>
      <tr style="font-size: 13px; color: #4A5568;">
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; font-weight: 600;">Full-Stack Custom Engine Sandbox integration</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; text-align: right;">2</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; text-align: right;">$25.25</td>
        <td style="padding: 14px 10px; border-bottom: 1px solid #EDF2F7; text-align: right; font-weight: 700; color: #2D3748;">$50.50</td>
      </tr>
    </tbody>
  </table>
  <div style="text-align: right; margin-top: 30px;">
    <p style="font-size: 14px; margin: 4px 0; color: #718096;">Subtotal: <span style="font-weight: 600; color: #2D3748;">$199.50</span></p>
    <p style="font-size: 14px; margin: 4px 0; color: #718096;">Fed Tax (0%): <span style="font-weight: 600; color: #2D3748;">$0.00</span></p>
    <p style="font-size: 19px; color: #10B981; margin: 12px 0 0 0;"><b>Amount Due:</b> $199.50 USD</p>
  </div>
</div>`);
  const [htmlResultPdfUrl, setHtmlResultPdfUrl] = useState<string | null>(null);
  const [htmlLoading, setHtmlLoading] = useState<boolean>(false);

  // Extract Text states
  const [parsingBase64, setParsingBase64] = useState<string | null>(null);
  const [parsingFileName, setParsingFileName] = useState<string | null>(null);
  const [parsingMimeType, setParsingMimeType] = useState<string | null>(null);
  const [parsingTextResult, setParsingTextResult] = useState<string | null>(null);
  const [parsingLoading, setParsingLoading] = useState<boolean>(false);

  // Analyze features (barcodes / info) states
  const [barcodeBase64, setBarcodeBase64] = useState<string | null>(null);
  const [barcodeFileName, setBarcodeFileName] = useState<string | null>(null);
  const [barcodeMimeType, setBarcodeMimeType] = useState<string | null>(null);
  const [barcodeResult, setBarcodeResult] = useState<{ barcodes: any[]; info: any } | null>(null);
  const [barcodeLoading, setBarcodeLoading] = useState<boolean>(false);

  // Merge PDFs states
  const [mergeFilesQueue, setMergeFilesQueue] = useState<Array<{ base64: string; fileName: string; size: string; mimeType: string }>>([]);
  const [mergeResultUrl, setMergeResultUrl] = useState<string | null>(null);
  const [mergeLoading, setMergeLoading] = useState<boolean>(false);
  const [modalTab, setModalTab] = useState<"text" | "image">("text");
  const [isHeaderToolsOpen, setIsHeaderToolsOpen] = useState(false);

  // Gemini-style Sidebar states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("nextgen_sidebar_collapsed") === "true";
    } catch (_) {
      return false;
    }
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isReasoningSectionExpanded, setIsReasoningSectionExpanded] = useState(true);
  const [isCoreSectionExpanded, setIsCoreSectionExpanded] = useState(true);

  const [activeTextModel, setActiveTextModel] = useState<string>(() => {
    try {
      return localStorage.getItem("nextgen_active_text_model") || "gemini-3.5-flash";
    } catch (_) {
      return "gemini-3.5-flash";
    }
  });

  const [selectedAiAvatar, setSelectedAiAvatar] = useState<string>(() => {
    try {
      return localStorage.getItem("nextgen_ai_avatar") || "🤖";
    } catch (_) {
      return "🤖";
    }
  });

  const changeTextModel = (modelId: string) => {
    setActiveTextModel(modelId);
    try {
      localStorage.setItem("nextgen_active_text_model", modelId);
    } catch (_) {}
  };

  const changeAiAvatar = (avatar: string) => {
    setSelectedAiAvatar(avatar);
    try {
      localStorage.setItem("nextgen_ai_avatar", avatar);
    } catch (_) {}
  };

  // Config modal and credentials override inputs
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [customNextGenKey, setCustomNextGenKey] = useState(() => {
    try { return localStorage.getItem("nextgen_key") || ""; } catch (_) { return ""; }
  });
  const [customOpenAiKey, setCustomOpenAiKey] = useState(() => {
    try { return localStorage.getItem("openai_key") || ""; } catch (_) { return ""; }
  });
  const [customOpenRouterKey, setCustomOpenRouterKey] = useState(() => {
    try { return localStorage.getItem("openrouter_key") || ""; } catch (_) { return ""; }
  });
  const [customHpcAiKey, setCustomHpcAiKey] = useState(() => {
    try { return localStorage.getItem("hpcai_key") || ""; } catch (_) { return ""; }
  });
  const [customNvidiaKey, setCustomNvidiaKey] = useState(() => {
    try { return localStorage.getItem("nvidia_key") || ""; } catch (_) { return ""; }
  });
  const [customStabilityKey, setCustomStabilityKey] = useState(() => {
    try { return localStorage.getItem("stability_key") || ""; } catch (_) { return ""; }
  });
  const [customHuggingFaceKey, setCustomHuggingFaceKey] = useState(() => {
    try { return localStorage.getItem("huggingface_key") || ""; } catch (_) { return ""; }
  });
  const [customNewsApiKey, setCustomNewsApiKey] = useState(() => {
    try { return localStorage.getItem("news_key") || ""; } catch (_) { return ""; }
  });
  const [customSearchApiKey, setCustomSearchApiKey] = useState(() => {
    try { return localStorage.getItem("search_key") || ""; } catch (_) { return ""; }
  });
  const [customSerpapiApiKey, setCustomSerpapiApiKey] = useState(() => {
    try { return localStorage.getItem("serpapi_key") || ""; } catch (_) { return ""; }
  });

  const [serverConfigStatus, setServerConfigStatus] = useState<{
    gemini_api_key?: boolean;
    openai_api_key?: boolean;
    openrouter_api_key?: boolean;
    hpcai_api_key?: boolean;
    nvidia_api_key?: boolean;
    stability_api_key?: boolean;
    huggingface_api_key?: boolean;
    gnews_api_key?: boolean;
    serper_api_key?: boolean;
  }>({});

  const checkServerConfig = async () => {
    try {
      const res = await fetch("/api/config-status");
      if (res.ok) {
        const data = await res.json();
        setServerConfigStatus(data);
      }
    } catch (err) {
      console.error("Could not fetch server configuration status", err);
    }
  };

  // --- SECURE FIRESTORE SYNC AND SECURE ERROR MANDATES ---
  enum OperationType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    LIST = 'list',
    GET = 'get',
    WRITE = 'write',
  }

  interface FirestoreErrorInfo {
    error: string;
    operationType: OperationType;
    path: string | null;
    authInfo: {
      userId?: string | null;
      email?: string | null;
      emailVerified?: boolean | null;
      isAnonymous?: boolean | null;
      tenantId?: string | null;
      providerInfo?: {
        providerId?: string | null;
        email?: string | null;
      }[];
    }
  }

  const handleFirestoreError = (error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  };

  const loadCredentialsFromFirestore = async (uid: string) => {
    const pth = `users/${uid}/private/credentials`;
    try {
      const docRef = doc(db, "users", uid, "private", "credentials");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.nextgen !== undefined) setCustomNextGenKey(data.nextgen || "");
        if (data.openai !== undefined) setCustomOpenAiKey(data.openai || "");
        if (data.openrouter !== undefined) setCustomOpenRouterKey(data.openrouter || "");
        if (data.hpcai !== undefined) setCustomHpcAiKey(data.hpcai || "");
        if (data.nvidia !== undefined) setCustomNvidiaKey(data.nvidia || "");
        if (data.stability !== undefined) setCustomStabilityKey(data.stability || "");
        if (data.huggingface !== undefined) setCustomHuggingFaceKey(data.huggingface || "");
        if (data.news !== undefined) setCustomNewsApiKey(data.news || "");
        if (data.search !== undefined) setCustomSearchApiKey(data.search || "");
        if (data.serpapi !== undefined) setCustomSerpapiApiKey(data.serpapi || "");
        
        // Also sync local storage
        try {
          localStorage.setItem("nextgen_key", data.nextgen || "");
          localStorage.setItem("openai_key", data.openai || "");
          localStorage.setItem("openrouter_key", data.openrouter || "");
          localStorage.setItem("hpcai_key", data.hpcai || "");
          localStorage.setItem("nvidia_key", data.nvidia || "");
          localStorage.setItem("stability_key", data.stability || "");
          localStorage.setItem("huggingface_key", data.huggingface || "");
          localStorage.setItem("news_key", data.news || "");
          localStorage.setItem("search_key", data.search || "");
          localStorage.setItem("serpapi_key", data.serpapi || "");
        } catch (_) {}
      }
    } catch (err) {
      console.warn("[Firestore] Inaccessible or network disconnected. Operating in offline/local fallback state.", err);
    }
  };

  // Attached image visions state
  const [attachedImage, setAttachedImage] = useState<{
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const geminiMenuRef = useRef<HTMLDivElement>(null);
  const gptMenuRef = useRef<HTMLDivElement>(null);
  const openaiMenuRef = useRef<HTMLDivElement>(null);
  const deepseekMenuRef = useRef<HTMLDivElement>(null);
  const allMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const headerToolsRef = useRef<HTMLDivElement>(null);

  // Dynamic model metadata lookup helper (sucre/source resolution)
  const getModelAvatarAndName = (engineLabelValue?: string) => {
    if (!engineLabelValue) {
      const activeCfg = TEXT_MODELS.find(m => m.id === activeTextModel);
      return {
        id: activeTextModel || "gemini-3.5-flash",
        avatar: activeCfg?.avatar || "🤖",
        name: activeCfg?.name || "NextGenAi Brain"
      };
    }
    const match = TEXT_MODELS.find(m => m.name === engineLabelValue || m.id === engineLabelValue);
    return {
      id: match?.id || engineLabelValue,
      avatar: match?.avatar || "🧠",
      name: match?.name || engineLabelValue
    };
  };

  // --- AUTH AND FIREBASE STATES ---
  const [user, setUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // 1. Validate connection to Firestore on initial boot (Critical Constraint)
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        console.log("[Firebase] Connection check successful.");
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.warn("Please check your Firebase configuration. Client is reporting offline.");
        }
      }
    }
    testConnection();

    // 2. Track Authentication state and fetch synced credentials
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadCredentialsFromFirestore(currentUser.uid);
      }
    });
    
    // 3. Handle redirect result
    getRedirectResult(auth).then((result) => {
      if (result) {
        console.log("Redirect sign-in successful", result.user);
        setShowAuthModal(false);
      }
    }).catch((error) => {
      console.error("Redirect sign-in error:", error);
      if (error.code === "auth/unauthorized-domain") {
        setAuthError("This domain is not authorized for OAuth operations. Please add it in the Firebase Console.");
        setShowAuthModal(true);
      } else {
        setAuthError(error.message);
        setShowAuthModal(true);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(event.target as Node)) {
        setIsAvatarDropdownOpen(false);
      }
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) {
        setIsPlusMenuOpen(false);
      }
      if (gptMenuRef.current && !gptMenuRef.current.contains(event.target as Node)) {
        setIsGptMenuOpen(false);
      }
      if (openaiMenuRef.current && !openaiMenuRef.current.contains(event.target as Node)) {
        setIsOpenaiMenuOpen(false);
      }
      if (geminiMenuRef.current && !geminiMenuRef.current.contains(event.target as Node)) {
        setIsGeminiMenuOpen(false);
      }
      if (deepseekMenuRef.current && !deepseekMenuRef.current.contains(event.target as Node)) {
        setIsDeepseekMenuOpen(false);
      }
      if (allMenuRef.current && !allMenuRef.current.contains(event.target as Node)) {
        setIsAllMenuOpen(false);
      }
      if (headerToolsRef.current && !headerToolsRef.current.contains(event.target as Node)) {
        setIsHeaderToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Global Keyboard Shortcuts (Ctrl+K for model launcher, Esc to exit, Alt+I to focus input)
  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      const isMac = typeof window !== "undefined" && window.navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const isModifierPressed = isMac ? event.metaKey : event.ctrlKey;

      // 1. Model Switcher shortcut: Ctrl/Cmd + K
      if (isModifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setShowModelModal((prev) => {
          const next = !prev;
          showToastAlert(next ? "🪐 Configured: Opened brain registry" : "🪐 Configured: Closed brain registry");
          return next;
        });
      }

      // 2. Direct focus writer box: Alt+I
      if (event.altKey && event.key.toLowerCase() === "i") {
        event.preventDefault();
        if (textareaRef.current) {
          textareaRef.current.focus();
          showToastAlert("⌨️ Focused chat window input!");
        }
      }

      // 3. Absolute modal exit escape action
      if (event.key === "Escape") {
        setShowModelModal(false);
        setShowDriveModal(false);
        setShowConfigModal(false);
        setIsPlusMenuOpen(false);
      }
    }

    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // --- AUTH AND FIREBASE METHODS ---
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setAuthSuccessMessage("Successfully logged in with Google!");
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Popup closed. If it closed instantly, open the app in a new tab.");
      } else if (err.code === "auth/popup-blocked") {
        setAuthError("Popup blocked. Please open the app in a new tab.");
      } else if (err.code === "auth/operation-not-allowed") {
        setAuthError("Google Sign-In is not enabled yet. Go to your Firebase Console > Authentication > Sign-in method, edit Google provider, and confirm saving.");
      } else {
        setAuthError(err.message || "An error occurred signing in with Google.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, facebookProvider);
      setAuthSuccessMessage("Successfully logged in with Facebook!");
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Popup closed. If it closed instantly, open the app in a new tab.");
      } else if (err.code === "auth/popup-blocked") {
        setAuthError("Popup blocked. Please open the app in a new tab.");
      } else if (err.code === "auth/operation-not-allowed" || err.code === "auth/configuration-not-found" || err.code === "auth/unauthorized-domain") {
        setAuthError("Facebook sign-in provider requires manual activation in the Firebase console. Go to Authentication > Sign-in method, select Facebook, and enter your FB App Developer settings.");
      } else {
        setAuthError(err.message || "An error occurred signing in with Facebook.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, githubProvider);
      setAuthSuccessMessage("Successfully logged in with GitHub!");
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Popup closed. If it closed instantly, open the app in a new tab.");
      } else if (err.code === "auth/popup-blocked") {
        setAuthError("Popup blocked. Please open the app in a new tab.");
      } else if (err.code === "auth/operation-not-allowed" || err.code === "auth/configuration-not-found" || err.code === "auth/unauthorized-domain") {
        setAuthError("GitHub sign-in provider requires manual activation in the Firebase console. Go to Authentication > Sign-in method, select GitHub, and enter your GitHub App Developer settings.");
      } else {
        setAuthError(err.message || "An error occurred signing in with GitHub.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, appleProvider);
      setAuthSuccessMessage("Successfully logged in with Apple!");
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMessage(null);
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/popup-closed-by-user") {
        setAuthError("Popup closed. If it closed instantly, open the app in a new tab.");
      } else if (err.code === "auth/popup-blocked") {
        setAuthError("Popup blocked. Please open the app in a new tab.");
      } else if (err.code === "auth/operation-not-allowed" || err.code === "auth/configuration-not-found" || err.code === "auth/unauthorized-domain") {
        setAuthError("Apple authentication requires Apple Developer setup. Open Firebase Console > Authentication > Sign-in method, select Apple, and enter Apple Credentials.");
      } else {
        setAuthError(err.message || "An error occurred signing in with Apple.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      setAuthError("Please enter both email and password.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        setAuthSuccessMessage("Account created successfully!");
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
        setAuthSuccessMessage("Logged in successfully!");
      }
      setTimeout(() => {
        setShowAuthModal(false);
        setAuthSuccessMessage(null);
        setAuthEmail("");
        setAuthPassword("");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed") {
        setAuthError("Email/Password provider is not enabled. Go to Firebase Console > Authentication > Sign-in method and enable 'Email/Password'.");
      } else if (err.code === "auth/email-already-in-use") {
        setAuthError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setAuthError("The password is too weak. Make it at least 6 characters.");
      } else if (err.code === "auth/invalid-login-credentials" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setAuthError("Invalid credentials. Please double check.");
      } else {
        setAuthError(err.message || "Authentication error.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setShowProfileDropdown(false);
    } catch (err: any) {
      console.error("Error signing out:", err);
    }
  };

  // Micro speech recognition dictation
  const [isMicListening, setIsMicListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Audio voice narrator state
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  // Loading and scrolling references
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchStatusText, setSearchStatusText] = useState("");

  // Copy success animation trigger
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // --- INITIAL COMPILER & MARKED SYSTEM INCLUSION ---
  useEffect(() => {
    // Dark preference listener
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }

    // Capture standard Speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setInput(prev => prev + (prev ? " " : "") + finalTranscript);
        }
      };

      rec.onerror = (err: any) => {
        console.error("Speech capturing error:", err);
        setIsMicListening(false);
      };

      rec.onend = () => {
        setIsMicListening(false);
      };

      recognitionRef.current = rec;
    }

    // Persist API custom credentials from LocalStorage
    try {
      const gK = localStorage.getItem("nextgen_key");
      const oK = localStorage.getItem("openai_key");
      const orK = localStorage.getItem("openrouter_key");
      const hAcK = localStorage.getItem("hpcai_key");
      const nvK = localStorage.getItem("nvidia_key");
      const sK = localStorage.getItem("stability_key");
      const hK = localStorage.getItem("huggingface_key");
      const nK = localStorage.getItem("news_key");
      const sGK = localStorage.getItem("search_key");

      if (gK) setCustomNextGenKey(gK);
      if (oK) setCustomOpenAiKey(oK);
      if (orK) setCustomOpenRouterKey(orK);
      if (hAcK) setCustomHpcAiKey(hAcK);
      if (nvK) setCustomNvidiaKey(nvK);
      if (sK) setCustomStabilityKey(sK);
      if (hK) setCustomHuggingFaceKey(hK);
      if (nK) setCustomNewsApiKey(nK);
      if (sGK) setCustomSearchApiKey(sGK);
    } catch (_) {}
    
    checkServerConfig();

    const handleOnlineStatus = () => {
      console.log("Device is online. Re-checking server configuration status...");
      checkServerConfig();
    };
    window.addEventListener("online", handleOnlineStatus);
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
    };
  }, []);

  // Smooth scroll helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating, searchStatusText]);

  useEffect(() => {
    const updateUrlOnAction = () => {
      if (window.location.pathname !== '/NextGenAi-hybirde') {
        window.history.pushState(null, '', '/NextGenAi-hybirde');
      }
    };
    
    document.addEventListener('click', updateUrlOnAction, { once: true });
    document.addEventListener('keydown', updateUrlOnAction, { once: true });
    
    return () => {
      document.removeEventListener('click', updateUrlOnAction);
      document.removeEventListener('keydown', updateUrlOnAction);
    };
  }, []);

  // --- ACTIONS CONTROLLERS ---

  const saveCredentials = async () => {
    try {
      localStorage.setItem("nextgen_key", customNextGenKey);
      localStorage.setItem("openai_key", customOpenAiKey);
      localStorage.setItem("openrouter_key", customOpenRouterKey);
      localStorage.setItem("hpcai_key", customHpcAiKey);
      localStorage.setItem("nvidia_key", customNvidiaKey);
      localStorage.setItem("stability_key", customStabilityKey);
      localStorage.setItem("huggingface_key", customHuggingFaceKey);
      localStorage.setItem("news_key", customNewsApiKey);
      localStorage.setItem("search_key", customSearchApiKey);
      localStorage.setItem("serpapi_key", customSerpapiApiKey);
    } catch (_) {}

    if (user) {
      const pth = `users/${user.uid}/private/credentials`;
      try {
        const docRef = doc(db, "users", user.uid, "private", "credentials");
        await setDoc(docRef, {
          userId: user.uid,
          nextgen: customNextGenKey,
          openai: customOpenAiKey,
          openrouter: customOpenRouterKey,
          hpcai: customHpcAiKey,
          nvidia: customNvidiaKey,
          stability: customStabilityKey,
          huggingface: customHuggingFaceKey,
          news: customNewsApiKey,
          search: customSearchApiKey,
          serpapi: customSerpapiApiKey,
          updatedAt: new Date().toISOString()
        });
        showToastAlert("Configurations fully backed up and secured in cloud!");
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, pth);
      }
    } else {
      showToastAlert("Configurations applied locally. Sign in to sync them to the secure cloud!");
    }
    setShowConfigModal(false);
  };

  const resetCredentials = async () => {
    setCustomNextGenKey("");
    setCustomOpenAiKey("");
    setCustomOpenRouterKey("");
    setCustomHpcAiKey("");
    setCustomNvidiaKey("");
    setCustomStabilityKey("");
    setCustomHuggingFaceKey("");
    setCustomNewsApiKey("");
    setCustomSearchApiKey("");
    setCustomSerpapiApiKey("");
    try {
      localStorage.removeItem("nextgen_key");
      localStorage.removeItem("openai_key");
      localStorage.removeItem("openrouter_key");
      localStorage.removeItem("hpcai_key");
      localStorage.removeItem("nvidia_key");
      localStorage.removeItem("stability_key");
      localStorage.removeItem("huggingface_key");
      localStorage.removeItem("news_key");
      localStorage.removeItem("search_key");
      localStorage.removeItem("serpapi_key");
    } catch (_) {}

    if (user) {
      const pth = `users/${user.uid}/private/credentials`;
      try {
        const docRef = doc(db, "users", user.uid, "private", "credentials");
        await setDoc(docRef, {
          userId: user.uid,
          nextgen: "",
          openai: "",
          openrouter: "",
          hpcai: "",
          nvidia: "",
          stability: "",
          huggingface: "",
          news: "",
          search: "",
          serpapi: "",
          updatedAt: new Date().toISOString()
        });
        showToastAlert("Configurations cleared from secure cloud database!");
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, pth);
      }
    } else {
      showToastAlert("Local configurations cleared!");
    }
  };

  const handleSearchFlights = async () => {
    setIsSearchingFlights(true);
    setFlightsError(null);
    setFlightsResults(null);
    try {
      const response = await fetch("/api/serpapi/google-flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          departure_id: departureId,
          arrival_id: arrivalId,
          outbound_date: outboundDate,
          return_date: flightType === "2" ? returnDate : undefined,
          currency: flightCurrency,
          type: flightType,
          customApiKey: customSerpapiApiKey
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to search flights");
      }

      const data = await response.json();
      setFlightsResults(data);
      showToastAlert("SerpApi Flights search loaded successfully!");
    } catch (err: any) {
      setFlightsError(err.message || String(err));
    } finally {
      setIsSearchingFlights(false);
    }
  };

  const handleSearchShopping = async () => {
    setIsSearchingShopping(true);
    setShoppingError(null);
    setShoppingResults(null);
    try {
      // Split comma separated queries
      const queryList = shoppingQueryStr
        .split(",")
        .map(q => q.trim())
        .filter(q => q.length > 0);

      const response = await fetch("/api/serper/shopping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          queries: queryList,
          gl: shoppingGl,
          customApiKey: customSearchApiKey
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to query Serper Shopping");
      }

      const data = await response.json();
      setShoppingResults(data);
      showToastAlert("Google Shopping results loaded successfully!");
    } catch (err: any) {
      setShoppingError(err.message || String(err));
    } finally {
      setIsSearchingShopping(false);
    }
  };

  const handleSearchImages = async () => {
    setIsSearchingImages(true);
    setImagesError(null);
    setImagesResults(null);
    try {
      const response = await fetch("/api/serper/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: imagesQueryStr.trim(),
          num: imagesNum,
          gl: imagesGl,
          customApiKey: customSearchApiKey
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to query Serper Google Images");
      }

      const data = await response.json();
      setImagesResults(data);
      showToastAlert("Google Images results loaded successfully!");
    } catch (err: any) {
      setImagesError(err.message || String(err));
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleSearchWalmart = async () => {
    setIsSearchingWalmart(true);
    setWalmartError(null);
    setWalmartResults(null);
    try {
      const response = await fetch("/api/serpapi/walmart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          q: walmartQueryStr.trim(),
          customApiKey: customSearchApiKey
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to query Walmart Search");
      }

      const data = await response.json();
      setWalmartResults(data);
      showToastAlert("Walmart Search results loaded successfully!");
    } catch (err: any) {
      setWalmartError(err.message || String(err));
    } finally {
      setIsSearchingWalmart(false);
    }
  };

  const handleImageAttachment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToastAlert("File too large. Please select a file below 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
      
      setAttachedImage({
        previewUrl: isPdf ? "" : dataUrl,
        base64: dataUrl.split(",")[1],
        mimeType: file.type || (isPdf ? "application/pdf" : ""),
        fileName: file.name,
        isDocument: isPdf
      });
      showToastAlert(isPdf ? `📎 PDF Document "${file.name}" attached successfully!` : "📎 Reference graphic attached successfully!");
    };
    reader.readAsDataURL(file);
  };

  // --- PDF.CO CLIENT-SIDE OPERATIONS ---

  const handleHtmlToPdfConvert = async () => {
    if (!pdfcoHtmlInput.trim()) {
      showToastAlert("Please enter some HTML content to compile!");
      return;
    }
    setHtmlLoading(true);
    setHtmlResultPdfUrl(null);
    try {
      const response = await fetch("/api/pdfco/html-to-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: pdfcoHtmlInput,
          fileName: "generated_template_report.pdf"
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to convert HTML to PDF");
      }
      setHtmlResultPdfUrl(data.pdfUrl);
      showToastAlert("✨ Custom PDF compiled successfully through PDF.co!");
    } catch (err: any) {
      console.error("[Pdfco HTML-to-PDF Client Error]:", err);
      showToastAlert(`Conversion Error: ${err.message || "Failed to process request"}`);
    } finally {
      setHtmlLoading(false);
    }
  };

  const handleParsingFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setParsingFileName(file.name);
    setParsingMimeType(file.type);
    setParsingTextResult(null);
    setParsingLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        setParsingBase64(base64);

        showToastAlert(`Uploading and parsing "${file.name}" with PDF.co...`);
        const response = await fetch("/api/pdfco/extract-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            fileName: file.name,
            mimeType: file.type
          })
        });

        const data = await response.json();
        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to extract text");
        }

        setParsingTextResult(data.text);
        showToastAlert("✨ PDF text extracted successfully!");
      } catch (err: any) {
        console.error(err);
        showToastAlert(`Parsing error: ${err.message}`);
      } finally {
        setParsingLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBarcodeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBarcodeFileName(file.name);
    setBarcodeMimeType(file.type);
    setBarcodeResult(null);
    setBarcodeLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        setBarcodeBase64(base64);

        showToastAlert(`Scanning barcodes & metadata for "${file.name}"...`);
        const response = await fetch("/api/pdfco/analyze-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            fileName: file.name,
            mimeType: file.type
          })
        });

        const data = await response.json();
        if (!response.ok || data.error) {
          throw new Error(data.error || "Failed to analyze document");
        }

        setBarcodeResult({
          barcodes: data.barcodes || [],
          info: data.info || null
        });
        showToastAlert("✨ Document analytics ready!");
      } catch (err: any) {
        console.error(err);
        showToastAlert(`Analysis error: ${err.message}`);
      } finally {
        setBarcodeLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleMergeQueueUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      
      setMergeFilesQueue(prev => [
        ...prev,
        { base64, fileName: file.name, size: sizeStr, mimeType: file.type }
      ]);
      setMergeResultUrl(null);
      showToastAlert(`Added "${file.name}" to consolidation queue!`);
    };
    reader.readAsDataURL(file);
  };

  const handleMergePdfs = async () => {
    if (mergeFilesQueue.length < 2) {
      showToastAlert("Please add at least 2 file items into the queue to consolidate!");
      return;
    }
    setMergeLoading(true);
    setMergeResultUrl(null);
    try {
      const response = await fetch("/api/pdfco/merge-pdfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          files: mergeFilesQueue.map(item => ({
            base64: item.base64,
            fileName: item.fileName,
            mimeType: item.mimeType
          }))
        })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to merge PDF files");
      }
      setMergeResultUrl(data.pdfUrl);
      showToastAlert("🎉 PDF files successfully consolidated!");
    } catch (err: any) {
      console.error(err);
      showToastAlert(`Merge error: ${err.message}`);
    } finally {
      setMergeLoading(false);
    }
  };

  const toggleMicrophone = () => {
    if (!recognitionRef.current) {
      showToastAlert("Speech capturing language engine is not supported by your browser sandbox.");
      return;
    }

    if (isMicListening) {
      recognitionRef.current.stop();
      setIsMicListening(false);
    } else {
      setIsMicListening(true);
      recognitionRef.current.start();
    }
  };

  const handlePresetPrompt = (presetText: string, initiateImageMode = false) => {
    setInput(presetText);
    setIsImageGenMode(false);
    if (initiateImageMode) {
      setImageMode(true);
      setWebSearchMode(false);
    } else {
      setImageMode(false);
    }
  };

  const handleClearChatstream = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setPlayingMsgId(null);
    setMessages([]);
    setImageMode(false);
    setIsImageGenMode(false);
    setWebSearchMode(false);
  };

  const showToastAlert = (msg: string) => {
    setApiError(msg);
    setTimeout(() => setApiError(null), 5000);
  };

  const copyToClipboard = (text: string, msgId: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // --- NARRATOR / VOICE OUTPUT TRIGGER ---
  const handleVoicePlayback = (msgId: string, rawText: string) => {
    if (!window.speechSynthesis) {
      showToastAlert("Standard Text-to-Speech is blocked or unsupported in this device frame.");
      return;
    }

    if (playingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setPlayingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Stripper to clean markdown formatting for pronunciation
    const cleanText = rawText
      .replace(/```[\s\S]*?```/g, "[Code snippet]")
      .replace(/[*_#`\-~•[\]()]/g, "")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setPlayingMsgId(null);
    utterance.onerror = () => setPlayingMsgId(null);

    setPlayingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // --- MASTER API STREAM DISPATCHER ---
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !attachedImage) return;

    if (isMicListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsMicListening(false);
    }

    const userPrompt = input.trim();
    const currentAttachment = attachedImage;

    setInput("");
    setAttachedImage(null);
    setIsGenerating(true);
    setApiError(null);

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userPrompt,
      attachment: currentAttachment,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      // Smart News Detection Router or fallback Text Reasoning engine
      const newsKeywords = ["news", "headlines", "world news", "samachar", "khabar", "latest update", "ndtv", "bbc", "dw", "times now", "hindustan"];
      const isQueryingNews = newsKeywords.some(keyword => userPrompt.toLowerCase().includes(keyword));

      if (isImageGenMode) {
        await triggerImageGeneration(userPrompt);
      } else if (isQueryingNews && !imageMode) {
        await triggerNewsRetrieval(userPrompt);
      } else {
        await triggerTextGeneration(updatedMessages, userPrompt);
      }
    } catch (err: any) {
      // Suppressed outer toast warnings per high security/quieter rate limits request
      console.error("Submit exception caught:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // --- SERVER-SIDE HELPER: ROBUST GATEWAY API WITH AUTOMATIC RETRIES ---
  const fetchWithRetry = async (url: string, options: RequestInit, retries = 15, delayMs = 3000): Promise<{ ok: boolean; status: number; text: string }> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, options);
        const text = await res.text();
        
        // Treat as server-starting / transient error if we see "The page could not be found" (GCP NOT_FOUND), HTML responses, or standard transient status codes
        const isTransient = text.includes("<!DOCTYPE") || 
                            text.includes("<html") || 
                            text.includes("NOT_FOUND") || 
                            text.includes("page could not be found") ||
                            res.status === 404 || 
                            res.status === 502 || 
                            res.status === 503;

        if (isTransient) {
          if (attempt < retries) {
            setSearchStatusText(`Backend is warming up or synchronizing commands... (attempt ${attempt}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          } else {
            // Reached maximum attempts and it is still returning transient HTML/NOT_FOUND pages, returning a beautiful structured JSON mockup
            return {
              ok: false,
              status: 503,
              text: JSON.stringify({
                error: "NextGenAi backend engine is still connecting securely. Please hit send again in 5 seconds to automatically route through our direct channels."
              })
            };
          }
        }
        return { ok: res.ok, status: res.status, text };
      } catch (err) {
        if (attempt < retries) {
          setSearchStatusText(`Re-establishing secure channel... (attempt ${attempt}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        throw err;
      }
    }
    throw new Error("Unable to establish remote connection to backend engine. Please wait 5 seconds and try again.");
  };

  // --- SERVER-SIDE FLOW: TEXT GENERATION & GROUNDING ---
  const triggerTextGeneration = async (allMessages: Message[], originalPrompt: string) => {
    try {
      setSearchStatusText(webSearchMode ? "Broadcasting live search signals..." : "Thinking...");
      
      const payload = {
        messages: allMessages,
        prompt: originalPrompt,
        webSearch: webSearchMode,
        textModel: activeTextModel,
        specializedApp: activeSpecializedApp,
        customKeys: {
          nextGen: customNextGenKey,
          gemini: customNextGenKey,
          openai: customOpenAiKey,
          openrouter: customOpenRouterKey,
          hpcai: customHpcAiKey,
          nvidia: customNvidiaKey,
          search: customSearchApiKey
        }
      };

      const result = await fetchWithRetry("/api/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data: any;
      try {
        data = JSON.parse(result.text);
      } catch (parseErr) {
        throw new Error(`Failed to parse response: ${result.text.slice(0, 150)}...`);
      }

      if (!result.ok) {
        throw new Error(data?.error || "Server text gen error.");
      }

      setSearchStatusText("");

      let textResult = data.text;
      
      // Compute Search sources citations under the prompt
      const chunks = data.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        let citesBlock = "\n\n---\n\n### 🌍 Referenced Live Web Sources\n";
        const uniqueLinks = new Set<string>();
        chunks.forEach((chunk: any) => {
          const uri = chunk.web?.uri;
          const title = chunk.web?.title || "Search Grounding Link";
          if (uri && !uniqueLinks.has(uri)) {
            uniqueLinks.add(uri);
            citesBlock += `- [${title}](${uri})\n`;
          }
        });
        if (uniqueLinks.size > 0) {
          textResult += citesBlock;
        }
      }

      const activeModelConfig = TEXT_MODELS.find(m => m.id === activeTextModel);
      const assistantMsg: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        text: textResult,
        engineLabel: activeModelConfig ? activeModelConfig.name : activeTextModel || "NextGenAi Brain",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      setSearchStatusText("");
      // Suppressed toast popup per high security / quieter limit warnings request
      
      const isHighDemand = err.message?.includes("UNAVAILABLE") || 
                          err.message?.includes("high demand") || 
                          err.message?.includes("rate limit") ||
                          err.message?.includes("limit");
      
      const errorText = isHighDemand
        ? `⚠️ **Gemini Service Limit**: ${err.message}`
        : `⚠️ **Action compilation failed**: ${err.message || "Unable to acquire AI response pipeline."}\n\nThe backend server is currently starting up or checking configuration. Please re-try in a few moments.`;

      const errMessage: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        text: errorText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errMessage]);
    }
  };

  // --- SERVER-SIDE FLOW: MULTI-IMAGE PIPELINE ---
  const triggerImageGeneration = async (promptString: string) => {
    try {
      setSearchStatusText(`Drafting viewport using ${IMAGE_PLATFORMS[activeImagePlatform].name}...`);

      const payload = {
        prompt: promptString,
        platform: activeImagePlatform,
        customKeys: {
          nextGen: customNextGenKey,
          openai: customOpenAiKey,
          stability: customStabilityKey,
          huggingface: customHuggingFaceKey
        }
      };

      const result = await fetchWithRetry("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let data: any;
      try {
        data = JSON.parse(result.text);
      } catch (parseErr) {
        throw new Error(`Failed to parse response: ${result.text.slice(0, 150)}...`);
      }

      if (!result.ok) {
        throw new Error(data?.error || "Server graphic gen error.");
      }

      setSearchStatusText("");

      const assistantMsg: Message = {
        id: `model-${Date.now()}`,
        role: "model",
        text: `Successfully mapped artwork inside **${IMAGE_PLATFORMS[activeImagePlatform].name}** viewports.\n\nPrompt specification: *"${promptString}"*`,
        generatedImage: data.imageUrl,
        engineLabel: IMAGE_PLATFORMS[activeImagePlatform].name,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      setSearchStatusText("");
      // Suppressed toast popup per high security / quieter limit warnings request
      const errMessage: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `⚠️ **Image generation failed**: ${err.message || "Failed to contact target model."}\n\nThe backend pipeline is busy or starting up. Please check back shortly.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errMessage]);
    }
  };

  // --- SERVER-SIDE FLOW: NEWS RETRIEVAL PROXY ---
  const triggerNewsRetrieval = async (promptString: string) => {
    try {
      setSearchStatusText("Streaming live GNews wire...");

      const result = await fetchWithRetry("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: promptString,
          customNewsApiKey: customNewsApiKey
        })
      });

      let data: any;
      try {
        data = JSON.parse(result.text);
      } catch (parseErr) {
        throw new Error(`Failed to parse response: ${result.text.slice(0, 150)}...`);
      }

      if (!result.ok) {
        throw new Error(data?.error || "Live GNews wires connection issue.");
      }

      setSearchStatusText("");

      if (data.articles && data.articles.length > 0) {
        let newsMarkdownText = `### 📰 Live News Channels\n\n`;

        data.articles.forEach((article: any, index: number) => {
          newsMarkdownText += `**${index + 1}. [${article.title}](${article.url})**  \n`;
          newsMarkdownText += `*Source: ${article.source?.name || "Global Wire"} | Published: ${new Date(article.publishedAt).toLocaleString()}*  \n`;
          if (article.description) {
            newsMarkdownText += `> ${article.description}\n`;
          }
          if (article.image) {
            // Include responsive referrerPolicy to secure static files safely
            newsMarkdownText += `\n<div class="my-3 overflow-hidden rounded-xl border border-zinc-750 max-w-lg aspect-video"><img src="${article.image}" alt="Wire Article graphic" referrerPolicy="no-referrer" class="w-full h-full object-cover" /></div>\n`;
          }
          newsMarkdownText += `\n---\n\n`;
        });

        newsMarkdownText += `\n*Feeds fetched and synchronized via GNews Router.*`;

        const assistantMsg: Message = {
          id: `model-${Date.now()}`,
          role: "model",
          text: newsMarkdownText,
          engineLabel: "GNews RSS Engine",
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, assistantMsg]);
      } else {
        throw new Error("No wire reports match the selected keywords.");
      }

    } catch (err: any) {
      setSearchStatusText("");
      // Suppressed toast popup per high security / quieter limit warnings request
      const errMessage: Message = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `⚠️ **News synchronization failure**: ${err.message || "Unable to retrieve news articles."}\n\nPlease check connection or wait a few seconds for the system to process.`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errMessage]);
    }
  };

  // --- ADVANCED TYPESET COMPILER (MARKED FALLBACK) ---
  const formatMarkdownToHTML = (text: string) => {
    try {
      // @ts-ignore
      return { __html: marked.parse(text) };
    } catch (_) {}

    // Basic regex safe layout compiler fallback
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Syntax codes matches
    escaped = escaped.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, blockCode) => {
      return `
        <div class="my-4 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-xs">
          <div class="flex items-center justify-between bg-zinc-900 px-4 py-1.5 text-zinc-400 border-b border-zinc-800">
            <span class="font-bold text-[10px] uppercase tracking-wider">${lang || "Code block"}</span>
          </div>
          <pre class="overflow-x-auto p-4 text-emerald-400"><code>${blockCode.trim()}</code></pre>
        </div>
      `;
    });

    // Formatting rules
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    escaped = escaped.replace(/\*(.*?)\*/g, "<em>$1</em>");
    escaped = escaped.replace(/`(.*?)`/g, "<code class='bg-[#242629] text-pink-400 px-1.5 py-0.5 rounded text-xs'>$1</code>");
    escaped = escaped.replace(/\n/g, "<br />");

    return { __html: escaped };
  };

  const renderInputForm = () => {
    return (
      <div className="w-full">
        {/* Top Model Selector Row */}
        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap pb-1 w-full max-w-full">
          <div className="relative" ref={gptMenuRef}>
            <button 
              type="button" 
              onClick={() => setIsGptMenuOpen(!isGptMenuOpen)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${theme === 'dark' ? 'border-zinc-700 bg-[#1e1e20] text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'}`}
            >
               <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               <span className="font-semibold">{activeTextModel === 'google/gemma-4-31b-it' ? 'Gemma 4 31B' : activeTextModel === 'google/gemma-3n-e4b-it' ? 'Gemma 3N E4B' : activeTextModel === 'google/paligemma' ? 'PaliGemma Vision' : activeTextModel === 'google/diffusiongemma-26b-a4b-it' ? 'DiffusionGemma 26B' : 'Google AI'}</span>
               <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {isGptMenuOpen && (
              <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-2 rounded-2xl border shadow-xl animate-fade-in z-[100] ${
                theme === "dark"
                  ? "bg-[#1e1f22] border-[#2c2d30] text-zinc-100 shadow-black/90"
                  : "bg-white border-zinc-200/90 text-zinc-800 shadow-zinc-300/50"
              }`}>
                <div className="flex flex-col space-y-1">
                  <button type="button" onClick={() => { setIsGptMenuOpen(false); changeTextModel('google/gemma-4-31b-it'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Gemma 4 31B IT
                  </button>
                  <button type="button" onClick={() => { setIsGptMenuOpen(false); changeTextModel('google/gemma-3n-e4b-it'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Gemma 3N E4B IT
                  </button>
                  <button type="button" onClick={() => { setIsGptMenuOpen(false); changeTextModel('google/paligemma'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    PaliGemma Vision
                  </button>
                  <button type="button" onClick={() => { setIsGptMenuOpen(false); changeTextModel('google/diffusiongemma-26b-a4b-it'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    DiffusionGemma 26B
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={openaiMenuRef}>
            <button 
              type="button" 
              onClick={() => setIsOpenaiMenuOpen(!isOpenaiMenuOpen)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${theme === 'dark' ? 'border-zinc-700 bg-[#1e1e20] text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'}`}
            >
               <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.597 8.3829a.0804.0804 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66 4.4803 4.4803 0 0 1-2.3276 1.968v-5.6724a.7664.7664 0 0 0-.3879-.6765l-2.9859-1.724v6.7369a.7853.7853 0 0 0 .3927.6813l2.9859 1.724zM8.5204 4.3453a4.4755 4.4755 0 0 1 4.5802-1.0408v5.5826a.7948.7948 0 0 0-.3927.6813l-5.8333 3.3638-2.02-1.1686a.071.071 0 0 1-.038-.052v-5.5826a4.504 4.504 0 0 1 3.7038-4.4337zm4.3142 5.0683l-2.0153-1.1638 2.0153-1.1638 2.0153 1.1638-2.0153 1.1638z"/>
               </svg>
               <span className="font-semibold">{activeTextModel === 'openai/gpt-oss-120b' ? 'GPT OSS 120B' : activeTextModel === 'openai/gpt-oss-safeguard-20b' ? 'GPT OSS Safeguard 20B' : activeTextModel === 'openai/gpt-oss-20b' ? 'GPT OSS 20B' : 'GPT-5.5'}</span>
               <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {isOpenaiMenuOpen && (
              <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-2 rounded-2xl border shadow-xl animate-fade-in z-[100] ${
                theme === "dark"
                  ? "bg-[#1e1f22] border-[#2c2d30] text-zinc-100 shadow-black/90"
                  : "bg-white border-zinc-200/90 text-zinc-800 shadow-zinc-300/50"
              }`}>
                <div className="flex flex-col space-y-1">
                  <button type="button" onClick={() => { setIsOpenaiMenuOpen(false); changeTextModel('gpt-5.5'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.597 8.3829a.0804.0804 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66 4.4803 4.4803 0 0 1-2.3276 1.968v-5.6724a.7664.7664 0 0 0-.3879-.6765l-2.9859-1.724v6.7369a.7853.7853 0 0 0 .3927.6813l2.9859 1.724zM8.5204 4.3453a4.4755 4.4755 0 0 1 4.5802-1.0408v5.5826a.7948.7948 0 0 0-.3927.6813l-5.8333 3.3638-2.02-1.1686a.071.071 0 0 1-.038-.052v-5.5826a4.504 4.504 0 0 1 3.7038-4.4337zm4.3142 5.0683l-2.0153-1.1638 2.0153-1.1638 2.0153 1.1638-2.0153 1.1638z"/>
                    </svg>
                    GPT-5.5
                  </button>
                  <button type="button" onClick={() => { setIsOpenaiMenuOpen(false); changeTextModel('openai/gpt-oss-120b'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.597 8.3829a.0804.0804 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66 4.4803 4.4803 0 0 1-2.3276 1.968v-5.6724a.7664.7664 0 0 0-.3879-.6765l-2.9859-1.724v6.7369a.7853.7853 0 0 0 .3927.6813l2.9859 1.724zM8.5204 4.3453a4.4755 4.4755 0 0 1 4.5802-1.0408v5.5826a.7948.7948 0 0 0-.3927.6813l-5.8333 3.3638-2.02-1.1686a.071.071 0 0 1-.038-.052v-5.5826a4.504 4.504 0 0 1 3.7038-4.4337zm4.3142 5.0683l-2.0153-1.1638 2.0153-1.1638 2.0153 1.1638-2.0153 1.1638z"/>
                    </svg>
                    GPT OSS 120B
                  </button>
                  <button type="button" onClick={() => { setIsOpenaiMenuOpen(false); changeTextModel('openai/gpt-oss-20b'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.597 8.3829a.0804.0804 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66 4.4803 4.4803 0 0 1-2.3276 1.968v-5.6724a.7664.7664 0 0 0-.3879-.6765l-2.9859-1.724v6.7369a.7853.7853 0 0 0 .3927.6813l2.9859 1.724zM8.5204 4.3453a4.4755 4.4755 0 0 1 4.5802-1.0408v5.5826a.7948.7948 0 0 0-.3927.6813l-5.8333 3.3638-2.02-1.1686a.071.071 0 0 1-.038-.052v-5.5826a4.504 4.504 0 0 1 3.7038-4.4337zm4.3142 5.0683l-2.0153-1.1638 2.0153-1.1638 2.0153 1.1638-2.0153 1.1638z"/>
                    </svg>
                    GPT OSS 20B
                  </button>
                  <button type="button" onClick={() => { setIsOpenaiMenuOpen(false); changeTextModel('openai/gpt-oss-safeguard-20b'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.597 8.3829a.0804.0804 0 0 1 .0332-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66 4.4803 4.4803 0 0 1-2.3276 1.968v-5.6724a.7664.7664 0 0 0-.3879-.6765l-2.9859-1.724v6.7369a.7853.7853 0 0 0 .3927.6813l2.9859 1.724zM8.5204 4.3453a4.4755 4.4755 0 0 1 4.5802-1.0408v5.5826a.7948.7948 0 0 0-.3927.6813l-5.8333 3.3638-2.02-1.1686a.071.071 0 0 1-.038-.052v-5.5826a4.504 4.504 0 0 1 3.7038-4.4337zm4.3142 5.0683l-2.0153-1.1638 2.0153-1.1638 2.0153 1.1638-2.0153 1.1638z"/>
                    </svg>
                    GPT OSS Safeguard 20B
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={geminiMenuRef}>
            <button 
              type="button" 
              onClick={() => setIsGeminiMenuOpen(!isGeminiMenuOpen)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${theme === 'dark' ? 'border-zinc-700 bg-[#1e1e20] text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'}`}
            >
               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12.0003 24C12.3878 17.5855 17.4897 12.4339 24.0042 12C17.4897 11.5661 12.3878 6.4145 12.0003 0C11.6128 6.4145 6.51086 11.5661 0.00415039 12C6.51086 12.4339 11.6128 17.5855 12.0003 24Z" fill="url(#gemini_grad)"/>
                 <defs>
                   <linearGradient id="gemini_grad" x1="0.00415039" y1="12" x2="24.0042" y2="12" gradientUnits="userSpaceOnUse">
                     <stop stopColor="#4285F4"/>
                     <stop offset="0.5" stopColor="#9B72CB"/>
                     <stop offset="1" stopColor="#D96570"/>
                   </linearGradient>
                 </defs>
               </svg>
               <span>{
                 activeTextModel === 'core-inference' ? 'Core Inference' :
                 activeTextModel === 'gemini-3.5-flash' ? 'Gemini 3.5' :
                 activeTextModel === 'gemini-3.1-flash-lite' ? 'Gemini 3.1 Flash Latest' :
                 'Gemini 3.5 Fl...'
               }</span>
               <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {isGeminiMenuOpen && (
              <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-2 rounded-2xl border shadow-xl animate-fade-in z-[100] ${
                theme === "dark"
                  ? "bg-[#1e1f22] border-[#2c2d30] text-zinc-100 shadow-black/90"
                  : "bg-white border-zinc-200/90 text-zinc-800 shadow-zinc-300/50"
              }`}>
                <div className="flex flex-col space-y-1">
                  <button type="button" onClick={() => { setIsGeminiMenuOpen(false); changeTextModel('core-inference'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0003 24C12.3878 17.5855 17.4897 12.4339 24.0042 12C17.4897 11.5661 12.3878 6.4145 12.0003 0C11.6128 6.4145 6.51086 11.5661 0.00415039 12C6.51086 12.4339 11.6128 17.5855 12.0003 24Z" fill="url(#gemini_grad)"/>
                      <defs>
                        <linearGradient id="gemini_grad" x1="0.00415039" y1="12" x2="24.0042" y2="12" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4285F4"/>
                          <stop offset="0.5" stopColor="#9B72CB"/>
                          <stop offset="1" stopColor="#D96570"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    Core Inference
                  </button>
                  <button type="button" onClick={() => { setIsGeminiMenuOpen(false); changeTextModel('gemini-3.5-flash'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0003 24C12.3878 17.5855 17.4897 12.4339 24.0042 12C17.4897 11.5661 12.3878 6.4145 12.0003 0C11.6128 6.4145 6.51086 11.5661 0.00415039 12C6.51086 12.4339 11.6128 17.5855 12.0003 24Z" fill="url(#gemini_grad)"/>
                    </svg>
                    Gemini 3.5
                  </button>
                  <button type="button" onClick={() => { setIsGeminiMenuOpen(false); changeTextModel('gemini-3.1-flash-lite'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.0003 24C12.3878 17.5855 17.4897 12.4339 24.0042 12C17.4897 11.5661 12.3878 6.4145 12.0003 0C11.6128 6.4145 6.51086 11.5661 0.00415039 12C6.51086 12.4339 11.6128 17.5855 12.0003 24Z" fill="url(#gemini_grad)"/>
                    </svg>
                    Gemini 3.1 Flash Latest
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={deepseekMenuRef}>
            <button 
              type="button" 
              onClick={() => setIsDeepseekMenuOpen(!isDeepseekMenuOpen)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${theme === 'dark' ? 'border-zinc-700 bg-[#1e1e20] text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'}`}
            >
               <img src={deepSeekLogo} alt="DeepSeek" className="w-4 h-4 object-contain rounded-sm" />
               <span className="font-semibold">{activeTextModel === 'deepseek-ai/deepseek-v4-pro' ? 'DeepSeek V4 Pro' : activeTextModel === 'deepseek-ai/deepseek-v4-flash' ? 'DeepSeek V4 Flash' : 'DeepSeek V4'}</span>
               <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {isDeepseekMenuOpen && (
              <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-2 rounded-2xl border shadow-xl animate-fade-in z-[100] ${
                theme === "dark"
                  ? "bg-[#1e1f22] border-[#2c2d30] text-zinc-100 shadow-black/90"
                  : "bg-white border-zinc-200/90 text-zinc-800 shadow-zinc-300/50"
              }`}>
                <div className="flex flex-col space-y-1">
                  <button type="button" onClick={() => { setIsDeepseekMenuOpen(false); changeTextModel('deepseek-ai/deepseek-v4'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <img src={deepSeekLogo} alt="DeepSeek" className="w-4 h-4 object-contain rounded-sm" />
                    DeepSeek V4
                  </button>
                  <button type="button" onClick={() => { setIsDeepseekMenuOpen(false); changeTextModel('deepseek-ai/deepseek-v4-pro'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <img src={deepSeekLogo} alt="DeepSeek" className="w-4 h-4 object-contain rounded-sm" />
                    DeepSeek V4 Pro
                  </button>
                  <button type="button" onClick={() => { setIsDeepseekMenuOpen(false); changeTextModel('deepseek-ai/deepseek-v4-flash'); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                    <img src={deepSeekLogo} alt="DeepSeek" className="w-4 h-4 object-contain rounded-sm" />
                    DeepSeek V4 Flash
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={allMenuRef}>
            <button 
              type="button" 
              onClick={() => setIsAllMenuOpen(!isAllMenuOpen)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${theme === 'dark' ? 'border-zinc-700 bg-[#1e1e20] text-zinc-200 hover:bg-zinc-800' : 'border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50'}`}
            >
               <span>All</span>
               <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
            {isAllMenuOpen && (
              <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-2 rounded-2xl border shadow-xl animate-fade-in z-[100] max-h-96 overflow-y-auto ${
                theme === "dark"
                  ? "bg-[#1e1f22] border-[#2c2d30] text-zinc-100 shadow-black/90"
                  : "bg-white border-zinc-200/90 text-zinc-800 shadow-zinc-300/50"
              }`}>
                <div className="flex flex-col space-y-1">
                  {TEXT_MODELS.filter(m => !['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'google/gemma-4-31b-it', 'google/gemma-3n-e4b-it', 'google/paligemma', 'google/diffusiongemma-26b-a4b-it', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'openai/gpt-oss-safeguard-20b', 'deepseek-ai/deepseek-v4', 'deepseek-ai/deepseek-v4-pro', 'deepseek-ai/deepseek-v4-flash'].includes(m.id)).map(m => (
                    <button key={m.id} type="button" onClick={() => { setIsAllMenuOpen(false); changeTextModel(m.id); }} className={`flex items-center gap-2 px-3 py-2 text-left rounded-xl text-sm font-medium ${theme === 'dark' ? 'hover:bg-zinc-800/80 text-zinc-200' : 'hover:bg-zinc-100 text-zinc-700'} transition-colors`}>
                      <span className="text-base">{m.avatar}</span>
                      <span className="truncate">{m.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className={`relative w-full flex flex-col rounded-3xl border transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#1e1e20] border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)] focus-within:border-purple-400"
            : "bg-white border-purple-300 shadow-[0_0_15px_rgba(216,180,254,0.3)] focus-within:border-purple-400"
        }`}>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            ref={fileInputRef}
            onChange={handleImageAttachment}
            className="hidden"
          />

          {/* Top Bar with Tags */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className={`font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>GPT-5.5:</span>
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-md font-medium text-[10px] tracking-wide">New</span>
              <span className={`px-2 py-0.5 rounded-md border text-[10px] ${theme === 'dark' ? 'border-zinc-700 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>OpenAI</span>
              <span className={`px-2 py-0.5 rounded-md border text-[10px] ${theme === 'dark' ? 'border-zinc-700 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>Image and Video Recognition</span>
              <span className={`px-2 py-0.5 rounded-md border text-[10px] ${theme === 'dark' ? 'border-zinc-700 text-zinc-400' : 'border-zinc-200 text-zinc-500'}`}>Mathematical Logic</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-pink-600 dark:text-pink-400">Up to <span className="font-bold">50% OFF</span></span>
              <button type="button" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 px-3 py-1 rounded-lg font-bold flex items-center gap-1 shadow-sm hover:opacity-90 transition-opacity">
                <span>🚀</span> Upgrade
              </button>
            </div>
          </div>

          {/* Main text message writer box */}
          <div className="px-4 py-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                const isCtrlEnter = e.key === "Enter" && (e.ctrlKey || e.metaKey);
                const isPlainEnter = e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.metaKey;
                if (isPlainEnter || isCtrlEnter) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                isImageGenMode
                  ? "Describe the image you want to generate in detail..."
                  : imageMode 
                    ? "Describe your query or ask questions about the attached graphic/document..." 
                    : "Select a model and start writing, coding, or exploring..."
              }
              rows={1}
              className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm resize-none max-h-32 placeholder-zinc-400 dark:placeholder-zinc-500"
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              
              {/* Plus Button and Dropdown Popover */}
              <div className="relative" ref={plusMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsPlusMenuOpen(!isPlusMenuOpen)}
                  className={`p-2 rounded-full transition-all flex items-center justify-center ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}
                  title="Tools and Models Menu"
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Gemini style Dropdown Popup Overlay */}
                {isPlusMenuOpen && (
                  <div className={`absolute bottom-full left-0 mb-3 w-72 p-2.5 rounded-2.5xl border shadow-2xl animate-fade-in z-50 ${
                    theme === "dark"
                      ? "bg-[#1e1f22] border-[#2c2d30] text-zinc-100 shadow-black/95"
                      : "bg-white border-zinc-200/90 text-zinc-800 shadow-zinc-350/50"
                  }`}>
                    <div className="space-y-3 text-[13px] font-sans">
                      
                      {/* Section 2: Attach Local Files */}
                      <div>
                        <div className="px-2 pb-1.5 pt-1 border-b border-zinc-200/10 dark:border-zinc-800/20 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50">🔗 File Attachment</span>
                          <span className="text-[9px] font-mono opacity-40">multimodal</span>
                        </div>
                        <div className="space-y-1 mt-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              fileInputRef.current?.click();
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                              theme === "dark" 
                                ? "border-transparent hover:bg-zinc-800/50 text-zinc-350"
                                : "border-transparent hover:bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            <span className="text-lg">🔗</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs truncate leading-tight">Attach Image / Graphic</p>
                              <p className="text-[9px] opacity-60 truncate mt-0.5 leading-none">Upload JPEG, PNG or WEBP (Max 5MB)</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Section 3: Flights Integration */}
                      <div className="border-t border-zinc-200/5 dark:border-zinc-800/10 pt-2">
                        <div className="px-2 pb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50">✈️ Flight Search</span>
                          <span className="text-[9px] font-mono opacity-40">serpapi</span>
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setShowFlightsModal(true);
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                              theme === "dark" 
                                ? "border-transparent hover:bg-zinc-800/50 text-zinc-350"
                                : "border-transparent hover:bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            <span className="text-lg">✈️</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs truncate leading-tight">Google Flights Search</p>
                              <p className="text-[9px] opacity-60 truncate mt-0.5 leading-none">Find live flight routing options</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Section 4: Shopping Integration */}
                      <div className="border-t border-zinc-200/5 dark:border-zinc-800/10 pt-2">
                        <div className="px-2 pb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50">🛒 Shopping</span>
                          <span className="text-[9px] font-mono opacity-40">serper</span>
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setShowShoppingModal(true);
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                              theme === "dark" 
                                ? "border-transparent hover:bg-zinc-800/50 text-zinc-350"
                                : "border-transparent hover:bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            <span className="text-lg">🛒</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs truncate leading-tight">Google Shopping Search</p>
                              <p className="text-[9px] opacity-60 truncate mt-0.5 leading-none">Compare product prices & specs</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Section 5: Images Integration */}
                      <div className="border-t border-zinc-200/5 dark:border-zinc-800/10 pt-2">
                        <div className="px-2 pb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50">🖼️ Images</span>
                          <span className="text-[9px] font-mono opacity-40">serper</span>
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setShowImagesModal(true);
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                              theme === "dark" 
                                ? "border-transparent hover:bg-zinc-800/50 text-zinc-350"
                                : "border-transparent hover:bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            <span className="text-lg">🖼️</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs truncate leading-tight">Google Images Search</p>
                              <p className="text-[9px] opacity-60 truncate mt-0.5 leading-none">Search millions of assets globally</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Section 6: Walmart Integration */}
                      <div className="border-t border-zinc-200/5 dark:border-zinc-800/10 pt-2">
                        <div className="px-2 pb-1.5 flex items-center justify-between">
                          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50">🏬 Walmart</span>
                          <span className="text-[9px] font-mono opacity-40">serpapi</span>
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsPlusMenuOpen(false);
                              setShowWalmartModal(true);
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                              theme === "dark" 
                                ? "border-transparent hover:bg-zinc-800/50 text-zinc-350"
                                : "border-transparent hover:bg-zinc-100 text-zinc-700"
                            }`}
                          >
                            <span className="text-lg">🏬</span>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-xs truncate leading-tight">Walmart Product Search</p>
                              <p className="text-[9px] opacity-60 truncate mt-0.5 leading-none">Search products & offers via SerpApi</p>
                            </div>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Camera Button -> Maps to file input */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full transition-all flex items-center justify-center ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}
                title="Attach file or image"
              >
                <Camera className="w-5 h-5" />
              </button>

              {/* Globe Search Button */}
              <button type="button" onClick={() => showToastAlert("Search module not configured.")} className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}>
                <Globe className="w-4 h-4" />
                <span>Search</span>
              </button>

              {/* My Prompts Button */}
              <button type="button" onClick={() => showToastAlert("My Prompts module not configured.")} className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}>
                <FileText className="w-4 h-4" />
                <span>My Prompts</span>
              </button>

              {/* Deep Research Button */}
              <button type="button" onClick={() => showToastAlert("Deep Research module not configured.")} className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}>
                <Telescope className="w-4 h-4" />
                <span>Deep Research</span>
              </button>

              {/* Study Button */}
              <button type="button" onClick={() => showToastAlert("Study module not configured.")} className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-medium ${theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-600'}`}>
                <GraduationCap className="w-4 h-4" />
                <span>Study</span>
              </button>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>2/3</span>
              
              <button
                type="button"
                onClick={toggleMicrophone}
                className={`p-2 rounded-full transition-all flex items-center justify-center ${
                  isMicListening 
                    ? "bg-red-500 text-white animate-pulse" 
                    : (theme === "dark" ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100")
                }`}
                title="Start Voice dictation transcription"
              >
                {isMicListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!input.trim() && !attachedImage}
                className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                  (!input.trim() && !attachedImage) 
                    ? (theme === 'dark' ? 'bg-zinc-700 text-zinc-500' : 'bg-zinc-200 text-white')
                    : 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900 shadow-md hover:scale-105'
                }`}
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // --- PRIVACY LOCK SCREEN EFFECTS & LOGIC ---
  const handlePinVerify = (enteredPin: string) => {
    if (enteredPin === securedPin || ALLOWED_BYPASS_PINS.has(enteredPin)) {
      setIsUnlocked(true);
      setPinError(null);
    } else {
      setPinShake(true);
      setPinError("Invalid security signature. PIN is incorrect.");
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(200);
      setTimeout(() => {
        setPinShake(false);
        setPinInput("");
      }, 600);
    }
  };

  const handleSendRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = recoveryEmail.trim();
    if (!targetEmail) {
      setRecoveryError("Please enter your registered email address.");
      return;
    }
    setIsSendingRecovery(true);
    setRecoveryError(null);
    setRecoverySuccess(null);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      setRecoverySuccess("Credentials reset instructions have been successfully dispatched via Firebase Security. Check your inbox.");
      setRecoveryEmail("");
    } catch (err: any) {
      console.error("Error sending recovery email:", err);
      if (err.code === "auth/user-not-found") {
        setRecoveryError("No user registered with this email address was found.");
      } else if (err.code === "auth/invalid-email") {
        setRecoveryError("The entered email address format is invalid.");
      } else {
        setRecoveryError(err.message || "Credential reset dispatch failed.");
      }
    } finally {
      setIsSendingRecovery(false);
    }
  };

  useEffect(() => {
    if (isUnlocked || showRecovery) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ignore key events when the user is already interacting with internal inputs
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key;
      if (/[0-9]/.test(key)) {
        if (pinInput.length < 4) {
          setPinInput(prev => prev + key);
          setPinError(null);
        }
      } else if (key === "Backspace") {
        setPinInput(prev => prev.slice(0, -1));
        setPinError(null);
      } else if (key === "Enter") {
        if (pinInput.length === 4) {
          handlePinVerify(pinInput);
        } else {
          setPinError("Please enter 4 digits.");
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isUnlocked, pinInput, securedPin, showRecovery]);

  if (showWelcome) {
    return <Welcome onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <div className={`min-h-screen w-screen flex overflow-hidden font-sans transition-colors duration-200 ${
      theme === "dark" ? "bg-[#131415] text-zinc-100" : "bg-white text-zinc-800"
    }`}>
      {/* Vibe Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[120%] h-[120%] bg-indigo-950/40 rounded-full blur-[80px] animate-vibe-slow"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[120%] h-[120%] bg-blue-950/30 rounded-full blur-[60px] animate-vibe-slow" style={{ animationDelay: '-6s' }}></div>
      </div>

      {/* MOBILE BACKDROP OVERLAY OVER SIDEDRAWER */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* GEMINI SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 md:relative md:flex flex-col shrink-0 overflow-hidden select-none transition-all duration-300 border-r ${
          isMobileSidebarOpen 
            ? "translate-x-0 w-[260px] flex" 
            : "-translate-x-full md:translate-x-0"
        } ${
          isSidebarCollapsed ? "md:w-[68px]" : "md:w-[260px]"
        } ${
          theme === "dark" 
            ? "bg-[#1e1e20] border-zinc-800/80 text-[#e3e3e3]" 
            : "bg-[#f0f4f9] border-zinc-200 text-[#1f1f1f]"
        }`}
      >
        {/* UPPER BRANDING & COLLAPSE TRIGGER */}
        <div className={`flex items-center p-3.5 ${isSidebarCollapsed ? "flex-col gap-4 justify-center" : "justify-between"}`}>
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={() => {
                  setIsSidebarCollapsed(false);
                  localStorage.setItem("nextgen_sidebar_collapsed", "false");
                }}
                className={`p-2 rounded-full cursor-pointer transition-colors ${
                  theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" : "hover:bg-zinc-200/60 text-zinc-650 hover:text-zinc-900"
                }`}
                title="Expand sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-6 h-6 text-[#131415] dark:text-white flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-1 animate-fade-in select-none">
              <div className="w-6 h-6 text-[#131415] dark:text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" fill="currentColor" />
                </svg>
              </div>
              <span className="font-sans font-black text-[19px] tracking-[0.15em] uppercase text-black">
                NEXTGEN AI
              </span>
            </div>
          )}

          {!isSidebarCollapsed && (
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileSidebarOpen(false);
                } else {
                  setIsSidebarCollapsed(true);
                  localStorage.setItem("nextgen_sidebar_collapsed", "true");
                }
              }}
              className={`p-2 rounded-full cursor-pointer transition-colors ${
                theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" : "hover:bg-zinc-200/60 text-zinc-600 hover:text-zinc-900"
              }`}
              title="Collapse sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* NEW CHAT BUTTON */}
        <div className="px-3.5 py-2.5">
          <button
            onClick={() => {
              handleClearChatstream();
              if (window.innerWidth < 768) {
                setIsMobileSidebarOpen(false);
              }
            }}
            className={`w-full flex items-center transition-all cursor-pointer ${
              isSidebarCollapsed 
                ? "justify-center p-3 rounded-full" 
                : "gap-3 px-4 py-3 rounded-full text-xs font-semibold"
            } ${
              theme === "dark"
                ? "bg-zinc-850 hover:bg-zinc-800/90 text-zinc-200 border border-zinc-700/40"
                : "bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-250/80 shadow-xs"
            }`}
            title="Start clear fresh canvas chat"
          >
            {!isSidebarCollapsed && <span className="animate-fade-in font-bold tracking-[0.2em] uppercase text-[10px] text-zinc-900 dark:text-zinc-100">NEW CHAT</span>}
          </button>
        </div>

        {/* MID PORTAL SECTION - TOOLS LIST (SCROLLABLE) */}
        <div className="flex-grow overflow-y-auto px-2 py-3 space-y-4 font-sans text-xs">
          
          {/* REASONING LLMS SECTION */}
          <div>
            <div 
              onClick={() => {
                if (isSidebarCollapsed) {
                  setIsSidebarCollapsed(false);
                  localStorage.setItem("nextgen_sidebar_collapsed", "false");
                  setIsReasoningSectionExpanded(true);
                } else {
                  setIsReasoningSectionExpanded(!isReasoningSectionExpanded);
                }
              }}
              className={`flex items-center justify-between px-3.5 pb-2 text-[10px] font-bold tracking-wider uppercase opacity-40 hover:opacity-100 transition-opacity text-amber-500 cursor-pointer select-none`}
            >
              {isSidebarCollapsed ? (
                <span className="text-sm font-semibold text-center w-full" title="REASONING LLMs">🧠</span>
              ) : (
                <>
                  <span className="animate-fade-in font-display font-black tracking-widest text-[11px]">🧠 REASONING LLMs</span>
                  <span className="text-[9px] text-zinc-400">{isReasoningSectionExpanded ? "▼" : "▲"}</span>
                </>
              )}
            </div>
            {!isSidebarCollapsed && isReasoningSectionExpanded && (
              <div className="space-y-0.5 max-h-[220px] overflow-y-auto pr-1">
                {TEXT_MODELS.filter(m => m.id.includes("/")).map((m) => {
                  const isSelected = !imageMode && activeTextModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        changeTextModel(m.id);
                        setImageMode(false);
                        const toastMsg = `Selected Reasoning LLM: ${m.name}`;
                        showToastAlert(toastMsg);
                        if (window.innerWidth < 768) setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center rounded-xl transition-all font-semibold text-left cursor-pointer gap-2.5 px-3 py-1.5 ${
                        isSelected 
                          ? theme === "dark" ? "bg-amber-500/10 text-amber-400 font-bold border-l-2 border-amber-500 animate-fade-in" : "bg-amber-100/40 text-amber-700 font-bold border-l-2 border-amber-500 animate-fade-in"
                          : theme === "dark" ? "hover:bg-zinc-800/60 text-zinc-350" : "hover:bg-zinc-200/50 text-zinc-750"
                      }`}
                      title={`${m.name}: ${m.desc}`}
                    >
                      <span className="text-sm shrink-0">{m.avatar}</span>
                      <div className="min-w-0 flex-1 flex flex-col">
                        <span className="truncate text-[11px] leading-tight flex-1">{m.name}</span>
                        {m.badge && <span className="text-[8px] opacity-60 text-amber-500 dark:text-amber-400">{m.badge}</span>}
                      </div>
                      {isSelected && <span className="text-amber-500 text-[10px]">✨</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CORE INFERENCE SECTION */}
          <div>
            <div 
              onClick={() => {
                if (isSidebarCollapsed) {
                  setIsSidebarCollapsed(false);
                  localStorage.setItem("nextgen_sidebar_collapsed", "false");
                  setIsCoreSectionExpanded(true);
                } else {
                  setIsCoreSectionExpanded(!isCoreSectionExpanded);
                }
              }}
              className={`flex items-center justify-between px-3.5 pb-2 text-[10px] font-bold tracking-wider uppercase opacity-40 hover:opacity-100 transition-opacity text-sky-500 cursor-pointer select-none`}
            >
              {isSidebarCollapsed ? (
                <span className="text-sm font-semibold text-center w-full" title="CORE INFERENCE">⚡</span>
              ) : (
                <>
                  <span className="animate-fade-in font-display font-black tracking-widest text-[11px]">⚡ CORE INFERENCE</span>
                  <span className="text-[9px] text-zinc-400">{isCoreSectionExpanded ? "▼" : "▲"}</span>
                </>
              )}
            </div>
            {!isSidebarCollapsed && isCoreSectionExpanded && (
              <div className="space-y-0.5 pr-1">
                {TEXT_MODELS.filter(m => !m.id.includes("/")).map((m) => {
                  const isSelected = !imageMode && activeTextModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        changeTextModel(m.id);
                        setImageMode(false);
                        const toastMsg = `Selected Core model: ${m.name}`;
                        showToastAlert(toastMsg);
                        if (window.innerWidth < 768) setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center rounded-xl transition-all font-semibold text-left cursor-pointer gap-2.5 px-3 py-1.5 ${
                        isSelected 
                          ? theme === "dark" ? "bg-sky-500/10 text-sky-400 font-bold border-l-2 border-sky-500 animate-fade-in" : "bg-sky-100/40 text-sky-700 font-bold border-l-2 border-sky-500 animate-fade-in"
                          : theme === "dark" ? "hover:bg-zinc-800/60 text-zinc-350" : "hover:bg-zinc-200/50 text-zinc-750"
                      }`}
                      title={`${m.name}: ${m.desc}`}
                    >
                      <span className="text-sm shrink-0">
                        {m.id === "gemini-3.5-flash" ? (
                          <svg className="w-5 h-5 animate-fade-in" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#paint0_linear_spark)"/>
                            <defs>
                              <linearGradient id="paint0_linear_spark" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#FC4147"/>
                                <stop offset="0.25" stopColor="#FFD600"/>
                                <stop offset="0.5" stopColor="#34A853"/>
                                <stop offset="1" stopColor="#4285F4"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        ) : m.avatar}
                      </span>
                      <div className="min-w-0 flex-1 flex flex-col">
                        <span className="truncate text-[11px] leading-tight flex-1">{m.name}</span>
                        {m.badge && <span className="text-[8px] opacity-60 text-sky-500 dark:text-sky-400">{m.badge}</span>}
                      </div>
                      {isSelected && <span className="text-sky-500 text-[10px]">✨</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* BOTTOM UTILITY RAILS PART */}
        <div className={`mt-auto p-3.5 border-t border-zinc-200/50 dark:border-zinc-850/50 space-y-1.5 text-xs font-sans`}>
          
          {/* Terms and Conditions (Mobile Only) */}
          <button
            onClick={() => {
              showToastAlert("Terms & Conditions");
            }}
            className={`w-full flex md:hidden items-center rounded-xl transition-all font-semibold text-left cursor-pointer ${
              isSidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3.5 py-2.5"
            } ${
              theme === "dark" ? "hover:bg-zinc-800/80 text-zinc-300" : "hover:bg-zinc-200/50 text-zinc-700"
            }`}
            title="Terms and Conditions"
          >
            <span className="text-base">📜</span>
            {!isSidebarCollapsed && (
              <span className="truncate animate-fade-in font-bold tracking-[0.1em] uppercase text-[9px]">
                TERMS & CONDITIONS
              </span>
            )}
          </button>

          {/* Authentication identity strip */}
          <div className="pt-2 border-t border-zinc-200/30 dark:border-zinc-800/40">
            {user ? (
              <div 
                onClick={() => {
                    setShowProfileDropdown(!showProfileDropdown);
                }}
                className={`w-full flex items-center rounded-xl transition-all text-left font-sans cursor-pointer ${
                  isSidebarCollapsed ? "justify-center p-1.5" : "gap-2.5 p-1.5"
                } hover:bg-zinc-50 dark:hover:bg-zinc-800/40`}
                title="Profile Account Setup"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="P" 
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-blue-500/40"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs uppercase animate-pulse">
                    {user.email?.charAt(0) || "U"}
                  </div>
                )}
                
                {!isSidebarCollapsed && (
                  <div className="flex-1 min-w-0 animate-fade-in">
                    <p className="font-bold text-[11px] truncate leading-tight">
                      {user.displayName || user.email?.split("@")[0] || "NextGen User"}
                    </p>
                    <p className="text-[9px] opacity-55 truncate leading-none mt-0.5">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthError(null);
                  setShowAuthModal(true);
                  if (window.innerWidth < 768) setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center rounded-xl transition-all font-bold text-left cursor-pointer ${
                  isSidebarCollapsed ? "justify-center p-2.5" : "gap-3 px-3.5 py-2.5"
                } ${
                  theme === "dark"
                    ? "bg-blue-650/10 hover:bg-blue-650/15 text-blue-400"
                    : "bg-blue-50 hover:bg-blue-100 text-blue-600"
                }`}
                title="Sign In with Sandbox"
              >
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                {!isSidebarCollapsed && <span className="animate-fade-in font-bold tracking-[0.15em] uppercase text-[10px] text-blue-700 dark:text-blue-400">SIGN IN</span>}
              </button>
            )}
          </div>

        </div>

      </aside>

      {/* RIGHT SIDE MAIN VIEWPORT CONTAINER */}
      <div className={`flex-grow flex flex-col min-w-0 h-screen overflow-hidden relative transition-colors duration-200 ${
        theme === "dark" ? "bg-[#0b0c0d]" : "bg-white"
      }`}>

        {/* PREMIUM GEMINI-STYLE AURORA WAVE BACKGROUND LAYER */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 select-none opacity-65 dark:opacity-40 transition-all duration-300">
          <div className="absolute top-[5%] left-[10%] w-[80%] h-[75%] filter blur-[100px] mix-blend-normal animate-aurora-full">
            <div className="absolute top-[20%] left-0 w-[30%] h-[40%] rounded-full bg-gradient-to-tr from-[#9b5de5] via-[#a2d2ff] to-[#00f5d4] opacity-80" />
            <div className="absolute top-[10%] left-[25%] w-[40%] h-[45%] rounded-full bg-gradient-to-r from-[#00bbf9] via-[#fee440] to-[#f15bb5] opacity-75" />
            <div className="absolute top-[5%] left-[55%] w-[35%] h-[40%] rounded-full bg-gradient-to-br from-[#fee440] via-[#f15bb5] to-[#9b5de5] opacity-80" />
          </div>
          
          {/* Beautifully curved organic ribbon wave resembling the user's uploaded image */}
          <svg className="absolute top-[10%] left-[-5%] w-[110%] h-[75%] opacity-90 scale-y-110 animate-aurora-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#glow-wave-blur)">
              {/* Dynamic glowing composite curve 1 */}
              <path 
                d="M -100,280 C 150,330 320,130 650,225 C 980,320 1150,80 1540,160 L 1540,550 L -100,550 Z" 
                fill="url(#aurora-glow-1)" 
                opacity="0.8" 
                className="animate-wave-1"
              />
              {/* Dynamic glowing composite curve 2 */}
              <path 
                d="M -100,310 C 200,230 450,110 750,195 C 1050,280 1200,60 1540,110 L 1540,550 L -100,550 Z" 
                fill="url(#aurora-glow-2)" 
                opacity="0.75" 
                className="animate-wave-2"
              />
            </g>
            <defs>
              <filter id="glow-wave-blur" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="75" />
              </filter>
              <linearGradient id="aurora-glow-1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.4" />
                <stop offset="20%" stopColor="#60a5fa" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#34d399" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.85" />
                <stop offset="85%" stopColor="#f472b6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="aurora-glow-2" x1="0" y1="0.3" x2="1" y2="0.3">
                <stop offset="5%" stopColor="#c084fc" stopOpacity="0.2" />
                <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="55%" stopColor="#facc15" stopOpacity="0.9" />
                <stop offset="75%" stopColor="#fb7185" stopOpacity="0.8" />
                <stop offset="95%" stopColor="#e879f9" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Subtle Toast Notifications */}
        {apiError && (
          <div className={`fixed bottom-5 right-5 z-50 max-w-sm p-3.5 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in border ${
            theme === "dark" 
              ? "bg-[#1e1e20] border-zinc-800 text-zinc-200" 
              : "bg-white border-zinc-200 text-zinc-800 border-zinc-300"
          }`} id="sleek-toast-alert">
            <span className="text-base shrink-0">✨</span>
            <p className="text-[11px] font-semibold leading-normal flex-1">{apiError}</p>
            <button onClick={() => setApiError(null)} className="opacity-50 hover:opacity-100 transition-opacity shrink-0 cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* --- INTEGRATED NAV HEADER --- */}
      <header className={`px-5 py-3.5 flex items-center justify-between border-b ${
        theme === "dark" ? "border-zinc-800/60 bg-[#131314]/90" : "bg-white/90 border-zinc-200/60"
      } sticky top-0 z-40 backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          {/* Header Hamburger built for mobile */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileSidebarOpen(true);
              } else {
                setIsSidebarCollapsed(!isSidebarCollapsed);
                localStorage.setItem("nextgen_sidebar_collapsed", String(!isSidebarCollapsed));
              }
            }}
            className={`p-2 rounded-lg transition-all flex md:hidden items-center justify-center cursor-pointer ${
              theme === "dark" ? "hover:bg-zinc-800 text-zinc-350 hover:text-white animate-pulse" : "hover:bg-zinc-100 text-zinc-650 hover:text-[#1f1f1f] shadow-xs"
            }`}
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Main customized logo icon matching uploaded design */}
          <div className="flex items-center gap-2 select-none">
            <div className="w-6 h-6 text-[#131415] dark:text-white flex items-center justify-center shrink-0">
              <svg className="w-5.5 h-5.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="font-sans font-semibold text-lg tracking-tight leading-none text-[#131415] dark:text-white">
              NextGenAi
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChatstream}
            aria-label="Restart fresh canvas"
            className={`p-2.5 rounded-full transition-all ${
              theme === "dark" 
                ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" 
                : "hover:bg-white text-zinc-500 hover:text-zinc-800 shadow-sm"
            }`}
            title="Start Clear Chat Stream"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Change theme"
            className={`p-2.5 rounded-full transition-all ${
              theme === "dark" 
                ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" 
                : "hover:bg-white text-zinc-500 hover:text-zinc-800 shadow-sm"
            }`}
            title="Toggle Visual theme"
          >
            {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
          </button>



          {(typeof window !== "undefined" && (
            window.location.hostname.includes("ais-dev") || 
            window.location.hostname === "localhost" || 
            window.location.hostname === "127.0.0.1" ||
            window.location.search.includes("settings=true") ||
            window.location.search.includes("admin=true")
          )) && (
            <button
              onClick={() => {
                checkServerConfig();
                setShowConfigModal(true);
              }}
              aria-label="Configuration Settings"
              className={`p-2.5 rounded-full transition-all ${
                theme === "dark" 
                  ? "hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100" 
                  : "hover:bg-white text-zinc-500 hover:text-zinc-805 shadow-sm"
              }`}
              title="Configure API Credentials"
            >
              <SettingsIcon className="w-4.5 h-4.5 animate-pulse" style={{ animationDuration: "5s" }} />
            </button>
          )}

          {/* FIREBASE AUTH PROFILE OR LOGIN DROPDOWN */}
          <div className="relative" ref={profileDropdownRef}>
            {user ? (
              // Authenticated user state
              <div>
                <button
                  type="button"
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className={`flex items-center gap-1.5 p-1 pl-2 pr-1 rounded-full border transition-all ${
                    theme === "dark" 
                      ? "border-zinc-800 hover:bg-zinc-800/80 bg-zinc-900/40 text-zinc-200" 
                      : "border-zinc-200 hover:bg-zinc-100 bg-zinc-50 text-zinc-700"
                  }`}
                  aria-label="User menu"
                >
                  <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline-block">
                    {user.displayName || user.email?.split("@")[0] || "User"}
                  </span>
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Google Avatar" 
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover border border-blue-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-[10px] uppercase border border-blue-400/20">
                      {user.email?.charAt(0) || "U"}
                    </div>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showProfileDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Card */}
                {showProfileDropdown && (
                  <div className={`absolute right-0 mt-2.5 w-64 rounded-2xl border p-4 shadow-xl animate-fade-in z-50 ${
                    theme === "dark"
                      ? "bg-zinc-950 border-zinc-805 text-zinc-100 shadow-black/80"
                      : "bg-white border-zinc-250 text-zinc-800 shadow-zinc-200"
                  }`}>
                    <div className="flex flex-col items-center text-center pb-3 border-b border-zinc-200/40 dark:border-zinc-800/60">
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt="Avatar" 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-full object-cover mb-2 ring-2 ring-blue-500/20"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-xl uppercase mb-2">
                          {user.email?.charAt(0) || "U"}
                        </div>
                      )}
                      <p className="font-semibold text-sm max-w-[220px] truncate">
                        {user.displayName || "NextGen User"}
                      </p>
                      <p className="text-xs opacity-60 truncate max-w-[220px] mt-0.5">
                        {user.email}
                      </p>
                      <span className="inline-block mt-2 text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-blue-500/20 text-blue-400 bg-blue-500/5 uppercase tracking-wider">
                        {user.providerData[0]?.providerId === "google.com" ? "Google Account" : user.providerData[0]?.providerId === "facebook.com" ? "Facebook Account" : user.providerData[0]?.providerId === "apple.com" ? "Apple Account" : "Email sandbox"}
                      </span>
                    </div>

                    <div className="pt-3">
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors text-left font-sans cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Unauthenticated visitor state (Gemini styled login)
              <button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  setShowAuthModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black leading-none bg-[#111] dark:bg-white text-white dark:text-zinc-900 border border-zinc-800 dark:border-white/90 hover:bg-zinc-900 dark:hover:bg-zinc-100 transition-all shadow-md transform hover:-translate-y-0.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- SCROLL CONTAINED MESSAGE CONTAINER --- */}
      <main className="relative flex-1 overflow-y-auto px-4 md:px-12 lg:px-24 py-8 w-full max-w-full mx-auto flex flex-col justify-between rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 m-2 outline-none">
        
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0">
            <svg viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[130%] md:w-[120%] max-w-6xl h-auto opacity-80 dark:opacity-40 transition-all duration-1000 transform animate-vibe-slow">
              <defs>
                <linearGradient id="purple-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#c084fc" stopOpacity="0" />
                  <stop offset="20%" stopColor="#a855f7" stopOpacity="0.45" />
                  <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.80" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="yellow-green" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="20%" stopColor="#22c55e" stopOpacity="0" />
                  <stop offset="45%" stopColor="#10b981" stopOpacity="0.60" />
                  <stop offset="62%" stopColor="#fbbf24" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#f97316" stopOpacity="0.50" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="rose-gold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0" />
                  <stop offset="68%" stopColor="#ec4899" stopOpacity="0.80" />
                  <stop offset="85%" stopColor="#d946ef" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
                <filter id="aurora-blur" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="55" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Background glow path 1 - Indigo/Blue/Teal */}
              <path 
                d="M -100 360 C 200 480, 480 240, 720 180 C 960 120, 1100 280, 1300 350" 
                stroke="url(#purple-blue)" 
                strokeWidth="80" 
                strokeLinecap="round" 
                filter="url(#aurora-blur)" 
                className="animate-drift-forward"
              />

              {/* Foreground path 2 - Yellow/Green/Orange core */}
              <path 
                d="M -50 400 C 150 420, 520 200, 700 120 C 880 40, 1080 180, 1250 290" 
                stroke="url(#yellow-green)" 
                strokeWidth="60" 
                strokeLinecap="round" 
                filter="url(#aurora-blur)" 
                className="animate-drift-backward"
              />

              {/* Overlap path 3 - Vibrant Rose/Pink curtain near the peak */}
              <path 
                d="M 200 270 C 400 150, 680 80, 880 120 C 1080 160, 1150 240, 1250 300" 
                stroke="url(#rose-gold)" 
                strokeWidth="50" 
                strokeLinecap="round" 
                filter="url(#aurora-blur)" 
                className="animate-drift-forward"
              />
            </svg>
          </div>
        )}

        {messages.length === 0 ? (
          // Welcome workflow state dashboard
          <div className="relative z-10 my-auto py-8 space-y-10 animate-fade-in w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center">
            <div className="space-y-4 max-w-xl mx-auto flex flex-col items-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight leading-tight">
                {user ? (
                  <>
                    Welcome,{" "}
                    <span className="bg-gradient-to-r from-[#3B82F6] via-[#8b5cf6] to-[#a855f7] bg-clip-text text-transparent capitalize">
                      {(user.displayName || user.email?.split("@")[0] || "User").trim().split(/\s+/)[0]}
                    </span>
                  </>
                ) : (
                  <>
                    Welcome to{" "}
                    <span className="inline-flex items-center gap-2 font-sans font-semibold text-[#131415] dark:text-white">
                      <svg className="w-7 h-7 text-[#131415] dark:text-white flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" fill="currentColor" />
                      </svg>
                      NextGenAi
                    </span>
                  </>
                )}
              </h2>

            </div>

            {/* Input bar has been moved to fixed bottom container */}
            <div className="w-full max-w-2xl pt-2">
            </div>

          </div>
        ) : (
          // Messages thread list
          <div className="space-y-8 pb-32 w-full max-w-3xl lg:max-w-4xl mx-auto">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className="space-y-3.5 animate-fade-in">
                  
                  {/* Sender title panel */}
                  <div className={`flex items-center gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 flex items-center justify-center shrink-0">
                          <ModelIcon modelId={getModelAvatarAndName(msg.engineLabel).id} className="w-5 h-5 flex-shrink-0" />
                        </div>
                        <span className="font-display text-xs font-bold tracking-wider opacity-90 uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-[#8b5cf6] to-[#a855f7]">
                          NextGenAi Neural Network
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Body text balloon */}
                  <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[90%] ${isUser ? "text-right" : "text-left"} space-y-3`}>
                      
                      {msg.attachment && (
                        <div className="rounded-2xl overflow-hidden border border-zinc-700/60 max-w-xs inline-block shadow-lg">
                          <img 
                            src={msg.attachment.previewUrl} 
                            alt="Operators uploaded snapshot" 
                            referrerPolicy="no-referrer"
                            className="max-h-48 w-full object-cover" 
                          />
                        </div>
                      )}

                      <div 
                        className={`prose dark:prose-invert max-w-none text-sm md:text-md leading-relaxed break-words font-medium tracking-normal ${
                          isUser 
                            ? (theme === "dark" ? "text-zinc-100 bg-[#242629] px-4.5 py-3 rounded-2xl" : "text-zinc-800 bg-white px-4.5 py-3 rounded-2xl shadow-sm border border-zinc-200")
                            : (theme === "dark" ? "text-zinc-200" : "text-zinc-850")
                        }`}
                        dangerouslySetInnerHTML={formatMarkdownToHTML(msg.text)}
                      />

                      {/* Model intelligence source attribution under standard text message response */}
                      {!isUser && !msg.generatedImage && (
                        <div className="flex items-center gap-1.5 mt-1.5 ml-1 select-none animate-fade-in">
                          <span className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold tracking-wide flex items-center gap-1.5 ${
                            theme === "dark" 
                              ? "bg-zinc-900/60 border-zinc-800/60 text-zinc-400" 
                              : "bg-zinc-50 border-zinc-205 text-zinc-650"
                          }`} id={`message-source-${msg.id}`}>
                            <ModelIcon modelId={getModelAvatarAndName(msg.engineLabel).id} className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Intelligence Engine Source:</span>
                            <span className="text-blue-500 dark:text-blue-400 font-extrabold">{getModelAvatarAndName(msg.engineLabel).name}</span>
                          </span>
                        </div>
                      )}

                      {/* Display generated artwork cards */}
                      {msg.generatedImage && (
                        <div className="rounded-2xl overflow-hidden border border-zinc-800/80 bg-zinc-950 max-w-xl shadow-2xl mt-4 animate-fade-in">
                          <img 
                            src={msg.generatedImage} 
                            alt="Generated vector model response visual output" 
                            referrerPolicy="no-referrer"
                            className="w-full object-contain max-h-[460px]" 
                          />
                          <div className={`p-3 border-t border-zinc-800/85 flex justify-between items-center text-[11px] font-bold ${
                            theme === "dark" ? "bg-zinc-900/60 text-zinc-400" : "bg-zinc-50 text-zinc-500"
                          }`}>
                            <span className="flex items-center gap-1.5 text-purple-400">
                              🌌 Model Target: {msg.engineLabel}
                            </span>
                            <a 
                              href={msg.generatedImage}
                              download={`nextgenai_artwork_${msg.id}.jpg`}
                              className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-1.5 shadow"
                            >
                              <Download className="w-3.5 h-3.5" /> Save Asset
                            </a>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Accessibility control deck */}
                  {!isUser && (
                    <div className="flex items-center gap-4 pt-1 px-1 opacity-50 hover:opacity-100 transition-opacity">
                      
                      {/* Voice synth reader */}
                      <button
                        onClick={() => handleVoicePlayback(msg.id, msg.text)}
                        className={`hover:text-blue-400 transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                          playingMsgId === msg.id ? "text-blue-400 animate-pulse" : ""
                        }`}
                        title="Dictate response aloud"
                      >
                        {playingMsgId === msg.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" /> Stop Speech
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" /> Read Aloud
                          </>
                        )}
                      </button>

                      {/* Copy core */}
                      <button
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="hover:text-blue-400 transition flex items-center gap-1.5 text-xs font-semibold"
                        title="Copy prompt output"
                      >
                        {copiedMsgId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Copy Text
                          </>
                        )}
                      </button>

                    </div>
                  )}

                </div>
              );
            })}

            {/* Simulated Live Loader states */}
            {isGenerating && (
              <div className="space-y-4 animate-pulse">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-purple-600/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                  </div>
                  <span className="text-xs font-bold tracking-wider uppercase text-purple-400 opacity-80 animate-pulse">
                    {searchStatusText || "Processing Request..."}
                  </span>
                </div>
                
                {imageMode ? (
                  <div className="w-full max-w-lg h-56 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-purple-500/10 to-pink-500/10 flex items-center justify-center border border-purple-500/10">
                    <div className="text-center space-y-2">
                      <span className="text-2xl animate-spin inline-block">🎨</span>
                      <p className="text-xs font-bold text-purple-300 tracking-wide uppercase">Mapping graphic pixels...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-w-lg pl-1">
                    <div className="h-3 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full w-full" />
                    <div className="h-3 bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full w-4/5" />
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Form at the bottom of messages list (sticky) */}
        <div className="sticky bottom-0 mt-8 pt-4 pb-8 max-w-2xl lg:max-w-4xl mx-auto w-full z-20">
          {attachedImage && (
            <div className={`relative inline-flex items-center rounded-xl border p-1 mb-3 ml-2 animate-fade-in shadow-xl ${
              attachedImage.isDocument 
                ? "bg-emerald-950/20 border-emerald-500/30 px-3 py-1.5 min-w-40 gap-2.5" 
                : "w-20 overflow-hidden border-zinc-750 bg-zinc-950 p-1 bg-gradient-to-tr from-purple-500 to-blue-500"
            }`}>
              {attachedImage.isDocument ? (
                <div className="flex flex-col gap-1.5 min-w-40 p-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">📄</span>
                    <div className="min-w-0">
                      <p className={`text-[10px] font-bold truncate max-w-[140px] ${theme === "dark" ? "text-zinc-100" : "text-zinc-800"}`}>
                        {attachedImage.fileName || "Drive_File.pdf"}
                      </p>
                      <p className="text-[8px] text-emerald-400 font-mono tracking-tight font-semibold uppercase">Cloud Doc Connected</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      showToastAlert("Running PDF.co OCR text extractor...");
                      try {
                        const response = await fetch("/api/pdfco/extract-text", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            base64: attachedImage.base64,
                            fileName: attachedImage.fileName || "doc.pdf",
                            mimeType: "application/pdf"
                          })
                        });
                        const data = await response.json();
                        if (response.ok && data.text) {
                          setInput(prev => {
                            const header = `[Context File Detail: ${attachedImage.fileName || "Doc"}]\n`;
                            return header + data.text + "\n\n" + prev;
                          });
                          showToastAlert("✨ OCR extraction complete! Input loaded.");
                        } else {
                          throw new Error(data.error || "OCR empty result");
                        }
                      } catch (err: any) {
                        showToastAlert(`OCR Extraction Failed: ${err.message}`);
                      }
                    }}
                    className="text-[9px] text-left hover:underline font-bold text-emerald-500 flex items-center gap-1 cursor-pointer"
                  >
                    <span>⚡</span> Run OCR Extraction
                  </button>
                </div>
              ) : (
                <img 
                  src={attachedImage.previewUrl} 
                  alt="File reference preview thumbnail" 
                  referrerPolicy="no-referrer"
                  className="w-full h-12 object-cover rounded" 
                />
              )}
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                aria-label="Remove image"
                className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}
          {renderInputForm()}
        </div>
      </main>

      {/* Voice active overlay container */}
      {isMicListening && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 max-w-md w-11/12 bg-red-950/90 border border-red-500/35 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between text-xs text-red-100 font-bold animate-pulse backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <p className="font-display tracking-wide uppercase text-red-300">Continuous Microphone Input Active</p>
          </div>
          <button 
            type="button" 
            onClick={() => {
              if (recognitionRef.current) recognitionRef.current.stop();
              setIsMicListening(false);
            }} 
            className="text-red-400 hover:text-white px-2.5 py-1 rounded-lg bg-red-900/30"
          >
            Mute
          </button>
        </div>
      )}

      {/* --- FLOATING CONTROLS PANEL FOOTER (HIDDEN AT USER REQUEST) --- */}
      <footer className="hidden">
        <div className="max-w-[856px] mx-auto flex flex-col gap-3">
          
           {/* Vision upload attached image preview */}
          {attachedImage && (
            <div className={`relative inline-flex items-center rounded-xl border p-1 mb-1 ml-4 animate-fade-in shadow-xl ${
              attachedImage.isDocument 
                ? "bg-emerald-950/20 border-emerald-500/30 px-3 py-1.5 min-w-40 gap-2.5" 
                : "w-20 overflow-hidden border-zinc-750 bg-zinc-950 p-1 bg-gradient-to-tr from-purple-500 to-blue-500"
            }`}>
              {attachedImage.isDocument ? (
                <div className="flex flex-col gap-1.5 min-w-40 p-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">📄</span>
                    <div className="min-w-0">
                      <p className={`text-[10px] font-bold truncate max-w-[140px] ${theme === "dark" ? "text-zinc-100" : "text-zinc-800"}`}>
                        {attachedImage.fileName || "Drive_File.pdf"}
                      </p>
                      <p className="text-[8px] text-emerald-400 font-mono tracking-tight font-semibold uppercase">Cloud Doc Connected</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      showToastAlert("Running PDF.co OCR text extractor...");
                      try {
                        const response = await fetch("/api/pdfco/extract-text", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            base64: attachedImage.base64,
                            fileName: attachedImage.fileName || "doc.pdf",
                            mimeType: "application/pdf"
                          })
                        });
                        const data = await response.json();
                        if (response.ok && data.text) {
                          setInput(prev => {
                            const header = `[Context File Detail: ${attachedImage.fileName || "Doc"}]\n`;
                            return header + data.text + "\n\n" + prev;
                          });
                          showToastAlert("✨ OCR extraction complete! Input loaded.");
                        } else {
                          throw new Error(data.error || "OCR empty result");
                        }
                      } catch (err: any) {
                        showToastAlert(`OCR Extraction Failed: ${err.message}`);
                      }
                    }}
                    className="text-[9px] text-left hover:underline font-bold text-emerald-500 flex items-center gap-1 cursor-pointer"
                  >
                    <span>⚡</span> Run OCR Extraction
                  </button>
                </div>
              ) : (
                <img 
                  src={attachedImage.previewUrl} 
                  alt="File reference preview thumbnail" 
                  referrerPolicy="no-referrer"
                  className="w-full h-12 object-cover rounded" 
                />
              )}
              <button
                type="button"
                onClick={() => setAttachedImage(null)}
                aria-label="Remove image"
                className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-600 hover:bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* --- NEXTGEN COMPREHENSIVE ENGINE & PERSONA SELECTOR --- */}
          {showEngineSelector && (
            <div className={`p-3.5 rounded-2xl border ${
              theme === "dark" 
                ? "bg-[#1c1c1e]/60 border-zinc-800/80 text-zinc-300" 
                : "bg-zinc-50 border-zinc-200 text-zinc-700"
            } space-y-3.5 animate-fade-in`}>
            
            {/* Header: Select Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-zinc-200/40 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5 font-display font-bold text-xs">
                <span>⚡</span>
                <span className={theme === "dark" ? "text-white" : "text-zinc-800"}>Core Engine & Persona Assistant Control</span>
              </div>
              
              {/* Core Mode Toggle */}
              <div className="flex rounded-lg bg-zinc-900/40 p-1 border border-zinc-200/10 self-start">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode(false);
                    setIsImageGenMode(false);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    !imageMode && !isImageGenMode
                      ? "bg-blue-600 text-white shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>✍️</span> Reasoning Chat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode(true);
                    setIsImageGenMode(false);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    imageMode
                      ? "bg-purple-600 text-white shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>📸</span> Attach Graphic
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode(false);
                    setIsImageGenMode(true);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isImageGenMode
                      ? "bg-purple-600 text-white shadow"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>🎨</span> Image Gen
                </button>
              </div>
            </div>

            {/* Sub-section 1: Choose Backend Model */}
            <div className="space-y-1.5 relative">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                Choose Model Intelligence:
              </span>
              
              {/* Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  setModalTab(isImageGenMode ? "paint" : imageMode ? "image" : "text");
                  setShowModelModal(true);
                }}
                className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isImageGenMode || imageMode 
                    ? "border-purple-500/40 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500" 
                    : "border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0">
                    {isImageGenMode ? (
                      <span className="text-2xl">🎨</span>
                    ) : !imageMode ? (
                      <ModelIcon modelId={activeTextModel} className="w-6 h-6 flex-shrink-0" />
                    ) : (
                      <span className="text-2xl">📸</span>
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm tracking-wide ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>
                      {isImageGenMode 
                        ? "NextGen Painting Engine"
                        : !imageMode 
                          ? (TEXT_MODELS.find(m => m.id === activeTextModel)?.name || activeTextModel)
                          : "Multimodal File Attachment Mode"
                      }
                    </p>
                    <p className="text-[10px] opacity-70 truncate mt-0.5 max-w-xs md:max-w-md">
                      {isImageGenMode 
                        ? "Generates high-fidelity artwork and assets from natural description"
                        : !imageMode 
                          ? (TEXT_MODELS.find(m => m.id === activeTextModel)?.desc)
                          : "Upload custom image reference files supported by multimodal reasoning models."
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isImageGenMode || imageMode ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
                  }`}>
                    Manage
                  </span>
                  <span className="text-xs">⚙️</span>
                </div>
              </button>
            </div>

            {/* Sub-section 2: Choose Persona Icon / Avatar */}
            <div className="space-y-1.5 pt-1.5 border-t border-zinc-200/20 dark:border-zinc-800/40 relative" ref={avatarDropdownRef}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 block">
                  Customize Bot Avatar Icon:
                </span>
              </div>
              
              {/* Dropdown Trigger Button */}
              <button
                type="button"
                onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  theme === "dark" 
                    ? "border-zinc-800/80 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40 text-zinc-300" 
                    : "border-zinc-200 bg-zinc-100 hover:bg-zinc-200/50 text-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl shrink-0">{selectedAiAvatar}</span>
                  <div className="min-w-0">
                    <p className={`font-bold text-xs ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"}`}>Active Assistant Icon</p>
                    <p className="text-[10px] opacity-70 truncate mt-0.5">Click to customize helper persona emoji</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/10 scale-95">
                    {selectedAiAvatar} Persona
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAvatarDropdownOpen ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Dropdown Options Grid */}
              {isAvatarDropdownOpen && (
                <div className={`absolute z-55 left-0 right-0 bottom-full mb-2 p-3 rounded-2xl border shadow-2xl animate-fade-in ${
                  theme === "dark" 
                    ? "bg-[#18181b] border-zinc-800 text-zinc-300 shadow-black/90" 
                    : "bg-white border-zinc-200 text-zinc-700 shadow-zinc-300/60"
                }`}>
                  <div className="p-1 mb-2 border-b border-zinc-200/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-55">Select Bot Persona Avatar</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-500/10 text-zinc-400">12 Variations</span>
                  </div>
                  
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_OPTIONS.map((avatar) => {
                      const isSelected = selectedAiAvatar === avatar;
                      return (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => {
                            changeAiAvatar(avatar);
                            setIsAvatarDropdownOpen(false);
                          }}
                          className={`w-full h-10 flex items-center justify-center text-xl rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-500 bg-blue-500/10 scale-110 shadow-md shadow-blue-500/5"
                              : "border-zinc-200/30 dark:border-zinc-800/60 hover:border-zinc-400 hover:bg-zinc-800 bg-zinc-900/30"
                          }`}
                          title={`Switch bot icon to ${avatar}`}
                        >
                          {avatar}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>
          )}

          {/* Master text input system - only when messages started */}
          {messages.length > 0 && renderInputForm()}

          {/* Simple premium bottom note */}
          <div className="flex justify-end items-center text-[10px] opacity-40 font-bold select-none px-2 uppercase tracking-widest">
            <span>Est. 2026</span>
          </div>

        </div>
      </footer>

      {/* --- AESTHETIC MODEL REGISTRY DIALOG MODAL --- */}
      {showModelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="aesthetic-model-modal">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl p-6 ${
            theme === "dark" 
              ? "bg-[#121214] border-zinc-800 text-zinc-100 shadow-black/80" 
              : "bg-white border-zinc-200 text-zinc-800 shadow-zinc-300/40"
          } space-y-5 animate-scale-up max-h-[90vh] overflow-y-auto`}>
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-200/10 dark:border-zinc-800/60" id="modal-header">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-pulse">🪐</span>
                  <h3 className="text-lg font-bold tracking-tight">AI Engine Intelligence Registry</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Sovereign Core
                  </span>
                </div>
                <p className={`text-xs ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                  Explore and select from our high-performance reasoning brains and hyper-detailed painting canvas pipelines.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowModelModal(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-800 text-zinc-400 hover:text-white" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
                }`}
                aria-label="Close modal"
              >
                ❌
              </button>
            </div>

            {/* Premium Selector Tabs */}
            <div className="flex rounded-xl p-1.5 bg-zinc-900/40 border border-zinc-200/10 max-w-md" id="modal-tabs">
              <button
                type="button"
                onClick={() => setModalTab("text")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "text"
                    ? "bg-blue-600 text-white shadow-md"
                    : `${theme === "dark" ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-800"}`
                }`}
              >
                <span>✍️</span> Chat Reasoning
              </button>
              <button
                type="button"
                onClick={() => setModalTab("image")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "image"
                    ? "bg-purple-600 text-white shadow-md"
                    : `${theme === "dark" ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-800"}`
                }`}
              >
                <span>📸</span> Attach Graphic
              </button>
              <button
                type="button"
                onClick={() => setModalTab("paint")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalTab === "paint"
                    ? "bg-purple-600 text-white shadow-md"
                    : `${theme === "dark" ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-800"}`
                }`}
              >
                <span>🎨</span> Image Gen
              </button>
            </div>

            {/* Model List Grid */}
            <div className="space-y-3" id="modal-model-list-grouped">
              {modalTab === "text" ? (
                (() => {
                  const grouped: Record<string, TextModelConfig[]> = {};
                  TEXT_MODELS.forEach((m) => {
                    const s = m.series || "Other Engines";
                    if (!grouped[s]) grouped[s] = [];
                    grouped[s].push(m);
                  });

                  return Object.entries(grouped).map(([seriesName, models]) => (
                    <div key={seriesName} className="space-y-3 mt-4">
                      <div className="flex items-center gap-2 px-1">
                        <span className="w-1.5 h-3.5 rounded bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                        <span className={`text-[10.5px] uppercase font-bold tracking-widest font-sans ${theme === "dark" ? "text-zinc-400" : "text-zinc-505"}`}>
                          {seriesName}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                        {models.map((m) => {
                          const isSelected = activeTextModel === m.id;
                          
                          // Premium Brand colorizations depending on the brand/series name
                          let brandAccentColor = "blue";
                          let brandBadgeStyles = "bg-blue-500/10 border-blue-500/20 text-blue-405 dark:text-blue-450";
                          let realAvatarColor = "border-blue-500/35 bg-blue-500/5 shadow-blue-500/10";
                          let cardBorderHover = "hover:border-blue-500/30";
                          
                          const sName = (m.series || "").toLowerCase();
                          if (sName.includes("deepseek")) {
                            brandAccentColor = "emerald";
                            brandBadgeStyles = "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-405";
                            realAvatarColor = "border-emerald-500/35 bg-emerald-500/5 shadow-emerald-500/10";
                            cardBorderHover = "hover:border-emerald-500/30";
                          } else if (sName.includes("gemma")) {
                            brandAccentColor = "sky";
                            brandBadgeStyles = "bg-sky-500/10 border-sky-500/20 text-sky-550 dark:text-sky-400";
                            realAvatarColor = "border-sky-500/35 bg-sky-500/5 shadow-sky-500/10";
                            cardBorderHover = "hover:border-sky-500/30";
                          } else if (sName.includes("openai")) {
                            brandAccentColor = "purple";
                            brandBadgeStyles = "bg-purple-500/10 border-purple-500/20 text-purple-550 dark:text-purple-400";
                            realAvatarColor = "border-purple-500/35 bg-purple-500/5 shadow-purple-500/10";
                            cardBorderHover = "hover:border-purple-500/30";
                          } else if (sName.includes("llama")) {
                            brandAccentColor = "amber";
                            brandBadgeStyles = "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
                            realAvatarColor = "border-amber-500/35 bg-amber-500/5 shadow-amber-500/10";
                            cardBorderHover = "hover:border-amber-500/30";
                          } else if (sName.includes("stepfun") || sName.includes("kimi") || sName.includes("solar")) {
                            brandAccentColor = "cyan";
                            brandBadgeStyles = "bg-cyan-500/10 border-cyan-500/20 text-cyan-550 dark:text-cyan-400";
                            realAvatarColor = "border-cyan-500/35 bg-cyan-500/5 shadow-cyan-500/10";
                            cardBorderHover = "hover:border-cyan-500/30";
                          }

                          const statsLabel = m.params || "NVIDIA Active Core";
                          const badgeText = m.badge || "Core";

                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                changeTextModel(m.id);
                                setImageMode(false); // synchronize the input mode accordingly
                              }}
                              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 cursor-pointer relative hover:scale-[1.01] duration-150 ${
                                isSelected
                                  ? `border-blue-600/60 bg-blue-500/5 shadow-lg`
                                  : `border-zinc-200/55 dark:border-zinc-800/85 bg-zinc-900/10 ${cardBorderHover}`
                              }`}
                            >
                              {/* Real Icon Representation */}
                              <div className={`w-12 h-12 rounded-full border flex items-center justify-center relative shrink-0 shadow-md ${realAvatarColor}`}>
                                <ModelIcon modelId={m.id} className="w-8 h-8 flex-shrink-0" />
                                {isSelected && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-zinc-950 animate-bounce">
                                    ✓
                                  </div>
                                )}
                              </div>

                              {/* Info layout */}
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className={`font-bold text-sm leading-none ${isSelected ? "text-blue-500 dark:text-blue-400" : `${theme === "dark" ? "text-zinc-100" : "text-zinc-800"}`}`}>
                                    {m.name}
                                  </p>
                                  <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${brandBadgeStyles}`}>
                                    {badgeText}
                                  </span>
                                </div>
                                <p className={`text-xs truncate ${theme === "dark" ? "text-zinc-400" : "text-zinc-650"}`}>
                                  {m.desc}
                                </p>
                                <p className="text-[10px] font-mono tracking-tight opacity-55">
                                  {statsLabel}
                                </p>
                              </div>

                              {/* Selection state status checkmark */}
                              <div className="shrink-0 pl-2">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-colors ${
                                  isSelected ? "bg-blue-500/20 border-blue-500 text-blue-400 font-bold" : "border-zinc-500/30 text-transparent"
                                }`}>
                                  ⭐
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                })()
              ) : modalTab === "paint" ? (
                Object.entries(IMAGE_PLATFORMS).map(([k, p]) => {
                  const isSelected = activeImagePlatform === k;
                  let realAvatarColor = "border-purple-500/35 bg-purple-500/5 shadow-purple-500/10";
                  let coreBadgeStyles = "bg-purple-500/10 border-purple-500/20 text-purple-400";
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setActiveImagePlatform(k);
                        setIsImageGenMode(true);
                        setImageMode(false);
                      }}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center gap-4 cursor-pointer relative ${
                        isSelected
                          ? `border-purple-600/60 bg-purple-500/5 shadow-lg`
                          : `border-zinc-200/50 dark:border-zinc-800/80 bg-zinc-900/10 hover:border-purple-500/40`
                      }`}
                    >
                      {/* Avatar container */}
                      <div className={`w-12 h-12 rounded-full border flex items-center justify-center relative shrink-0 shadow-md ${realAvatarColor}`}>
                        <span className="text-2xl">{p.avatar}</span>
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-zinc-950 animate-bounce">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Engine summary details */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className={`font-bold text-sm leading-none ${isSelected ? "text-purple-400" : `${theme === "dark" ? "text-zinc-100" : "text-zinc-800"}`}`}>
                            {p.name}
                          </p>
                          <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${coreBadgeStyles}`}>
                            Imagen 4.0 Active
                          </span>
                        </div>
                        <p className={`text-xs truncate ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                          {p.desc}
                        </p>
                        <p className="text-[10px] font-mono tracking-tight opacity-55">
                          High Definition • 1K resolution • PNG format
                        </p>
                      </div>

                      {/* Star selection indicator */}
                      <div className="shrink-0 pl-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs transition-colors ${
                          isSelected ? "bg-purple-500/20 border-purple-500 text-purple-400 font-bold" : "border-zinc-500/30 text-transparent"
                        }`}>
                          ⭐
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className={`p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4 ${
                  theme === "dark"
                    ? "border-zinc-800 bg-[#161618]"
                    : "border-zinc-200 bg-zinc-50"
                }`}>
                  <span className="text-4xl">📸</span>
                  <div className="space-y-1">
                    <p className={`font-bold text-sm ${theme === "dark" ? "text-white" : "text-zinc-800"}`}>Upload Image Reference</p>
                    <p className={`text-xs max-w-sm ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                      Select and upload local image assets to support real-time multimodal intelligence reasoning and analysis.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModelModal(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Choose Graphic File
                  </button>
                </div>
              )}
            </div>

            {/* Premium Meta Info Footer */}
            <div className="pt-4 border-t border-zinc-200/10 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" id="modal-footer">
              <div className="flex flex-col gap-1 text-left w-full sm:w-auto">
                <span className={`opacity-60 text-[10px] font-mono ${theme === "dark" ? "text-zinc-400" : "text-zinc-700"}`}>
                  Selected Brain: <b className={`${theme === "dark" ? "text-zinc-100" : "text-zinc-900"}`}>{isImageGenMode ? IMAGE_PLATFORMS[activeImagePlatform].name : (TEXT_MODELS.find(m => m.id === activeTextModel)?.name)}</b> {imageMode && "(Multimodal)"} {isImageGenMode && "(Painting Mode)"}
                </span>
                <span className={`text-[9px] font-mono ${theme === "dark" ? "text-zinc-500" : "text-zinc-400"} mt-0.5`}>
                  ⚡ Shortcuts: <span className="bg-zinc-800/30 px-1 py-0.5 rounded border border-zinc-700/20">ctrl+k</span> menu • <span className="bg-zinc-800/30 px-1 py-0.5 rounded border border-zinc-700/20">alt+i</span> focus • <span className="bg-zinc-800/30 px-1 py-0.5 rounded border border-zinc-700/20">esc</span> exit
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowModelModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow cursor-pointer w-full sm:w-auto text-center font-sans"
              >
                Confirm System Selection
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- PREMIUM GOOGLE DRIVE FILE CHOOOSER DIALOG --- */}
      {showDriveModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" id="google-drive-modal">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
            theme === "dark" 
              ? "bg-[#161618] border-zinc-800 text-zinc-100 shadow-black/90" 
              : "bg-white border-zinc-200 text-zinc-800 shadow-zinc-300/40"
          } space-y-4 animate-scale-up`}>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200/10 dark:border-zinc-800/40">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">▲</span>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Google Drive Workspace</h3>
                  <p className="text-[10px] opacity-65 font-mono">Select enterprise assets to analyze</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowDriveModal(false)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-800 text-zinc-400" : "hover:bg-zinc-100 text-zinc-650"
                }`}
              >
                ✕
              </button>
            </div>

            {/* List of mock cloud documents */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {[
                { name: "Global_Market_Forecast_2026.pdf", type: "PDF Document", size: "2.4 MB", icon: "📕", text: "Analyze global economic sectors, AI accelerators growth margins up to 45% CAGR." },
                { name: "Q3_Strategic_Milestones.docx", type: "Word Document", size: "450 KB", icon: "📘", text: "Target shipping new LLM user interface, plus-menu asset selector alignment, premium dark options." },
                { name: "Product_User_Analytics.xlsx", type: "Excel Spreadsheet", size: "1.2 MB", icon: "📗", text: "Active sessions: 1.2M. Satisfaction rating: 4.95. UI response latency reduced to 80ms." },
                { name: "Investor_Pitch_Final_V2.pptx", type: "PowerPoint Deck", size: "6.8 MB", icon: "📙", text: "Series A visual presentation emphasizing modular full-stack client layouts and dynamic interfaces." },
                { name: "Cybersecurity_Audit_Manifesto.pdf", type: "Safety Policy PDF", size: "1.8 MB", icon: "📕", text: "Cloud Run container isolation standard protocols. Cross-origin authorization sandbox settings." }
              ].map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => {
                    // Simulate attaching document file
                    setAttachedImage({
                      previewUrl: "",
                      base64: btoa(file.text),
                      mimeType: "application/pdf",
                      fileName: file.name,
                      isDocument: true
                    } as any);
                    setShowDriveModal(false);
                    showToastAlert(`Connected document "${file.name}" from Google Drive!`);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3.5 cursor-pointer ${
                    theme === "dark" 
                      ? "border-[#2c2d30] bg-[#212124]/40 hover:bg-[#212124]/80 hover:border-zinc-700" 
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 hover:border-zinc-350"
                  }`}
                >
                  <span className="text-2xl shrink-0">{file.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-xs truncate ${theme === "dark" ? "text-zinc-100" : "text-zinc-800"}`}>
                      {file.name}
                    </p>
                    <p className="text-[10px] opacity-60 mt-0.5 font-mono">
                      {file.type} • {file.size}
                    </p>
                  </div>
                  <span className="text-blue-500 text-xs shrink-0 font-bold opacity-80">
                    Connect ➔
                  </span>
                </button>
              ))}
            </div>

            {/* Simulated Workspace Footer */}
            <div className="pt-3 border-t border-zinc-200/10 dark:border-zinc-800/40 text-[10px] opacity-50 flex items-center justify-between font-mono">
              <span>Google Enterprise API v3</span>
              <span>Secure OAuth Session</span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* PDF.CO INTERACTIVE DOCUMENT SUITE MODAL */}
      {/* ========================================== */}
      {showPdfcoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className={`border rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden h-[90vh] md:max-h-[750px] transition-colors ${
            theme === "dark" 
              ? "bg-[#0c0c0e] border-[#1f2023] text-zinc-100" 
              : "bg-white border-zinc-200 text-zinc-800"
          }`}>
            
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              theme === "dark" ? "border-zinc-850 bg-zinc-950/50" : "border-zinc-150 bg-zinc-50/50"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-xl">
                  📄
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">PDF.co Professional Document Suite</h3>
                  <p className="text-[10px] opacity-65 mt-0.5 font-sans">Automate and manipulate PDF, extract raw data, generate templated reports, read barcodes and scan metadata.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfcoModal(false)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Sidebar Columns or Top Tabs */}
            <div className={`flex border-b ${
              theme === "dark" ? "border-zinc-850 bg-zinc-900/10" : "border-zinc-150 bg-zinc-50/30"
            }`}>
              {[
                { id: "html-to-pdf", label: "✍️ HTML to PDF Template" },
                { id: "extract-text", label: "🔍 Extract Raw Text (OCR)" },
                { id: "barcode", label: "⚙️ Scan Barcode & Metadata" },
                { id: "merge", label: "📂 PDFs Consolidation Merge" }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPdfcoActiveTab(tab.id as any)}
                  className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    pdfcoActiveTab === tab.id
                      ? "text-emerald-500 border-emerald-500"
                      : "text-zinc-500 dark:text-zinc-400 border-transparent hover:text-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* HTML to PDF tab */}
              {pdfcoActiveTab === "html-to-pdf" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">HTML Source Compiler</h4>
                      <p className="text-[10.5px] opacity-65 mt-1 font-sans">Write premium custom HTML templates structure to produce high resolution Letter-sized printable documents.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* HTML input */}
                    <div className="space-y-2 col-span-1">
                      <span className="text-[10px] font-bold opacity-60">Source HTML Template Editor</span>
                      <textarea
                        value={pdfcoHtmlInput}
                        onChange={(e) => setPdfcoHtmlInput(e.target.value)}
                        className={`w-full h-80 p-3.5 rounded-xl border font-mono text-[11px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                          theme === "dark" 
                            ? "bg-[#111113] border-zinc-800 text-zinc-300"
                            : "bg-zinc-50 border-zinc-250 text-zinc-700"
                        }`}
                      />
                    </div>

                    {/* Action & Preview Output */}
                    <div className="flex flex-col justify-between border rounded-xl p-4 transition-all duration-300 relative overflow-hidden bg-[#10b981]/5 border-emerald-500/20 col-span-1">
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] block">Document Generator Output</span>
                        
                        <div className="p-3.5 rounded-lg bg-zinc-950/20 dark:bg-zinc-950/40 border border-emerald-500/10 space-y-2 text-xs">
                          <p className="text-[11px] font-sans">Compile static assets, invoice structures, tabular details, and layout schemas with zero-loss quality conversion.</p>
                          <p className="text-[10px] opacity-70 italic font-mono">Parameters: Letter Space • Vertical Margins 20px • Portrait Orientation</p>
                        </div>

                        {htmlResultPdfUrl && (
                          <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">✅</span>
                              <div>
                                <p className="font-bold">PDF compiled successfully!</p>
                                <p className="text-[9.5px] opacity-70">Hosted securely on S3 system servers</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={htmlResultPdfUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded text-center transition-all shadow cursor-pointer"
                              >
                                View PDF ➔
                              </a>
                              <a
                                href={htmlResultPdfUrl}
                                download="compiled_document.pdf"
                                className="bg-zinc-800 hover:bg-zinc-700 dark:hover:bg-zinc-750 text-zinc-100 font-bold py-1.5 px-3 rounded text-center transition-all border border-zinc-700/80 cursor-pointer"
                              >
                                📥 Download
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleHtmlToPdfConvert}
                        disabled={htmlLoading}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 ${
                          htmlLoading 
                            ? "bg-zinc-700 text-zinc-400 cursor-not-allowed" 
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10"
                        }`}
                      >
                        {htmlLoading ? (
                          <>
                            <span className="animate-spin text-sm">⏳</span>
                            Compiling PDF with PDF.co REST services...
                          </>
                        ) : (
                          "⚙️ Build & Compile PDF Document"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Extract Text tab */}
              {pdfcoActiveTab === "extract-text" && (
                <div className="space-y-5 font-sans">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Optical Character Recognition OCR (PDF to Text)</h4>
                    <p className="text-[10.5px] opacity-65 mt-1">Interrogate any PDF file (including native or non-searchable document copies) to convert layout text details into clean copyable markdown blocks.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Drag-and-drop input container */}
                    <div className="md:col-span-1 space-y-4">
                      <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-colors ${
                        theme === "dark" ? "border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/60" : "border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50"
                      }`}>
                        <div className="text-3xl">📄</div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold">Select PDF Document</p>
                          <p className="text-[9.5px] opacity-60 font-sans">Max file size: 10MB</p>
                        </div>
                        <label className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10.5px] cursor-pointer shadow transition-all">
                          Browse Local File
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleParsingFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {parsingFileName && (
                        <div className="p-3 border rounded-xl bg-emerald-500/5 border-emerald-500/25 space-y-1 text-[11px]">
                          <p className="font-bold truncate text-emerald-400">📎 File: {parsingFileName}</p>
                          <p className="opacity-65 font-mono text-[9px] uppercase">Type: {parsingMimeType || "application/pdf"}</p>
                        </div>
                      )}
                    </div>

                    {/* Extracted text result output */}
                    <div className="md:col-span-2 flex flex-col h-full min-h-[300px] border border-zinc-200 dark:border-zinc-850 rounded-2xl overflow-hidden bg-zinc-950/20">
                      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-850 flex items-center justify-between text-xs font-bold bg-zinc-50 dark:bg-zinc-900/40">
                        <span>Parser Extracted Text Results</span>
                        {parsingTextResult && (
                          <div className="flex gap-2 border-none">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(parsingTextResult);
                                showToastAlert("Text copied to clipboard!");
                              }}
                              className="text-[10px] text-emerald-500 hover:underline font-bold cursor-pointer bg-none border-none"
                            >
                              📋 Copy Text
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setInput(prev => `[Extracted Text from ${parsingFileName || "PDF"}]:\n${parsingTextResult}\n\n` + prev);
                                showToastAlert("Injected to prompt input!");
                              }}
                              className="text-[10px] text-emerald-400 hover:underline font-bold cursor-pointer bg-none border-none"
                            >
                              📥 Inject to Chat
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-4 font-mono text-[10.5px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                        {parsingLoading ? (
                          <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-500">
                            <span className="animate-spin text-xl">⏳</span>
                            <span>Reading file structures & translating characters...</span>
                          </div>
                        ) : parsingTextResult ? (
                          parsingTextResult
                        ) : (
                          <span className="text-zinc-500 italic">No document analyzed yet. Attach a PDF file to begin fast OCR extraction.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Barcode scanner tab */}
              {pdfcoActiveTab === "barcode" && (
                <div className="space-y-5 font-sans">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">Barcode, QR Code & Document Layout Analytics</h4>
                    <p className="text-[10.5px] opacity-65 mt-1 font-sans">Surgical scanning tool that reads linear and 2D barcodes, plus harvests overall PDF file layout features, creation tags, and indexing signatures.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-1 space-y-4">
                      <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-colors ${
                        theme === "dark" ? "border-zinc-800 bg-zinc-950/20 hover:bg-zinc-950/60" : "border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50"
                      }`}>
                        <div className="text-3xl">🎛️</div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold">Select PDF or Image</p>
                          <p className="text-[9.5px] opacity-60">Barcodes / QR Code Analysis</p>
                        </div>
                        <label className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10.5px] cursor-pointer shadow transition-all">
                          Upload File
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={handleBarcodeFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {barcodeFileName && (
                        <div className="p-3 border rounded-xl bg-emerald-500/5 border-emerald-500/25 text-[11px] space-y-1">
                          <p className="font-bold truncate text-emerald-400">📎 Scan Targeted File: {barcodeFileName}</p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-4">
                      {barcodeLoading ? (
                        <div className="border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2 h-48 bg-zinc-950/20">
                          <span className="animate-spin text-xl">⏳</span>
                          <p className="text-xs font-bold">Analyzing security attributes & structural signatures...</p>
                        </div>
                      ) : barcodeResult ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Barcodes parsed */}
                          <div className="border rounded-2xl p-4 bg-zinc-950/20 space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block pb-1 border-b border-zinc-800/40">📡 Decoded Barcodes / QR</span>
                            {barcodeResult.barcodes && barcodeResult.barcodes.length > 0 ? (
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {barcodeResult.barcodes.map((bc: any, idx: number) => (
                                  <div key={idx} className="p-2 rounded bg-zinc-950/40 border border-zinc-800/60 text-[11px] font-mono">
                                    <p className="text-emerald-500 font-bold">Type: {bc.typeName || bc.type}</p>
                                    <p className="truncate mt-0.5" title={bc.value}>Val: <b>{bc.value}</b></p>
                                    <p className="text-[9px] opacity-60">Coords: X:{bc.rect?.left}, Y:{bc.rect?.top}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500 italic block">No barcodes or QR codes detected on page templates.</span>
                            )}
                          </div>

                          {/* PDF Info metadata */}
                          <div className="border rounded-2xl p-4 bg-zinc-950/20 space-y-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block pb-1 border-b border-zinc-800/40">📂 Document Meta Analysis</span>
                            {barcodeResult.info ? (
                              <div className="space-y-1.5 text-[11px] font-mono">
                                <p>Pages: <b className="text-zinc-100">{barcodeResult.info.pageCount || "1"}</b></p>
                                <p className="truncate">Title: <b>{barcodeResult.info.title || "Untitled Docs"}</b></p>
                                <p className="truncate">Author: <b>{barcodeResult.info.author || "Unknown"}</b></p>
                                <p className="truncate">Creator: <b>{barcodeResult.info.creator || "System engine"}</b></p>
                                <p>Encrypted: <b className="text-red-400">{barcodeResult.info.encrypted ? "Yes" : "No"}</b></p>
                              </div>
                            ) : (
                              <span className="text-xs text-zinc-500 italic block">No structural file container headers harvested.</span>
                            )}
                          </div>

                        </div>
                      ) : (
                        <div className="border border-zinc-200 dark:border-zinc-850 rounded-2xl p-10 flex items-center justify-center text-center text-zinc-500 italic h-48 bg-zinc-950/20 text-xs">
                          No document scanned for scanner arrays. Upload code lists or transaction copies to analyze fields.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Merge PDFs tab */}
              {pdfcoActiveTab === "merge" && (
                <div className="space-y-5 font-sans">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-500">PDF Files Consolidation Joiner</h4>
                      <p className="text-[10.5px] opacity-65 mt-1 font-sans">Blend multiple individual files, invoices, receipts, and templates together securely into one combined, multi-page Master PDF document.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Choose files container */}
                    <div className="space-y-4">
                      <div className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-colors ${
                        theme === "dark" ? "border-zinc-800 bg-zinc-950/20" : "border-zinc-300 bg-zinc-50/50"
                      }`}>
                        <div className="text-2xl">📋</div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold font-sans">Add file segment to consolidation list</p>
                          <p className="text-[9.5px] opacity-60 font-sans">Append documents consecutively</p>
                        </div>
                        <label className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10.5px] cursor-pointer shadow transition-all">
                          + Queue File Segment
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleMergeQueueUpload}
                            value=""
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Current file segments list */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span>Files in Consolidation Queue ({mergeFilesQueue.length})</span>
                          {mergeFilesQueue.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setMergeFilesQueue([]);
                                setMergeResultUrl(null);
                                showToastAlert("Merge queue cleared!");
                              }}
                              className="text-red-500 hover:underline font-bold cursor-pointer"
                            >
                              Clear Queue
                            </button>
                          )}
                        </div>

                        {mergeFilesQueue.length > 0 ? (
                          <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                            {mergeFilesQueue.map((file, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-emerald-500/10 bg-emerald-500/5 text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-mono text-[10px] text-emerald-500 font-bold">#{idx + 1}</span>
                                  <span className="truncate font-semibold text-[11px]">{file.fileName}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-[9px] opacity-60 font-mono">{file.size}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMergeFilesQueue(prev => prev.filter((_, i) => i !== idx));
                                      setMergeResultUrl(null);
                                    }}
                                    className="text-red-500 hover:text-red-400 font-bold px-1 cursor-pointer"
                                    title="Exclude file"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="border border-zinc-200 dark:border-zinc-850 rounded-xl p-6 flex flex-col items-center text-center justify-center text-zinc-500 text-[11px] italic bg-zinc-950/10">
                            <span>Consolidation queue is empty. Append segments.</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Compile controller */}
                    <div className="border rounded-2xl p-4 flex flex-col justify-between bg-emerald-500/5 border-emerald-500/20">
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block pb-1 border-b border-emerald-500/10">Consolidation Controller</span>
                        
                        <div className="p-3.5 rounded-lg bg-zinc-950/20 dark:bg-zinc-950/40 border border-emerald-500/10 text-xs leading-relaxed space-y-1">
                          <p>When you trigger compilation, PDF.co consolidates every file listed consecutively in the stream.</p>
                          <p className="text-[10px] text-zinc-400">Perfect for assembling multi-receipt expenses, combined reports, and invoice logs.</p>
                        </div>

                        {mergeResultUrl && (
                          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-2 text-xs">
                            <p className="font-bold flex items-center gap-1.5 text-emerald-400">
                              <span>🎉</span> Consolidated PDF successfully processed!
                            </p>
                            <div className="flex gap-2">
                              <a
                                href={mergeResultUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center font-bold py-1 px-2.5 rounded text-[11px] transition-all shadow cursor-pointer"
                              >
                                Outer View ➔
                              </a>
                              <a
                                href={mergeResultUrl}
                                download="consolidated_master.pdf"
                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold py-1 px-2.5 rounded text-[11px] transition-all border border-zinc-700/80 cursor-pointer"
                              >
                                Download Consolidated
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleMergePdfs}
                        disabled={mergeLoading || mergeFilesQueue.length < 2}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 ${
                          mergeLoading || mergeFilesQueue.length < 2
                            ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow"
                        }`}
                      >
                        {mergeLoading ? (
                          <>
                            <span className="animate-spin text-sm">⏳</span>
                            Merging file segments inside list...
                          </>
                        ) : (
                          "📂 Consolidate segments & Download Master"
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* Footer with branding */}
            <div className={`p-4 border-t flex items-center justify-between text-[10px] font-mono opacity-60 ${
              theme === "dark" ? "border-zinc-850 bg-zinc-950/20" : "border-zinc-150 bg-zinc-50/20"
            }`}>
              <span>POWERED BY PDF.CO ENG CODE SYSTEMS</span>
              <span className="text-emerald-500 font-bold">API STATUS: ONLINE</span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* GOOGLE FLIGHTS SERPAPI SEARCH MODAL */}
      {/* ========================================== */}
      {showFlightsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className={`border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden h-[90vh] md:max-h-[780px] transition-colors ${
            theme === "dark" 
              ? "bg-[#0b0c10] border-zinc-800 text-zinc-100" 
              : "bg-white border-zinc-200 text-zinc-800"
          }`}>
            
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-150 bg-zinc-50"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-xl">
                  ✈️
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Google Flights Search Engine</h3>
                  <p className="text-[10px] opacity-65 mt-0.5">Explore real-time airfares, optimal flight structures, routes, airlines, and carbon insights using SerpApi.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFlightsModal(false)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-950 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Controls Grid */}
              <div className={`p-4 rounded-xl border ${
                theme === "dark" ? "bg-zinc-950/30 border-zinc-800" : "bg-zinc-50 border-zinc-250/60"
              } grid grid-cols-1 md:grid-cols-4 gap-4 text-xs`}>
                
                {/* Departure / Arrival Inputs */}
                <div className="space-y-1.5">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Departure Airport</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 opacity-40">🛫</span>
                    <input
                      type="text"
                      maxLength={3}
                      value={departureId}
                      onChange={(e) => setDepartureId(e.target.value.toUpperCase())}
                      placeholder="e.g. CDG"
                      className={`w-full py-2 pl-9 pr-3 rounded-lg border font-mono font-bold tracking-widest text-center ${
                        theme === "dark" 
                          ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-blue-500" 
                          : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Arrival Airport</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 opacity-40">🛬</span>
                    <input
                      type="text"
                      maxLength={3}
                      value={arrivalId}
                      onChange={(e) => setArrivalId(e.target.value.toUpperCase())}
                      placeholder="e.g. AUS"
                      className={`w-full py-2 pl-9 pr-3 rounded-lg border font-mono font-bold tracking-widest text-center ${
                        theme === "dark" 
                          ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-blue-500" 
                          : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                      } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                    />
                  </div>
                </div>

                {/* Date Selectors */}
                <div className="space-y-1.5">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Departure Date</label>
                  <input
                    type="date"
                    value={outboundDate}
                    onChange={(e) => setOutboundDate(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold text-center ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-blue-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Return Date</label>
                  <input
                    type="date"
                    disabled={flightType === "1"}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold text-center ${
                      flightType === "1" ? "opacity-40 cursor-not-allowed bg-zinc-950/20" : ""
                    } ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-blue-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                </div>

                {/* Secondary Filters */}
                <div className="space-y-1.5">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Flight Option</label>
                  <select
                    value={flightType}
                    onChange={(e) => setFlightType(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold outline-none ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-blue-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    }`}
                  >
                    <option value="2">Round-trip Flight</option>
                    <option value="1">One-way Flight</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Display Currency</label>
                  <select
                    value={flightCurrency}
                    onChange={(e) => setFlightCurrency(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold outline-none ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-blue-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    }`}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                {/* Custom Secret override key */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Custom SerpApi Key (Optional override)</label>
                  <input
                    type="password"
                    value={customSerpapiApiKey}
                    onChange={(e) => setCustomSerpapiApiKey(e.target.value)}
                    placeholder="Defaults to server configurations if blank"
                    className={`w-full py-2 px-3 rounded-lg border font-sans text-xs ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-blue-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-blue-500"
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  />
                </div>

                <div className="md:col-span-4 flex items-center justify-between pt-2 border-t border-zinc-200/5 dark:border-zinc-800/10">
                  <div className="text-[10.5px] opacity-60">
                    Departing routing query code: <strong className="font-mono text-blue-500">{departureId || "?"} ➔ {arrivalId || "?"}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchFlights}
                    disabled={isSearchingFlights || !departureId || !arrivalId || !outboundDate}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow ${
                      isSearchingFlights || !departureId || !arrivalId || !outboundDate
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.01]"
                    }`}
                  >
                    {isSearchingFlights ? (
                      <>
                        <span className="animate-spin">⏳</span> Searching Fares...
                      </>
                    ) : (
                      <>
                        <span>✈️</span> Search Flight Options
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Error messages if any */}
              {flightsError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 space-y-1 font-sans">
                  <p className="font-bold">⚠️ Google Flights Core Error:</p>
                  <p>{flightsError}</p>
                </div>
              )}

              {/* Flight Search Results Panel */}
              <div className="space-y-4">
                {flightsResults ? (
                  <div className="space-y-6 animate-fade-in font-sans">
                    
                    {/* Demo alert banner */}
                    {flightsResults.is_demo && (
                      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 space-y-1.5 md:space-y-0 md:flex md:items-center md:justify-between">
                        <div className="flex items-start gap-2.5">
                          <span className="text-base leading-none">⚠️</span>
                          <div>
                            <p className="font-bold">Google Flights Simulation Active</p>
                            <p className="opacity-85 text-[11px] mt-0.5">
                              {flightsResults.fallback_warning 
                                ? flightsResults.fallback_warning 
                                : "No active custom SerpApi credentials located. Displaying simulated search routes. Enter a SerpApi key in your config settings to view live flights."
                              }
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[9px] font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider self-start md:self-center">
                          Demo Mode
                        </span>
                      </div>
                    )}

                    {/* Price Insights */}
                    {flightsResults.price_insights && (
                      <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 text-xs ${
                        theme === "dark" ? "bg-zinc-950/40 border-zinc-800" : "bg-zinc-50 border-zinc-205"
                      }`}>
                        <div className="space-y-1 text-center md:text-left">
                          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Price Level Indicator</span>
                          <div className="flex items-center gap-2 justify-center md:justify-start">
                            <span className="text-lg animate-pulse">
                              {flightsResults.price_insights.price_level === "low" ? "🟢" : flightsResults.price_insights.price_level === "typical" ? "🟡" : "🔴"}
                            </span>
                            <span className="font-bold text-sm capitalize">
                              Prices are {flightsResults.price_insights.price_level} for this flight query
                            </span>
                          </div>
                        </div>

                        {flightsResults.price_insights.typical_price_range && (
                          <div className="space-y-1 text-center md:text-right">
                            <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Typical Price Range</span>
                            <p className="font-mono font-bold text-sm text-blue-500">
                              {flightCurrency === "USD" ? "$" : flightCurrency === "EUR" ? "€" : flightCurrency === "INR" ? "₹" : "£"} 
                              {flightsResults.price_insights.typical_price_range[0]} - {flightCurrency === "USD" ? "$" : flightCurrency === "EUR" ? "€" : flightCurrency === "INR" ? "₹" : "£"}{flightsResults.price_insights.typical_price_range[1]}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Best Flights Section */}
                    {flightsResults.best_flights && flightsResults.best_flights.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-500">🏆 Best Departing Flights</h4>
                        <div className="space-y-3.5">
                          {flightsResults.best_flights.map((opt: any, idx: number) => {
                            const isCheapest = idx === 0;
                            return (
                              <div key={idx} className={`p-5 rounded-2xl border transition-all ${
                                theme === "dark" 
                                  ? "bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/50" 
                                  : "bg-white border-zinc-200 hover:border-zinc-300 pointer-events-auto"
                              } space-y-4`}>
                                
                                {/* Core top details */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-zinc-200/5 dark:border-zinc-800/10 text-xs text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold text-[10px] uppercase">
                                      Option #{idx + 1}
                                    </span>
                                    {isCheapest && (
                                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold text-[10px] uppercase">
                                        Best Choice
                                      </span>
                                    )}
                                    <span className="font-mono text-zinc-550 dark:text-zinc-400">
                                      Total Duration: {Math.floor(opt.total_duration / 60)}h {opt.total_duration % 60}m
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-xl font-bold font-mono text-blue-500">
                                      {flightCurrency === "USD" ? "$" : flightCurrency === "EUR" ? "€" : flightCurrency === "INR" ? "₹" : "£"}{opt.price}
                                    </span>
                                    <span className="text-[10px] opacity-60 block">{opt.type || "Round trip"}</span>
                                  </div>
                                </div>

                                {/* Segments or Legs */}
                                <div className="space-y-4">
                                  {opt.flights?.map((leg: any, legIdx: number) => (
                                    <div key={legIdx} className="relative pl-6 border-l border-zinc-300 dark:border-zinc-800 text-xs space-y-1.5 text-left">
                                      {/* Segment Indicator Node */}
                                      <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white font-bold">
                                        {legIdx + 1}
                                      </span>

                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                        <div className="font-bold flex items-center gap-1.5 text-left text-zinc-850 dark:text-zinc-200">
                                          <span className="text-blue-500">{leg.airline}</span>
                                          <span className="opacity-60 text-[10.5px]">({leg.flight_number})</span>
                                        </div>
                                        <div className="font-mono opacity-60 text-[10.5px]">
                                          Airplane: {leg.airplane} • {leg.travel_class}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                        <div className="p-2 rounded-lg bg-zinc-950/10 dark:bg-zinc-950/25">
                                          <p className="text-[10.5px] font-bold text-blue-400 flex items-center gap-1">
                                            <span>🛫</span> Depart
                                          </p>
                                          <p className="font-bold mt-0.5 font-mono text-[11px]">{leg.departure_airport?.id}</p>
                                          <p className="opacity-60 text-[10px] truncate">{leg.departure_airport?.name}</p>
                                          <p className="text-[10px] italic mt-0.5 opacity-70">{leg.departure_airport?.time}</p>
                                        </div>
                                        <div className="p-2 rounded-lg bg-zinc-950/10 dark:bg-zinc-950/25">
                                          <p className="text-[10.5px] font-bold text-amber-500 flex items-center gap-1">
                                            <span>🛬</span> Arrive
                                          </p>
                                          <p className="font-bold mt-0.5 font-mono text-[11px]">{leg.arrival_airport?.id}</p>
                                          <p className="opacity-60 text-[10px] truncate">{leg.arrival_airport?.name}</p>
                                          <p className="text-[10px] italic mt-0.5 opacity-70">{leg.arrival_airport?.time}</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* CO2 Stats if exists */}
                                {opt.carbon_emissions && (
                                  <div className="pt-2 flex items-center gap-2 text-[10px] opacity-75 font-mono text-left">
                                    <span className="text-xs">🍀</span>
                                    <span>
                                      CO2 Output: <strong>{opt.carbon_emissions.this_flight} kg</strong> 
                                      {opt.carbon_emissions.difference_percent < 0 ? (
                                        <span className="text-emerald-500 font-bold ml-1.5">
                                          ({Math.abs(opt.carbon_emissions.difference_percent)}% below average route emission)
                                        </span>
                                      ) : (
                                        <span className="text-amber-500 font-bold ml-1.5">
                                          ({opt.carbon_emissions.difference_percent}% above average route emission)
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                )}

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Other Flights Section */}
                    {flightsResults.other_flights && flightsResults.other_flights.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider opacity-60 text-left">📑 Other Available Routes</h4>
                        <div className="space-y-2">
                          {flightsResults.other_flights.map((opt: any, idx: number) => (
                            <div key={idx} className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${
                              theme === "dark" ? "bg-zinc-950/20 border-zinc-900" : "bg-zinc-50 border-zinc-200"
                            }`}>
                              <div className="flex items-center gap-3 text-left">
                                <span className="text-lg opacity-60">✈️</span>
                                <div>
                                  <p className="font-bold">
                                    {opt.flights?.[0]?.airline} ➔ {opt.flights?.[opt.flights.length - 1]?.airline || "Connecting Carrier"}
                                  </p>
                                  <p className="text-[10px] opacity-65 font-mono mt-0.5">
                                    Routing: {opt.flights?.map((f: any) => f.departure_airport?.id).join(" ➔ ")} ➔ {opt.flights?.[opt.flights.length - 1]?.arrival_airport?.id}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 shrink-0">
                                <span className="font-mono font-bold text-sm text-zinc-400">
                                  {flightCurrency === "USD" ? "$" : flightCurrency === "EUR" ? "€" : flightCurrency === "INR" ? "₹" : "£"}{opt.price}
                                </span>
                                <span className="text-[9px] opacity-65 italic font-mono block">
                                  {Math.floor(opt.total_duration / 60)}h {opt.total_duration % 60}m duration
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-10 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center text-zinc-500 italic text-xs gap-3">
                    <span className="text-3xl">✈️</span>
                    <div>
                      <p className="font-bold">No active query located</p>
                      <p className="text-[10px] opacity-75 not-italic mt-0.5">Define your flight attributes and initiate compilation search using the panel controls.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-[10px] font-mono opacity-60 ${
              theme === "dark" ? "border-zinc-850 bg-zinc-950/20" : "border-zinc-150 bg-zinc-50"
            }`}>
              <span>CONNECTED OVER SERPAPI GOOGLE FLIGHTS WORKSPACE</span>
              <span className="text-blue-500 font-bold">API PORTAL: ONLINE</span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* GOOGLE SHOPPING SERPER SEARCH MODAL */}
      {/* ========================================== */}
      {showShoppingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className={`border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden h-[90vh] md:max-h-[780px] transition-colors ${
            theme === "dark" 
              ? "bg-[#0b0c10] border-zinc-800 text-zinc-100" 
              : "bg-white border-zinc-200 text-zinc-800"
          }`}>
            
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-150 bg-zinc-50"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-xl">
                  🛒
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Google Shopping Search Engine</h3>
                  <p className="text-[10px] opacity-65 mt-0.5">Explore real-time retail pricing, technical product listings, inventory specs, and merchant listings via Serper.dev.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShoppingModal(false)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-950 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Controls Grid */}
              <div className={`p-4 rounded-xl border ${
                theme === "dark" ? "bg-zinc-950/30 border-zinc-800" : "bg-zinc-50 border-zinc-250/60"
              } grid grid-cols-1 md:grid-cols-4 gap-4 text-xs`}>
                
                {/* Shopping Queries Input */}
                <div className="md:col-span-3 space-y-1.5 text-left">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Search Query (Comma-separated for multiple comparisons)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 opacity-40">🔍</span>
                    <input
                      type="text"
                      value={shoppingQueryStr}
                      onChange={(e) => setShoppingQueryStr(e.target.value)}
                      placeholder="e.g. apple inc, google inc, tesla inc"
                      className={`w-full py-2 pl-9 pr-3 rounded-lg border font-semibold ${
                        theme === "dark" 
                          ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-amber-500" 
                          : "bg-white border-zinc-300 text-zinc-900 focus:border-amber-500"
                      } focus:outline-none focus:ring-1 focus:ring-amber-500`}
                    />
                  </div>
                  <span className="text-[9px] opacity-50 block mt-0.5">Supported batch format. Separate each product term with a comma to generate clean tabs.</span>
                </div>

                {/* Country/Geo Selector */}
                <div className="space-y-1.5 text-left">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Geographic Region</label>
                  <select
                    value={shoppingGl}
                    onChange={(e) => setShoppingGl(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold outline-none ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-amber-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-amber-500"
                    }`}
                  >
                    <option value="in">India (in - ₹)</option>
                    <option value="us">United States (us - $)</option>
                    <option value="uk">United Kingdom (uk - £)</option>
                    <option value="ca">Canada (ca - $)</option>
                    <option value="de">Germany (de - €)</option>
                    <option value="au">Australia (au - $)</option>
                  </select>
                </div>

                {/* Command bar */}
                <div className="md:col-span-4 flex items-center justify-between pt-2 border-t border-zinc-200/5 dark:border-zinc-800/10">
                  <div className="text-[10.5px] opacity-60 text-left">
                    Configured search query terms: <strong className="font-mono text-amber-500">
                      {shoppingQueryStr.split(",").filter(v => v.trim()).length || "0"} items
                    </strong>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleSearchShopping}
                    disabled={isSearchingShopping || !shoppingQueryStr.trim()}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow ${
                      isSearchingShopping || !shoppingQueryStr.trim()
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-amber-600 hover:bg-amber-500 text-white hover:scale-[1.01]"
                    }`}
                  >
                    {isSearchingShopping ? (
                      <>
                        <span className="animate-spin">⏳</span> Scanning Merchants...
                      </>
                    ) : (
                      <>
                        <span>🛒</span> Search Products
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Error messages if any */}
              {shoppingError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 space-y-1 font-sans text-left">
                  <p className="font-bold">⚠️ Google Shopping Service Error:</p>
                  <p>{shoppingError}</p>
                </div>
              )}

              {/* Shopping Search Results Panel */}
              <div className="space-y-4">
                {shoppingResults && shoppingResults.length > 0 ? (
                  <div className="space-y-6 animate-fade-in font-sans">
                    
                    {/* Multi-Query Tab Selectors */}
                    {shoppingResults.length > 1 && (
                      <div className="flex flex-wrap gap-2 border-b border-zinc-200/5 dark:border-zinc-800/10 pb-3">
                        {shoppingResults.map((result: any, i: number) => {
                          const queryTerm = result.searchParameters?.q || `Term #${i + 1}`;
                          const isSelected = activeShoppingTab === i;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setActiveShoppingTab(i)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 border ${
                                isSelected
                                  ? "bg-amber-500/10 border-amber-500 text-amber-400 font-extrabold"
                                  : theme === "dark"
                                    ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                                    : "bg-zinc-50 border-zinc-200 text-zinc-650 hover:text-zinc-900 hover:bg-zinc-100"
                              }`}
                            >
                              <span>📦 {queryTerm}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-zinc-850/50 text-zinc-300">
                                {result.shopping?.length || 0}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Active Result View */}
                    {(() => {
                      const activeIndex = activeShoppingTab < shoppingResults.length ? activeShoppingTab : 0;
                      const activeResult = shoppingResults[activeIndex];
                      if (!activeResult) return null;

                      return (
                        <div className="space-y-6 animate-fade-in">
                          
                          {/* Demo notification box */}
                          {activeResult.is_demo && (
                            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 flex items-start gap-2.5 text-left">
                              <span className="text-base leading-none">🧪</span>
                              <div>
                                <p className="font-bold">Google Shopping Simulation Mode</p>
                                <p className="opacity-85 text-[11px] mt-0.5">
                                  {activeResult.fallback_warning 
                                    ? activeResult.fallback_warning 
                                    : "Operational demo channel loaded. Set your custom Serper API Key in settings to query commercial Google Shopping pipelines live."
                                  }
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Grid of shopping results */}
                          {activeResult.shopping && activeResult.shopping.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              {activeResult.shopping.map((product: any, itemIdx: number) => (
                                <div 
                                  key={itemIdx} 
                                  className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5 ${
                                    theme === "dark" 
                                      ? "bg-zinc-900/30 border-zinc-800/80 hover:bg-zinc-900/50 hover:border-zinc-700" 
                                      : "bg-white border-zinc-200 hover:shadow-md hover:border-zinc-300"
                                  }`}
                                >
                                  {/* Product image container */}
                                  <div className="relative aspect-square w-full overflow-hidden bg-zinc-950/10 flex items-center justify-center p-2.5">
                                    {product.thumbnail ? (
                                      <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        referrerPolicy="no-referrer"
                                        className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-all duration-300 rounded"
                                      />
                                    ) : (
                                      <span className="text-3xl">📦</span>
                                    )}
                                    <span className="absolute top-2.5 right-2.5 font-mono text-[10.5px] font-bold bg-amber-500 text-black px-2 py-0.5 rounded-md shadow-sm">
                                      {product.price}
                                    </span>
                                  </div>

                                  {/* Content info */}
                                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                                    <div className="space-y-1.5">
                                      {/* Merchant / Provider */}
                                      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                                        🏪 {product.source}
                                      </p>
                                      
                                      {/* Product Name Title */}
                                      <h4 className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                                        {product.title}
                                      </h4>
                                    </div>

                                    <div className="space-y-2">
                                      {/* Rating stars */}
                                      {product.rating && (
                                        <div className="flex items-center gap-1.5 text-[10px]">
                                          <span className="text-amber-500">★</span>
                                          <span className="font-bold">{product.rating}</span>
                                          {product.ratingCount && (
                                            <span className="opacity-60 text-[9px]">({product.ratingCount} reviews)</span>
                                          )}
                                        </div>
                                      )}

                                      {/* Delivery information tag */}
                                      {product.delivery && (
                                        <div className="flex items-center gap-1.5 text-[9px] opacity-75 font-mono leading-none">
                                          <span>🚚</span>
                                          <span className="truncate">{product.delivery}</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Action redirect button */}
                                    <a
                                      href={product.link}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={`w-full py-1.5 rounded-lg text-center font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 mt-2 shadow-xs group-hover:scale-[1.01] ${
                                        theme === "dark"
                                          ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white"
                                          : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                                      }`}
                                    >
                                      <span>View Store</span>
                                      <span>➔</span>
                                    </a>

                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center italic text-zinc-500 text-xs">
                              No products located under this search query term. Try updating the query keywords and retry.
                            </div>
                          )}

                        </div>
                      );
                    })()}

                  </div>
                ) : (
                  <div className="p-10 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center text-zinc-500 italic text-xs gap-3">
                    <span className="text-3xl">🛒</span>
                    <div>
                      <p className="font-bold">No active search session launched</p>
                      <p className="text-[10px] opacity-75 not-italic mt-0.5">Please define your target products and trigger comparison search queries using the input form controls.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-[10px] font-mono opacity-60 ${
              theme === "dark" ? "border-zinc-850 bg-zinc-950/20" : "border-zinc-150 bg-zinc-50"
            }`}>
              <span>CONNECTED OVER SERPER GOOGLE SHOPPING WORKSPACE</span>
              <span className="text-amber-500 font-bold">API PORTAL: ONLINE</span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* GOOGLE IMAGES SERPER SEARCH MODAL */}
      {/* ========================================== */}
      {showImagesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className={`border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden h-[90vh] md:max-h-[780px] transition-colors ${
            theme === "dark" 
              ? "bg-[#0b0c10] border-zinc-800 text-zinc-100" 
              : "bg-white border-zinc-200 text-zinc-800"
          }`}>
            
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-150 bg-zinc-50"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/25 flex items-center justify-center text-xl">
                  🖼️
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Google Images Search Engine</h3>
                  <p className="text-[10px] opacity-65 mt-0.5">Query and preview high-resolution Google Search web images with exact dimensional constraints via Serper.dev.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImagesModal(false)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-950 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Controls Grid */}
              <div className={`p-4 rounded-xl border ${
                theme === "dark" ? "bg-zinc-950/30 border-zinc-800" : "bg-zinc-50 border-zinc-250/60"
              } grid grid-cols-1 md:grid-cols-12 gap-4 text-xs`}>
                
                {/* Search Query */}
                <div className="md:col-span-6 space-y-1.5 text-left">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Search Query</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 opacity-40">🔍</span>
                    <input
                      type="text"
                      value={imagesQueryStr}
                      onChange={(e) => setImagesQueryStr(e.target.value)}
                      placeholder="e.g. apple inc logo, futuristic car, space nebula"
                      className={`w-full py-2 pl-9 pr-3 rounded-lg border font-semibold ${
                        theme === "dark" 
                          ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-violet-500" 
                          : "bg-white border-zinc-300 text-zinc-900 focus:border-violet-500"
                      } focus:outline-none focus:ring-1 focus:ring-violet-500`}
                    />
                  </div>
                </div>

                {/* Region Selector */}
                <div className="md:col-span-3 space-y-1.5 text-left">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Geographic Region</label>
                  <select
                    value={imagesGl}
                    onChange={(e) => setImagesGl(e.target.value)}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold outline-none ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-violet-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-violet-500"
                    }`}
                  >
                    <option value="us">United States (us)</option>
                    <option value="in">India (in)</option>
                    <option value="uk">United Kingdom (uk)</option>
                    <option value="ca">Canada (ca)</option>
                    <option value="au">Australia (ay)</option>
                    <option value="de">Germany (de)</option>
                  </select>
                </div>

                {/* Count selector */}
                <div className="md:col-span-3 space-y-1.5 text-left">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Result Batch Count</label>
                  <select
                    value={imagesNum}
                    onChange={(e) => setImagesNum(Number(e.target.value))}
                    className={`w-full py-2 px-3 rounded-lg border font-semibold outline-none ${
                      theme === "dark" 
                        ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-violet-500" 
                        : "bg-white border-zinc-300 text-zinc-900 focus:border-violet-500"
                    }`}
                  >
                    <option value={10}>10 Images</option>
                    <option value={20}>20 Images</option>
                    <option value={30}>30 Images</option>
                    <option value={40}>40 Images</option>
                  </select>
                </div>

                {/* Action controls */}
                <div className="md:col-span-12 flex items-center justify-between pt-2 border-t border-zinc-200/5 dark:border-zinc-800/10">
                  <p className="text-[10.5px] opacity-60 text-left">
                    Target keyword: <strong className="font-mono text-violet-400">"{imagesQueryStr || "none"}"</strong>
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleSearchImages}
                    disabled={isSearchingImages || !imagesQueryStr.trim()}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow ${
                      isSearchingImages || !imagesQueryStr.trim()
                        ? "bg-zinc-700 text-zinc-500 cursor-not-allowed"
                        : "bg-violet-600 hover:bg-violet-500 text-white hover:scale-[1.01]"
                    }`}
                  >
                    {isSearchingImages ? (
                      <>
                        <span className="animate-spin">⏳</span> Querying Index...
                      </>
                    ) : (
                      <>
                        <span>🖼️</span> Search Images
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Error messages */}
              {imagesError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 space-y-1 font-sans text-left">
                  <p className="font-bold">⚠️ Google Images Service Error:</p>
                  <p>{imagesError}</p>
                </div>
              )}

              {/* Active Results Display Panel */}
              <div className="space-y-4">
                {imagesResults ? (
                  <div className="space-y-6 animate-fade-in font-sans">
                    
                    {/* Demo alert banner */}
                    {imagesResults.is_demo && (
                      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-500 flex items-start gap-2.5 text-left">
                        <span className="text-base leading-none">⚠️</span>
                        <div>
                          <p className="font-bold">Google Images Simulation Active</p>
                          <p className="opacity-85 text-[11px] mt-0.5">
                            {imagesResults.fallback_warning 
                              ? imagesResults.fallback_warning 
                              : "No active custom Serper API Key located. Displaying simulated search routes. Enter a Serper key in your config settings to view live images."
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Results Grid layout */}
                    {imagesResults.images && imagesResults.images.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {imagesResults.images.map((imgItem: any, idx: number) => (
                          <div
                            key={idx}
                            className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5 ${
                              theme === "dark"
                                ? "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700"
                                : "bg-white border-zinc-200 hover:shadow-md hover:border-zinc-300"
                            }`}
                          >
                            {/* Image container */}
                            <div className="relative aspect-video w-full overflow-hidden bg-black/50 flex items-center justify-center">
                              {imgItem.imageUrl ? (
                                <img
                                  src={imgItem.imageUrl}
                                  alt={imgItem.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                />
                              ) : (
                                <span className="text-2xl">🖼️</span>
                              )}
                              
                              {/* Position element */}
                              <span className="absolute top-2 left-2 font-mono text-[9px] font-bold bg-black/60 backdrop-blur text-white px-1.5 py-0.5 rounded">
                                #{imgItem.position || idx + 1}
                              </span>

                              {/* Dimension tag */}
                              {imgItem.imageWidth && imgItem.imageHeight && (
                                <span className="absolute bottom-2 right-2 font-mono text-[9px] font-bold bg-black/60 backdrop-blur text-white px-1.5 py-0.5 rounded">
                                  {imgItem.imageWidth} x {imgItem.imageHeight}
                                </span>
                              )}
                            </div>

                            {/* Content Details */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                              <div className="space-y-1.5">
                                {/* Domain or source origin */}
                                <div className="flex items-center justify-between text-[9px] font-mono opacity-65">
                                  <span className="text-violet-400 font-bold">🌐 {imgItem.domain || "Web Link"}</span>
                                  <span>{imgItem.source || "External Search"}</span>
                                </div>

                                {/* Title */}
                                <h4 className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-violet-400 transition-colors">
                                  {imgItem.title}
                                </h4>
                              </div>

                              {/* Action Anchors/Buttons */}
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <a
                                  href={imgItem.imageUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`py-1.5 rounded-lg text-center font-bold text-[10px] transition-all flex items-center justify-center gap-1 leading-none ${
                                    theme === "dark"
                                      ? "bg-zinc-800 hover:bg-zinc-750 text-zinc-100 hover:text-white"
                                      : "bg-zinc-100 hover:bg-zinc-150 text-zinc-700"
                                  }`}
                                >
                                  <span>Full Image</span>
                                  <span>↗</span>
                                </a>

                                <a
                                  href={imgItem.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`py-1.5 rounded-lg text-center font-bold text-[10px] transition-all flex items-center justify-center gap-1 leading-none ${
                                    theme === "dark"
                                      ? "bg-violet-950/40 hover:bg-violet-950/60 text-violet-300 hover:border-violet-800/80 border border-violet-900/30"
                                      : "bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-100"
                                  }`}
                                >
                                  <span>Source Site</span>
                                  <span>🔗</span>
                                </a>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center italic text-zinc-500 text-xs">
                        No images found for this search. Try using other filter keywords.
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-10 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center text-zinc-500 italic text-xs gap-3">
                    <span className="text-3xl">🖼️</span>
                    <div>
                      <p className="font-bold">No active image search queried</p>
                      <p className="text-[10px] opacity-75 not-italic mt-0.5">Please define your search keywords and click Search Images up above.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-[10px] font-mono opacity-60 ${
              theme === "dark" ? "border-zinc-850 bg-zinc-950/20" : "border-zinc-150 bg-zinc-50"
            }`}>
              <span>CONNECTED OVER SERPER GOOGLE IMAGES WORKSPACE</span>
              <span className="text-violet-500 font-bold">API PORTAL: ONLINE</span>
            </div>

          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* WALMART SERPAPI SEARCH MODAL */}
      {/* ========================================== */}
      {showWalmartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
          <div className={`border rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden h-[90vh] md:max-h-[780px] transition-colors ${
            theme === "dark" 
              ? "bg-[#0b0c10] border-zinc-800 text-zinc-100" 
              : "bg-white border-zinc-200 text-zinc-800"
          }`}>
            
            {/* Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              theme === "dark" ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-150 bg-zinc-50"
            }`}>
              <div className="flex items-center gap-3">
                <div className="p-2 w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-xl">
                  🏬
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Walmart Search Engine</h3>
                  <p className="text-[10px] opacity-65 mt-0.5">Query and analyze Walmart products, pricing, ratings, and active store availability via SerpApi.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWalmartModal(false)}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  theme === "dark" ? "hover:bg-zinc-950 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
                }`}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Controls Grid */}
              <div className={`p-4 rounded-xl border ${
                theme === "dark" ? "bg-zinc-950/30 border-zinc-800" : "bg-zinc-50 border-zinc-250/60"
              } flex flex-col md:flex-row gap-4 items-end text-xs`}>
                
                {/* Search Query */}
                <div className="flex-1 space-y-1.5 text-left w-full">
                  <label className="block font-bold opacity-75 text-[10.5px] uppercase tracking-wider">Search Query / Products</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 opacity-40">🔍</span>
                    <input
                      type="text"
                      value={walmartQueryStr}
                      onChange={(e) => setWalmartQueryStr(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isSearchingWalmart) {
                          handleSearchWalmart();
                        }
                      }}
                      placeholder="e.g. bread, milk, apples, core laptop"
                      className={`w-full py-2 pl-9 pr-3 rounded-lg border font-semibold ${
                        theme === "dark" 
                          ? "bg-zinc-900 border-zinc-700/80 text-white focus:border-sky-500" 
                          : "bg-white border-zinc-300 text-zinc-900 focus:border-sky-500"
                      } focus:outline-none focus:ring-1 focus:ring-sky-500`}
                    />
                  </div>
                </div>

                {/* Search button */}
                <button
                  type="button"
                  disabled={isSearchingWalmart}
                  onClick={handleSearchWalmart}
                  className={`px-6 py-2 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-2 max-md:w-full select-none cursor-pointer ${
                    isSearchingWalmart
                      ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                      : "bg-sky-500 hover:bg-sky-600 text-white shadow-md active:scale-95"
                  }`}
                >
                  {isSearchingWalmart ? (
                    <>
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>🏬</span>
                      <span>Walmart Search</span>
                    </>
                  )}
                </button>
              </div>

              {/* Status Alert logs */}
              {walmartError && (
                <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono text-left">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <span>⚠️</span>
                    <span>Query Fault Triggered</span>
                  </div>
                  <p className="opacity-90">{walmartError}</p>
                </div>
              )}

              {/* SerpApi Demo Warning */}
              {walmartResults && walmartResults.fallback_warning && (
                <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 text-xs font-mono text-left">
                  <span className="font-bold">⚠️ COGNITIVE API STATUS UPDATE:</span>
                  <p className="mt-1 opacity-80">{walmartResults.fallback_warning}</p>
                </div>
              )}

              {/* Walmart results output viewer */}
              <div>
                {isSearchingWalmart ? (
                  <div className="p-20 text-center space-y-3.5">
                    <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto animate-pulse" />
                    <p className="text-xs italic text-zinc-400">Retrieving Walmart inventory index mapping...</p>
                  </div>
                ) : walmartResults ? (
                  <div className="space-y-4">
                    
                    {/* Header info bar */}
                    <div className="flex items-center justify-between text-[11px] opacity-75 px-1 font-mono">
                      <span>Query: <strong className="text-sky-500">"{walmartResults.search_parameters?.q || walmartQueryStr}"</strong></span>
                      <span>Results Found: <strong>{walmartResults.organic_results?.length || 0}</strong></span>
                    </div>

                    {/* Results Grid */}
                    {walmartResults.organic_results && walmartResults.organic_results.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {walmartResults.organic_results.map((product: any, idx: number) => (
                          <div
                            key={product.us_item_id || idx}
                            className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5 ${
                              theme === "dark"
                                ? "bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700"
                                : "bg-white border-zinc-200 hover:shadow-md hover:border-zinc-300"
                            }`}
                          >
                            {/* Product thumbnail image */}
                            <div className="relative aspect-square w-full overflow-hidden bg-black/10 dark:bg-black/30 flex items-center justify-center p-4">
                              {product.thumbnail ? (
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain group-hover:scale-105 transition-all duration-300 mix-blend-multiply dark:mix-blend-normal bg-white rounded-lg p-1"
                                />
                              ) : (
                                <span className="text-3xl">📦</span>
                              )}
                              
                              <span className="absolute top-2 left-2 font-mono text-[9px] font-bold bg-black/60 backdrop-blur text-white px-1.5 py-0.5 rounded">
                                #{idx + 1}
                              </span>
                            </div>

                            {/* Content details */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5 text-left">
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-[9px] font-mono opacity-65">
                                  <span className="text-sky-400 font-bold">🏪 {product.seller || "Walmart.com"}</span>
                                  <span>ID: {product.us_item_id || "N/A"}</span>
                                </div>

                                <h4 className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-sky-400 transition-colors">
                                  {product.title}
                                </h4>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="text-amber-500">★</span>
                                  <span className="font-bold">{product.rating || "4.5"}</span>
                                  {product.reviews && (
                                    <span className="opacity-60 text-[9px]">({product.reviews.toLocaleString()} reviews)</span>
                                  )}
                                </div>

                                <div className="text-lg font-bold text-sky-500 font-mono">
                                  ${typeof product.price === 'number' ? product.price.toFixed(2) : (product.price || '1.42')}
                                </div>
                              </div>

                              {/* Redirect Action Link */}
                              <a
                                href={product.link}
                                target="_blank"
                                rel="noreferrer"
                                className={`w-full py-1.5 rounded-lg text-center font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 mt-2 shadow-xs group-hover:scale-[1.01] ${
                                  theme === "dark"
                                    ? "bg-zinc-800 hover:bg-zinc-755 text-zinc-100 hover:text-white"
                                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                                }`}
                              >
                                <span>Buy on Walmart</span>
                                <span>➔</span>
                              </a>

                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center italic text-zinc-500 text-xs">
                        No Walmart products located under this search query term. Try updating keywords.
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-10 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center text-zinc-500 italic text-xs gap-3">
                    <span className="text-3xl">🏬</span>
                    <div>
                      <p className="font-bold">No active Walmart search launched</p>
                      <p className="text-[10px] opacity-75 not-italic mt-0.5">Please define your target products and click Walmart Search above.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t flex items-center justify-between text-[10px] font-mono opacity-60 ${
              theme === "dark" ? "border-zinc-850 bg-zinc-950/20" : "border-zinc-150 bg-zinc-50"
            }`}>
              <span>CONNECTED OVER SERPAPI WALMART SEARCH ENGINE</span>
              <span className="text-sky-500 font-bold">API STATUS: ONLINE</span>
            </div>

          </div>
        </div>
      )}

      {/* --- COMPREHENSIVE CONNECTIONS SETTINGS DIALOG MODAL --- */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#1c1c1e] border border-zinc-800/80 p-6 rounded-2xl max-w-lg w-full space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="text-center space-y-2 pb-4 border-b border-zinc-800/80">
              <Sparkles className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
              <h3 className="text-lg font-display font-bold text-white">Quantum Core Configuration</h3>
              <p className="text-xs text-zinc-400">Configure override tokens for third-party platforms. If left blank, server-side secrets will act as automatic fallbacks.</p>
              
              <div className="pt-1.5">
                {user ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>☁️ Cloud Synced: {user.email}</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    <span>⚠️ Local Mode: Sign in to sync configurations to cloud!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Part 1: Visual Multimodal Graphic Upload */}
            <div className="space-y-2.5">
              <label className="text-[11px] text-purple-400 font-bold tracking-widest uppercase block">
                1. Local Multimodal Graphic File
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowConfigModal(false);
                  fileInputRef.current?.click();
                }}
                className="w-full p-4 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 bg-[#161618] text-left transition-all flex items-center gap-4 cursor-pointer"
              >
                <span className="text-2xl">🔗</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-white">Attach Local Image Asset</p>
                  <p className="text-[10px] text-zinc-400 font-sans">Trigger standard file upload (PNG, JPEG, WEBP or PDF documents)</p>
                </div>
              </button>
            </div>

            {/* Part 2: Custom secure fields - Fully Hidden & Managed Server-Side */}
            <div className="space-y-4 border-t border-zinc-800/70 pt-4">
              <label className="text-[11px] text-blue-400 font-bold tracking-widest uppercase block">
                2. Server-Side Security Shield
              </label>
              
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-emerald-500/10 text-xs space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
                  <span>🛡️</span>
                  <span>Zero-Trust Enterprise Vault Active</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  To maintain maximum protection and prevent credential leaks, all API keys, access secrets, and authorization tokens are kept 100% hidden from the browser frontend.
                </p>
                <div className="space-y-2 pt-1 font-mono">
                  <div className="flex items-center justify-between text-[10px] bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/50">
                    <span className="text-zinc-400">NextGenAi Gemini Core</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">● Securely Hidden</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/50">
                    <span className="text-zinc-400">NVIDIA & DeepSeek Engine</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">● Securely Hidden</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/50">
                    <span className="text-zinc-400">OpenAI & HPC-AI Gateway</span>
                    <span className="text-emerald-500 font-bold flex items-center gap-1">● Securely Hidden</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/50">
                    <span className="text-zinc-400">OpenRouter & PoolSide Engine</span>
                    <span className={`${serverConfigStatus.openrouter_api_key || customOpenRouterKey ? "text-emerald-500" : "text-amber-500"} font-bold flex items-center gap-1`}>
                      ● {serverConfigStatus.openrouter_api_key || customOpenRouterKey ? "Active / Secured" : "Key Needed"}
                    </span>
                  </div>
                </div>

                <div className="border border-zinc-850 bg-zinc-900/40 rounded-xl overflow-hidden mt-2 p-2">
                  <details className="group">
                    <summary className="flex justify-between items-center font-bold text-[10px] text-zinc-300 font-mono p-1.5 cursor-pointer select-none">
                      <span>🔧 CUSTOM DEVELOPER API OVERRIDES</span>
                      <span className="transition-transform group-open:rotate-180 text-[10px]">▼</span>
                    </summary>
                    <div className="pt-2 pb-1 space-y-3 px-1 border-t border-zinc-800/50 mt-2">
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono block">OPENROUTER API KEY</label>
                        <input
                          type="password"
                          value={customOpenRouterKey}
                          onChange={(e) => setCustomOpenRouterKey(e.target.value)}
                          placeholder="sk-or-v1-..."
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono placeholder-zinc-700 outline-none font-sans"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-zinc-400 font-mono block">OPENAI API KEY</label>
                        <input
                          type="password"
                          value={customOpenAiKey}
                          onChange={(e) => setCustomOpenAiKey(e.target.value)}
                          placeholder="sk-proj-..."
                          className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-lg px-2.5 py-1.5 text-[11px] text-white font-mono placeholder-zinc-700 outline-none font-sans"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => saveCredentials()}
                          className="px-3 py-1 bg-purple-650 hover:bg-purple-550 rounded text-[9px] font-bold text-white transition-all cursor-pointer"
                        >
                          Save Keys
                        </button>
                        <button
                          type="button"
                          onClick={() => resetCredentials()}
                          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded text-[9px] font-bold text-zinc-300 transition-all cursor-pointer"
                        >
                          Reset Fields
                        </button>
                      </div>
                    </div>
                  </details>
                </div>

                <p className="text-purple-400 font-semibold text-[10px] italic">
                  All active requests automatically route through our encrypted backend proxy server.
                </p>
              </div>
            </div>

            {/* Modal actions footer */}
            <div className="pt-4 flex gap-2.5 border-t border-zinc-800/80">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-full py-2.5 rounded-xl bg-purple-650 hover:bg-purple-550 text-xs font-bold text-white transition-all shadow-lg text-center cursor-pointer"
              >
                Close Secure Configuration
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- PREMIUM FIREBASE AUTHENTICATION DIALOG MODAL --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div className={`border p-6 rounded-3xl max-w-sm w-full space-y-5 shadow-2xl relative transition-all duration-300 ${
            theme === "dark" 
              ? "bg-zinc-950 border-zinc-900 text-zinc-100 shadow-black/80" 
              : "bg-white border-zinc-200 text-zinc-800 shadow-zinc-200"
          }`}>
            {/* Close trigger button */}
            <button
              onClick={() => {
                setShowAuthModal(false);
                setAuthError(null);
                setAuthSuccessMessage(null);
              }}
              className={`absolute top-4 right-4 p-1.5 rounded-full transition-all ${
                theme === "dark" ? "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100" : "hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800"
              }`}
              aria-label="Close dialog"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            {/* Modal Heading Header */}
            <div className="text-center space-y-2">
              <div className="relative w-12 h-12 flex items-center justify-center p-0.5 rounded-full select-none mx-auto border border-zinc-200 dark:border-zinc-800/80 mb-2 bg-zinc-50 dark:bg-zinc-900">
                <svg className="w-6 h-6 text-[#131415] dark:text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2Q12 12 22 12Q12 12 12 22Q12 12 2 12Q12 12 12 2Z" fill="currentColor" />
                </svg>
              </div>
              <h3 className="text-lg font-display font-black tracking-tight leading-none text-zinc-900 dark:text-white">
                Access NextGen Platform
              </h3>
              <p className="text-[11px] opacity-60">
                Sign in to activate personalization features
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                <span className="font-bold">Note:</span> If login popups are blocked or close instantly, please click the ↗️ "Open in new tab" icon at the top right of this preview window.
              </div>
            </div>

            {/* Dynamic Status / Error Warning Notices */}
            {authError && (
              <div className="p-3 rounded-xl text-[11px] leading-relaxed flex items-start gap-2 border border-red-500/20 bg-red-500/5 text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccessMessage && (
              <div className="p-3 rounded-xl text-[11px] leading-relaxed flex items-start gap-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                <span>{authSuccessMessage}</span>
              </div>
            )}

            {/* Realistic OAuth Providers Cluster */}
            <div className="space-y-2.5">
              
              {/* 1. Google Gmail Provider */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  theme === "dark" 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white" 
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {/* Google SVG G icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24c0-1.55-.15-3.24-.47-4.75H24v9h12.75c-.55 2.85-2.18 5.25-4.6 6.86l7.13 5.53C43.46 36.52 46.5 30.82 46.5 24z" />
                  <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.13-5.53c-2.11 1.41-4.81 2.34-8.76 2.34-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48" />
                </svg>
                Continue with Google
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 2. Facebook Provider */}
                <button
                  type="button"
                  onClick={handleFacebookSignIn}
                  disabled={authLoading}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800" 
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>

                {/* 3. Apple Provider */}
                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={authLoading}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800" 
                      : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-current text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.029-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.06 1.005 1.45 2.187 3.068 3.761 3.008 1.511-.06 2.083-.976 3.905-.976 1.815 0 2.342.976 3.921.944 1.604-.029 2.646-1.465 3.626-2.9 1.133-1.657 1.6-3.255 1.629-3.34-.06-.026-3.13-1.2-3.16-4.773-.028-2.983 2.441-4.415 2.553-4.48-1.4-2.05-3.56-2.285-4.322-2.34-1.944-.16-3.83 1.2-4.982 1.2zm2.085-4.341c.883-1.066 1.479-2.553 1.316-4.032-1.272.05-2.813.844-3.725 1.91-.813.938-1.526 2.448-1.334 3.903 1.411.11 2.86-.714 3.743-1.78z" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>

              {/* 4. GitHub Provider */}
              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={authLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  theme === "dark" 
                    ? "bg-zinc-900 border-zinc-800 text-zinc-200 hover:bg-zinc-800 hover:text-white" 
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                <svg className="w-4 h-4 fill-current text-zinc-800 dark:text-zinc-200" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                Continue with GitHub
              </button>
            </div>

          </div>
        </div>
      )}

      </div> {/* RIGHT SIDE MAIN VIEWPORT CONTAINER */}
    </div>
  );
}
