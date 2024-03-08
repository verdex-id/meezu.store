# User API Spec

## Update User Password

Endpoint : PUT /api/user/settings/password

Request Header :
- Authorization : bearer <access_token>

#### Request Body :

```json
{
  "password":"old password", 
  "new_password":"new password"
}
```

#### Response Body (Success) :

```json
{
  "status": "success",
  "data": {
    "message": "Password successfully updated"
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

```json
{
  "status": "fail",
  "message": "Password incorrect.",
  "detail": "No detail provided"
}
```