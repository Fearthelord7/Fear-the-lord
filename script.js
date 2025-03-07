document.addEventListener("DOMContentLoaded", () => {
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
})

// Lightning effect implementation - modified to be visible throughout the site
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

  gl.useProgram(program) // Ensure program is always used during render

  const render = () => {
    gl.useProgram(program) // Ensure program is always used during render
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

  gl.useProgram(program) // Ensure program is always used during render
  requestAnimationFrame(render)
}

