const addWorkerButton = document.getElementById("add-worker-btn")
const editWorkerBtn = document.querySelector("editBtn")
const addForm = document.querySelector(".display")
const membersContainer = document.getElementById("membersContainer")
let workers = []
const addWorkers = document.getElementById('addWorkers')
const nom = document.getElementById('workerName')
const role = document.getElementById('role')
const email = document.getElementById('email')
const tel = document.getElementById('phone')
let editingId = document.getElementById("addworkers")


function addWorker() {
    addWorkers.reset()
    addForm.classList.add("active")
}

function cancelWorker() {
    addForm.classList.remove("active")
    if (addWorkers) {
        addWorkers.reset()
    }
}



addWorkers.addEventListener("submit", function (e) {
    e.preventDefault()

    if (editingId !== null) {

        const worker = workers.find(w => w.id === editingId)
        worker.name = nom.value
        worker.role = role.value
        worker.tel = tel.value
        worker.email = email.value

        editingId = null
    } else {
        const worker = {
            id: Date.now(),
            name: nom.value,
            role: role.value,
            tel: tel.value,
            email: email.value,
            zone: null
        }
        workers.push(worker)
    }

    renderWorkers()

    // addForm.reset()
    addForm.classList.remove("active")
})

function renderWorkers() {
    membersContainer.innerHTML = ''

    workers.forEach(work => {
        const card = document.createElement("div")
        card.className = 'member'

        card.innerHTML = `
                    <img src="/assets/logo.png" alt="Photo du membre" />
                    <div class="disc">
                        <p>${work.name}</p>
                    </div>
                    <button class="editBtn">Modifier</button>
                `

        card.querySelector(".editBtn").addEventListener("click", function () {
            editWorker(work.id)
        })

        membersContainer.appendChild(card)
    });

}

function editWorker(id) {
    const worker = workers.find(w => w.id === id)
    if (!worker) return

    editingId = id
    nom.value = worker.name
    role.value = worker.role
    tel.value = worker.tel
    email.value = worker.email

    addForm.classList.add("active")
}