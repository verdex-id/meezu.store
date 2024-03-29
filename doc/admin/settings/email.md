# admin API Spec

## Update admin Email

Endpoint : PATCH /api/admins/settings/email

Request Header :
- Authorization : bearer <access_token>

#### Request Body :

#### Request Body :

```json
{
	"password":"admin123",
	"new_email":"admins@gmail.com"
}
```

#### Response Body (Success) :

```json
{
	"status": "success",
	"data": {
		"email": "admins@gmail.com"
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





