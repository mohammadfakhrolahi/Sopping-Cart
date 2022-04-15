// Cart
let cart = []

// Get product data from product.json
class Product {
  async getProducts() {
    try {
      const result = await fetch('products.json')
      const data = await result.json()

      return data
    } catch (err) {
        console.log(err)
    }
  }
}

// Show product data in DOM
class View {}

class Storage {}

// Create objects whene DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const view = new View
  const product = new Product

  product.getProducts().then((data) => console.log(data))
})