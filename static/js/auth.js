
let formState = false;
const auth = document.querySelector('#auth');
const reg = document.querySelector('#register');

// Set list country
const countryEl = document.querySelector('#country');
const countryList = fetch('/countryList', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(data => data.json());
countryList.then(data => console.log(data));
countryList.then(data => countryEl.innerHTML = '<option value="0" selected>Select country</option>' + data.map(el => `<option value="${el.id}">${el.name}</option>`).join('')).catch(console.log);

document.querySelectorAll('.changeForm').forEach(el => el.onclick = () => {
    formState = !formState;
    if(formState) {
        auth.style.display = 'none';
        reg.style.display = 'flex';
    } else {
        auth.style.display = 'flex';
        reg.style.display = 'none';
    }
});

const hook = async(data, url) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return res.json();
}

document.querySelector('#submitReg').onclick = () => {
    const input = [...reg.querySelectorAll('input')];
    const inputs = input.map(el => el.value);
    if(inputs.every(el => el.length)) {
        return hook({
            name: inputs[0],
            date: inputs[1],
            email: inputs[2],
            phone: inputs[3],
            country: countryEl.value
        }, '/register').then(res => {
            if(res.error) return document.querySelector('.info').textContent = `Ошибка: ${res.error}`;
            input.forEach(el => el.value = '');
            reg.querySelector('.info').textContent = `Ваш пароль: ${res.password}`;
        });
    }
    console.log(1);
    document.querySelector('.info').textContent = 'Не все поля заполнены!';
}

document.querySelector('#submitAuth').onclick = () => {
    const inputs = [...auth.querySelectorAll('input')].map(el => el.value);
    if(inputs.every(el => el.length)) {
        hook({
            email: inputs[0],
            password: inputs[1]
        }, '/auth').then(data => {
            if(data.email) {
                localStorage.setItem('email', data.email);
                return window.location.href = `/user/id${data.id}`;
            }
            auth.querySelector('.info').textContent = data.error;
        });
    }
}