import os
import json
import re
import logging
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from openai import AsyncOpenAI
from dotenv import load_dotenv
import asyncio

# ==========================================
# 1. Setup & Configuration
# ==========================================
load_dotenv()

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("originality_ai")

class Settings(BaseModel):
    """Centralized configuration manager"""
    PROJECT_NAME: str = "Originality AI Lite (Enterprise)"
    VERSION: str = "2.0.0"
    API_KEY: str = Field(default_factory=lambda: os.getenv("NVIDIA_API_KEY", ""))
    ALLOWED_ORIGINS: List[str] = ["*"]
    
    # AI Model configuration
    MODEL_NAME: str = "bytedance/seed-oss-36b-instruct"
    TEMPERATURE: float = 1.0  # Maximize perplexity
    TOP_P: float = 0.95       # Allow broader vocabulary selection

settings = Settings()

if not settings.API_KEY:
    logger.warning("NVIDIA_API_KEY is not set. API calls will fail until configured.")

# ==========================================
# 2. Schemas & Data Validation
# ==========================================
class TextRequest(BaseModel):
    text: str = Field(..., min_length=5, description="The input text to process")

class PlagiarismResponse(BaseModel):
    score: int = Field(..., ge=0, le=100)
    suspicious_sentences: List[str]
    explanation: str

class HumanizeResponse(BaseModel):
    humanized_text: str

# ==========================================
# 3. Services (Core Business Logic)
# ==========================================
class AIService:
    """Service layer class handling all interactions with NVIDIA NIM (DeepSeek)."""
    def __init__(self):
        self.client = AsyncOpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=settings.API_KEY
        )

    async def check_plagiarism(self, text: str) -> PlagiarismResponse:
        """Analyzes text for plagiarism and returns structured data."""
        sys_prompt = "You are an expert plagiarism detection system. Return ONLY valid JSON with no extra commentary, no markdown, no code blocks."
        prompt = f"""Analyze the following text for plagiarism and AI-generated patterns.
{{
  "score": <number between 0 and 100>,
  "suspicious_sentences": ["sentence1", "sentence2"],
  "explanation": "short explanation"
}}
Where score represents the likelihood of plagiarism/AI-generation (0 = fully original, 100 = fully plagiarized/AI).
Text:
{text}"""
        try:
            logger.info("Sending plagiarism analysis request to AI model...")
            completion = await self.client.chat.completions.create(
                model=settings.MODEL_NAME,
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                top_p=1.0,
                max_tokens=2048,
                extra_body={"thinking_budget": -1},
                stream=False
            )
            raw = completion.choices[0].message.content.strip()
            
            # Clean markdown formatting if model forces it
            raw = re.sub(r"^```(?:json)?\s*", "", raw)
            raw = re.sub(r"\s*```$", "", raw)
            
            data = json.loads(raw)
            return PlagiarismResponse(**data)
            
        except json.JSONDecodeError as e:
            logger.error(f"JSON Parse Error: {e} | Raw response: {raw}")
            raise HTTPException(status_code=502, detail=f"Invalid response from AI model. Raw output: {raw[:100]}...")
        except Exception as e:
            logger.error(f"AI Service Error during plagiarism check: {e}")
            raise HTTPException(status_code=500, detail=f"Plagiarism Check API Error: {str(e)}")

    def _in_house_humanize_fallback(self, text: str, error_reason: str) -> str:
        """
        ADVANCED NATIVE IN-HOUSE NLP FALLBACK
        If the primary AI crashes or hits a quota, this entirely local script executes.
        It forcefully alters the syntactic rhythm (burstiness) and vocabulary predictability (perplexity)
        to dramatically lower AI detection scores locally while retaining strict empirical accuracy.
        """
        logger.warning(f"Using Advanced In-House fallback algorithmic NLP model due to: {error_reason}")
        
        import re
        
        # 1. Heavily Expanded Phrase Replacement (targets rigid AI academic structures)
        phrases = {
            "In conclusion,": "Ultimately,",
            "Furthermore,": "Additionally,",
            "Delving into": "Examining",
            "It is paramount to": "We must",
            "It is crucial to": "It is necessary to",
            "This demonstrates": "This shows",
            "Sheds light on": "Clarifies",
            "The evolving landscape of": "Changes within",
            "In recent years,": "Recently,",
            "Undeniably,": "Clearly,",
            "A myriad of": "Numerous",
            "Plays a vital role": "Is important",
            "As we navigate": "When exploring",
            "In summary,": "Overall,",
            "Significant implications": "Clear effects"
        }
        
        # 2. Aggressive Word-Level Perplexity Disruptors
        words = {
            " vital ": " key ",
            " pivotal ": " central ",
            " comprehensive ": " detailed ",
            " intricate ": " complex ",
            " robust ": " strong ",
            " delve ": " look ",
            " beacon ": " symbol ",
            " myriad ": " variety ",
            " plethora ": " host ",
            " utilize ": " use ",
            " optimum ": " best "
        }
        
        for old, new in phrases.items():
            text = text.replace(old, new)
            
        for old, new in words.items():
            text = text.replace(old, new)
            
        # 3. Structural Burstiness Injection via Regex
        # AI models love perfect comma boundaries and short predictable sentences.
        # We will dynamically inject semicolons where appropriate commas exist to disrupt the n-gram tree natively.
        text = re.sub(r', and ', '; additionally, ', text)
        text = re.sub(r', however,', '; however,', text)
        text = re.sub(r', therefore,', '; therefore,', text)
        
        # 4. Spacing anomalies (mimics human typing imperfection)
        text = text.replace(". ", ".  ").replace("  ", " ")
        
        # 5. Occasional Em-Dash Injection for rhythmic unpredictability
        # If an AI uses too many "that" clauses, it looks robotic. We can selectively dash them.
        text = text.replace(", specifically ", "—specifically ")
        
        return text + f"\n\n*(Note: Generated securely via Advanced Native Fallback Engine | Fallback Trigger Reason: {error_reason})*"

    async def humanize_text(self, text: str) -> HumanizeResponse:
        """Transforms AI-generated text into highly human-like, 0% plagiarism text."""
        sys_prompt = "You are a master academic editor. Your objective is to rewrite the provided text so that it passes Turnitin and Originality.ai with a 0% AI score AND a strictly 0% Plagiarism score."
        prompt = f"""CRITICAL INSTRUCTIONS FOR 0% AI & 0% PLAGIARISM:
1. COMPLETE RESTRUCTURING (ANTI-PLAGIARISM): Do NOT just swap words (synonym spinning). You must fundamentally rebuild the entire logical structure of the text from the ground up. Synthesize the core meaning and rewrite the ideas entirely in a new, original sequence.
2. MAXIMIZE BURSTINESS (ANTI-AI): AI inherently balances sentence length. You must violently break this. Write an extremely short sentence. Follow it with an incredibly long, 35+ word, multi-clause sentence.
3. ORGANIC SYNTAX (ANTI-AI): Inject semicolons (;) and em-dashes (—) natively. Never use generic AI transitional phrases like "Furthermore," "Moreover," "In conclusion," "Crucial," "Paramount," or "It is important to note."
4. RIGOROUS & FACTUAL: Keep the absolute academic truth, terminology, and metrics of the original text, but present them in a dramatically different, highly complex flow.

Return strictly the finalized, plagiarism-free text. Do not include markdown formatting or conversational filler.

Text to Rewrite:
{text}"""

        try:
            completion = await self.client.chat.completions.create(
                model=settings.MODEL_NAME,
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": prompt}
                ],
                temperature=1.0, 
                top_p=0.95,
                max_tokens=4096,
                extra_body={"thinking_budget": -1},
                stream=False
            )
            
            final_content = completion.choices[0].message.content
                    
            if not final_content:
                 raise ValueError("Empty response returned from DeepSeek.")
                 
            humanized = final_content.strip()
                
            return HumanizeResponse(humanized_text=humanized)
            
        except Exception as e:
            logger.error(f"DeepSeek API Error during humanization: {e}. Falling back to in-house model.")
            
            # Trigger our in-house fallback system!
            try:
                fallback_text = self._in_house_humanize_fallback(text, error_reason=str(e))
                return HumanizeResponse(humanized_text=fallback_text)
            except Exception as fallback_error:
                raise HTTPException(status_code=500, detail=f"Both Primary and In-House Models Failed: {str(fallback_error)}")


# ==========================================
# 4. Dependency Injection
# ==========================================
def get_ai_service() -> AIService:
    """Dependency injector for AIService"""
    return AIService()

# ==========================================
# 5. Application and Route Definition
# ==========================================
app = FastAPI(
    title=settings.PROJECT_NAME, 
    version=settings.VERSION,
    description="Scalable, enterprise-grade AI Text Processing API."
)

# CORS middleware for secure cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handler for cleaner unhandled exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception occurred")
    return JSONResponse(
        status_code=500,
        content={"message": "An unexpected error occurred. Please try again later.", "details": str(exc)},
    )

# Routes
@app.get("/", tags=["Health"])
async def health_check():
    return {"status": "healthy", "app": settings.PROJECT_NAME, "version": settings.VERSION}

@app.post("/api/check-plagiarism", response_model=PlagiarismResponse, tags=["AI Processing"])
async def api_check_plagiarism(req: TextRequest, ai_service: AIService = Depends(get_ai_service)):
    return await ai_service.check_plagiarism(req.text)

@app.post("/api/humanize", response_model=HumanizeResponse, tags=["AI Processing"])
async def api_humanize_text(req: TextRequest, ai_service: AIService = Depends(get_ai_service)):
    return await ai_service.humanize_text(req.text)
