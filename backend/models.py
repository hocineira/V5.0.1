from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class PersonalInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    title: str
    subtitle: str
    description: str
    email: str
    phone: str
    location: str
    avatar: str
    resume: str
    social: dict
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PersonalInfoUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None
    resume: Optional[str] = None
    social: Optional[dict] = None

class Education(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    degree: str
    school: str
    period: str
    description: str
    skills: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class EducationCreate(BaseModel):
    degree: str
    school: str
    period: str
    description: str
    skills: List[str]

class EducationUpdate(BaseModel):
    degree: Optional[str] = None
    school: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    skills: Optional[List[str]] = None

class SkillItem(BaseModel):
    name: str
    level: int

class SkillCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    items: List[SkillItem]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class SkillCategoryCreate(BaseModel):
    category: str
    items: List[SkillItem]

class SkillCategoryUpdate(BaseModel):
    category: Optional[str] = None
    items: Optional[List[SkillItem]] = None

class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    technologies: List[str]
    image: str
    category: str
    date: str
    highlights: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProjectCreate(BaseModel):
    title: str
    description: str
    technologies: List[str]
    image: str
    category: str
    date: str
    highlights: List[str]
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technologies: Optional[List[str]] = None
    image: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    highlights: Optional[List[str]] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None

class Experience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    company: str
    period: str
    description: str
    responsibilities: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ExperienceCreate(BaseModel):
    title: str
    company: str
    period: str
    description: str
    responsibilities: List[str]

class ExperienceUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    period: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[List[str]] = None

class Certification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    issuer: str
    status: str
    date: str
    description: str
    credential_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class CertificationCreate(BaseModel):
    name: str
    issuer: str
    status: str
    date: str
    description: str
    credential_url: Optional[str] = None

class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuer: Optional[str] = None
    status: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    credential_url: Optional[str] = None

class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    company: str
    content: str
    avatar: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TestimonialCreate(BaseModel):
    name: str
    role: str
    company: str
    content: str
    avatar: str

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    company: Optional[str] = None
    content: Optional[str] = None
    avatar: Optional[str] = None

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    message: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False

class ContactMessageCreate(BaseModel):
    name: str
    email: str
    message: str

# New models for additional features
class Procedure(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    content: str
    category: str
    tags: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProcedureCreate(BaseModel):
    title: str
    description: str
    content: str
    category: str
    tags: List[str]

class ProcedureUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None

class VeilleContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # 'technologique' or 'juridique'
    title: str
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class VeilleContentCreate(BaseModel):
    type: str
    title: str
    content: str

class VeilleContentUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None