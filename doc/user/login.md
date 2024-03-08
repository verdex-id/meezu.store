# User API Spec

## Login User

Endpoint : POST /api/user/login

#### Request Body :

```json
{
  "password":"rizkia", 
  "email":"rizkia.as.actmp@gmail.com"
}
```

#### Response Body (Success) :

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..kmnEIcbO15jSpcOVM0LbNg.eY_ESqTg9383KT2OX_iPNxMLQRvUYAryR_Q_K_komdB-1IMOxZqJdJzatkh_lKVIgD3C2BwQlYjGJuJRA1apeHWpG4Vk_2MQdGSBwYFLCBety5HuFZqC7AiVKdEEmdKFkqM3RjpF63dfUAyugr4s71w25s83dtNG36IpGOkNRr1-rGt3FMx6XFfhBQNEdsHhTyFtKCNM1-Vcx-pA4uARzw.AdUDN9F9JD_yodl5x6TEow",
    "access_token_expire_at": "2024-03-08T01:05:35.714Z",
    "refresh_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..aDAV2migcYRNgd82jrD42g.i-CMtL2dJfsDh79_fvyh7fZZiVzXTbawDA7opCt39Z5cKcqRS-ZDY9tnFIvMS5e18M7e1IX08y11e58kp8Hh5egvASx7M4ozKLPFhI3EiZK3o142dgyiAz3dkcmjFl5Ci70htcrJk9x9dwmYnfd-y-0TXI19Egy5LvtR8TUTKWNFXijYCTf0sVqhfZ6y1K207L8cpI-_0bBTE0R2vejMVQ.Klwzom1b0-7dIPCs_c9o_A",
    "refresh_token_expire_at": "2024-03-15T00:05:35.716Z",
    "user": {
      "full_name": "Rizkia Adhy Syahputra",
      "email": "rizkia.as.actmp@gmail.com",
    }
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
