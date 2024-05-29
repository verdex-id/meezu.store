# admin API Spec

## Update admin Name

Endpoint : PATCH /api/admin/settings/name

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
	"message": "No changes were made.",
	"detail": "No detail provided"
}
```
