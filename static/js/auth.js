
let formState = false;
const auth = document.querySelector('#auth');
const reg = document.querySelector('#register');

document.querySelectorAll('.changeForm').forEach(el => el.onclick = () => {
    formState = !formState;
    if(formState) {
        auth.style.display = 'flex';
        reg.style.display = 'none';
    } else {
        auth.style.display = 'none';
        reg.style.display = 'flex';
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
    const inputs = [...reg.querySelectorAll('input')].map(el => el.value);
    hook({
        name: inputs[0],
        date: inputs[1],
        email: inputs[2],
        phone: inputs[3]
    }, '/register').then(res => alert(`Your password: ${res.password}`));
}

document.querySelector('#submitAuth').onclick = () => {
    const inputs = [...auth.querySelectorAll('input')].map(el => el.value);
    hook({
        email: inputs[0],
        password: inputs[1]
    }, '/auth').then(data => {
        localStorage.setItem('email', data.email);
        window.location.href = `/user/id${data.id}`;
    });
}