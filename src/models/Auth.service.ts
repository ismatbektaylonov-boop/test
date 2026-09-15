import bcrypt from "bcryptjs";

class AuthService {
  private readonly saltRounds = 10;

  public async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  public async comparePassword(
    plain: string,
    hashed: string
  ): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}

export default new AuthService();
