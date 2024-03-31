# Failed Detail

#### no detail provided  :

```json
{
  "status": "fail",
  "message": "Username and/or password are incorrect.",
  "detail": "No detail provided"
}
```

#### with detail provided (json syntax error)

```json
{
  "status": "fail",
  "message": "Request/JSON syntax error",
  "detail": {
    "name": "SyntaxError",
    "message": "Expected double-quoted property name in JSON at position 95 (line 1 column 96)"
  }
}
```

#### invalid request format (missing required field)

```json
{
  "status": "fail",
  "message": "Invalid request format.",
  "detail": [
    {
      "message": "\"email\" is required",
      "path": [
        "email"
      ],
      "type": "any.required",
      "context": {
        "label": "email",
        "key": "email"
      }
    }
  ]
}
```

```json
{
	"status": "fail",
	"message": "Invalid request format.",
	"detail": [
		{
			"message": "\"admin_full_name\" is required",
			"path": [
				"admin_full_name"
			],
			"type": "any.required",
			"context": {
				"label": "admin_full_name",
				"key": "admin_full_name"
			}
		}
	]
}
```

#### invalid request format (field not valid)

```json
{
  "status": "fail",
  "message": "Invalid request format.",
  "detail": [
    {
      "message": "\"email\" must be a valid email",
      "path": [
        "email"
      ],
      "type": "string.email",
      "context": {
        "value": "admin.as.pac@gmail",
        "invalids": [
          "admin.as.pac@gmail"
        ],
        "label": "email",
        "key": "email"
      }
    }
  ]
}
```

```json
{
	"status": "fail",
	"message": "Invalid request format.",
	"detail": [
		{
			"message": "\"admin_full_name\" with value \"AdminJohn adi 311\" fails to match the required pattern: /^[A-Za-z\\s']+$/",
			"path": [
				"admin_full_name"
			],
			"type": "string.pattern.base",
			"context": {
				"regex": {},
				"value": "AdminJohn adi 311",
				"label": "admin_full_name",
				"key": "admin_full_name"
			}
		}
	]
}
```