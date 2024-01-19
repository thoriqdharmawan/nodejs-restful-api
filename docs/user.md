# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body:
```json
{
  "username": "thoriq",
  "password": "rahasia",
}
```

Response Body Success: 
```Json
{
  "data": {
    "username": "thoriq",
    "name": "Thoriq Dharmawan"
  }
}
```

Response Body Error: 
```Json
{
  "errors": "Username alreeady registred"
}
```

## Login User API

Endpoint: POST /api/users/login

Request Body:
```json
{
  "username": "thoriq",
  "password": "rahasia"
}
```

Response Body Success: 
```Json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error: 
```Json
{
  "errors": "Username or password wrong"
}
```

## Update User API

Endpoint: PATCH /api/users/current

Headers: 
- Authorization: "unique-token"

Request Body:
```json
{
  "name": "Thoriq Dharmawan Lagi", // optional
  "password": "new_password" // optional
}
```

Response Body Success: 
```Json
{
  "data": {
    "username": "thoriq",
    "name": "Thoriq Dharmawan Lagi"
  }
}
```

Response Body Error: 
```Json
{
  "errors": "Name length max 100"
}
```

## Get User API

Endpoint: GET /api/users/current

Response Body Success: 
```Json
{
  "data": {
    "username": "thoriq",
    "name": "Thoriq Dharmawan"
  }
}
```

Response Body Error: 
```Json
{
  "errors": "Unauthorized"
}
```


## Logout User API

Endpoint: DELETE /api/users/logout

Headers: 
- Authorization: "unique-token"

Response Body Success: 
```Json
{
  "data": "OK"
}
```

Response Body Error: 
```Json
{
  "errors": "Error unauthorized"
}
```