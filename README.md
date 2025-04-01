## Book handling API ##

This is a simple REST API for managing books library written in NodeJS using Express and Dockerized MySQL database for storage.

### Pre-requisites ###
1. Node v22.14 or newer.
2. Docker or Docker Desktop. Download link in installation instructions if needed.
3. API testing platform. Can use Postman if standalone tool is wanted (available here: https://www.postman.com/), or use Thunderclient extension in VSC, if it is your preferred code editor.

### Installation ###
#### Node installation ####
1. Download Node following instructions available here https://nodejs.org/en/download. Make sure to select your platform accordingly and install manager according to your preference. Download options available at top of the download page as selectable options.
#### Docker installation (if needed) ####
1. Download project from repository.
2. Download Docker if not present in machine. Docker desktop download link is available here: https://www.docker.com/
3. Follow instructions to install Docker desktop (if not already installed).
4. Open Docker and navigate to "Images" section.
5. Search for "MySQL" latest image and pull it.

#### Project preparation ####
1. Download project from repository.
2. Open project in your preferred code editor. I used VSC (available here: https://code.visualstudio.com/).
3. Open "docker-compose.yml" file and fill out fields marked with \<placeholder_text\>. Placeholder text explains what is expected to be entered there.
4. Open .env file and fill out required environment variable fields present with data filled out in docker-compose.yml file in previous step

### Running project ###
1. Run "docker compose up -d" command to create Docker network and start MySQL container which will have connection details provided in "docker-compose.yml". "-d" flag is optional as it just runs container in the background. You can check that your MySQL service is running using "docker compose ps" command if wanted.
2. Open new terminal (if needed) and run command "npm run build". This will install all needed node dependencies and start the application.
3. Open your API testing platform. All API commands will start with "localhost:3000/api/books" when testing.

#### URL call list ####
1. GET - "localhost:3000/api/books" - returns list of available books. Initially empty. \
1.1 there is an optional "?filter" query parameter available. If passed in the call with "=" value, then default list of not deleted books from DB is returned. When passed with "=archived" value, API will return archived/soft deleted books list only. When passed with "=all" value, API will return list of all books no matter the archive/soft delete state of them.
3. POST - "localhost:3000/api/books" - creates new book from passed up JSON object. JSON object must have "title", "author", "genre" and "publishDate" fields in it. All fields are in string value. "publishDate" is a string with "YYYY-MM-DD" format. Duplicate titles and other parameters are allowed as long as every record title-publishDate fields value combination is unique.
4. PUT - update call - "localhost:3000/api/books/:id" - Can update single field or all fields of existing book record as long as ID is known. Update data is passed as JSON object and must have at least one field to update successfully.
5. PUT - restore call - "localhost:3000/api/books/restore/:id" - Will restore book from archived/soft deleted state when given the ID.
6. DELETE - "localhost:3000/api/books/:id" - Archives/soft deletes book in table. To retrieve archived books list GET request API URL has to be called with "?filter=archived" or "?filter=all" parameters mentioned in 1.1.

### Testing ###
Simple unit tests for basic CRUD functions are available. Written with Jest library. Can be run with "npm run test" command in terminal.
