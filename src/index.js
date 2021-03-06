const productsDOM = document.querySelector('.products-container')
const cartItemsBtn = document.querySelector('#cart-items')
const cartItemsCloseBtn = document.querySelector('.close-cart-menu')
const cartItemsBadge = document.querySelector('.cart-items__badge')
const cartTotalValue = document.querySelector('.cart-total__value')
const cartMenu = document.querySelector('.cart-menu')
const overlay = document.querySelector('.overlay')
const cartContent = document.querySelector('.cart-content')
const clearCartBtn = document.querySelector('#clear-cart-btn')
const cartItemRemoveBtn = document.querySelectorAll('.cart-item__remove-btn')
const emptyCartMsg = document.querySelector('.empty-cart-msg')
const amountMinus = document.querySelector('.amount-minus')

// Cart
let cart = []

// Get product data from product.json
class Product {
  async getProducts() {
    try {
      const result = await fetch('https://fakestoreapi.com/products')
      const data = await result.json()

      let products = data

      // Extract data
      products = products.map(item => {
        const { title, price, id, image } = item

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
        
        this.setCartValues(cart)
        Storage.saveCart(cart)
        this.addCartIem(cartItem)
        this.showEmptyCartMsg()

        console.log(cartItem)
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

    cartTotalValue.innerText = `Total: $${totalPrice}`
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
    <div class="cart-item__amount">
      <i class="fa-solid fa-minus amount-minus" data-id="${item.id}"></i>
      <p class="cart-item__amount-number">${item.amount}</p>
      <i class="fa-solid fa-plus amount-plus" data-id="${item.id}"></i>            
    </div>
    <button class="cart-item__remove-btn btn-xs" data-id="${item.id}">Remove</button>
   `
   cartContent.appendChild(div)
  }

  // Open cart
  showCartMenu() {
    overlay.classList.add('visibleOverlay')
    cartMenu.classList.add('show-cart-menu')
  }

  // Close cart
  closeCartMenu() {
    overlay.classList.remove('visibleOverlay')
    cartMenu.classList.remove('show-cart-menu') 
  }

  // Cart item amount


  // Read and Calculate again setCartValues()
  initApp() {
    cart = Storage.getCart()
    this.setCartValues(cart)
    cart.forEach(item => this.addCartIem(item))
    // this.populate(cart)

    cartItemsBtn.addEventListener('click', this.showCartMenu)
    cartItemsCloseBtn.addEventListener('click', this.closeCartMenu)
    overlay.addEventListener('click', this.closeCartMenu)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeCartMenu()
    })
  }

  cartProcess() {
    clearCartBtn.addEventListener('click', () => {
      this.clearCart()
      this.showEmptyCartMsg()
    })

    // Event listener for when clicked on cart item elements
    cartContent.addEventListener('click', e => {
      // Remove product from cart
      if (e.target.classList.contains('cart-item__remove-btn')) {
        let removeItem = e.target
        let id = removeItem.dataset.id

        cartContent.removeChild(removeItem.parentElement)

        this.removeProduct(id)
        this.showEmptyCartMsg()
      }

      // Increase product
      if (e.target.classList.contains('amount-plus')) {
        let addAmount = e.target
        let id = addAmount.dataset.id

        let product = cart.find(item => item.id == id)

        product.amount = product.amount + 1

        Storage.saveCart(cart)
        this.setCartValues(cart)

        addAmount.previousElementSibling.innerText = product.amount
      }

      // Decrease product
      if (e.target.classList.contains('amount-minus')) {
        let lowerAmount = e.target
        let id = lowerAmount.dataset.id

        let product = cart.find(item => item.id == id)

        product.amount = product.amount - 1

        if (product.amount > 0) {
          Storage.saveCart(cart)
          this.setCartValues(cart)
          lowerAmount.nextElementSibling.innerText = product.amount
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement)
          this.removeProduct(id)
          this.showEmptyCartMsg()
        }
      }
    })
  }

  clearCart() {
    let cartItems = cart.map(item => {
      return item.id
    })

    cartItems.map(item => {
      this.removeProduct(item)
      
    })

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0])
    }
  }

  removeProduct(id) {
    cart = cart.filter(item => {
      return item.id !== id
    })

    Storage.saveCart(cart)
    this.setCartValues(cart)
  }

  // Empty cart message
  showEmptyCartMsg() {
    if (cart.length == 0) {
      emptyCartMsg.classList.add('empty-cart-msg-visible')
      cartContent.classList.add('cart-content-hide')
    } else {
      emptyCartMsg.classList.remove('empty-cart-msg-visible')
      cartContent.classList.remove('cart-content-hide')
    }
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
    return products.find(item => item.id == id)
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
      view.cartProcess()
    })
})