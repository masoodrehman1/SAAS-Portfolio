from pydantic import BaseModel
class UserRegister(BaseModel):
    email:str
    password:str

class UserLogin(BaseModel):
    email:str
    password:str
    
class TokenResponse(BaseModel):
    access_token:str
    token_type:str

class UserResponse(BaseModel):
    id:int
    email:str

class ChangePassword(BaseModel):
    old_password:str
    new_password:str

class UpdateProfile(BaseModel):
    email:str

class PostResponse(BaseModel):
    id:int
    title:str
    content:str
    user_id:int
    class Config:
        from_attributes=True

class PostCreate(BaseModel):
    title:str
    content:str