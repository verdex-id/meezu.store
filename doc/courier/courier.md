# admin Api spec

## create couriers

Endpoint : POST /api/couriers

Request Header :
- Authorization : bearer <access_token>


### Request Body :


```json
{
  "courier_code": "gojek",
  "courier_service_code": "instant"
}
```

#### Response Body (Success) :

```json
{
	"status": "success",
	"data": {
		"courier_company": {
			"courier_id": 1,
			"courier_name": "Gojek",
			"courier_code": "gojek",
			"courier_service_name": "Instant",
			"courier_service_code": "instant"
		}
	}
}
```

#### Response Body (Error) :
```json
{
	"status": "fail",
	"message": "Unable to add this specific company, please add a supported company",
	"detail": "No detail provided"
}
```
