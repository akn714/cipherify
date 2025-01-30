i am building a password saver website named 'cipherify', in this users can save their passwords securely


i want you to write a prompt for this project to create the frontend of the project on loveable.dev


# routes in the project

- auth
    - GET /auth/logout: backend redirects user to /
    - GET /auth/signup: backend sends a signup form
    - GET /auth/login: backend sends a login form
    - POST /auth/signup: backend sign's up a new user and redirects to /user (form takes 4 values -> name, email, password, confirm password)
    - POST /auth/login: backend log's in the user and redirects to /user (form takes 2 inputs -> email, password)
- user
    - GET /user: returns a html page of main dashboard
    - GET /user/get-secrets: this route fetchs all the secrets of the user in a json formate
    - POST /user/delete-secret: (sends the perticular url to backend to delete ) deletes a perticular secret using it's url as key
         - delete secret button: '<button class="delete-secret" onclick="deleteSecret(this)">Delete</button>'
         - this delete button will be included in every saved password container
    - POST /user/add-secret: add a new secret (sends url, username, password to the backend)

# pages
- main home page of website: this will be like a landing page of the project with links of login and signup
- login page: needs email and password
- signup page: needs name, email, password and confirm password
- secrets page: this page will be shown when the user logs in, this will display all the saved passwords of the user
    - this page contains an addition section which is shown only when the toggleAddSecret() function is called by clicking 'add' button, this page contains a form to add new password which contains 3 inputs (url, username and password)

# Note:
- do proper form validation in every form
- the ui of the website should be trendy ui




















**Project Title:** Cipherify - Secure Password Manager  

**Description:**  
Cipherify is a modern password manager that allows users to securely store and manage their credentials. The website will feature a trendy UI with proper form validation to ensure a seamless user experience.  

**Pages & Features:**  

1. **Landing Page (/)**
   - A sleek homepage with options to log in or sign up.  

2. **Authentication Pages**  
   - **Login Page (/auth/login)**: Users enter their email and password.  
   - **Signup Page (/auth/signup)**: Users provide their name, email, password, and confirm password.  
   - **Validation:**  
     - Required fields must be filled.  
     - Email format should be validated.  
     - Password strength check.  

3. **User Dashboard (/user)**  
   - Displays a list of saved passwords.  
   - Each saved password entry contains a delete button.  
   - A form to add new passwords appears when the 'Add' button is clicked.  

4. **Add Secret (Toggleable Form on /user)**  
   - Fields: URL, Username, Password  
   - Form appears when `toggleAddSecret()` is called.  

**Routes & Backend Integration:**  

- **Authentication Routes**  
  - `GET /auth/logout` → Redirects to `/`.  
  - `GET /auth/signup` → Displays the signup form.  
  - `GET /auth/login` → Displays the login form.  
  - `POST /auth/signup` → Handles signup (name, email, password, confirm password), then redirects to `/user`.  
  - `POST /auth/login` → Handles login (email, password), then redirects to `/user`.  

- **User Routes**  
  - `GET /user` → Displays the main dashboard.  
  - `GET /user/get-secrets` → Fetches saved passwords in JSON format.  
  - `POST /user/add-secret` → Adds a new password entry (URL, Username, Password).  
  - `POST /user/delete-secret` → Deletes a password using the URL as a key.  

  - **Delete Secret Button (Inside each saved password container):**  
    ```html
    <button class="delete-secret" onclick="deleteSecret(this)">Delete</button>
    ```

**UI & Styling:**  
- **Trendy, modern UI** with a minimalist design.  
- **Smooth animations** for form toggling and transitions.  
- **Dark mode support** for a professional look.  
- **Responsive layout** for mobile and desktop use.  

**Additional Requirements:**  
- Implement **form validation** for all inputs.  chrom
- Ensure buttons and inputs have an intuitive design.  
- **Toggle function for adding new secrets**.  
