# Documentation

### till now
- added secrets after encrypting
- todo:
    - [x] decrypting secrets using pin on client side
    - [ ] removing IV from user db (iv will be in secrets array)

### Security
- user signs up: (working fine)
    - a new user is created
    - a randomly generated initialization vector (IV) is sent from frontend using 'cryto' in form data and is saved in user db
    - the initialization vector (IV) is saved in cookies
    - user redirected to /user
- login: (working fine)
    - user gets logged in using email and password
    - initialization vector (IV) from user db is saved in browser cookies
    - redirect to /user

### Todo
- [ ] Delete user account
- [ ] adding form validation in login like done in signup
- [ ] adding popup for messages

# Todos (frontend)
- logout not implemented properly
- implementing ProtechedRoute properly (fixing /api/auth/verify route in backend)

### Todos when merging frontend and backend
- [ ] removing "sameSite: 'None'" from cookies during login and signup
- [ ] setting logout properly in frontend
- [ ] removing hard coded urls in fetch api 'http://localhost:3000/' -> '/'

### Workflow
- signup
    - user sign ups
    - user adds secret and is prompted to enter pin (iv of the secret is saved along with username and password in the db)
    - user logs out
- login
    - user logs in
    - user is prompted to enter pin after login and then he/she will be able to see all the saved usernames and passwords

