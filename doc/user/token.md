# User API Spec

## Refresh User Access Token

Endpoint : POST /api/user/token

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
    "access_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..gSJHbG3J2uytiAQUBizgDw.O_VuE9GQvA2fS-upHLHXqF_vccSuDo0EBb3bacdUG48d6wD8skAozCwgXjmHeTyZD8d1YkCqLy_UnmrzbXh1gB8Sv1gPPyvK6Ia5A4bKtkN_X1lapYtpqtlpgU2VfUNDp2L1YfSaj-H5VVRsYGwWDva4dj_u1Ih8_mGpRmr9fMDIB8O47hSSvsR1W3PpaPZibSP9vfPJzsQby1moOsOj8A.xOFMSiE9g6wxu3lpVNEgyw",
    "access_token_expire_at": "2024-03-08T03:58:24.716Z"
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