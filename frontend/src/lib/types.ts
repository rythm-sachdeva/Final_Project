export interface signupForm{
    first_name:string,
    last_name:string,
    email : string,
    password:string
}

export interface loginForm{
    email : string,
    password:string
}

interface User {
    email: string;
    id: string;
  }
  
export interface LoginResponse {
    message: string;
    token: string;
    user: User;
  }