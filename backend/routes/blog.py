from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime, timezone
from config.database import db, get_next_sequence_value
from middleware.auth import get_current_user

router = APIRouter(prefix="/blog", tags=["Blog"])


class BlogPostCreate(BaseModel):
    title: str
    excerpt: str | None = None
    content: str | None = None
    author: str = "ShoRubenix"
    tags: list[str] = []
    image_url: str | None = None
    read_time: str | None = None


@router.get("")
async def get_blog_posts():
    posts_cursor = db.blog_posts.find({"is_published": True}).sort("created_at", -1)
    posts = []
    for doc in posts_cursor:
        doc_dict = dict(doc)
        if "_id" in doc_dict:
            del doc_dict["_id"]
        posts.append(doc_dict)
    return {"posts": posts}


@router.get("/{post_id}")
async def get_blog_post(post_id: int):
    # Increment views and fetch the updated post atomically
    post = db.blog_posts.find_one_and_update(
        {"id": post_id},
        {"$inc": {"views": 1}},
        return_document=True
    )
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    post_dict = dict(post)
    if "_id" in post_dict:
        del post_dict["_id"]
    return {"post": post_dict}


@router.post("")
async def create_blog_post(data: BlogPostCreate, current_user=Depends(get_current_user)):
    slug = data.title.lower().replace(" ", "-").replace("'", "")
    
    # Check slug uniqueness
    existing = db.blog_posts.find_one({"slug": slug})
    if existing:
        slug = f"{slug}-{int(datetime.now().timestamp())}"

    post_id = get_next_sequence_value("blog_posts_id")
    new_post = {
        "id": post_id,
        "title": data.title,
        "slug": slug,
        "excerpt": data.excerpt,
        "content": data.content,
        "author": data.author,
        "tags": data.tags,
        "image_url": data.image_url,
        "is_published": True,
        "views": 0,
        "read_time": data.read_time,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    db.blog_posts.insert_one(new_post)

    return {
        "message": "Blog post created",
        "post": {
            "id": post_id,
            "title": data.title,
            "slug": slug,
            "created_at": new_post["created_at"]
        }
    }
