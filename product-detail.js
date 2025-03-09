document.addEventListener("DOMContentLoaded", () => {
    // Page transition effect
    const pageTransition = document.querySelector(".page-transition")
    if (pageTransition) {
      pageTransition.classList.add("active")
      setTimeout(() => {
        pageTransition.classList.remove("active")
      }, 500)
    }
  
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search)
    const productId = urlParams.get("id")
  
    if (!productId) {
      window.location.href = "index.html"
      return
    }
  
    // Product descriptions - add detailed descriptions for each product
    const productDescriptions = {
      1: "The FTL OG T-shirt is our flagship product, featuring our iconic logo on premium quality fabric. Made with 100% combed ringspun cotton for ultimate comfort and durability. This shirt is perfect for everyday wear, featuring a classic fit that suits all body types. The bold design represents your faith while maintaining a stylish, modern look.",
      2: "Stay warm and represent your faith with our FTL OG Hoodie. Made with a premium cotton-polyester blend for maximum comfort and warmth. Features a kangaroo pocket, adjustable drawstring hood, and ribbed cuffs and hem. The perfect addition to your wardrobe for those cooler days, combining style with a powerful message.",
      3: "Our FTL Shorts are designed for both comfort and performance. Made with lightweight, breathable fabric that wicks away moisture, these shorts are perfect for workouts, casual wear, or just lounging around. The elastic waistband with drawstring ensures a perfect fit, while the side pockets provide convenient storage.",
      4: "The FTL Jesus Saves Shorts feature our powerful 'Jesus Saves' message prominently displayed. These premium athletic shorts are made with quick-dry fabric, perfect for workouts or casual wear. The comfortable fit and durable construction make these shorts a staple in your wardrobe, reminding you and others of the saving grace of Jesus Christ.",
      5: "Our Faith Over Fear T-shirt is a powerful reminder to trust in God's plan. Made with soft, premium cotton that feels great against your skin. The modern design features our message in a bold, eye-catching font that sparks conversations and shares your faith. A comfortable, relaxed fit makes this shirt perfect for everyday wear.",
      6: "The Side Cross FTL T-Shirt features our unique side cross design, symbolizing how faith should be carried with us always. Made with high-quality, soft cotton that provides all-day comfort. The minimalist design makes this shirt versatile enough to pair with any outfit while still making a statement about your faith.",
      7: "Our Jesus Saves FTL T-Shirt boldly proclaims the most important message of all. Crafted from lightweight, breathable cotton that's perfect for year-round wear. The classic fit and clean design put the focus on the message, making this shirt a powerful yet subtle way to share your faith with those around you.",
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
            price: "$49.99",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20og%20logo%20shirt-IkqmEnUSFFNJu7qkffZDppmOkoHn29.png",
          },
          {
            id: 2,
            name: "FTL OG Hoodie",
            price: "$69.99",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20front-qZlX6uB6JaNsJpbWzY3W2XSJOh5YcU.png",
          },
          {
            id: 3,
            name: "FTL Shorts",
            price: "$129.99",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts%20front-RR2CD01ba3XKgL5heWrBHDRXawGmHJ.png",
          },
          {
            id: 4,
            name: "FTL Jesus Saves Shorts",
            price: "$89.99",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20jesus%20saves%20shorts%20front-CsFiKDGHEYeK0qTY4iQxSdjC163Zys.png",
          },
          {
            id: 5,
            name: "FTL Faith Over Fear T-shirt",
            price: "$34.99",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20jesus%20front-bH31nR7gJukYhSvBmZxvbNo94QDngS.png",
          },
          {
            id: 6,
            name: "Side Cross FTL T-Shirt",
            price: "$29.99",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20cross%20front-JQpm5CZ4etYOh32A2lWTotF4VQMbNY.png",
          },
          {
            id: 7,
            name: "Jesus Saves FTL T-Shirt",
            price: "$19.99",
            image:
              "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shirt%5B47%5D-AI8xtKZEg9OIRdwfIf9D4M7RfnZ7qM.png",
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
          price: "$49.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20og%20logo%20shirt-IkqmEnUSFFNJu7qkffZDppmOkoHn29.png",
        },
        {
          id: 2,
          name: "FTL OG Hoodie",
          price: "$69.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20front-qZlX6uB6JaNsJpbWzY3W2XSJOh5YcU.png",
        },
        {
          id: 3,
          name: "FTL Shorts",
          price: "$129.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts%20front-RR2CD01ba3XKgL5heWrBHDRXawGmHJ.png",
        },
        {
          id: 4,
          name: "FTL Jesus Saves Shorts",
          price: "$89.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20jesus%20saves%20shorts%20front-CsFiKDGHEYeK0qTY4iQxSdjC163Zys.png",
        },
        {
          id: 5,
          name: "FTL Faith Over Fear T-shirt",
          price: "$34.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20jesus%20front-bH31nR7gJukYhSvBmZxvbNo94QDngS.png",
        },
        {
          id: 6,
          name: "Side Cross FTL T-Shirt",
          price: "$29.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20cross%20front-JQpm5CZ4etYOh32A2lWTotF4VQMbNY.png",
        },
        {
          id: 7,
          name: "Jesus Saves FTL T-Shirt",
          price: "$19.99",
          image:
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shirt%5B47%5D-AI8xtKZEg9OIRdwfIf9D4M7RfnZ7qM.png",
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
    document.getElementById("product-price").textContent = product.price
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
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20front-qZlX6uB6JaNsJpbWzY3W2XSJOh5YcU.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20hoodie%20back-ExbIrBts2vKvD4WCm25PJcDN1Z8X7G.png",
        ]
        break
      case 3:
        productImages = [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts%20front-RR2CD01ba3XKgL5heWrBHDRXawGmHJ.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shorts-2OPcQfkeRE9gu7GSnTM7puuSxNZSEi.png",
        ]
        break
      case 4:
        productImages = [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20jesus%20saves%20shorts%20front-CsFiKDGHEYeK0qTY4iQxSdjC163Zys.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20jesus%20saves%20shorts-xVhEQ5d1AfAEhVgcLXdzbjqBwecIek.png",
        ]
        break
      case 5:
        productImages = [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20jesus%20front-bH31nR7gJukYhSvBmZxvbNo94QDngS.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20jesus%20back-7QQtankNAIY8pJifYhMAPcgEB3JoXo.png",
        ]
        break
      case 6:
        productImages = [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20cross%20front-JQpm5CZ4etYOh32A2lWTotF4VQMbNY.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20side%20cross%20back-v7vfXwDRjU41YMqdwpMaxsLukhwmco.png",
        ]
        break
      case 7:
        productImages = [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shirt%5B47%5D-AI8xtKZEg9OIRdwfIf9D4M7RfnZ7qM.png",
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FTL%20shirt%20back%20jesus%20saves-vBwO5ZgvBo3s2cxhMuCj1JaGJmGUJk.png",
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
    const mainImageContainer = document.querySelector(".product-detail-main-image");
    if (mainImageContainer) {
      // Create a zoom container
      const zoomContainer = document.createElement("div");
      zoomContainer.className = "zoom-container";
      
      // Move the existing image into the zoom container
      const mainImage = document.getElementById("main-product-image");
      if (mainImage) {
        const originalSrc = mainImage.src;
        mainImageContainer.innerHTML = "";
        zoomContainer.appendChild(mainImage);
        mainImageContainer.appendChild(zoomContainer);
        
        // Make sure the image is properly loaded
        mainImage.src = originalSrc;
        
        // Add zoom functionality
        zoomContainer.addEventListener("click", function() {
          this.classList.toggle("active");
        });
        
        zoomContainer.addEventListener("mousemove", function(e) {
          if (this.classList.contains("active")) {
            // Calculate mouse position as percentage of container
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Set CSS variables for transform-origin
            this.style.setProperty("--x", `${x}%`);
            this.style.setProperty("--y", `${y}%`);
          }
        });
      }
    }
  
    // Update thumbnail click handler to work with zoom container
    const thumbnailsContainer = document.querySelector(".product-detail-thumbnails");
    if (thumbnailsContainer) {
      thumbnailsContainer.addEventListener("click", function(e) {
        const thumbnail = e.target.closest(".thumbnail");
        if (thumbnail) {
          // Update active thumbnail
          document.querySelectorAll(".thumbnail").forEach((thumb) => {
            thumb.classList.remove("active");
          });
          thumbnail.classList.add("active");
          
          // Update main image
          const mainImage = document.getElementById("main-product-image");
          if (mainImage) {
            const imgSrc = thumbnail.querySelector("img").src;
            mainImage.src = imgSrc;
          }
        }
      });
    }
  
    // Create thumbnails
    const thumbnailsContainerOld = document.querySelector(".product-detail-thumbnails")
    productImages.forEach((imgSrc, index) => {
      const thumbnail = document.createElement("div")
      thumbnail.className = `thumbnail ${index === 0 ? "active" : ""}`
      thumbnail.innerHTML = `<img src="${imgSrc}" alt="${product.name} view ${index + 1}">`
  
      // thumbnail.addEventListener("click", () => {
      //   // Update main image
      //   mainImage.src = imgSrc
  
      //   // Update active thumbnail
      //   document.querySelectorAll(".thumbnail").forEach((thumb) => {
      //     thumb.classList.remove("active")
      //   })
      //   thumbnail.classList.add("active")
      // })
  
      thumbnailsContainerOld.appendChild(thumbnail)
    })
  
    // Add to cart functionality
    const addToCartBtn = document.getElementById("add-to-cart-btn")
    addToCartBtn.addEventListener("click", () => {
      const size = document.getElementById("product-size").value
      const color = document.getElementById("product-color").value
  
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: mainImage.src,
        size: size,
        color: color,
      }
  
      // Try to use the cart object from script.js
      try {
        if (window.cart && typeof window.cart.addItem === "function") {
          window.cart.addItem(productToAdd)
        } else {
          // Fallback if cart is not available
          console.log("Added to cart:", productToAdd)
          alert(`${product.name} added to cart!`)
        }
      } catch (error) {
        console.error("Error adding to cart:", error)
        alert(`${product.name} added to cart!`)
      }
  
      // Show notification
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
  
    // Back to collection with transition
    const backLink = document.querySelector(".back-to-collection")
    if (backLink) {
      backLink.addEventListener("click", function (e) {
        e.preventDefault()
        const href = this.getAttribute("href")
  
        // Activate transition
        if (pageTransition) {
          pageTransition.classList.add("active")
  
          // Navigate after transition
          setTimeout(() => {
            window.location.href = href
          }, 500)
        } else {
          window.location.href = href
        }
      })
    }
  })