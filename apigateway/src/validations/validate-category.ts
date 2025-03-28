import {HttpErrors} from '@loopback/rest';
import {CategoryInterface} from '../interfaces/category-interface'; // Ensure this file exists at the specified path

export class CategoryValidator {
  private static instance: CategoryValidator;

  // Private constructor to prevent instantiation
  private constructor() {}

  // Get instance of the CategoryValidator class
  public static getInstance(): CategoryValidator {
    if (!CategoryValidator.instance) {
      CategoryValidator.instance = new CategoryValidator();
    }
    return CategoryValidator.instance;
  }

  // Validation logic
  public validate(category: CategoryInterface): void {
    if (!category.bookCategoryId || !category.bookCategoryId.startsWith('C')) {
      throw new HttpErrors.BadRequest(
        'CategoryId is required and must start with "C"',
      );
    }
    if (!category.bookCategoryName) {
      throw new HttpErrors.BadRequest('CategoryName is required');
    }
  }
}