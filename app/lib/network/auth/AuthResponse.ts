export default interface AuthResponse {
    user: User
    token: Token
    message: string
}

export interface User {
    username: string
    email: string
}

export interface Token {
    refresh: string
    access: string
}
