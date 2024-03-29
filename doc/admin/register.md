# admin API Spec

## Register admin

Endpoint : POST /api/admins/register

#### Request Body :

```json
{
  "admin_full_name": "AdminDemit",
  "password": "admin123",
  "admin_email": "admin2@gmail.com"
}
```

#### Response Body (Success) :

```json
{
	"status": "success",
	"data": {
		"admin_full_name": "AdminDemit",
		"admin_email": "admin2@gmail.com"
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