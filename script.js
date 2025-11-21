const addWorkerButton = document.getElementById("add-worker-btn");
const addForm = document.querySelector(".display");
const membersContainer = document.getElementById("membersContainer");
const addWorkers = document.getElementById('addWorkers');
const addExperience = document.querySelector(".experience");

const nom = document.getElementById('workerName');
const role = document.getElementById('role');
const email = document.getElementById('email');
const tel = document.getElementById('phone');
const url = document.getElementById("url");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const urlError = document.getElementById("urlError");

let workers = [];
let experienceCount = 0;

const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^0\d{9}$/;
const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

addWorkerButton.addEventListener("click", addWorker);

function addWorker() {
    addWorkers.reset();
    clearExperiences();
    addForm.classList.add("active");
}

function cancelWorker() {
    addForm.classList.remove("active");
    addWorkers.reset();
    clearExperiences();
}

function clearExperiences() {
    addExperience.innerHTML = '';
    experienceCount = 0;
}

function addExperienceBtn() {
    experienceCount++;

    const div = document.createElement("div");
    div.className = "add-experience";
    div.innerHTML = `
        <input type="text" id="post${experienceCount}" placeholder="Poste" required>
        <input type="text" id="enterprise${experienceCount}" placeholder="Entreprise" required>
        <input type="date" id="startDate${experienceCount}" required>
        <input type="date" id="endDate${experienceCount}" required>
        <button type="button" class="cancelbtn" onclick="removeExperience(this)">Supprimer</button>
    `;
    addExperience.appendChild(div);
}

function removeExperience(button) {
    button.parentElement.remove();
}

function getAllExperiences() {
    const experiences = [];
    const experienceDivs = document.querySelectorAll('.add-experience');

    experienceDivs.forEach((div) => {
        const postInput = div.querySelector('input[type="text"]:nth-of-type(1)');
        const enterpriseInput = div.querySelector('input[type="text"]:nth-of-type(2)');
        const startDateInput = div.querySelector('input[type="date"]:nth-of-type(1)');
        const endDateInput = div.querySelector('input[type="date"]:nth-of-type(2)');

        experiences.push({
            post: postInput ? postInput.value : '',
            enterprise: enterpriseInput ? enterpriseInput.value : '',
            startDate: startDateInput ? startDateInput.value : '',
            endDate: endDateInput ? endDateInput.value : ''
        });
    });

    return experiences;
}

function validateForm() {
    let isValid = true;

    if (!nameRegex.test(nom.value)) {
        nameError.textContent = "Nom invalide";
        isValid = false;
    } else {
        nameError.textContent = "";
    }

    if (!emailRegex.test(email.value)) {
        emailError.textContent = "Email invalide";
        isValid = false;
    } else {
        emailError.textContent = "";
    }

    if (!phoneRegex.test(tel.value)) {
        phoneError.textContent = "Numéro invalide";
        isValid = false;
    } else {
        phoneError.textContent = "";
    }

    if (!urlRegex.test(url.value)) {
        urlError.textContent = "URL invalide";
        isValid = false;
    } else {
        urlError.textContent = "";
    }

    return isValid;
}

addWorkers.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
        alert("Veuillez corriger les erreurs avant de soumettre.");
        return;
    }

    const experiences = getAllExperiences();

    const worker = {
        id: Date.now(),
        name: nom.value,
        role: role.value,
        tel: tel.value,
        email: email.value,
        url: url.value,
        experiences: experiences
    };
    workers.push(worker);

    renderWorkers();
    addForm.classList.remove("active");
    console.log("Travailleurs:", workers);
});

function renderWorkers() {
    membersContainer.innerHTML = '';

    workers.forEach(worker => {
        const card = document.createElement("div");
        card.className = 'member';
        card.innerHTML = `
            <img src="${worker.url || 'assets/logo.png'}" alt="Photo" />
            <div class="disc">
                <p>${worker.name}</p>
                <small>${worker.role}</small>
            </div>
            <div class="discbtn">
                <button class="detailsBtn">...</button>
            </div>
        `;

        card.querySelector(".detailsBtn").addEventListener("click", function () {
            showWorkerDetails(worker.id)
        });

        membersContainer.appendChild(card);
    });
}

const modal = document.getElementById("workerModal")
const details = document.getElementById("modalDetails")

function showWorkerDetails(id) {
    const worker = workers.find(w => w.id === id)

    if (!worker) return

    let experiencesHTML = ''

    if (worker.experiences && worker.experiences.length > 0) {
        worker.experiences.forEach(exp => {
            experiencesHTML += `
            <div class="exp-item"> 
                <strong>${exp.post}</strong> chez 
                <em>${exp.enterprise}</em> <br>
                <small>Du ${exp.startDate} au ${exp.endDate}</small>
            </div>
            `
        })
    } else {
        experiencesHTML = `<p>Aucune expérience</p>`
    }

    details.innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <div class="worker-header"> 
            <img src="${worker.url || 'assets/logo.png'}" alt="Photo">
            <h3>${worker.name}</h3>
            <p><strong>Email :</strong> ${worker.email}</p>
            <p><strong>Rôle :</strong> ${worker.role}</p>
            <p><strong>Téléphone :</strong> ${worker.tel}</p>
        </div>
        <div class="worker-experience">
            <h4>Expériences :</h4>
            ${experiencesHTML}
        </div>
    `
    modal.classList.add("active");
}

function closeModal() {
    modal.classList.remove("active");
}

modal.addEventListener("click", function (event) {
    if(event.target === modal) {
        closeModal()
    }
})

nom.addEventListener("input", () => validateField(nom, nameRegex, nameError, "Nom invalide"));
email.addEventListener("input", () => validateField(email, emailRegex, emailError, "Email invalide"));
tel.addEventListener("input", () => validateField(tel, phoneRegex, phoneError, "Numéro invalide"));
url.addEventListener("input", () => validateField(url, urlRegex, urlError, "URL invalide"));

function validateField(field, regex, errorElement, message) {
    if (!regex.test(field.value)) {
        errorElement.textContent = message;
    } else {
        errorElement.textContent = "";
    }
}

window.addExperienceBtn = addExperienceBtn;
window.removeExperience = removeExperience;
window.closeModal = closeModal;
window.cancelWorker = cancelWorker;