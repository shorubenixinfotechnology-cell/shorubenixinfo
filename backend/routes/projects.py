from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from config.database import db, get_next_sequence_value
from middleware.auth import get_current_user, get_optional_user

router = APIRouter(prefix="/projects", tags=["Projects"])


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None
    category: str | None = None
    tech: list[str] = []
    image_url: str | None = None
    live_url: str | None = None
    github_url: str | None = None
    client_name: str | None = None
    price: float | None = None


@router.get("")
async def get_projects():
    projects_cursor = db.projects.find({"status": "active"}).sort([("is_featured", -1), ("created_at", -1)])
    projects = []
    for doc in projects_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        projects.append(doc_dict)
    return {"projects": projects}


@router.get("/my-projects")
async def get_my_projects(current_user=Depends(get_current_user)):
    user_projs = list(db.user_projects.find({"user_id": current_user["id"]}))
    if not user_projs:
        return {"projects": []}

    project_ids = [up["project_id"] for up in user_projs]
    projects_cursor = db.projects.find({"id": {"$in": project_ids}})
    projects_dict = {p["id"]: p for p in projects_cursor}

    my_projects = []
    for up in user_projs:
        proj = projects_dict.get(up["project_id"])
        if proj:
            proj_dict = dict(proj)
            if "_id" in proj_dict:
                del proj_dict["_id"]
            proj_dict["purchased_at"] = up.get("purchased_at")
            my_projects.append(proj_dict)

    my_projects.sort(key=lambda x: x.get("purchased_at") or datetime.min, reverse=True)
    return {"projects": my_projects}


@router.get("/{project_id}")
async def get_project(project_id: int):
    project = db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    proj_dict = dict(project)
    if "_id" in proj_dict:
        del proj_dict["_id"]
    return {"project": proj_dict}


@router.post("")
async def create_project(data: ProjectCreate, current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    project_id = get_next_sequence_value("projects_id")
    new_project = {
        "id": project_id,
        "title": data.title,
        "description": data.description,
        "category": data.category,
        "tech": data.tech,
        "image_url": data.image_url,
        "live_url": data.live_url,
        "github_url": data.github_url,
        "client_name": data.client_name,
        "price": data.price,
        "is_featured": False,
        "status": "active",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    db.projects.insert_one(new_project)

    return {
        "message": "Project created",
        "project": {
            "id": project_id,
            "title": data.title,
            "description": data.description,
            "category": data.category,
            "tech": data.tech,
            "price": data.price,
            "created_at": new_project["created_at"]
        }
    }


@router.put("/{project_id}")
async def update_project(project_id: int, data: ProjectCreate, current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    updates = {
        "title": data.title,
        "description": data.description,
        "category": data.category,
        "tech": data.tech,
        "image_url": data.image_url,
        "live_url": data.live_url,
        "github_url": data.github_url,
        "client_name": data.client_name,
        "price": data.price,
        "updated_at": datetime.now(timezone.utc)
    }

    project = db.projects.find_one_and_update(
        {"id": project_id},
        {"$set": updates},
        return_document=True
    )
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    proj_dict = dict(project)
    if "_id" in proj_dict:
        del proj_dict["_id"]
        
    return {
        "message": "Project updated",
        "project": {
            "id": proj_dict["id"],
            "title": proj_dict["title"],
            "description": proj_dict["description"],
            "category": proj_dict["category"],
            "tech": proj_dict["tech"],
            "price": proj_dict.get("price")
        }
    }


@router.delete("/{project_id}")
async def delete_project(project_id: int, current_user=Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    result = db.projects.update_one(
        {"id": project_id},
        {"$set": {"status": "deleted", "updated_at": datetime.now(timezone.utc)}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted"}
