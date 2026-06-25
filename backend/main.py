from fastapi import FastAPI,Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database import engine,get_db,base
from models import user as UserModel,post as PostModel
from schemas import UserRegister,UserLogin,TokenResponse,UserResponse,ChangePassword,UpdateProfile,PostResponse,PostCreate
from auth import hash_password,verify_password,create_access_token,verify_token

oauth2_schema=OAuth2PasswordBearer(tokenUrl="login")
base.metadata.create_all(bind=engine)
app=FastAPI()
@app.get("/")
def home():
    return{"message":"backend is running"}

@app.post("/register",response_model=TokenResponse)
def register(data:UserRegister,db:Session=Depends(get_db)):
    existing_user=db.query(UserModel).filter(UserModel.email==data.email).first()
    if existing_user:
        raise HTTPException(status_code=400,detail="Email already registered")
    
    hashed=hash_password(data.password)
    new_user=UserModel(email=data.email,hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token=create_access_token({"id":new_user.id,"email":new_user.email})
    return {"access_token":token,"token_type":"bearer"}

@app.post("/login",response_model=TokenResponse)
def login(data:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    existing_user=db.query(UserModel).filter(UserModel.email==data.username).first()
    if not existing_user:
        raise HTTPException(status_code=404,detail="email not found")
    if not verify_password(data.password,existing_user.hashed_password):
        raise HTTPException(status_code=400,detail="incorrect password")
    token=create_access_token({"id":existing_user.id,"email":existing_user.email})
    return{"access_token":token,"token_type":"bearer"}

@app.get("/me",response_model=UserResponse)
def me(token:str =Depends(oauth2_schema),db:Session=Depends(get_db)):
    payload =verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="invalid or expired token")
    user =db.query(UserModel).filter(UserModel.id==payload["id"]).first()
    if not user:
        raise HTTPException(status_code=401,detail="user not found")
    return user

@app.put("/change-password", response_model=None)
def change_password(data:ChangePassword, token:str=Depends(oauth2_schema),db:Session=Depends(get_db)):
    payload=verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail=("invalid or token expired"))
    user=db.query(UserModel).filter(UserModel.id==payload["id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail=("user not found"))
    if not verify_password(data.old_password,user.hashed_password):
        raise HTTPException(status_code=400,detail=("incorrect old password"))
    user.hashed_password=hash_password(data.new_password)
    db.commit()
    return {"message":"password changed successfuly"}

@app.put("/update-profile", response_model=UserResponse)
def update_profile(data:UpdateProfile,token:str=Depends(oauth2_schema), db: Session=Depends(get_db)):
    payload= verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="invalid or expired tokens")
    user= db.query(UserModel).filter(UserModel.id==payload["id"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="user not found")
    existing_email=db.query(UserModel).filter(UserModel.email==data.email,UserModel.id!=user.id).first()
    if existing_email:
        raise HTTPException(status_code=400,detail= "email already taken")
        
    user.email=data.email
    db.commit()
    db.refresh(user)
    return user

@app.delete("/delete-account", response_model=None)
def delet_account(token:str=Depends(oauth2_schema), db:Session=Depends(get_db)):
    try:
        payload=verify_token(token)
        if not payload:
            raise HTTPException(status_code=401,detail="invalid or expired token")
    
        user=db.query(UserModel).filter(UserModel.id==payload["id"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="user not found")
        db.query(PostModel).filter(PostModel.user_id==user.id).delete()
    
        db.delete(user)
        db.commit()
    
        return {"message":"account deleted successfully"}
    except Exception as e:
        print("DELETE ERROE:",e)
        raise HTTPException(status_code=500,detail=str(e))

@app.post("/posts",response_model=PostResponse)
def create_post(data:PostCreate,token:str=Depends(oauth2_schema),db:Session=Depends(get_db)):
    payload=verify_token(token)
    if not payload:
        raise HTTPException(status_code=401,detail="invalid or expired token")
    
    new_post=PostModel(title=data.title,content=data.content,user_id=payload["id"])
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return new_post

@app.get("/posts", response_model=list[PostResponse])
def get_posts(db:Session=Depends(get_db)):
    posts=db.query(PostModel).all()
    return posts

@app.get("/posts/{id}",response_model=PostResponse)
def get_post(id:int,db:Session=Depends(get_db)):
    post=db.query(PostModel).filter(PostModel.id==id).first()
    if not post:
        raise HTTPException(status_code=404,detail="post not found")
    return post

@app.put("/posts/{id}",response_model=PostModel)
def update_post(id:int,data:PostCreate,token:str=Depends(oauth2_schema),db:Session=Depends(get_db)):
    payload=verify_token(token)
    if not payload:
        raise HTTPException(status_code=401,detail="invalid or expired token")
    post=db.query(PostModel).filter(PostModel.id==id).first()
    if not post:
        raise HTTPException(status_code=404,detail="post not found")
    if post.user_id !=payload["id"]:
        raise HTTPException(status_code=403,detail="you are not authorized to update this post")
    post.title=data.title
    post.content=data.content
    db.commit()
    db.refresh(post)
    return post

@app.delete("/posts/{id}",response_model=None)
def delete_post(id:int,token:str=Depends(oauth2_schema),db:Session=Depends(get_db)):
    payload=verify_token(token)
    if not payload:
        raise HTTPException(status_code=401,detail="invalid or expired token")
    post=db.query(PostModel).filter(PostModel.id==id).first()
    if not post:
        raise HTTPException(status_code=404,detail="post not found")
    if post.user_id !=payload["id"]:
        raise HTTPException(status_code=403,detail="you are not authorized to delete this post")
    db.delete(post)
    db.commit()
    return{"message":"post deleted successfully"}