# User API Spec

## Update User Name

Endpoint : PUT /api/user/settings/name

Request Header :
- Authorization : bearer <access_token>

#### Request Body :

```json
{
  "new_name": "Rizkia AS"
}
```

#### Response Body (Success) :

```json
{
  "status": "success",
  "data": {
    "full_name": "Rizkia AS"
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
  "message": "An operation failed because it depends on one or more records that were required but not found. {cause}",
  "detail": "No detail provided"
}
```
