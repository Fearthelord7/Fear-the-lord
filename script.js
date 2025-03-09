// Update the products array in the search functionality section
const products = [
  {
    id: 1,
    name: "FTL OG T-shirt",
    price: "$49.99",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    name: "FTL OG Hoodie",
    price: "$69.99",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    name: "FTL Shorts",
    price: "$129.99",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    name: "FTL Jesus Saves Shorts",
    price: "$89.99",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 5,
    name: "FTL Faith Over Fear T-shirt",
    price: "$34.99",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 6,
    name: "Side Cross FTL T-Shirt",
    price: "$29.99",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 7,
    name: "Jesus Saves FTL T-Shirt",
    price: "$19.99",
    image: "/placeholder.svg?height=60&width=60",
  },
]

document.addEventListener("DOMContentLoaded", () => {
  // Page transition for initial load
  const pageTransition = document.querySelector(".page-transition")
  if (pageTransition) {
    pageTransition.classList.add("active")
    setTimeout(() => {
      pageTransition.classList.remove("active")
    }, 500)
  }

  // Initialize lightning effect
  initLightning()

  // Initialize product sliders
  initProductSliders()

  // Cart functionality
  const cart = {
    items: [],
    total: 0,

    addItem(product) {
      const productCard = product.card
      const sizeSelect = productCard ? productCard.querySelector(".product-size") : null
      const colorSelect = productCard ? productCard.querySelector(".product-color") : null

      const size = sizeSelect ? sizeSelect.value : "M"
      const color = colorSelect ? colorSelect.value : "Black"

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
        document.querySelector(".cart-footer").style.display = "none"
        return
      }

      document.querySelector(".cart-footer").style.display = "block"

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

      document.querySelector(".cart-total-amount").textContent = `$${this.total.toFixed(2)}`

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

  // Initialize cart
  cart.loadCart()

  // Add to cart functionality
  const productButtons = document.querySelectorAll(".product-button")
  productButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      const productCard = button.closest(".product-card")
      const productName = productCard.querySelector(".product-name").textContent
      const productPrice = productCard.querySelector(".product-price").textContent

      // Get the current active slide image for the product
      const sliderTrack = productCard.querySelector(".slider-track")
      const activeSlideIndex = Number.parseInt(sliderTrack.getAttribute("data-active-slide") || "0")
      const activeSlide = productCard.querySelectorAll(".slider-slide")[activeSlideIndex]
      const productImage = activeSlide.querySelector("img").src

      const product = {
        id: index + 1,
        name: productName,
        price: productPrice,
        image: productImage,
        card: productCard,
      }

      cart.addItem(product)

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
  })

  // Cart toggle
  const cartToggle = document.querySelector(".cart-toggle")
  if (cartToggle) {
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault()
      document.querySelector(".cart-container").classList.add("active")
    })
  }

  // Close cart
  const cartClose = document.querySelector(".cart-close")
  if (cartClose) {
    cartClose.addEventListener("click", () => {
      document.querySelector(".cart-container").classList.remove("active")
    })
  }

  // Overlay close cart
  const cartOverlay = document.querySelector(".cart-overlay")
  if (cartOverlay) {
    cartOverlay.addEventListener("click", () => {
      document.querySelector(".cart-container").classList.remove("active")
    })
  }

  // Stripe Checkout Integration
  const checkoutBtn = document.querySelector(".checkout-btn")
  // Replace the existing checkout button event listener with this:
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async (e) => {
      e.preventDefault()
      if (cart.items.length === 0) return

      try {
        // Create checkout session
        const response = await fetch("https://your-server-domain.com/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: cart.items }),
        })

        const session = await response.json()

        // Redirect to Stripe Checkout
        const stripe = window.Stripe(
          "pk_test_51QzvO507sof0o0hWPvys2KZUsUqF2ITa7Ohu3qXwAvL4FXJtBjqJGKMUu30srjAKaSo3QRmXQ2rno17rWXNytMWX00iVkbi11B",
        )
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        })

        if (error) {
          console.error("Error:", error)
          alert("Checkout error: " + error.message)
        }
      } catch (err) {
        console.error("Error:", err)
        alert("Error creating checkout session")
      }
    })
  }

  // Mobile menu toggle
  const mobileToggle = document.querySelector(".mobile-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (mobileToggle) {
    mobileToggle.addEventListener("click", (e) => {
      e.preventDefault()
      navLinks.classList.toggle("active")
      document.body.classList.toggle("no-scroll")
    })
  }

  // Close mobile menu
  const navItems = document.querySelectorAll(".nav-links a")
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active")
      document.body.classList.remove("no-scroll")
    })
  })

  // Header scroll effect
  const header = document.querySelector("header")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }
  })

  // Logo entrance animation
  const logo = document.querySelector(".main-logo")
  const brandName = document.querySelector(".brand-name")
  const tagline = document.querySelector(".tagline")

  if (logo && brandName && tagline) {
    logo.style.opacity = "0"
    brandName.style.opacity = "0"
    tagline.style.opacity = "0"

    setTimeout(() => {
      logo.style.transition = "opacity 1.5s ease, transform 1.5s ease"
      logo.style.opacity = "1"
      logo.style.transform = "translateY(0)"
    }, 300)

    setTimeout(() => {
      brandName.style.transition = "opacity 1.5s ease, transform 1.5s ease"
      brandName.style.opacity = "1"
      brandName.style.transform = "translateY(0)"
    }, 1000)

    setTimeout(() => {
      tagline.style.transition = "opacity 1.5s ease"
      tagline.style.opacity = "1"
    }, 1800)
  }

  // Parallax effect
  const heroSection = document.querySelector(".hero")
  if (heroSection) {
    window.addEventListener("mousemove", (e) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight

      const logoContainer = document.querySelector(".logo-animation")
      if (logoContainer) {
        logoContainer.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`
      }
    })
  }

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      if (targetId === "#top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      } else {
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Search functionality
  const searchToggle = document.querySelector(".search-toggle")
  const searchContainer = document.querySelector(".search-container")
  const searchClose = document.querySelector(".search-close")
  const searchForm = document.querySelector(".search-form")
  const searchInput = document.querySelector(".search-input")
  const searchResults = document.querySelector(".search-results")

  // Get all products from the page with their actual images
  const getAllProducts = () => {
    const productCards = document.querySelectorAll(".product-card")
    return Array.from(productCards).map((card, index) => {
      const name = card.querySelector(".product-name").textContent
      const price = card.querySelector(".product-price").textContent
      const firstSlide = card.querySelector(".slider-slide")
      const image = firstSlide.querySelector("img").src

      return {
        id: index + 1,
        name,
        price,
        image,
        card,
      }
    })
  }

  // Get products with actual images
  const products = getAllProducts()

  if (searchToggle) {
    searchToggle.addEventListener("click", (e) => {
      e.preventDefault()
      searchContainer.classList.add("active")
      document.body.classList.add("no-scroll")
      setTimeout(() => {
        searchInput.focus()
      }, 300)
    })
  }

  if (searchClose) {
    searchClose.addEventListener("click", () => {
      searchContainer.classList.remove("active")
      document.body.classList.remove("no-scroll")
      searchResults.classList.remove("active")
      searchInput.value = ""
    })
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchContainer.classList.contains("active")) {
      searchContainer.classList.remove("active")
      document.body.classList.remove("no-scroll")
      searchResults.classList.remove("active")
      searchInput.value = ""
    }
  })

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      performSearch()
    })
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      if (searchInput.value.length > 1) {
        performSearch()
      } else {
        searchResults.classList.remove("active")
      }
    })
  }

  function performSearch() {
    const query = searchInput.value.toLowerCase().trim()

    if (query.length < 2) return

    const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(query))

    searchResults.innerHTML = ""

    if (filteredProducts.length > 0) {
      filteredProducts.forEach((product) => {
        const resultItem = document.createElement("a")
        resultItem.href = "#"
        resultItem.className = "search-result-item"
        resultItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="search-result-image">
          <div class="search-result-info">
            <div class="search-result-name">${product.name}</div>
            <div class="search-result-price">${product.price}</div>
          </div>
        `

        resultItem.addEventListener("click", (e) => {
          e.preventDefault()
          cart.addItem(product)
          searchContainer.classList.remove("active")
          document.body.classList.remove("no-scroll")

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

          document.querySelector(".cart-container").classList.add("active")
        })

        searchResults.appendChild(resultItem)
      })
    } else {
      const noResults = document.createElement("div")
      noResults.className = "no-results"
      noResults.textContent = "No products found"
      searchResults.appendChild(noResults)
    }

    searchResults.classList.add("active")
  }

  // Product Slider Functionality
  function initProductSliders() {
    const sliders = document.querySelectorAll(".product-slider")

    sliders.forEach((slider) => {
      const track = slider.querySelector(".slider-track")
      const slides = slider.querySelectorAll(".slider-slide")
      const dotsContainer = slider.querySelector(".slider-dots")
      const prevBtn = slider.querySelector(".slider-prev")
      const nextBtn = slider.querySelector(".slider-next")

      // Create dots
      slides.forEach((_, index) => {
        const dot = document.createElement("div")
        dot.className = `slider-dot ${index === 0 ? "active" : ""}`
        dot.setAttribute("data-index", index)
        dotsContainer.appendChild(dot)

        dot.addEventListener("click", () => {
          goToSlide(index)
        })
      })

      // Set initial state
      track.setAttribute("data-active-slide", "0")
      track.style.transform = "translateX(0%)"

      // Navigation functions
      function goToSlide(index) {
        const dots = slider.querySelectorAll(".slider-dot")
        dots.forEach((dot, i) => {
          dot.classList.toggle("active", i === index)
        })

        track.style.transform = `translateX(-${index * 33.333}%)`
        track.setAttribute("data-active-slide", index)
      }

      // Event listeners
      prevBtn.addEventListener("click", () => {
        const currentIndex = Number.parseInt(track.getAttribute("data-active-slide"))
        const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
        goToSlide(newIndex)
      })

      nextBtn.addEventListener("click", () => {
        const currentIndex = Number.parseInt(track.getAttribute("data-active-slide"))
        const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1
        goToSlide(newIndex)
      })

      // Touch/swipe support
      let touchStartX = 0
      let touchEndX = 0

      slider.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX
        },
        { passive: true },
      )

      slider.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX
          handleSwipe()
        },
        { passive: true },
      )

      function handleSwipe() {
        const currentIndex = Number.parseInt(track.getAttribute("data-active-slide"))

        if (touchEndX < touchStartX - 50) {
          // Swipe left - next slide
          const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1
          goToSlide(newIndex)
        }

        if (touchEndX > touchStartX + 50) {
          // Swipe right - previous slide
          const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
          goToSlide(newIndex)
        }
      }

      // Auto-rotate slides every 5 seconds
      let slideInterval = setInterval(() => {
        const currentIndex = Number.parseInt(track.getAttribute("data-active-slide"))
        const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1
        goToSlide(newIndex)
      }, 5000)

      // Pause auto-rotation when hovering over the slider
      slider.addEventListener("mouseenter", () => {
        clearInterval(slideInterval)
      })

      slider.addEventListener("mouseleave", () => {
        slideInterval = setInterval(() => {
          const currentIndex = Number.parseInt(track.getAttribute("data-active-slide"))
          const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1
          goToSlide(newIndex)
        }, 5000)
      })
    })
  }

  // Product detail view functionality
  document.querySelectorAll(".product-card").forEach((card, index) => {
    // Get the product info
    const productName = card.querySelector(".product-name").textContent;
    const productId = index + 1; // Assuming IDs match the order

    // Make the card clickable to view details
    card.addEventListener("click", (e) => {
      // Don't navigate if clicking on the add to cart button or selects
      if (
        e.target.classList.contains("product-button") ||
        e.target.tagName === "SELECT" ||
        e.target.tagName === "OPTION" ||
        e.target.tagName === "LABEL" ||
        e.target.closest(".slider-nav")
      ) {
        return;
      }

      // Activate transition before navigating
      const pageTransition = document.querySelector(".page-transition");
      if (pageTransition) {
        pageTransition.classList.add("active");

        // Navigate after transition
        setTimeout(() => {
          window.location.href = `product-detail.html?id=${productId}`;
        }, 300); // Reduced from 500ms to 300ms for a quicker transition
      } else {
        // Navigate immediately if no transition element
        window.location.href = `product-detail.html?id=${productId}`;
      }
    });
  });
})

// Lightning effect
function initLightning() {
  const lightningContainer = document.createElement("div")
  lightningContainer.id = "lightning-container"
  lightningContainer.style.position = "fixed"
  lightningContainer.style.top = "0"
  lightningContainer.style.left = "0"
  lightningContainer.style.width = "100%"
  lightningContainer.style.height = "100%"
  lightningContainer.style.zIndex = "-2"
  lightningContainer.style.pointerEvents = "none"
  document.body.prepend(lightningContainer)

  const canvas = document.createElement("canvas")
  canvas.className = "lightning-container"
  lightningContainer.appendChild(canvas)

  const resizeCanvas = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  const gl = canvas.getContext("webgl")
  if (!gl) {
    console.error("WebGL not supported")
    return
  }

  const vertexShaderSource = `
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `

  const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform float uHue;
    uniform float uXOffset;
    uniform float uSpeed;
    uniform float uIntensity;
    uniform float uSize;
    
    #define OCTAVE_COUNT 10

    vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        return c.z * mix(vec3(1.0), rgb, c.y);
    }

    float hash11(float p) {
        p = fract(p * .1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    float hash12(vec2 p) {
        vec3 p3 = fract(vec3(p.xyx) * .1031);
        p3 += dot(p3, p3.yzx + 33.33);
        return fract((p3.x + p3.y) * p3.z);
    }

    mat2 rotate2d(float theta) {
        float c = cos(theta);
        float s = sin(theta);
        return mat2(c, -s, s, c);
    }

    float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        float a = hash12(ip);
        float b = hash12(ip + vec2(1.0, 0.0));
        float c = hash12(ip + vec2(0.0, 1.0));
        float d = hash12(ip + vec2(1.0, 1.0));
        
        vec2 t = smoothstep(0.0, 1.0, fp);
        return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
    }

    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < OCTAVE_COUNT; ++i) {
            value += amplitude * noise(p);
            p *= rotate2d(0.45);
            p *= 2.0;
            amplitude *= 0.5;
        }
        return value;
    }

    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;
        uv.x += uXOffset;
        
        uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
        
        float dist = abs(uv.x);
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
        vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
        col = pow(col, vec3(1.0));
        fragColor = vec4(col, 1.0);
    }

    void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
    }
  `

  const compileShader = (source, type) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER)
  const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER)
  if (!vertexShader || !fragmentShader) return

  const program = gl.createProgram()
  if (!program) return
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program linking error:", gl.getProgramInfoLog(program))
    return
  }

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1])
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  const aPosition = gl.getAttribLocation(program, "aPosition")
  gl.enableVertexAttribArray(aPosition)
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0)

  const iResolutionLocation = gl.getUniformLocation(program, "iResolution")
  const iTimeLocation = gl.getUniformLocation(program, "iTime")
  const uHueLocation = gl.getUniformLocation(program, "uHue")
  const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset")
  const uSpeedLocation = gl.getUniformLocation(program, "uSpeed")
  const uIntensityLocation = gl.getUniformLocation(program, "uIntensity")
  const uSizeLocation = gl.getUniformLocation(program, "uSize")

  const hue = 0
  const xOffset = 0
  const speed = 0.8
  const intensity = 1.5
  const size = 1.2

  const startTime = performance.now()

  gl.useProgram(program) // Ensure gl.useProgram is always called

  const render = () => {
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.uniform2f(iResolutionLocation, canvas.width, canvas.height)
    const currentTime = performance.now()
    gl.uniform1f(iTimeLocation, (currentTime - startTime) / 1000.0)
    gl.uniform1f(uHueLocation, hue)
    gl.uniform1f(uXOffsetLocation, xOffset)
    gl.uniform1f(uSpeedLocation, speed)
    gl.uniform1f(uIntensityLocation, intensity)
    gl.uniform1f(uSizeLocation, size)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}

// Add this code to your existing script.js file

// Make the cart object globally accessible
window.cart = cart

// Make the products array globally accessible
window.products = products
