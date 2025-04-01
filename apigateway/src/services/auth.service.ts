import {injectable, BindingScope} from '@loopback/core';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import {HttpErrors} from '@loopback/rest';

@injectable({scope: BindingScope.SINGLETON})
export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'default_secret';

  // In-memory storage for authors (use a database in production)
  private authors: any[] = [];

  /**
   * Generate JWT Token
   */
  generateToken(author: any): string {
    const payload = {
      id: author.bookAuthorId,
      name: author.bookAuthorName,
    };
    return jwt.sign(payload, this.jwtSecret, {expiresIn: '1h'});
  }

  /**
   * Verify JWT Token
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new HttpErrors.Unauthorized('Token is invalid or expired');
    }
  }

  /**
   * Hash Password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Validate Password
   */
  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Sign Up Method
   */
  async signup(author: {bookAuthorName: string; password: string}) {
    // Check if the author already exists in in-memory storage
    const existingAuthor = this.authors.find(
      (a) => a.bookAuthorName === author.bookAuthorName,
    );

    if (existingAuthor) {
      throw new HttpErrors.Conflict('Author with this name already exists');
    }

    // Hash the password before storing
    const hashedPassword = await this.hashPassword(author.password);
    const newAuthor = {
      bookAuthorId: Date.now().toString(),  // Generate a unique ID for the author
      bookAuthorName: author.bookAuthorName,
      password: hashedPassword,
    };

    // Store the new author in in-memory storage  
    this.authors.push(newAuthor);
    return {message: 'Author registered successfully'};
  }

  /**
   * Log In Method
   */
  async login(credentials: {bookAuthorName: string; password: string}) {
    const author = this.authors.find(
      (a) => a.bookAuthorName === credentials.bookAuthorName,
    );

    if (!author) {
      throw new HttpErrors.Unauthorized('Invalid name or password');
    }

    // Validate password
    const passwordMatch = await this.comparePasswords(credentials.password, author.password);
    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized('Invalid name or password');
    }

    // Generate JWT token
    const token = this.generateToken(author);
    return {token};
  }
}
