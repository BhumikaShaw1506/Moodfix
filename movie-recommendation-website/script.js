// OMDb API Configuration
const OMDB_API_KEY = "YOUR_API_KEY_HERE" // Replace with your OMDb API key from https://www.omdbapi.com/apikey.aspx
const OMDB_BASE_URL = "https://www.omdbapi.com/"

// Signup Handler
function handleSignup(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value
  const confirmPassword = document.getElementById("confirmPassword").value

  const errorMsg = document.getElementById("errorMessage")
  const successMsg = document.getElementById("successMessage")

  // Clear previous messages
  errorMsg.classList.remove("show")
  successMsg.classList.remove("show")

  // Validation
  if (password.length < 6) {
    errorMsg.textContent = "Password must be at least 6 characters long"
    errorMsg.classList.add("show")
    return
  }

  if (password !== confirmPassword) {
    errorMsg.textContent = "Passwords do not match"
    errorMsg.classList.add("show")
    return
  }

  // Check if user already exists
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const userExists = users.some((user) => user.email === email)

  if (userExists) {
    errorMsg.textContent = "User already exists with this email"
    errorMsg.classList.add("show")
    return
  }

  // Save user
  users.push({ email, password })
  localStorage.setItem("users", JSON.stringify(users))

  successMsg.textContent = "Account created successfully! Redirecting to login..."
  successMsg.classList.add("show")

  setTimeout(() => {
    window.location.href = "login.html"
  }, 1500)
}

// Login Handler
function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const errorMsg = document.getElementById("errorMessage")
  const successMsg = document.getElementById("successMessage")

  // Clear previous messages
  errorMsg.classList.remove("show")
  successMsg.classList.remove("show")

  // Validate credentials
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  const user = users.find((u) => u.email === email && u.password === password)

  if (!user) {
    errorMsg.textContent = "Invalid email or password"
    errorMsg.classList.add("show")
    return
  }

  // Set logged in user
  localStorage.setItem("currentUser", email)

  successMsg.textContent = "Login successful! Redirecting..."
  successMsg.classList.add("show")

  setTimeout(() => {
    window.location.href = "mood.html"
  }, 1000)
}

// Check Authentication
function checkAuth() {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    window.location.href = "login.html"
  }
}

// Logout Handler
function handleLogout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Mood Selection Handler
async function handleMoodSelection(e) {
  e.preventDefault()

  const currentMood = document.getElementById("currentMood").value
  const desiredFeeling = document.getElementById("desiredFeeling").value

  // Show loading
  document.querySelector(".mood-box").style.display = "none"
  document.getElementById("loadingMessage").style.display = "block"

  try {
    // Call Flask backend API
    const response = await fetch("http://127.0.0.1:5000/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mood: currentMood,
        feeling: desiredFeeling,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch recommendations")
    }

    const data = await response.json()

    if (data.status === "success" && data.movies) {
      await displayMovies(data.movies, currentMood, desiredFeeling)
    } else {
      throw new Error("No movies found")
    }
  } catch (error) {
    console.error("Error loading movies:", error)
    alert("Error loading movies. Make sure the Flask server is running on http://127.0.0.1:5000")
    document.querySelector(".mood-box").style.display = "block"
    document.getElementById("loadingMessage").style.display = "none"
  }
}

async function getMoviePoster(movieTitle, posterUrl) {
  return posterUrl || "public/abstract-movie-poster.png"
}

// Display movies with posters
async function displayMovies(movies, currentMood, desiredFeeling) {
  const movieResults = document.getElementById("movieResults")
  movieResults.innerHTML = ""

  // Display movies with posters from backend
  movies.forEach((movie) => {
    const movieCard = document.createElement("div")
    movieCard.className = "movie-card"

    movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}" onerror="this.src='public/abstract-movie-poster.png'">
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-tags">
                    <span class="tag">${movie.mood}</span>
                    <span class="tag">${movie.feel}</span>
                </div>
                <p class="movie-description">${movie.description}</p>
            </div>
        `

    movieResults.appendChild(movieCard)
  })

  // Hide loading and show results
  document.getElementById("loadingMessage").style.display = "none"
  document.getElementById("recommendationsSection").style.display = "block"
}

// Show mood selector again
function showMoodSelector() {
  document.querySelector(".mood-box").style.display = "block"
  document.getElementById("recommendationsSection").style.display = "none"
  document.getElementById("moodForm").reset()
}
