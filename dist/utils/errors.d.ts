export declare class HttpError extends Error {
    readonly status: number;
    readonly details?: unknown;
    constructor(message: string, status?: number, details?: unknown);
}
export declare class DocusealApiError extends Error {
    readonly status: number | undefined;
    readonly errorCode: string | undefined;
    readonly details: unknown;
    constructor(message: string, status?: number, errorCode?: string, details?: unknown);
}
//# sourceMappingURL=errors.d.ts.map