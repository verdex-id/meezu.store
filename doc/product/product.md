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

## GET product

Endpoint : GET /api/products?page=2&limit=30

#### Response (Success) :

```json
{
	"status": "success",
	"data": {
		"products": [
			{
				"product_id": 1,
				"product_slug": "infinix-note-40-pro-max-q",
				"product_name": "Infinix Note 40 Pro Max Q !",
				"product_discounts": null,
				"product_iterations": [
					{
						"product_iteration_id": 1,
						"product_variant_price": 3079000
					}
				]
			},
			{
				"product_id": 2,
				"product_slug": "samsung-s12",
				"product_name": "samsung  s12",
				"product_discounts": {
					"discount": {
						"discount_value": 500,
						"is_percent_discount": false
					}
				},
				"product_iterations": [
					{
						"product_iteration_id": 3,
						"product_variant_price": 3079000
					}
				]
			}
		]
	}
}
```

## GET product specific

Endpoint : GET /api/products/<product_slug>

#### Response (Success) :
```json
{
	"status": "success",
	"data": {
		"product": {
			"product_id": 1,
			"product_slug": "iphone-xs-xr-x-original",
			"product_name": "iPhone XS XR X Original",
			"product_discounts": {
				"discount": {
					"discount_value": 500,
					"is_percent_discount": false
				}
			},
			"product_description": "iPhone XR, smartphone penuh gaya dengan pilihan warna menarik, layar Liquid Retina HD 6,1 inci yang jernih, kamera TrueDepth 7MP dan kamera wide 12MP untuk hasil foto dan video menakjubkan, chip A12 Bionic untuk performa tangguh, baterai tahan lama, dan sistem operasi iOS 15 yang canggih dan mudah digunakan. Dapatkan iPhone XR sekarang dan rasakan pengalaman smartphone yang luar biasa!",
			"product_category": {
				"product_category_name": "Smartphone",
				"product_category_slug": "smartphone"
			},
			"product_iterations": [
				{
					"product_iteration_id": 1,
					"product_variant_price": 3079000,
					"product_variant_stock": 20,
					"product_variant_weight": 194,
					"product_variant_mapping": [
						{
							"variant": {
								"variant_slug": "unit-only",
								"variant_name": "Unit only",
								"varian_type": {
									"variant_type_name": "kelengkapan"
								}
							}
						},
						{
							"variant": {
								"variant_slug": "64gb",
								"variant_name": "64GB",
								"varian_type": {
									"variant_type_name": "memori"
								}
							}
						}
					]
				},
				{
					"product_iteration_id": 2,
					"product_variant_price": 3129000,
					"product_variant_stock": 8,
					"product_variant_weight": 194,
					"product_variant_mapping": [
						{
							"variant": {
								"variant_slug": "fullset-inter",
								"variant_name": "Fullset inter",
								"varian_type": {
									"variant_type_name": "kelengkapan"
								}
							}
						},
						{
							"variant": {
								"variant_slug": "64gb",
								"variant_name": "64GB",
								"varian_type": {
									"variant_type_name": "memori"
								}
							}
						}
					]
				}
			]
		}
	}
}
```

## UPDATE product 

Endpoint : UPDATE /api/products/<product_slug>

Request Header :
- Authorization : bearer <access_token>

### Request Body :
```json
{
  "new_product_name": "Infinix Note 40 Pro Max Q !",
  "new_product_description": "Hape yang luar biasa"
}
```
#### Response Body (Success) :
```json
{
	"status": "success",
	"data": {
		"updated_product": {
			"product_slug": "infinix-note-40-pro-max-q",
			"product_name": "Infinix Note 40 Pro Max Q !",
			"product_description": "Hape yang luar biasa"
		}
	}
}
```

## DELETE product 

Endpoint : DELETE /api/products/<product_slug>

Request Header :
- Authorization : bearer <access_token>


#### Response (Success) :
```json
{
	"status": "success",
	"data": {
		"deleted_product": {
			"product_id": 3,
			"product_slug": "pocophone-f1",
			"product_name": "PocoPhone F1",
			"product_description": "POCOPHONE F1 menggunakan prosesor mobile platform Qualcomm® Snapdragon™ 845, yang berarti kamu mendapatkan mesin AI milik Snapdragon yang terkuat pada chip kelas 10nm flagship terbaru mereka. Nikmati performa yang lebih unggul dan konsumsi daya lebih rendah"
		}
	}
}
```




#### Response Body (Error) :

```json
{

	"status": "fail",
	"message": "Product creation failed: Duplicate product.",
	"detail": "No detail provided"

}
```
