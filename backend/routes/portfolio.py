from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
ROOT_DIR = Path(__file__).parent.parent
load_dotenv(ROOT_DIR / '.env')

from database import get_db
from db_models import (
    PersonalInfo as PersonalInfoModel,
    Education as EducationModel,
    SkillCategory as SkillCategoryModel,
    Project as ProjectModel,
    Experience as ExperienceModel,
    Certification as CertificationModel,
    Testimonial as TestimonialModel,
    ContactMessage as ContactMessageModel,
    Procedure as ProcedureModel,
    VeilleContent as VeilleContentModel
)

from models import (
    PersonalInfo, PersonalInfoUpdate,
    Education, EducationCreate, EducationUpdate,
    SkillCategory, SkillCategoryCreate, SkillCategoryUpdate,
    Project, ProjectCreate, ProjectUpdate,
    Experience, ExperienceCreate, ExperienceUpdate,
    Certification, CertificationCreate, CertificationUpdate,
    Testimonial, TestimonialCreate, TestimonialUpdate,
    ContactMessage, ContactMessageCreate,
    Procedure, ProcedureCreate, ProcedureUpdate,
    VeilleContent, VeilleContentCreate, VeilleContentUpdate
)

router = APIRouter()

def model_to_dict(model):
    """Convert SQLAlchemy model to dictionary"""
    result = {}
    for c in model.__table__.columns:
        value = getattr(model, c.name)
        # Convert UUID objects to strings for JSON serialization
        if hasattr(value, 'hex'):  # UUID objects have a hex attribute
            value = str(value)
        result[c.name] = value
    return result

# Personal Info Routes
@router.get("/personal-info", response_model=PersonalInfo)
async def get_personal_info(db: Session = Depends(get_db)):
    personal_info = db.query(PersonalInfoModel).first()
    if not personal_info:
        raise HTTPException(status_code=404, detail="Personal info not found")
    return PersonalInfo(**model_to_dict(personal_info))

@router.put("/personal-info", response_model=PersonalInfo)
async def update_personal_info(update_data: PersonalInfoUpdate, db: Session = Depends(get_db)):
    personal_info = db.query(PersonalInfoModel).first()
    if not personal_info:
        raise HTTPException(status_code=404, detail="Personal info not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(personal_info, key, value)
    
    db.commit()
    db.refresh(personal_info)
    return PersonalInfo(**model_to_dict(personal_info))

# Education Routes
@router.get("/education", response_model=List[Education])
async def get_education(db: Session = Depends(get_db)):
    education_list = db.query(EducationModel).all()
    return [Education(**model_to_dict(edu)) for edu in education_list]

@router.post("/education", response_model=Education)
async def create_education(education_data: EducationCreate, db: Session = Depends(get_db)):
    education = EducationModel(**education_data.dict())
    db.add(education)
    db.commit()
    db.refresh(education)
    return Education(**model_to_dict(education))

@router.put("/education/{education_id}", response_model=Education)
async def update_education(education_id: str, update_data: EducationUpdate, db: Session = Depends(get_db)):
    education = db.query(EducationModel).filter(EducationModel.id == education_id).first()
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(education, key, value)
    
    db.commit()
    db.refresh(education)
    return Education(**model_to_dict(education))

@router.delete("/education/{education_id}")
async def delete_education(education_id: str, db: Session = Depends(get_db)):
    education = db.query(EducationModel).filter(EducationModel.id == education_id).first()
    if not education:
        raise HTTPException(status_code=404, detail="Education not found")
    
    db.delete(education)
    db.commit()
    return {"message": "Education deleted successfully"}

# Skills Routes
@router.get("/skills", response_model=List[SkillCategory])
async def get_skills(db: Session = Depends(get_db)):
    skills_list = db.query(SkillCategoryModel).all()
    return [SkillCategory(**model_to_dict(skill)) for skill in skills_list]

@router.post("/skills", response_model=SkillCategory)
async def create_skill_category(skill_data: SkillCategoryCreate, db: Session = Depends(get_db)):
    skill_category = SkillCategoryModel(**skill_data.dict())
    db.add(skill_category)
    db.commit()
    db.refresh(skill_category)
    return SkillCategory(**model_to_dict(skill_category))

@router.put("/skills/{skill_id}", response_model=SkillCategory)
async def update_skill_category(skill_id: str, update_data: SkillCategoryUpdate, db: Session = Depends(get_db)):
    skill = db.query(SkillCategoryModel).filter(SkillCategoryModel.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill category not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(skill, key, value)
    
    db.commit()
    db.refresh(skill)
    return SkillCategory(**model_to_dict(skill))

@router.delete("/skills/{skill_id}")
async def delete_skill_category(skill_id: str, db: Session = Depends(get_db)):
    skill = db.query(SkillCategoryModel).filter(SkillCategoryModel.id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill category not found")
    
    db.delete(skill)
    db.commit()
    return {"message": "Skill category deleted successfully"}

# Projects Routes
@router.get("/projects", response_model=List[Project])
async def get_projects(db: Session = Depends(get_db)):
    projects_list = db.query(ProjectModel).all()
    return [Project(**model_to_dict(project)) for project in projects_list]

@router.post("/projects", response_model=Project)
async def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    project = ProjectModel(**project_data.dict())
    db.add(project)
    db.commit()
    db.refresh(project)
    return Project(**model_to_dict(project))

@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**model_to_dict(project))

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, update_data: ProjectUpdate, db: Session = Depends(get_db)):
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(project, key, value)
    
    db.commit()
    db.refresh(project)
    return Project(**model_to_dict(project))

@router.delete("/projects/{project_id}")
async def delete_project(project_id: str, db: Session = Depends(get_db)):
    project = db.query(ProjectModel).filter(ProjectModel.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}

# Experience Routes
@router.get("/experience", response_model=List[Experience])
async def get_experience(db: Session = Depends(get_db)):
    experience_list = db.query(ExperienceModel).all()
    return [Experience(**model_to_dict(exp)) for exp in experience_list]

@router.post("/experience", response_model=Experience)
async def create_experience(experience_data: ExperienceCreate, db: Session = Depends(get_db)):
    experience = ExperienceModel(**experience_data.dict())
    db.add(experience)
    db.commit()
    db.refresh(experience)
    return Experience(**model_to_dict(experience))

@router.put("/experience/{experience_id}", response_model=Experience)
async def update_experience(experience_id: str, update_data: ExperienceUpdate, db: Session = Depends(get_db)):
    experience = db.query(ExperienceModel).filter(ExperienceModel.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(experience, key, value)
    
    db.commit()
    db.refresh(experience)
    return Experience(**model_to_dict(experience))

@router.delete("/experience/{experience_id}")
async def delete_experience(experience_id: str, db: Session = Depends(get_db)):
    experience = db.query(ExperienceModel).filter(ExperienceModel.id == experience_id).first()
    if not experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    
    db.delete(experience)
    db.commit()
    return {"message": "Experience deleted successfully"}

# Certifications Routes
@router.get("/certifications", response_model=List[Certification])
async def get_certifications(db: Session = Depends(get_db)):
    certifications_list = db.query(CertificationModel).all()
    return [Certification(**model_to_dict(cert)) for cert in certifications_list]

@router.post("/certifications", response_model=Certification)
async def create_certification(certification_data: CertificationCreate, db: Session = Depends(get_db)):
    certification = CertificationModel(**certification_data.dict())
    db.add(certification)
    db.commit()
    db.refresh(certification)
    return Certification(**model_to_dict(certification))

@router.put("/certifications/{certification_id}", response_model=Certification)
async def update_certification(certification_id: str, update_data: CertificationUpdate, db: Session = Depends(get_db)):
    certification = db.query(CertificationModel).filter(CertificationModel.id == certification_id).first()
    if not certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(certification, key, value)
    
    db.commit()
    db.refresh(certification)
    return Certification(**model_to_dict(certification))

@router.delete("/certifications/{certification_id}")
async def delete_certification(certification_id: str, db: Session = Depends(get_db)):
    certification = db.query(CertificationModel).filter(CertificationModel.id == certification_id).first()
    if not certification:
        raise HTTPException(status_code=404, detail="Certification not found")
    
    db.delete(certification)
    db.commit()
    return {"message": "Certification deleted successfully"}

# Testimonials Routes
@router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(db: Session = Depends(get_db)):
    testimonials_list = db.query(TestimonialModel).all()
    return [Testimonial(**model_to_dict(testimonial)) for testimonial in testimonials_list]

@router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial_data: TestimonialCreate, db: Session = Depends(get_db)):
    testimonial = TestimonialModel(**testimonial_data.dict())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return Testimonial(**model_to_dict(testimonial))

@router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(testimonial_id: str, update_data: TestimonialUpdate, db: Session = Depends(get_db)):
    testimonial = db.query(TestimonialModel).filter(TestimonialModel.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(testimonial, key, value)
    
    db.commit()
    db.refresh(testimonial)
    return Testimonial(**model_to_dict(testimonial))

@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, db: Session = Depends(get_db)):
    testimonial = db.query(TestimonialModel).filter(TestimonialModel.id == testimonial_id).first()
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    db.delete(testimonial)
    db.commit()
    return {"message": "Testimonial deleted successfully"}

# Contact Messages Routes
@router.get("/contact-messages", response_model=List[ContactMessage])
async def get_contact_messages(db: Session = Depends(get_db)):
    messages_list = db.query(ContactMessageModel).all()
    return [ContactMessage(**model_to_dict(message)) for message in messages_list]

@router.post("/contact-messages", response_model=ContactMessage)
async def create_contact_message(message_data: ContactMessageCreate, db: Session = Depends(get_db)):
    message = ContactMessageModel(**message_data.dict())
    db.add(message)
    db.commit()
    db.refresh(message)
    return ContactMessage(**model_to_dict(message))

@router.put("/contact-messages/{message_id}/read")
async def mark_message_as_read(message_id: str, db: Session = Depends(get_db)):
    message = db.query(ContactMessageModel).filter(ContactMessageModel.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message.read = True
    db.commit()
    return {"message": "Message marked as read"}

@router.delete("/contact-messages/{message_id}")
async def delete_contact_message(message_id: str, db: Session = Depends(get_db)):
    message = db.query(ContactMessageModel).filter(ContactMessageModel.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    db.delete(message)
    db.commit()
    return {"message": "Contact message deleted successfully"}

# Procedures Routes
@router.get("/procedures", response_model=List[Procedure])
async def get_procedures(db: Session = Depends(get_db)):
    procedures_list = db.query(ProcedureModel).all()
    return [Procedure(**model_to_dict(procedure)) for procedure in procedures_list]

@router.post("/procedures", response_model=Procedure)
async def create_procedure(procedure_data: ProcedureCreate, db: Session = Depends(get_db)):
    procedure = ProcedureModel(**procedure_data.dict())
    db.add(procedure)
    db.commit()
    db.refresh(procedure)
    return Procedure(**model_to_dict(procedure))

@router.get("/procedures/{procedure_id}", response_model=Procedure)
async def get_procedure(procedure_id: str, db: Session = Depends(get_db)):
    procedure = db.query(ProcedureModel).filter(ProcedureModel.id == procedure_id).first()
    if not procedure:
        raise HTTPException(status_code=404, detail="Procedure not found")
    return Procedure(**model_to_dict(procedure))

@router.put("/procedures/{procedure_id}", response_model=Procedure)
async def update_procedure(procedure_id: str, update_data: ProcedureUpdate, db: Session = Depends(get_db)):
    procedure = db.query(ProcedureModel).filter(ProcedureModel.id == procedure_id).first()
    if not procedure:
        raise HTTPException(status_code=404, detail="Procedure not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(procedure, key, value)
    
    db.commit()
    db.refresh(procedure)
    return Procedure(**model_to_dict(procedure))

@router.delete("/procedures/{procedure_id}")
async def delete_procedure(procedure_id: str, db: Session = Depends(get_db)):
    procedure = db.query(ProcedureModel).filter(ProcedureModel.id == procedure_id).first()
    if not procedure:
        raise HTTPException(status_code=404, detail="Procedure not found")
    
    db.delete(procedure)
    db.commit()
    return {"message": "Procedure deleted successfully"}

# Veille Content Routes
@router.get("/veille", response_model=List[VeilleContent])
async def get_veille_content(db: Session = Depends(get_db)):
    veille_list = db.query(VeilleContentModel).all()
    return [VeilleContent(**model_to_dict(veille)) for veille in veille_list]

@router.get("/veille/{veille_type}", response_model=List[VeilleContent])
async def get_veille_by_type(veille_type: str, db: Session = Depends(get_db)):
    veille_list = db.query(VeilleContentModel).filter(VeilleContentModel.type == veille_type).all()
    return [VeilleContent(**model_to_dict(veille)) for veille in veille_list]

@router.post("/veille", response_model=VeilleContent)
async def create_veille_content(veille_data: VeilleContentCreate, db: Session = Depends(get_db)):
    veille = VeilleContentModel(**veille_data.dict())
    db.add(veille)
    db.commit()
    db.refresh(veille)
    return VeilleContent(**model_to_dict(veille))

@router.put("/veille/{veille_id}", response_model=VeilleContent)
async def update_veille_content(veille_id: str, update_data: VeilleContentUpdate, db: Session = Depends(get_db)):
    veille = db.query(VeilleContentModel).filter(VeilleContentModel.id == veille_id).first()
    if not veille:
        raise HTTPException(status_code=404, detail="Veille content not found")
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict['updated_at'] = datetime.utcnow()
    
    for key, value in update_dict.items():
        setattr(veille, key, value)
    
    db.commit()
    db.refresh(veille)
    return VeilleContent(**model_to_dict(veille))

@router.delete("/veille/{veille_id}")
async def delete_veille_content(veille_id: str, db: Session = Depends(get_db)):
    veille = db.query(VeilleContentModel).filter(VeilleContentModel.id == veille_id).first()
    if not veille:
        raise HTTPException(status_code=404, detail="Veille content not found")
    
    db.delete(veille)
    db.commit()
    return {"message": "Veille content deleted successfully"}