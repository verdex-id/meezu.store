# admin API Spec

## Refresh admin Access Token

Endpoint : POST /api/admins/token

#### Request Body :

```json
{
  "refresh_token": <refresh_token> 
}
```

#### Response Body (Success) :

```json
{
	"status": "success",
	"data": {
		"access_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..lRwAl1gH0P2Divw_SX69Kg.SmYmZMNTH552MRn4m4Qnu0yB6T-mtlfhGu-gPwvzyckcu4Z83yf9QYFDynN0RrmrkXgAWPpv5UrxQnQYrEV5-diUIyR82UymQRQzPjhI4LmMvhmsycPULB8eQD2UsTGmfzVZCRvwXCFtYh6IsrspmPajmkcsJXwAYWmgAmwJlXF46msIQZD3DEc2BROmMrvO9YfjVCZ2xqGp-DiYVTiWvA.rzr1ylubiTfPHD3H0wPw1A",
		"access_token_expire_at": "2024-03-29T09:34:55.569Z"
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

```json
{
  "status": "fail",
  "message": "expired session",
  "detail": "No detail provided"
}
```