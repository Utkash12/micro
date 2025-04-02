import {get, post, patch, put, del, requestBody, param} from '@loopback/rest';
import {inject} from '@loopback/core';
import axios from 'axios';
import {BookValidator} from '../validations/validate-book';
import {AuthorValidator} from '../validations/validate-author';
import {CategoryValidator} from '../validations/validate-category';
import { AuthService } from '../services/auth.service';
import {Client} from '@opensearch-project/opensearch';
// import {AuthService} from '../services/auth-service.service';


export class ApiGatewayController {
  private bookServiceUrl = 'http://127.0.0.1:3001/books';
  private authorServiceUrl = 'http://127.0.0.1:3002/authors';
  private categoryServiceUrl = 'http://127.0.0.1:3003/categories';
  private bookValidator = BookValidator.getInstance();
  private client:Client;

  constructor(
    @inject('services.AuthService') private authService: AuthService, // Inject AuthService here
  ) {
    this.client=new Client({
      node: 'http://localhost:9200',
      ssl:{
        rejectUnauthorized: false,
      },
      auth: {
        username: 'admin',
        password: 'YourStrongPassword123!'
      }
    })
  }
  @post('/signup')
  async signup(@requestBody() user: any) {
    
    return this.authService.signup(user);
  }

  @post('/login')
  async login(@requestBody() credentials: any) {
    return this.authService.login(credentials);
  }

  // Books endpoints
  // @post('/books')
  // async createBook(@requestBody() book: any) {
  //   try {
  //     await this.bookValidator.validate(book);
  //   } catch (error) {
  //     console.error('Validation failed:', error.message);
  //     throw error;
  //   }
  //   const response = await axios.post(`${this.bookServiceUrl}/books`, book);
  //   this.client.index({
  //     index: 'books',
  //     id:book.bookId,
  //     body: book,
  //   })
  //   return response.data;
  // }

  @post('/books')
  async createBook(@requestBody() book: any) {
    try {
      const res = await this.bookValidator.validate(book);
      console.log("Res",res);
      
    } catch (error) {
      console.error('Validation failed:', error.message);
      throw error;
    }
    const response = await axios.post(`${this.bookServiceUrl}`, book);
    console.log("Response",response.data);
    
    return response.data;
  }

  @get('/books')
  async getBooks() {
    try {
      const booksResponse = await axios.get(`${this.bookServiceUrl}`);
      const books = booksResponse.data;
      const booksWithDetails = await Promise.all(
        books.map(async (book: any) => {
          const author = await this.fetchAuthor(book.bookAuthorId);
          const category = await this.fetchCategory(book.bookCategoryId);
          return {
            bookId: book.bookId,
            bookTitle: book.bookTitle,
            bookIsbn: book.bookIsbn,
            bookPrice: book.bookPrice,
            bookPublishDate: book.bookPublishDate,
            author: author.bookAuthorName,
            category: category.bookCategoryName,
          };
        }),
      );
      return booksWithDetails;
    } catch (error) {
      return {error: 'Failed to fetch books', details: error.message};
    }
  }

  @get('/books/{id}')
  async getBookById(@param.path.string('id') id: string) {
    const response = await axios.get(`${this.bookServiceUrl}/${id}`);
    return response.data;
  }

  @patch('/books/{id}')
  async updateBookById(
    @param.path.string('id') id: string,
    @requestBody() book: any,
  ) {
    const response = await axios.patch(
      `${this.bookServiceUrl}/books/${id}`,
      book,
    );
    return response.data;
  }

  @del('/books/{id}')
  async deleteBookById(@param.path.string('id') id: string) {
    console.log(id);
    const response = await axios.delete(`${this.bookServiceUrl}/${id}`);
    return response.data;
  }

  private async fetchAuthor(bookAuthorId: number) {
    try {
      const response = await axios.get(
        `${this.authorServiceUrl}/${bookAuthorId}`,
      );
      return response.data;
    } catch (error) {
      return {error: `Author not found for id ${bookAuthorId}`};
    }
  }

  private async fetchCategory(bookCategoryId: number) {
    try {
      const response = await axios.get(
        `${this.categoryServiceUrl}/${bookCategoryId}`,
      );
      return response.data;
    } catch (error) {
      return {error: `Category not found for id ${bookCategoryId}`};
    }
  }

  // Authors endpoints
  @post('/authors')
  async createAuthor(@requestBody() author: any) {
    try {
      AuthorValidator.getInstance().validate(author);
    } catch (error) {
      throw error;
    }
    const response = await axios.post(
      `${this.authorServiceUrl}/`,
      author,
    );
    return response.data;
  }

  @get('/authors')
  async getAllAuthors() {
    try {
      const response = await axios.get(`${this.authorServiceUrl}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching authors:', error.message);
      console.error('Error details:', error.toJSON?.() || error);
      return { error: 'Failed to fetch authors', details: error.message };
    }
  }

  @get('/authors/{id}')
  async getAuthorById(@param.path.string('id') id: string) {
    const response = await axios.get(
      `${this.authorServiceUrl}/${id}`,
    );
    return response.data;
  }

  @patch('/authors/{id}')
  async updateAuthor(
    @param.path.string('id') id: string,
    @requestBody() author: any,
  ) {
    const response = await axios.patch(
      `${this.authorServiceUrl}/${id}`,
      author,
    );
    return response.data;
  }

  @del('/authors/{id}')
  async deleteAuthor(@param.path.string('id') id: string) {
    const response = await axios.delete(`${this.authorServiceUrl}/${id}`);
    return response.data;
  }

  // Categories endpoints
  @post('/categories')
  async createCategory(@requestBody() category: any) {
    try {
      CategoryValidator.getInstance().validate(category);
    } catch (error) {
      throw error;
    }
    const response = await axios.post(
      `${this.categoryServiceUrl}/`,
      category,
    );
    return response.data;
  }

  @get('/categories')
  async getAllCategories() {
    const response = await axios.get(`${this.categoryServiceUrl}/`);
    return response.data;
  }

  @get('/categories/{id}')
  async getCategoryById(@param.path.string('id') id: string) {
    const response = await axios.get(
      `${this.categoryServiceUrl}/${id}`,
    );
    return response.data;
  }

  @patch('/categories/{id}')
  async updateCategory(
    @param.path.string('id') id: string,
    @requestBody() category: any,
  ) {
    const response = await axios.patch(
      `${this.categoryServiceUrl}/${id}`,
      category,
    );
    return response.data;
  }

  @del('/categories/{id}')
  async deleteCategory(@param.path.string('id') id: string) {
    const response = await axios.delete(
      `${this.categoryServiceUrl}/${id}`,
    );
    return response.data;
  }

  @get('/search/book')
  async searchBook(@param.query.string('q') query: string){
    const response= await this.client.search({
      index:'book',
      body:{
        query:{
          match:{'bookTitle.keyword':query},
        }
      }
    });
    const book=response.body.hits.hits.map(hit => hit._source);
    console.log(book);
  }
}
