from sqlalchemy import Column, String, DateTime, Boolean, Integer, Text, JSON, CHAR
from database import Base
from datetime import datetime
import uuid

# UUID compatible avec MariaDB
def generate_uuid():
    return str(uuid.uuid4())

class PersonalInfo(Base):
    __tablename__ = "personal_info"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    location = Column(String(255), nullable=False)
    avatar = Column(Text, nullable=False)
    resume = Column(Text, nullable=False)
    social = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Education(Base):
    __tablename__ = "education"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    degree = Column(String(255), nullable=False)
    school = Column(String(255), nullable=False)
    period = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    skills = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SkillCategory(Base):
    __tablename__ = "skill_categories"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    category = Column(String(255), nullable=False)
    items = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(JSON, nullable=False)
    image = Column(Text, nullable=False)
    category = Column(String(255), nullable=False)
    date = Column(String(100), nullable=False)
    highlights = Column(JSON, nullable=False)
    github_url = Column(String(255), nullable=True)
    demo_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Experience(Base):
    __tablename__ = "experience"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    period = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    responsibilities = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Certification(Base):
    __tablename__ = "certifications"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    issuer = Column(String(255), nullable=False)
    status = Column(String(100), nullable=False)
    date = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    credential_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    role = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    avatar = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Procedure(Base):
    __tablename__ = "procedures"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(255), nullable=False)
    tags = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VeilleContent(Base):
    __tablename__ = "veille_content"
    
    id = Column(String(36), primary_key=True, default=generate_uuid)
    type = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)