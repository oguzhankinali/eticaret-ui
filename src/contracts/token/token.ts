export interface Token {
    accessToken: string;
    refreshToken: string,
    expiration: Date | string;
}