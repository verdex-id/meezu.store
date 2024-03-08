# User API Spec

## Update User Email

Endpoint : PUT /api/user/settings/email

Request Header :
- Authorization : bearer <access_token>

#### Request Body :

```json
{
  "password":"rizkia", 
  "new_email":"rizkia.as.actmp@gmail.com"
}
```

#### Response Body (Success) :

```json
{
  "status": "success",
  "data": {
    "email": "rizkia.as.actmp@gmail.com"
  }
}
```

#### Response Body (Error) :
```json
{
  "status": "error",
  "message": "We're sorry, but something unexpected happened. Please try again later."
}
```


#### Response Body (Failed) :

###### no detail provided 

```json
{
  "status": "fail",
  "message": "Password incorrect.",
  "detail": "No detail provided"
}

```
```json
{
  "status": "fail",
  "message": "Unique constraint failed on the {constraint}",
  "detail": "No detail provided"
}
```
