
/* =====================================
   1. SCHOLARSHIP DATA
===================================== */

const scholarships = [
    {
        name: "Dr. Ambedkar Medhavi Chattervriti Yojana",
        category: "state",
        description: "Scholarship assistance for eligible Himachal Pradesh students."
    },
    {
        name: "National Scholarship Portal (NSP)",
        category: "central",
        description: "Explore central government scholarship opportunities."
    },
    {
        name: "Swami Vivekananda Utkrisht Chatravriti Yojana",
        category: "state",
        description: "Financial assistance for eligible meritorious students."
    }
];


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




displayScholarships(scholarships);

console.log("ScholarReady HP JavaScript loaded successfully!");

