# admin API Spec

## Login admin

Endpoint : POST /api/admins/login

#### Request Body :

```json
{
  "email": "admin2@gmail.com",
	"password": "admin123"
}
```

```json
{
	"status": "success",
	"data": {
		"session_id": "clu9jy1a30000s4t0hwrglfk3",
		"access_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..9DmpFPV6K9WYDce6S6bC4A.BKdp6h3MzjAvX6rzNmL8FCSxkr_mSK_cCnsO8M_e1KfVpjVdfghQt4Gw5JiJrLI2kR4o_EVn8Jtz63JWPl9cLF_PXsYjUFQPC14fk4KExLd6N5Rzd0NOGS0Oj_EV_QHRtikXLBc3jE8ZoYt85QYpzVWN9v_PQULLeh06VO3v4AtYYMgkN7AyCNNCximyTN9fFWWrLyF91BymxIf41oJtfg.DkEWtkhQ3r8w-1LkxtZppA",
		"access_token_expire_at": "2024-03-27T09:39:12.110Z",
		"refresh_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..VAble2gyucngMcnAes0Fpg.MnqRwT256TyY-JPbHTPV_P1lCOfhRzVEaCju0tmiN-s_VpUss6OV4_uKHwMPVJbtfwX5ozcp0KVvzUgInNoqhb6Ts2T1ivpSBBWLbhjlWVTDwf4uIMwoo5Tx0hVbT634-6iiCdL5JkX5FJlK-SwZouyyOkwhG64gCkJc-Hg0MJF2foSTA79pn8sc6GEFIlEnKaSANgtomZ5U5gRVbcDEgA.8ldnt5hF7HV8_lEpk9SQ0w",
		"refresh_token_expire_at": "2024-04-03T08:39:12.124Z",
		"admin": {}
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
  "message": "Username and/or password are incorrect.",
  "detail": "No detail provided"
}
```