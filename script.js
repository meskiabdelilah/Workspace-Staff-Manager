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
const rooms = document.querySelectorAll(".card")
const roomsPopUp = document.querySelector(".roomsPopUp")
const popUpList = document.getElementById("popUpList")
const AnnulerPopUp = document.getElementById("AnnulerPopUp")
const insideRoom = document.querySelector("insideRoom")

const roomRoles = [
    ["Manager", "Nettoyage"],          // Salle de conference
    ["Réceptionniste(e)", "Manager", "Nettoyage"],    // Reception
    ["Technicien IT", "Manager", "Nettoyage"],    // Salle des serveurs
    ["sécurité", "Manager", "Nettoyage"],        // Salle de sécurité
    ["Manager", "Nettoyage", "Autres rôle", "Réceptionniste(e)", "sécurité", "Technicien IT"],   // Salle du personnel
    ["Technicien IT", "Manager"],    // Salle d'archives

];

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

        const inputs = div.querySelectorAll("input")
        experiences.push({
            post: inputs[0].value,
            enterprise: inputs[1].value,
            startDate: inputs[2].value,
            endDate: inputs[3].value
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
        experiences: experiences,
        zone: null
    };
    workers.push(worker);

    renderWorkers();
    addForm.classList.remove("active");
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
    if (event.target === modal) {
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

AnnulerPopUp.addEventListener("click", function () {
    roomsPopUp.classList.add("hidePopUp");
});

for (let i = 0; i < rooms.length; i++) {
    const room = rooms[i];
    const roomIcon = room.querySelector(".fa-solid");

    // Container fin ghadi ytla3 worker daba
    const containerInRoom = room;

    roomIcon.addEventListener("click", function () {
        let roomRole = roomRoles[i];

        // Reset Popup
        roomsPopUp.classList.remove("hidePopUp");
        popUpList.innerHTML = ``;

        // Loop 3la workers
        for (let j = 0; j < workers.length; j++) {
            let worker = workers[j];

            if (worker.zone == null && roomRole.includes(worker.role)) {

                // Element jdiiid
                let empDiv = document.createElement("div");
                empDiv.className = "member";

                empDiv.innerHTML = `
                    <img src="${worker.url || 'assets/logo.png'}" alt="Photo" />
                    <div class="disc">
                        <p>${worker.name}</p>
                        <small>${worker.role}</small>
                    </div>
                `;

                // Event click dyal worker
                empDiv.addEventListener("click", function () {

                    worker.zone = i;

                    let insideRoomCard = document.createElement("div");
                    insideRoomCard.className = "member-small";
                    insideRoomCard.innerHTML = `
                        <p>${worker.name}</p>
                        <small>${worker.role}</small>
                    `;

                    containerInRoom.appendChild(insideRoomCard);

                    roomsPopUp.classList.add("hidePopUp");
                });

                popUpList.appendChild(empDiv);
            }
        }
    });
}
