# admin Api spec

## create discount

Endpoint : POST /api/discounts

Request Header :
- Authorization : bearer <access_token>


### Request Body :


```json
{
 "is_percent_discount": false, 
  "discount_value": 10000,      

  "maximum_discount_amount": 2000, 
	
	"is_limited_discount": false,
	"discount_usage_limits": 1,

  "is_threshold_discount": false, 
  "discount_minimum_amount": 3000,  

  "is_limited_time_discount": false, 
  "from_date": "2024-04-03T00:00:00.000Z", 
  "to_date": "2024-04-10T23:59:59.000Z",  

  "is_daily_discount": false, 
  "from_hour": 10,            
  "to_hour": 18              
}

```
#### Response Body (Success) :

```json
{
	"status": "success",
	"data": {
		"discount": {
			"discount_code": "7JLbWXOt",
			"discount_value": 10000,
			"usage_limits": 1,
			"number_of_uses": 0
		}
	}
}
```

## GET discount

Endpoint : GET /api/discounts

Request Header :
- Authorization : bearer <access_token>

#### Response  (Success) :

```json
{
	"status": "success",
	"data": {
		"discounts": [
			{
				"discount_code": "7JLbWXOt",
				"discount_id": 1,
				"discount_value": 10000,
				"threshold_discount": null,
				"limited_time_discount": null,
				"daily_discount": null
			}
		]
	}
}
```


## DELETE discount

Endpoint : DELETE /api/discounts <discount_id>

Request Header :
- Authorization : bearer <access_token>

#### Response  (Success) :

```json
{
	"status": "success",
	"data": {
		"discounts": [
			{
				"discount_code": "7JLbWXOt",
				"discount_id": 1,
				"discount_value": 10000,
				"threshold_discount": null,
				"limited_time_discount": null,
				"daily_discount": null
			}
		]
	}
}
```


#### Response Body (Error) :

```json

```