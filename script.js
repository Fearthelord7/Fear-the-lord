document.addEventListener("DOMContentLoaded", () => {
  // Initialize lightning effect
  initLightning();

  // Cart functionality
  const cart = {
    items: [],
    total: 0,

    addItem(product) {
      // Get selected options
      const productCard = product.card
      const sizeSelect = productCard ? productCard.querySelector(".product-size") : null
      const colorSelect = productCard ? productCard.querySelector(".product-color") : null

      const size = sizeSelect ? sizeSelect.value : "M"
      const color = colorSelect ? colorSelect.value : "Black"

      // Create unique ID based on product ID, size, and color
      const itemId = `${product.id}-${size}-${color}`

      // Check if this exact combination exists already
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
      // Save to session storage instead of local storage
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
      // Use sessionStorage instead of localStorage to make cart empty on page reload
      sessionStorage.setItem(
        "ftlCart",
        JSON.stringify({
          items: this.items,
          total: this.total,
        }),
      )
    },

    loadCart() {
      // Load from sessionStorage instead of localStorage
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

      // Update total
      document.querySelector(".cart-total-amount").textContent = `$${this.total.toFixed(2)}`

      // Add event listeners to the newly created buttons
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
      // Get the product card
      const productCard = button.closest(".product-card")
      const productName = productCard.querySelector(".product-name").textContent
      const productPrice = productCard.querySelector(".product-price").textContent

      const product = {
        id: index + 1,
        name: productName,
        price: productPrice,
        image: "/placeholder.svg?height=60&width=60",
        card: productCard,
      }

      cart.addItem(product)

      // Show cart notification
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

  // Rest of the event listeners and functionality...
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

  // Simulated server endpoint (DO NOT USE IN PRODUCTION)
  async function createCheckoutSession(items) {
    // In a real implementation, this would be done server-side
    return {
      id: 'cs_test_' + Math.random().toString(36).substr(2, 9),
    };
  }

  // Checkout button - Redirect to Stripe Checkout
  const checkoutBtn = document.querySelector(".checkout-btn")
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      if (cart.items.length === 0) return

      // Initialize Stripe
      const stripe = window.Stripe('pk_test_51O9BnbLkdIwg0YWOVVwxKyQfWNAhGQTvCJlzEqEcXbxGfJEwgiwQIEVSXIEGdvRNXBXLqURKP2VfDrwVfLNiEGnX00waUIzLKP');

      try {
        // Create a Stripe Checkout Session
        const session = await createCheckoutSession(cart.items);

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: session.id
        });

        if (result.error) {
          console.error(result.error.message);
          alert('There was an error redirecting to checkout. Please try again.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error creating your checkout session. Please try again.');
      }
    });
  }

  // Mobile menu toggle using FTL logo
  const mobileToggle = document.querySelector(".mobile-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (mobileToggle) {
    mobileToggle.addEventListener("click", (e) => {
      e.preventDefault() // Prevent default link behavior
      navLinks.classList.toggle("active")
      document.body.classList.toggle("no-scroll")
    })
  }

  // Close mobile menu when clicking on a link
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
    // Add initial opacity 0 to elements
    logo.style.opacity = "0"
    brandName.style.opacity = "0"
    tagline.style.opacity = "0"

    // Animate elements in sequence
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

  // Parallax effect on logo
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

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return // Skip if it's just "#"

      if (targetId === "#top") {
        // Scroll to the top of the page for Home link
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      } else {
        // Scroll to the specific section for other links
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: "smooth",
          })
        }
      }
    })
  })

  // Initialize Lightning effect - now applied to the entire body
  initLightning()

  // Search functionality
  const searchToggle = document.querySelector(".search-toggle")
  const searchContainer = document.querySelector(".search-container")
  const searchClose = document.querySelector(".search-close")
  const searchForm = document.querySelector(".search-form")
  const searchInput = document.querySelector(".search-input")
  const searchResults = document.querySelector(".search-results")

  // Sample product data for search
  const products = [
    {
      id: 1,
      name: "FTL T-shirt",
      price: "$49.99",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 2,
      name: "FTL Shorts",
      price: "$69.99",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 3,
      name: "FTL Hoodie",
      price: "$129.99",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: 4,
      name: "FTL Socks",
      price: "$89.99",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  // Toggle search container
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

  // Close search container
  if (searchClose) {
    searchClose.addEventListener("click", () => {
      searchContainer.classList.remove("active")
      document.body.classList.remove("no-scroll")
      searchResults.classList.remove("active")
      searchInput.value = ""
    })
  }

  // Close search on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && searchContainer.classList.contains("active")) {
      searchContainer.classList.remove("active")
      document.body.classList.remove("no-scroll")
      searchResults.classList.remove("active")
      searchInput.value = ""
    }
  })

  // Search functionality
  if (searchForm) {
    searchForm.addEventListener("submit", (e) => {
      e.preventDefault()
      performSearch()
    })
  }

  // Live search as user types
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

    // Display results
    searchResults.innerHTML = ""

    if (filteredProducts.length > 0) {
      filteredProducts.forEach((product) => {
        const resultItem = document.createElement("a")
        resultItem.href = "#" // In a real app, link to product page
        resultItem.className = "search-result-item"
        resultItem.innerHTML = `
          <img src="${product.image}" alt="${product.name}" class="search-result-image">
          <div class="search-result-info">
            <div class="search-result-name">${product.name}</div>
            <div class="search-result-price">${product.price}</div>
          </div>
        `

        // Add click event to add product to cart
        resultItem.addEventListener("click", (e) => {
          e.preventDefault()
          cart.addItem(product)
          searchContainer.classList.remove("active")
          document.body.classList.remove("no-scroll")

          // Show cart notification
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

          // Open cart drawer
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
})

// Lightning effect implementation
function initLightning() {
  // Create a fixed lightning container for the entire page
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

    // Convert HSV to RGB.
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
        // Normalized pixel coordinates.
        vec2 uv = fragCoord / iResolution.xy;
        uv = 2.0 * uv - 1.0;
        uv.x *= iResolution.x / iResolution.y;
        // Apply horizontal offset.
        uv.x += uXOffset;
        
        // Adjust uv based on size and animate with speed.
        uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
        
        float dist = abs(uv.x);
        // Compute base color using hue.
        vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
        // Compute color with intensity and speed affecting time.
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

  // Always use the program, even if the context is lost and recreated.
  gl.useProgram(program)

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

  // Set lightning parameters - red color for the theme
  const hue = 0 // Red hue
  const xOffset = 0
  const speed = 0.8
  const intensity = 1.5
  const size = 1.2

  const startTime = performance.now()

  // Ensure program is always used during render
  gl.useProgram(program)

  const render = () => {
    gl.useProgram(program)
    resizeCanvas()
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
