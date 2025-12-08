import type { Report, User, InsertUser } from "@shared/schema";

export interface IStorage {
  // Report methods
  saveReport(report: Report): Promise<Report>;
  getReport(id: string): Promise<Report | undefined>;
  getReports(): Promise<Report[]>;
  deleteReport(id: string): Promise<boolean>;
  
  // User methods (kept for compatibility)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private reports: Map<string, Report>;
  private users: Map<number, User>;
  private currentUserId: number;

  constructor() {
    this.reports = new Map();
    this.users = new Map();
    this.currentUserId = 1;
  }

  async saveReport(report: Report): Promise<Report> {
    this.reports.set(report.id, report);
    return report;
  }

  async getReport(id: string): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values()).sort((a, b) => b.timestamp - a.timestamp);
  }

  async deleteReport(id: string): Promise<boolean> {
    return this.reports.delete(id);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id: String(id) };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
