const productsDOM = document.querySelector('.products-container')
const cartItemsBtn = document.querySelector('#cart-items')
const cartItemsCloseBtn = document.querySelector('.close-cart-menu')
const cartItemsBadge = document.querySelector('.cart-items__badge')
const cartTotal = document.querySelector('.cart-total')
const cartMenu = document.querySelector('.cart-menu')
const overlay = document.querySelector('.overlay')
const cartContent = document.querySelector('.cart-content')

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
      products = products.map(item => {
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
  displayProducts(products) {
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
        let cartItem = { ...Storage.getProduct(id), amount: 1 }
        cart = [...cart, cartItem]
        
        Storage.saveCart(cart)

        this.setCartValues(cart)
        this.addCartIem(cartItem)
      })
    })
  }

  // Cart value
  setCartValues(cart) {
    let totalPrice = 0
    let totalItems = 0

    cart.map(item => {
      totalPrice = totalPrice + item.price * item.amount
      totalItems = totalItems + item.amount
    })

    cartTotal.innerText = `Total: $${totalPrice}`
    cartItemsBadge.innerText = totalItems
  }

  // Add product to cart
  addCartIem(item) {
   const div = document.createElement('div')
   div.classList.add('cart-item')

   div.innerHTML = `
    <div class="image-box-s">
    <img src="${item.image}" alt="Product image">
    </div>
    <p class="cart-item__name">${item.title}</p>
    <p class="cart-item__price">$${item.price}</p>
    <p class="cart-item__badge badge">${item.amount}</p>
    <button class="cart-item__remove-btn btn-xs">Remove</button>
   `
   cartContent.appendChild(div)
  }

  // Open cart //Todo. merge showCartMenu() add closeCartMenu()
  showCartMenu() {
    overlay.classList.add('visibleOverlay')
    cartMenu.classList.add('show-cart-menu')
  }

  // Close cart
  closeCartMenu() {
    overlay.classList.remove('visibleOverlay')
    cartMenu.classList.remove('show-cart-menu')
  
    if (e.key === 'Escape') {
      closeCartMenu()
    }
  }

  // Read and Calculate again setCartValues()
  initApp() {
    cart = Storage.getCart()
    this.setCartValues(cart)
    cart.forEach(item => this.addCartIem(item))
    // this.populate(cart)

    cartItemsBtn.addEventListener('click', this.showCartMenu)
    cartItemsCloseBtn.addEventListener('click', this.closeCartMenu)
    overlay.addEventListener('click', this.closeCartMenu)
    document.addEventListener('keydown', this.closeCartMenu)
  }

  // Run again addCartIem()
  // populate(cart) {
  //   cart.forEach(item => this.addCartIem(item))
  // }
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

  // Save cart to local storage
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  // Check cart exist
  static getCart() {
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  }
}

// Create objects when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  const view = new View()
  const product = new Product()

  view.initApp()
  // view.populate(cart)

  product
    .getProducts()
    .then((data) => {
      view.displayProducts(data)
      Storage.saveProducts(data)
    })
    .then(() => {
      view.getCartButtons()
    })
})