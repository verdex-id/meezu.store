# admin Api spec

## create product

Endpoint : POST /api/products

Request Header :
- Authorization : bearer <access_token>

### Request Body :

```json
{
{
  "product_category_name": "pakaian",
  "product_name": "baju polos",
  "product_description": "baju kece.",
  "product_iterations": [
    {
      "product_variant_weight": 500,
      "product_variant_price": 50000,
      "product_variant_stock": 10,
      "variants": [
        {
          "variant_type_name": "Ukuran",
          "variant_name": "Kecil"
        },
        {
          "variant_type_name": "Warna",
          "variant_name": "Merah"
        }
      ]
    },
    {
      "product_variant_weight": 1000,
      "product_variant_price": 75000,
      "product_variant_stock": 5,
      "variants": [
        {
          "variant_type_name": "Ukuran",
          "variant_name": "Sedang"
        },
        {
          "variant_type_name": "Warna",
          "variant_name": "Biru"
        }
      ]
    }
  ]
}
}
```

#### Response Body (Success) :

```json
{
{
	"status": "success",
	"data": {
		"product": {
			"product_id": 1,
			"product_slug": "baju-polos",
			"product_name": "baju polos",
			"product_description": "baju kece.",
			"product_category": {
				"product_category_name": "pakaian",
				"product_category_slug": "pakaian"
			},
			"product_iterations": [
				{
					"product_variant_price": 50000,
					"product_variant_stock": 10,
					"product_variant_weight": 500,
					"product_variant_mapping": [
						{
							"variant": {
								"variant_slug": "kecil",
								"variant_name": "Kecil",
								"varian_type": {
									"variant_type_name": "Ukuran"
								}
							}
						},
						{
							"variant": {
								"variant_slug": "merah",
								"variant_name": "Merah",
								"varian_type": {
									"variant_type_name": "Warna"
								}
							}
						}
					]
				},
				{
					"product_variant_price": 75000,
					"product_variant_stock": 5,
					"product_variant_weight": 1000,
					"product_variant_mapping": [
						{
							"variant": {
								"variant_slug": "sedang",
								"variant_name": "Sedang",
								"varian_type": {
									"variant_type_name": "Ukuran"
								}
							}
						},
						{
							"variant": {
								"variant_slug": "biru",
								"variant_name": "Biru",
								"varian_type": {
									"variant_type_name": "Warna"
								}
							}
						}
					]
				}
			]
		}
	}
}
}
```

```json

```


#### Response Body (Error) :

```json
{

	"status": "fail",
	"message": "Product creation failed: Duplicate product.",
	"detail": "No detail provided"

}
```