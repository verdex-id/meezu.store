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
      "message": "\"full_name\" is required",
      "path": [
        "full_name"
      ],
      "type": "any.required",
      "context": {
        "label": "full_name",
        "key": "full_name"
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
        "value": "rizkia.as.pac@gmail",
        "invalids": [
          "rizkia.as.pac@gmail"
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
      "message": "\"full_name\" with value \"rizkia adhy syahputra 123\" fails to match the required pattern: /^[A-Za-z\\s']+$/",
      "path": [
        "full_name"
      ],
      "type": "string.pattern.base",
      "context": {
        "regex": {},
        "value": "rizkia adhy syahputra 123",
        "label": "full_name",
        "key": "full_name"
      }
    }
  ]
}
```