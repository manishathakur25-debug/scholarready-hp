
/* =====================================
   1. SCHOLARSHIP DATA
===================================== */

let scholarships = [];

/* =====================================
   2. SCHOLARSHIP SEARCH
===================================== */

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryFilter = document.getElementById("categoryFilter");

const scholarshipContainer = document.getElementById(
    "scholarshipContainer"
);


function displayScholarships(data) {

    scholarshipContainer.innerHTML = "";

    if (data.length === 0) {

        scholarshipContainer.innerHTML = `
            <p>No scholarships found.</p>
        `;

        return;
    }

    data.forEach((scholarship) => {

        const card = document.createElement("div");

        card.className = "scholarship-card";

        card.dataset.category = scholarship.category;

        card.innerHTML = `

            <span class="category-tag">
                ${scholarship.category === "state"
                    ? "State Scholarship"
                    : "Central Scholarship"}
            </span>

            <h3>${scholarship.name}</h3>

            <p>${scholarship.description}</p>

            <button class="secondary-btn eligibility-btn">
                Check Eligibility
            </button>

        `;

        scholarshipContainer.appendChild(card);

    });

}

async function fetchScholarships() {
    try {
        const response = await fetch("/api/scholarships");

        if (!response.ok) {
            throw new Error("Failed to fetch scholarships");
        }

        const result = await response.json();

        scholarships = result.data;

        displayScholarships(scholarships);

    } catch (error) {
        console.error("Error fetching scholarships:", error);

        scholarshipContainer.textContent =
            "Unable to load scholarships. Please try again later.";
    }
}


// Search and filter function

function searchScholarships() {

    const searchValue = searchInput.value.toLowerCase().trim();

    const selectedCategory = categoryFilter.value;

    const filteredScholarships = scholarships.filter(
        (scholarship) => {

            const matchesName = scholarship.name
                .toLowerCase()
                .includes(searchValue);

            const matchesCategory =
                selectedCategory === "all" ||
                scholarship.category === selectedCategory;

            return matchesName && matchesCategory;

        }
    );

    displayScholarships(filteredScholarships);

}


// Search button click

searchBtn.addEventListener("click", searchScholarships);


// Search while typing

searchInput.addEventListener("input", searchScholarships);


// Category filter

categoryFilter.addEventListener("change", searchScholarships);



/* =====================================
   3. ELIGIBILITY CHECKER
===================================== */

const eligibilityForm = document.getElementById("eligibilityForm");

const eligibilityResult = document.getElementById(
    "eligibilityResult"
);


eligibilityForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const state = document.getElementById("studentState").value;

    const course = document.getElementById("studentCourse").value;

    const income = Number(
        document.getElementById("familyIncome").value
    );


    if (income < 0 || !Number.isFinite(income)) {

        eligibilityResult.textContent =
            "Please enter a valid annual family income.";

        return;
    }


    if (state !== "Himachal Pradesh") {

        eligibilityResult.textContent =
            "This portal currently focuses on Himachal Pradesh students.";

        return;
    }


    if (income === 0) {

        eligibilityResult.textContent =
            "Please enter your actual annual family income.";

        return;
    }


    eligibilityResult.innerHTML = `

        <div class="eligibility-message">

            <h3>Basic Information Submitted!</h3>

            <p>State: ${state}</p>

            <p>Course: ${course}</p>

            <p>Annual Family Income: ₹${income.toLocaleString("en-IN")}</p>

            <p>
                Please check the official scholarship guidelines
                to confirm your eligibility.
            </p>

        </div>

    `;

});



/* =====================================
   4. CHECK ELIGIBILITY BUTTONS
===================================== */

scholarshipContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("eligibility-btn")) {

        document.getElementById("eligibility").scrollIntoView({
            behavior: "smooth"
        });

    }

});



/* =====================================
   5. DOCUMENT SECTION
===================================== */

const documentCards = document.querySelectorAll(".document-card");

documentCards.forEach((card) => {

    card.addEventListener("click", function() {

        const documentName = card.querySelector("h3").textContent;

        alert(
            documentName +
            " is a required document. Document upload functionality will be added later."
        );

    });

});



fetchScholarships();


console.log("ScholarReady HP JavaScript loaded successfully!");


// STUDENT REGISTRATION

const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const studentData = {
        name: document.getElementById("registerName").value.trim(),
        email: document.getElementById("registerEmail").value.trim(),
        phone: document.getElementById("registerPhone").value.trim(),
        district: document.getElementById("registerDistrict").value.trim(),
        course: document.getElementById("registerCourse").value.trim(),
        annualIncome: Number(document.getElementById("registerIncome").value),
        password: document.getElementById("registerPassword").value
    };

    try {
        const response = await fetch("/api/students/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        const responseText = await response.text();

        const result = responseText
            ? JSON.parse(responseText)
            : {};

        if (!response.ok) {
            throw new Error(result.message || "Registration failed");
        }

        registerMessage.textContent = result.message || "Registration successful!";
        registerForm.reset();

    } catch (error) {
        console.error("Registration error:", error);
        registerMessage.textContent = error.message;
    }
});



/* =====================================
   7. STUDENT LOGIN
===================================== */

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    console.log("Login form submitted");

    const loginData = {
        email: document.getElementById("loginEmail").value.trim(),
        password: document.getElementById("loginPassword").value
    };

    try {
        const response = await fetch("/api/students/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Login failed");
        }

        sessionStorage.setItem("token", result.token);

        loginMessage.textContent = "Login successful!";

        await fetchStudentProfile();

    } catch (error) {
        console.error("Login error:", error);
        loginMessage.textContent = error.message;
    }

});



/* =====================================
   8. STUDENT PROFILE
===================================== */

async function fetchStudentProfile() {

    const token = sessionStorage.getItem("token");

    const profileMessage = document.getElementById("profileMessage");

    if (!token) {
        profileMessage.textContent = "Please login to view your profile.";
        return;
    }

    try {
        const response = await fetch("/api/students/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to fetch profile");
        }

        const student = result.data;

        profileMessage.innerHTML = `
            <p><strong>Name:</strong> ${student.name}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Phone:</strong> ${student.phone || "Not provided"}</p>
            <p><strong>District:</strong> ${student.district}</p>
            <p><strong>Course:</strong> ${student.course}</p>
            <p><strong>Annual Income:</strong> ₹${student.annualIncome}</p>
        `;

    } catch (error) {
        console.error("Profile error:", error);
        profileMessage.textContent = error.message;
    }
}



/* =====================================
   9. STUDENT LOGOUT
===================================== */

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function() {

    sessionStorage.removeItem("token");

    document.getElementById("loginMessage").textContent =
        "You have been logged out successfully.";

    document.getElementById("profileMessage").textContent =
        "Please login to view your profile.";

});

/* =====================================
   10. ADD SCHOLARSHIP
===================================== */

const scholarshipForm = document.getElementById("scholarshipForm");
const scholarshipMessage = document.getElementById("scholarshipMessage");

scholarshipForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const scholarshipData = {
        name: document.getElementById("scholarshipName").value.trim(),
        category: document.getElementById("scholarshipCategory").value,
        description: document.getElementById("scholarshipDescription").value.trim(),
        amount: document.getElementById("scholarshipAmount").value
            ? Number(document.getElementById("scholarshipAmount").value)
            : null,
        eligibility: document.getElementById("scholarshipEligibility").value.trim(),
        state: document.getElementById("scholarshipState").value.trim(),
        lastDate: document.getElementById("scholarshipLastDate").value || null,
        applicationLink: document.getElementById("scholarshipLink").value.trim()
    };

    try {
        const response = await fetch("/api/scholarships", {
            method: "POST",
headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
},
            body: JSON.stringify(scholarshipData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to add scholarship");
        }

        scholarshipMessage.textContent = "Scholarship added successfully!";

        scholarshipForm.reset();

        await fetchScholarships();

    } catch (error) {
        console.error("Scholarship error:", error);
        scholarshipMessage.textContent = error.message;
    }
});

