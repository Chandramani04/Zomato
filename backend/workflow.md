# zomato clone 

## 1. server create and start : 
npm init -y
npm install express
npm install nodemon 

backend/src/app.js => create server 
backend/server.js => start server 

## 2. connect to mongodb : 
npm i mongoose 

create a new folder `db`in src folder  only to connect database 
backend/src/db/db.js => creata a function to connect to mongodb and export it  to call in server.js 

## 3. create user model : 
before creating routes we need to have a usermodel (how user data will look like) in our database , so that we can intereact and perform CRUD operations on it 
create a folder `/backend/src/models` 
create a file `/backend/src/models/user.model.js` which will have user model 



## 4. create authentication routes for user : 
create a folder `/backend/src/routes` 
create a file `/backend/src/routes/auth.routes.js` which will have routes for user authentication  

### create seperate controllers for routes in  `/backend/src/routes/auth.routes.js` : 
create a router(`express.Router()`) for user authentication  
syntax : 
`router.http_method("/route", controller_fn OR middleware_fn OR callback_fn OR array_of_middleware_fn_and_controller_fn)`
we don't create controller_fn here , we create controller_fn in `/backend/src/controllers` folder and import it here

create a file `/backend/src/controllers/auth.controller.js` which will have controller_fn for routes

[summary : we define routes in `/backend/src/routes` folder and their logic i.e. controller_fn in `/backend/src/controllers` folder and import them in routes file]

## 5. password hashing using bcrypt : 

hash the password before saving user to database 
use `bcrypt` library for password hashing 
npm i bcrypt 

after hashing password , we need to create user and save it to database  

## 6. cookie + JWT based authentication  + send response to frontend : 
    now user is created but next time user sends a request , we need to check if user is authenticated ,for that we will use cookies  
    we will use jsonwebtoken(JWT) to create a token and store it in cookie .
    to store JWT in cookie , we use a middleware called cookie-parser 

```javascript
    npm i cookie-parser 
    const cookieParser = require("cookie-parser"); // in app.js
    npm i jsonwebtoken 
    const jwt = require("jsonwebtoken"); // in auth.controller.js
```

    [note : we don't use cookie-parser middleware in routes file , we use it in app.js]


### now sign the token and store it in cookie : 
    
 create a token using `const myJwtToken = jwt.sign({id: user._id}, "secretKey");`  
 store it in cookie using `res.cookie("token", myJwtToken);`


### send response to frontend :

 send a response with user data and token in cookie  
 response status : 201 because we are creating a new data 
 
```javascript
    res.status(201).json({
    message : "User registered successfully",
    _id: user._id,
    fullName: user.fullName,
    email: user.email 
    // we never send password to frontend in response
 })
```

## 7. create .env file and add JWT_SECRET , MONGODB_URL : 
create a .env file in backend folder 
add `JWT_SECRET = "secretKey"` and `MONGODB_URL = "mongodb://localhost:27017/food-view"` to .env file 

to access .env file in our backend application , we need to install `dotenv` library 

`npm i dotenv `   

then write `require("dotenv").config();` in server.js file  
and replace `"secretKey"` with `process.env.JWT_SECRET` in auth.controller.js file 

add `.env` to `.gitignore` file  to prevent it from being pushed to github 

## 8. Logout user : 

create a route for logout in `/backend/src/routes/auth.routes.js` 
delete the token from cookie using `res.clearCookie("token");`




---
---

# Flow of registering,login and logout : 
```javascript
// all database related operations will be async and will return promises 
// so we will use async/await to handle them 

async function registerUser(req,res){
    const {fullName, email, password} = req.body;

    // check if user already exists 
    const existingUser = await userModel.findOne({email}); 
    // find on the basis of email because we set email to be unique in user model
    if(existingUser){
        return res.status(400).json({message: "User already exists"});
    }

    // before creating user and saving it to database , we need to hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user and save it to database 
    const user = await userModel.create({
        fullName, 
        email, 
        password: hashedPassword
    });

   
    // Cookie + JWT based authentication 
    const myJwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET );
    res.cookie("token", myJwtToken);

    res.status(201).json({
        message: "User registered successfully",
        _id: user._id,
        fullName: user.fullName,
        email: user.email 
        // we never send password to frontend in response
    })
   
}

async function loginUser(req,res){
    const {email, password} = req.body;

    // check if user exists 
    const user = await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message: "Invalid credentials"});
    }

    // check if password is correct 
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Invalid credentials"});
    }

    // now user is verified , create token and store it in cookie 
    const myJwtToken = jwt.sign({id: user._id}, process.env.JWT_SECRET );
    res.cookie("token", myJwtToken);

    res.status(200).json({
        message: "User logged in successfully",
        _id: user._id,
        fullName: user.fullName,
        email: user.email 
        // we never send password to frontend in response
    })

}

async function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({message: "User logged out successfully"});
}

```



## multer middleware : 
multer is a middleware to handle file upload 
`npm i multer`

express can't handle file upload of any format of file 

how to use multer : 

```javascript
const multer = require("multer"); // import multer
const upload = multer({
    storage:multer.memoryStorage() // storage means where to store the file  multer.memoryStorage() means store the file in memory
    // multer.diskStorage() means store the file in disk 
    // destination: "uploads/", // destination means where to store the file    
});

// now use this middleware in routes 
router.post("/", upload.single("video"), controller_fn); 

upload.single() -> syntax for single file upload 
upload.array() -> syntax for multiple file upload  
inside () -> we pass the name of the file field in the form 
```


## Connect FE to BE :  Axios and CORS : 

CORS : Cross Origin Resource Sharing  
Axios is a library to make HTTP requests from frontend to backend  
CORS is a security feature that prevents web pages from making requests to a different domain than the one that served the web page  
`npm i axios`
`npm i cors` 




  

  

  



    





