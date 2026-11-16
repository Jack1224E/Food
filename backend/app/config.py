from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Root directory of Loners
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "SavoryAI Recipe Platform API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    
    # NVIDIA Nemotron
    NVIDIA_API_KEY: str = ""
    NVIDIA_BASE_URL: str = "https://integrate.api.nvidia.com/v1"
    NEMOTRON_MODEL: str = "nvidia/nemotron-3-ultra-550b-a55b"
    
    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
