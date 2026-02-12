import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Notification {
    id: bigint;
    recipient: Principal;
    isRead: boolean;
    message: string;
    timestamp: Time;
}
export type Time = bigint;
export interface UserProfile {
    displayName: string;
    phoneNumber: string;
    qrCode: string;
}
export interface Transaction {
    id: bigint;
    note: string;
    recipient: Principal;
    timestamp: Time;
    payer: Principal;
    amount: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTransaction(recipient: Principal, amount: bigint, note: string): Promise<Transaction>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNotification(id: bigint): Promise<Notification>;
    getUserNotifications(): Promise<Array<Notification>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markNotificationRead(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveUserProfile(profile: UserProfile): Promise<void>;
    sendQRScanNotification(owner: Principal, scannerDisplayName: string): Promise<void>;
}
