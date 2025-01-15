console.log('script.js loaded')

let data;

window.onload = () => {
    fetchSecret();
}

async function fetchSecret() {
    try {
        let secrets = document.querySelector('.container');
        let loading = document.createElement('p');
        loading.innerText = 'Loading...';
        secrets.appendChild(loading);

        const response = await fetch('/user/get-secrets', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        data = await response.json();

        displaySecrets(data.data);
    } catch (error) {
        console.error('Error fetching secret:', error);
    }
}

function displaySecrets(data) {

    let secrets = document.querySelector('.container');
    secrets.removeChild(secrets.lastElementChild)
    
    for(let i=0;i<data.length;i++){
        let new_secret = document.createElement('div');
        new_secret.setAttribute('class', 'secret');

        new_secret.innerHTML = `
        <div class="row">
        <p>URL:</p>
            <div class="value">${data[i].URL}</div>
            <!-- <button class="copy-link" onclick="copyToClipboard(this)">Copy</button> -->
            <button class="delete-secret" onclick="deleteSecret(this)">Delete</button>
        </div>
        <div class="row">
            <div class="row-username">
                <div class="value hidden">${data[i].USERNAME}</div>
                <button class="view-toggle" onclick="toggleView(this)">View</button>
                <button class="copy-link" onclick="copyToClipboard(this)">Copy</button>
            </div>
            <p>:</p>
            <div class="row-value">
                <div class="value hidden">${data[i].PASSWORD}</div>
                <button class="view-toggle" onclick="toggleView(this)">View</button>
                <button class="copy-link" onclick="copyToClipboard(this)">Copy</button>
            </div>
        </div>`;

        secrets.appendChild(new_secret);
    }


    if(secrets.childElementCount<=1){
        let empty_message = document.createElement('h3');
        empty_message.innerText = 'No secrets available!';
        secrets.appendChild(empty_message);
    }
}

function deleteSecret(button) {
    // implementation left
}

function toggleView(button) {
    const valueElement = button.previousElementSibling;
    const isHidden = valueElement.classList.contains("hidden");
    
    if (isHidden) {
        valueElement.classList.remove("hidden");
        button.textContent = "Hide";
    } else {
        valueElement.classList.add("hidden");
        button.textContent = "View";
    }
}

function copyToClipboard(button) {
    const textElement = button.previousElementSibling.previousElementSibling || button.nextElementSibling.nextElementSibling;
    const textToCopy = textElement.textContent || textElement.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
        button.textContent = "Copied!";
        setTimeout(() => {
            button.textContent = "Copy";
        }, 2000);
    }).catch(() => {
        alert("Failed to copy text.");
    });
}

const add_secret = document.querySelector('.form-container');
add_secret.style.visibility = 'hidden';
function toggleAddSecret() {
    if(add_secret.style.visibility=='hidden'){
        add_secret.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }
    else{
        add_secret.style.visibility = 'hidden';
        document.body.style.overflow = 'scroll';
    }
}