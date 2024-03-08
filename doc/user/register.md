# User API Spec

## Register User

Endpoint : POST /api/user/register

#### Request Body :

```json
{
  "email" :       "rizkia.as.actmp@gmail.com",
  "full_name"  :   "Rizkia Adhy Syahputra",
  "password" :    "rahasia123"
}
```

#### Response Body (Success) :

```json
{
  "status": "success",
  "data": {
    "full_name": "Rizkia Adhy Syahputra",
    "email": "rizkia.as.actmp@gmail.com"
  }
}
```

#### Response Body (Error) :

```json
{
  "status": "error",
  "message": "Unable to register at this time. Please try again later."
}
```

#### Response Body (Failed) :

```json
{
  "status": "fail",
  "message": "Unique constraint failed on the {constraint}",
  "detail": "No detail provided"
}
```