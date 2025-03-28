import {HttpErrors} from '@loopback/rest';
import {BookInterface} from '../interfaces/book-interface';
import axios from 'axios';

export class BookValidator {
  private static instance: BookValidator;
  private authorServiceUrl = 'http://localhost:3002';
  private categoryServiceUrl = 'http://localhost:3003';

  // Private constructor to prevent instantiation
  private constructor() {}

  // Method to fetch author by ID
  private async fetchAuthor(authorId: string) {
    try {
      const response = await axios.get(
        `${this.authorServiceUrl}/authors/${authorId}`,
      );
      return response.data || null;
    } catch (error) {
      return null;
    }
  }

  // Method to fetch category by ID
  private async fetchCategory(categoryId: string) {
    try {
      const response = await axios.get(
        `${this.categoryServiceUrl}/categories/${categoryId}`,
      );
      return response.data || null;
    } catch (error) {
      return null;
    }
  }

  // Get instance of the BookValidator class
  public static getInstance(): BookValidator {
    if (!BookValidator.instance) {
      BookValidator.instance = new BookValidator();
    }
    return BookValidator.instance;
  }

  // Validation logic
  public async validate(book: BookInterface): Promise<void> {
    // Validate book ID
    if (!book.bookId.startsWith('B')) {
      throw new HttpErrors.BadRequest('Book ID must start with "B"');
    }

    // Validate title
    if (!book.bookTitle) {
      throw new HttpErrors.BadRequest('Title is required');
    }

    // Validate ISBN
    if (!book.bookIsbn) {
      throw new HttpErrors.BadRequest('ISBN is required');
    }

    // Validate price
    if (!book.bookPrice) {
      throw new HttpErrors.BadRequest('Price is required');
    }

    // Validate authorId
    if (!book.bookAuthorId || !book.bookAuthorId.startsWith('A')) {
      throw new HttpErrors.BadRequest(
        'Author ID is required and must start with "A"',
      );
    }

    // Validate categoryId
    if (!book.bookCategoryId || !book.bookCategoryId.startsWith('C')) {
      throw new HttpErrors.BadRequest(
        'Category ID is required and must start with "C"',
      );
    }

    // Validate price (should be a number)
    if (isNaN(book.bookPrice)) {
      throw new HttpErrors.BadRequest('Price must be a valid number');
    }

    // Check if author exists
    const author = await this.fetchAuthor(book.bookAuthorId);
    if (!author) {
      throw new HttpErrors.BadRequest(
        `Author with ID ${book.bookAuthorId} not found`,
      );
    }

    // Check if category exists
    const category = await this.fetchCategory(book.bookCategoryId);
    if (!category) {
      throw new HttpErrors.BadRequest(
        `Category with ID ${book.bookCategoryId} not found`,
      );
    }
  }
}