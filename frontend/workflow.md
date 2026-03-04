/user/register => user registerm form 
/user/login => user login form 


/food-partner/register => food partner register form 
/food-partner/login => food partner login form 


# install react router dom

npm install react-router-dom

# to hit api from frontend to backend  
we use `axios` library 
`npm i axios`

syntax : 

```javascript
    const response = await axios.post(
        "http://localhost:3000/api/auth/user/register",
        {
            fullName: name,
            email,
            password,
        },
        {
            // withCredentials : true is used to send cookies to the backend 
            // because we are using cookie based authentication 
            withCredentials: true,
        },
    );
```