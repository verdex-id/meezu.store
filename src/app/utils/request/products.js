export async function findProducts() {
  const res = await fetch("/api/products", {
    headers: {
      "Authorization": "blablabla"
    }
  })
  const body = await res.json()
  
  if (body.status == "success") {
    return body.data.product
  }
}