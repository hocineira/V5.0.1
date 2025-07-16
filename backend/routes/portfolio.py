from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os

from models import (
    PersonalInfo, PersonalInfoUpdate,
    Education, EducationCreate, EducationUpdate,
    SkillCategory, SkillCategoryCreate, SkillCategoryUpdate,
    Project, ProjectCreate, ProjectUpdate,
    Experience, ExperienceCreate, ExperienceUpdate,
    Certification, CertificationCreate, CertificationUpdate,
    Testimonial, TestimonialCreate, TestimonialUpdate,
    ContactMessage, ContactMessageCreate
)

router = APIRouter()

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Personal Info Routes
@router.get("/personal-info", response_model=PersonalInfo)
async def get_personal_info():
    personal_info = await db.personal_info.find_one()
    if not personal_info:
        raise HTTPException(status_code=404, detail="Personal info not found")
    return PersonalInfo(**personal_info)

@router.put("/personal-info", response_model=PersonalInfo)
async def update_personal_info(update_data: PersonalInfoUpdate):
    personal_info = await db.personal_info.find_one()
    if not personal_info:
        raise HTTPException(status_code=404, detail="Personal info not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    await db.personal_info.update_one(
        {"id": personal_info["id"]}, 
        {"$set": update_dict}
    )
    
    updated_info = await db.personal_info.find_one({"id": personal_info["id"]})
    return PersonalInfo(**updated_info)

# Education Routes
@router.get("/education", response_model=List[Education])
async def get_education():
    education_list = await db.education.find().to_list(100)
    return [Education(**edu) for edu in education_list]

@router.post("/education", response_model=Education)
async def create_education(education_data: EducationCreate):
    education = Education(**education_data.dict())
    await db.education.insert_one(education.dict())
    return education

@router.put("/education/{education_id}", response_model=Education)
async def update_education(education_id: str, update_data: EducationUpdate):
    education = await db.education.find_one({"id": education_id})
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    await db.education.update_one(
        {"id": education_id}, 
        {"$set": update_dict}
    )
    
    updated_education = await db.education.find_one({"id": education_id})
    return Education(**updated_education)

@router.delete("/education/{education_id}")
async def delete_education(education_id: str):
    result = await db.education.delete_one({"id": education_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"message": "Education deleted successfully"}

# Skills Routes
@router.get("/skills", response_model=List[SkillCategory])
async def get_skills():
    skills_list = await db.skills.find().to_list(100)
    return [SkillCategory(**skill) for skill in skills_list]

@router.post("/skills", response_model=SkillCategory)
async def create_skill_category(skill_data: SkillCategoryCreate):
    skill_category = SkillCategory(**skill_data.dict())
    await db.skills.insert_one(skill_category.dict())
    return skill_category

@router.put("/skills/{skill_id}", response_model=SkillCategory)
async def update_skill_category(skill_id: str, update_data: SkillCategoryUpdate):
    skill = await db.skills.find_one({"id": skill_id})
    if not skill:
        raise HTTPException(status_code=404, detail="Skill category not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    await db.skills.update_one(
        {"id": skill_id}, 
        {"$set": update_dict}
    )
    
    updated_skill = await db.skills.find_one({"id": skill_id})
    return SkillCategory(**updated_skill)

@router.delete("/skills/{skill_id}")
async def delete_skill_category(skill_id: str):
    result = await db.skills.delete_one({"id": skill_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill category not found")
    return {"message": "Skill category deleted successfully"}

# Projects Routes
@router.get("/projects", response_model=List[Project])
async def get_projects():
    projects_list = await db.projects.find().to_list(100)
    return [Project(**project) for project in projects_list]

@router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate):
    project = Project(**project_data.dict())
    await db.projects.insert_one(project.dict())
    return project

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**project)

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, update_data: ProjectUpdate):
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    await db.projects.update_one(
        {"id": project_id}, 
        {"$set": update_dict}
    )
    
    updated_project = await db.projects.find_one({"id": project_id})
    return Project(**updated_project)

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Experience Routes
@router.get("/experience", response_model=List[Experience])
async def get_experience():
    experience_list = await db.experience.find().to_list(100)
    return [Experience(**exp) for exp in experience_list]

@router.post("/experience", response_model=Experience)
async def create_experience(experience_data: ExperienceCreate):
    experience = Experience(**experience_data.dict())
    await db.experience.insert_one(experience.dict())
    return experience

@router.put("/experience/{experience_id}", response_model=Experience)
async def update_experience(experience_id: str, update_data: ExperienceUpdate):
    experience = await db.experience.find_one({"id": experience_id})
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    await db.experience.update_one(
        {"id": experience_id}, 
        {"$set": update_dict}
    )
    
    updated_experience = await db.experience.find_one({"id": experience_id})
    return Experience(**updated_experience)

@router.delete("/experience/{experience_id}")
async def delete_experience(experience_id: str):
    result = await db.experience.delete_one({"id": experience_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"message": "Experience deleted successfully"}

# Certifications Routes
@router.get("/certifications", response_model=List[Certification])
async def get_certifications():
    certifications_list = await db.certifications.find().to_list(100)
    return [Certification(**cert) for cert in certifications_list]

@router.post("/certifications", response_model=Certification)
async def create_certification(certification_data: CertificationCreate):
    certification = Certification(**certification_data.dict())
    await db.certifications.insert_one(certification.dict())
    return certification

@router.put("/certifications/{certification_id}", response_model=Certification)
async def update_certification(certification_id: str, update_data: CertificationUpdate):
    certification = await db.certifications.find_one({"id": certification_id})
    if not certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    await db.certifications.update_one(
        {"id": certification_id}, 
        {"$set": update_dict}
    )
    
    updated_certification = await db.certifications.find_one({"id": certification_id})
    return Certification(**updated_certification)

@router.delete("/certifications/{certification_id}")
async def delete_certification(certification_id: str):
    result = await db.certifications.delete_one({"id": certification_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certification not found")
    return {"message": "Certification deleted successfully"}

# Testimonials Routes
@router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    testimonials_list = await db.testimonials.find().to_list(100)
    return [Testimonial(**testimonial) for testimonial in testimonials_list]

@router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate):
    testimonial = Testimonial(**testimonial_data.dict())
    await db.testimonials.insert_one(testimonial.dict())
    return testimonial

@router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, update_data: TestimonialUpdate):
    testimonial = await db.testimonials.find_one({"id": testimonial_id})
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    await db.testimonials.update_one(
        {"id": testimonial_id}, 
        {"$set": update_dict}
    )
    
    updated_testimonial = await db.testimonials.find_one({"id": testimonial_id})
    return Testimonial(**updated_testimonial)

@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}

# Contact Messages Routes
@router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages():
    messages_list = await db.contact_messages.find().to_list(100)
    return [ContactMessage(**message) for message in messages_list]

@router.post("/contact-messages", response_model=ContactMessage)
async def create_contact_message(message_data: ContactMessageCreate):
    message = ContactMessage(**message_data.dict())
    await db.contact_messages.insert_one(message.dict())
    return message

@router.put("/contact-messages/{message_id}/read")
async def mark_message_as_read(message_id: str):
    result = await db.contact_messages.update_one(
        {"id": message_id}, 
        {"$set": {"read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message marked as read"}

@router.delete("/contact-messages/{message_id}")
async def delete_contact_message(message_id: str):
    result = await db.contact_messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Contact message deleted successfully"}