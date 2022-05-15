const productsDOM = document.querySelector('.products-container')

// Cart
let cart = []

// Get product data from product.json
class Product {
  async getProducts() {
    try {
      const result = await fetch('products.json')
      const data = await result.json()

      let products = data.items

      // Extract data
      products = products.map((item) => {
        const { title, price } = item.fields
        const { id } = item.sys
        const image = item.fields.image.fields.file.url
        return { title, price, id, image }
      })

      return products
    } catch (err) {
        console.log(err)
    }
  }
}

// Show product data in DOM
class View {
  displayProdcuts(products) {
    let result = ''
    products.forEach((item) => {
      result += `
      <div class="product-card">
        <div class="product-card__image-box">
          <img src=${item.image} class="product-card__image" alt=${item.title}>
          <div class="icon-box-s">
            <i class="fa-solid fa-heart"></i>
          </div>
        </div>
  
        <div class="product-info">
          <h3 class="product-name">${item.title}</h3>
  
          <div class="buy-container">
            <div class="price-container">
              <span class="product-price-header">Price:</span> &nbsp;
      
              <span class="product-price">$${item.price}</span>
            </div>
              
            <button class="add-to-cart-btn btn-s" data-id=${item.id}>
              <i class="fa-solid fa-2x fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
      `
    })
    
    productsDOM.innerHTML = result
  }

  // Select add to cart buttons
  getCartButtons() {
    const buttons = [...document.querySelectorAll('.add-to-cart-btn')]

    buttons.forEach((item) => {
      let id = item.dataset.id

      item.addEventListener('click', (e) => {
        let cartItem = Storage.getProduct(id)
        cart = [...cart, cartItem]
        console.log(cart)
      })
    })
  }
}

class Storage {
  // Save products in local storage
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products))
  }

   // Find product in localStorage
   static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'))

    return products.find(item => item.id === id)
  }
}

// Create objects whene DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const view = new View()
  const product = new Product()

  product
    .getProducts()
    .then((data) => {
      view.displayProdcuts(data)
      Storage.saveProducts(data)
    })
    .then(() => {
      view.getCartButtons()
    })
})