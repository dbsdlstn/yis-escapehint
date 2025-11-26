// src/modules/auth/auth.service.ts
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class AuthService {
  private readonly jwtSecret: string;
  private readonly saltRounds: number;
  private readonly storedHashedPassword: string;

  constructor() {
    // In a real application, these would come from environment variables
    this.jwtSecret = process.env.JWT_SECRET || "default_secret_for_dev";
    this.saltRounds = 10;

    // Pre-hash the default password during initialization
    const defaultPassword = process.env.ADMIN_PASSWORD || "admin123";
    this.storedHashedPassword = bcrypt.hashSync(defaultPassword, this.saltRounds);
  }

  async login(password: string): Promise<string | null> {
    const isPasswordValid = await bcrypt.compare(password, this.storedHashedPassword);

    if (isPasswordValid) {
      // Generate JWT token
      const token = jwt.sign(
        {
          userId: "admin",
          role: "admin",
        },
        this.jwtSecret,
        { expiresIn: "2h" } // Token expires in 2 hours
      );

      return token;
    }

    return null;
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.jwtSecret);
      return true;
    } catch (_error) {
      return false;
    }
  }
}
