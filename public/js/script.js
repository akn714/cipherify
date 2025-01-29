console.log('script.js loaded')

let data;

window.onload = () => {
    fetchSecret();
}

function displaySecrets(data) {

    let secrets = document.querySelector('.container');
    // secrets.removeChild(secrets.lastElementChild)
    
    if(data.length==0){
        let empty_message = document.createElement('h3');
        empty_message.innerText = 'No secrets available!';
        secrets.appendChild(empty_message);
        return;
    }

    for(let i=0;i<data.length;i++){
        let new_secret = document.createElement('div');
        new_secret.setAttribute('class', 'secret');

        new_secret.innerHTML = `
        <div class="row">
            <p>URL:</p>
            <div class="value">${data[i].URL}</div>
            <!-- <button class="copy-link" onclick="copyToClipboard(this)">Copy</button> -->
            <button id='${data[i].URL}' class="delete-secret" onclick="deleteSecret(this)">Delete</button>
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
        if(data){
            let temp;
            let PIN = prompt('enter a 6 digit pin');
            let IV;
            let x;
            // let IV = Uint8Array.from(atob(data.data[0].IV), (c) => c.charCodeAt(0));
            // let x = await decrypt(PIN, data.data[0].USERNAME, IV);
            data = data.data;
            for(let i=0;i<data.length;i++){
                IV = Uint8Array.from(atob(data[i].IV), (c) => c.charCodeAt(0));

                temp = data[i].USERNAME;
                x = await decrypt(PIN, temp, IV);
                data[i].USERNAME = x;

                temp = data[i].PASSWORD;
                x = await decrypt(PIN, temp, IV);
                data[i].PASSWORD = x;
            }
            // console.log(data)
            secrets.removeChild(secrets.lastElementChild);
            displaySecrets(data);
        }
    } catch (error) {
        console.error('Error fetching secret:', error);
    }
}

async function deleteSecret(button) {
    try {
        let data = {
            URL: button.id
        }
        button.innerText = 'Deleting...';
        const response = await fetch('/user/delete-secret', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });

        if(response.ok){
            let secrets = document.querySelector('.container');
            secrets.innerHTML = '<h2>Ciphers</h2><p>Loading...</p>';
            let res = await response.json();
            if(res){
                secrets.removeChild(secrets.lastElementChild)
                displaySecrets(res.updatedSecrets)
            }
        }

        // if (response.ok) {
        //     const responseData = await response.json();
        //     if(responseData[0]=='ok') window.location = '/';
        //     else alert('Error from server', responseData[0]);
        //     console.log('Response from server:', responseData[0]);
        // } else {
        //     console.error('Failed to fetch:', response.statusText);
        // }        
    } catch (error) {
        console.log(error)
        alert('An error occured!');
    }
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