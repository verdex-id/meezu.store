# admin API Spec

## Update admin Password

Endpoint : PATCH /api/admin/settings/password

Request Header :
- Authorization : bearer <access_token>

#### Request Body :

```json
{
	"password":"admin321",
	"new_password":"admin911"
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