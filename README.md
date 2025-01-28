# Book List Application

This is a simple Book List application that allows users to view a list of books with their cover images and descriptions. The cover images are fetched from the Open Library API.

## Features

- View a list of books with their cover images and descriptions.
- Add new books to the list.
- Update existing books.
- Delete books from the list.

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- EJS (Embedded JavaScript templates)
- Bootstrap 5
- Axios

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/book-list-app.git
    cd book-list-app
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the PostgreSQL database:

    - Create a new PostgreSQL database.
    - Create a table named [items](http://_vscodecontentref_/0) with the following schema:

        ```sql
        CREATE TABLE items (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            isbn VARCHAR(13)
        );
        ```

4. Configure the database connection:

    - Open [index.js](http://_vscodecontentref_/1) and update the PostgreSQL connection details:

        ```javascript
        const client = new pg.Client({
            user: 'your-username',
            host: 'localhost',
            database: 'your-database',
            password: 'your-password',
            port: 5432,
        });
        ```

5. Start the application:

    ```bash
    node index.js
    ```

6. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

- To view the list of books, navigate to the root URL (`/`).
- To add a new book, send a POST request to `/items` with the book's name, description, and ISBN.
- To update an existing book, send a PUT request to `/items/:id` with the updated name, description, and ISBN.
- To delete a book, send a DELETE request to `/items/:id`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
