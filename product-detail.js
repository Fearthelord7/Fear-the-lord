document.addEventListener("DOMContentLoaded", () => {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const productId = urlParams.get("id")

  if (!productId) {
    window.location.href = "index.html"
    return
  }

  // Product descriptions - add detailed descriptions for each product
  const productDescriptions = {
    1: "The FTL OG T-shirt is our flagship product, featuring our iconic logo on premium quality fabric. Made with 100% combed ringspun cotton for ultimate comfort and durability. This shirt is perfect for everyday wear, featuring a classic fit that suits all body types. The bold design represents your faith while maintaining a stylish, modern look. Currently on sale for $39.99, down from $59.99!",
    2: "Stay cool and represent your faith with our FTL Shorts. Made with a lightweight, breathable fabric that wicks away moisture, these shorts are perfect for workouts, casual wear, or just lounging around. The elastic waistband with drawstring ensures a perfect fit, while the side pockets provide convenient storage. Currently on sale for $44.99, down from $64.99!",
    3: "Stay warm and represent your faith with our FTL OG Hoodie. Made with a premium cotton-polyester blend for maximum comfort and warmth. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs and hem. The perfect addition to your wardrobe for those cooler days, combining style with a powerful message. Currently on sale for $70.00, down from $95.00!",
  }

  // Try to get products from the global variable first
  let products
  try {
    // Check if window.products exists (from the main script)
    if (window.products) {
      products = window.products
    } else {
      // Fallback products array
      products = [
        {
          id: 1,
          name: "FTL OG T-shirt",
          price: "$39.99",
          originalPrice: "$59.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20og%20logo%20shirt-IkqmEnUSFFNJu7qkffZDppmOkoHn29.png",
        },
        {
          id: 2,
          name: "FTL Shorts",
          price: "$44.99",
          originalPrice: "$64.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts%20front-RR2CD01ba3XKgL5heWrBHDRXawGmHJ.png",
        },
        {
          id: 3,
          name: "FTL OG Hoodie",
          price: "$70.00",
          originalPrice: "$95.00",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20front-qZlX6uB6JaNsJpbWzY3W2XSJOh5YcU.png",
        },
      ]
    }
  } catch (error) {
    console.error("Error accessing products:", error)
    // Fallback products array
    products = [
      {
        id: 1,
        name: "FTL OG T-shirt",
        price: "$39.99",
        originalPrice: "$59.99",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20og%20logo%20shirt-IkqmEnUSFFNJu7qkffZDppmOkoHn29.png",
      },
      {
        id: 2,
        name: "FTL Shorts",
        price: "$44.99",
        originalPrice: "$64.99",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts%20front-RR2CD01ba3XKgL5heWrBHDRXawGmHJ.png",
      },
      {
        id: 3,
        name: "FTL OG Hoodie",
        price: "$70.00",
        originalPrice: "$95.00",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20front-qZlX6uB6JaNsJpbWzY3W2XSJOh5YcU.png",
      },
    ]
  }

  // Find the product in our products array
  const product = products.find((p) => p.id === Number.parseInt(productId))

  if (!product) {
    window.location.href = "index.html"
    return
  }

  // Update page with product details
  document.title = `${product.name} - Fear the Lord`
  document.getElementById("product-title").textContent = product.name

  // Update price display to show both original and sale price
  const priceElement = document.getElementById("product-price")
  if (product.originalPrice) {
    priceElement.innerHTML = `<span class="original-price">${product.originalPrice}</span> <span class="sale-price">${product.price}</span>`
  } else {
    priceElement.textContent = product.price
  }

  document.getElementById("product-description").textContent =
    productDescriptions[product.id] ||
    "This premium quality product from Fear the Lord clothing represents your faith while providing exceptional comfort and style. Made with high-quality materials and attention to detail."

  // Define product images based on the product ID
  let productImages = []

  // Front and back images for each product
  switch (Number.parseInt(productId)) {
    case 1:
      productImages = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20og%20logo%20shirt-IkqmEnUSFFNJu7qkffZDppmOkoHn29.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20red%20logo%20shirt%20back-eDzdfQ25qvLL34YLUlhtdBrmLWNNAb.png",
      ]
      break
    case 2:
      productImages = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts%20front-RR2CD01ba3XKgL5heWrBHDRXawGmHJ.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts-2OPcQfkeRE9gu7GSnTM7puuSxNZSEi.png",
      ]
      break
    case 3:
      productImages = [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20front-qZlX6uB6JaNsJpbWzY3W2XSJOh5YcU.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20back-ExbIrBts2vKvD4WCm25PJcDN1Z8X7G.png",
      ]
      break
    default:
      // Fallback to product image if available
      if (product.image) {
        productImages = [product.image, product.image]
      } else {
        productImages = ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=600&width=600"]
      }
  }

  // Set main image
  const mainImage = document.getElementById("main-product-image")
  mainImage.src = productImages[0]
  mainImage.alt = product.name

  // Add zoom functionality to the main product image
  const mainImageContainer = document.querySelector(".product-detail-main-image")
  if (mainImageContainer) {
    // Create a zoom container
    const zoomContainer = document.createElement("div")
    zoomContainer.className = "zoom-container"

    // Move the existing image into the zoom container
    const mainImage = document.getElementById("main-product-image")
    if (mainImage) {
      const originalSrc = mainImage.src
      mainImageContainer.innerHTML = ""
      zoomContainer.appendChild(mainImage)
      mainImageContainer.appendChild(zoomContainer)

      // Make sure the image is properly loaded
      mainImage.src = originalSrc

      // Add zoom functionality
      zoomContainer.addEventListener("click", function () {
        this.classList.toggle("active")
      })

      zoomContainer.addEventListener("mousemove", function (e) {
        if (this.classList.contains("active")) {
          // Calculate mouse position as percentage of container
          const rect = this.getBoundingClientRect()
          const x = ((e.clientX - rect.left) / rect.width) * 100
          const y = ((e.clientY - rect.top) / rect.height) * 100

          // Set CSS variables for transform-origin
          this.style.setProperty("--x", `${x}%`)
          this.style.setProperty("--y", `${y}%`)
        }
      })
    }
  }

  // Update thumbnail click handler to work with zoom container
  const thumbnailsContainer = document.querySelector(".product-detail-thumbnails")
  thumbnailsContainer.innerHTML = "" // Clear existing thumbnails

  if (thumbnailsContainer) {
    thumbnailsContainer.addEventListener("click", (e) => {
      const thumbnail = e.target.closest(".thumbnail")
      if (thumbnail) {
        // Update active thumbnail
        document.querySelectorAll(".thumbnail").forEach((thumb) => {
          thumb.classList.remove("active")
        })
        thumbnail.classList.add("active")

        // Update main image
        const mainImage = document.getElementById("main-product-image")
        if (mainImage) {
          const imgSrc = thumbnail.querySelector("img").src
          mainImage.src = imgSrc
        }
      }
    })
  }

  // Create thumbnails
  productImages.forEach((imgSrc, index) => {
    const thumbnail = document.createElement("div")
    thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`
    thumbnail.innerHTML = `<img src="${imgSrc}" alt="${product.name} view ${index + 1}">`
    thumbnailsContainer.appendChild(thumbnail)
  })

  // Create a cart object if it doesn't exist in the window
  if (!window.cart) {
    window.cart = {
      items: [],
      total: 0,

      addItem(product) {
        const size = product.size || "M"
        const color = product.color || "Black"
        const itemId = `${product.id}-${size}-${color}`

        const existingItem = this.items.find(
          (item) => item.id === product.id && item.size === size && item.color === color,
        )

        if (existingItem) {
          existingItem.quantity += 1
        } else {
          this.items.push({
            ...product,
            itemId,
            size,
            color,
            quantity: 1,
            originalPrice: product.originalPrice || null,
          })
        }

        this.updateTotal()
        this.saveCart()
        this.updateCartUI()
        this.updateCartCount()
      },

      removeItem(itemId) {
        const index = this.items.findIndex((item) => item.itemId === itemId)
        if (index !== -1) {
          this.items.splice(index, 1)
          this.updateTotal()
          this.saveCart()
          this.updateCartUI()
          this.updateCartCount()
        }
      },

      updateQuantity(itemId, quantity) {
        const item = this.items.find((item) => item.itemId === itemId)
        if (item) {
          item.quantity = quantity
          if (item.quantity <= 0) {
            this.removeItem(itemId)
          } else {
            this.updateTotal()
            this.saveCart()
            this.updateCartUI()
            this.updateCartCount()
          }
        }
      },

      updateTotal() {
        this.total = this.items.reduce((sum, item) => {
          return sum + Number.parseFloat(item.price.replace("$", "")) * item.quantity
        }, 0)
      },

      clearCart() {
        this.items = []
        this.total = 0
        this.saveCart()
        this.updateCartUI()
        this.updateCartCount()
      },

      saveCart() {
        sessionStorage.setItem(
          "ftlCart",
          JSON.stringify({
            items: this.items,
            total: this.total,
          }),
        )
      },

      loadCart() {
        const savedCart = sessionStorage.getItem("ftlCart")
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          this.items = parsedCart.items || []
          this.total = parsedCart.total || 0
          this.updateCartUI()
          this.updateCartCount()
        }
      },

      updateCartCount() {
        const cartCount = document.querySelector(".cart-count")
        if (cartCount) {
          const itemCount = this.items.reduce((count, item) => count + item.quantity, 0)
          cartCount.textContent = itemCount
          cartCount.style.display = itemCount > 0 ? "flex" : "none"
        }
      },

      updateCartUI() {
        const cartItemsContainer = document.querySelector(".cart-items")
        if (!cartItemsContainer) return

        cartItemsContainer.innerHTML = ""

        if (this.items.length === 0) {
          cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>'
          const cartFooter = document.querySelector(".cart-footer")
          if (cartFooter) {
            cartFooter.style.display = "none"
          }
          return
        }

        const cartFooter = document.querySelector(".cart-footer")
        if (cartFooter) {
          cartFooter.style.display = "block"
        }

        this.items.forEach((item) => {
          const cartItem = document.createElement("div")
          cartItem.className = "cart-item"
          cartItem.innerHTML = `
              <div class="cart-item-image">
                <img src="${item.image || "/placeholder.svg?height=60&width=60"}" alt="${item.name}">
              </div>
              <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <div class="cart-item-meta">
                  <span>Size: ${item.size}</span>
                  <span>Color: ${item.color}</span>
                </div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-controls">
                  <button class="quantity-btn minus" data-id="${item.itemId}">-</button>
                  <span class="quantity">${item.quantity}</span>
                  <button class="quantity-btn plus" data-id="${item.itemId}">+</button>
                  <button class="remove-btn" data-id="${item.itemId}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            `

          cartItemsContainer.appendChild(cartItem)
        })

        const cartTotalAmount = document.querySelector(".cart-total-amount")
        if (cartTotalAmount) {
          cartTotalAmount.textContent = `$${this.total.toFixed(2)}`
        }

        // Add event listeners to cart item controls
        document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id")
            const item = this.items.find((item) => item.itemId === id)
            if (item) {
              this.updateQuantity(id, item.quantity - 1)
            }
          })
        })

        document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id")
            const item = this.items.find((item) => item.itemId === id)
            if (item) {
              this.updateQuantity(id, item.quantity + 1)
            }
          })
        })

        document.querySelectorAll(".remove-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id")
            this.removeItem(id)
          })
        })
      },
    }

    // Load cart from session storage
    window.cart.loadCart()
  }

  // Add to cart functionality - FIXED
  const addToCartBtn = document.getElementById("add-to-cart-btn")
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const size = document.getElementById("product-size").value
      const color = document.getElementById("product-color").value

      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: mainImage.src,
        size: size,
        color: color,
      }

      // Add to cart
      window.cart.addItem(productToAdd)

      // Show notification without opening cart drawer
      const notification = document.createElement("div")
      notification.className = "cart-notification"
      notification.textContent = `${product.name} added to cart!`
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.classList.add("show")
      }, 10)

      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 300)
      }, 2000)
    })
  }

  // Cart toggle
  const cartToggle = document.querySelector(".cart-toggle")
  if (cartToggle) {
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault()
      const cartContainer = document.querySelector(".cart-container")
      if (cartContainer) {
        cartContainer.classList.add("active")
      }
    })
  }

  // Close cart
  const cartClose = document.querySelector(".cart-close")
  if (cartClose) {
    cartClose.addEventListener("click", () => {
      const cartContainer = document.querySelector(".cart-container")
      if (cartContainer) {
        cartContainer.classList.remove("active")
      }
    })
  }

  // Overlay close cart
  const cartOverlay = document.querySelector(".cart-overlay")
  if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
      const cartContainer = document.querySelector(".cart-container")
      if (cartContainer) {
        cartContainer.classList.remove("active")
      }
    })
  }

  // Update the back to collection link click handler
  // Back to collection without transition
  const backLink = document.querySelector(".back-to-collection")
  if (backLink) {
    backLink.addEventListener("click", function (e) {
      e.preventDefault()
      const href = this.getAttribute("href")
      // Set flag to indicate we're coming from product detail page
      sessionStorage.setItem("comingFromProductDetail", "true")
      // Navigate directly without transition
      window.location.href = href
    })
  }

  // Search functionality
  const searchToggle = document.querySelector(".search-toggle")
  const searchContainer = document.querySelector(".search-container")
  const searchClose = document.querySelector(".search-close")

  if (searchToggle) {
    searchToggle.addEventListener("click", (e) => {
      e.preventDefault()
      if (searchContainer) {
        searchContainer.classList.add("active")
        document.body.classList.add("no-scroll")
      }
    })
  }

  if (searchClose) {
    searchClose.addEventListener("click", () => {
      if (searchContainer) {
        searchContainer.classList.remove("active")
        document.body.classList.remove("no-scroll")
      }
    })
  }
})

