export declare const register: (data: {
    email: string;
    password: string;
    name?: string;
}) => Promise<{
    id: number;
    name: string | null;
    createdAt: Date;
    email: string;
}>;
export declare const login: (data: {
    email: string;
    password: string;
}) => Promise<{
    token: string;
    user: {
        id: number;
        email: string;
        name: string | null;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map