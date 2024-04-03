# admin Api spec

## create discount product

Endpoint : POST /api/discounts/products

Request Header :
- Authorization : bearer <access_token>


### Request Body :

```json
{
  "product_id": 2,          
  "is_percent_discount": false, 
  "discount_value": 500
}
```
#### Response Body (Success) :


```json
{
	"status": "success",
	"data": {
		"discount": {
			"discount_code": "4EybXHuN",
			"discount_value": 500,
			"is_percent_discount": false,
			"maximum_discount_amount": 0,
			"product_discount": {
				"product_id": 2
			}
		}
	}
}
```


## GET discount product
Endpoint : GET /api/discounts/products

Request Header :
- Authorization : bearer <access_token>

#### Response (Success) :


```json
{
	"status": "success",
	"data": {
		"discounts": [
			{
				"discount_code": "XAsfNLIy",
				"discount_id": 2,
				"discount_value": 500,
				"product_discount": {
					"product": {
						"product_id": 1,
						"product_slug": "iphone-xs-xr-x-original",
						"product_name": "iPhone XS XR X Original",
						"product_iterations": [
							{
								"product_iteration_id": 1,
								"product_variant_price": 3079000
							}
						]
					}
				}
			}
		]
	}
}
```


## DELETE discount product
Endpoint : DELETE /api/discounts/products<product_id>

Request Header :
- Authorization : bearer <access_token>

#### Response (Success) :

```json
{
	"status": "success",
	"data": {
		"deleted_discount": {
			"discount_id": 2,
			"discount_code": "XAsfNLIy",
			"discount_value": 500,
			"is_percent_discount": false,
			"maximum_discount_amount": 0,
			"is_limited": false,
			"usage_limits": 0,
			"number_of_uses": 0
		}
	}
}
```

#### Response Body (Error) :

```json

```