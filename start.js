const url = 'https://657e1bc63e3f5b1894638681.mockapi.io/user';

document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById('loginBtn');
    const submitBtn = document.getElementById('submitBtn');

    submitBtn.addEventListener("click", function(event) {
        event.preventDefault();
        
        const userName = document.getElementById('name').value;
        const userEmail = document.getElementById('email').value;
        const userPassword = document.getElementById('pass').value;

        const saveData = {
            name: userName,
            email: userEmail,
            password: userPassword
        };

        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(saveData)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if(data.id) {
                Swal.fire({
                    title: "Good job!",
                    text: "Sign Up successful!",
                    icon: "success"
                }).then((result) => {
                    if(result.isConfirmed){
                        localStorage.setItem('userName', data.name);
                        localStorage.setItem('userEmail', data.email);
                        localStorage.setItem('userId', data.id);   
                        window.location.href = 'index.html';
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!"
                }).then((result) => {
                    if(result.isConfirmed){
                        window.location.href = 'manager.html';
                    }
                });
            }
        })
        .catch(error => console.error("Error fetching data:", error));
    });

    loginBtn.addEventListener('click', function(event) {
        event.preventDefault();

        const userEmail = document.getElementById('logemail').value;
        const userPassword = document.getElementById('logpass').value;

        fetch(url)
        .then(res => res.json())
        .then(user => {
            const findUser = user.find(user => user.email === userEmail && user.password === userPassword);

            if(findUser){
                Swal.fire({
                    title: "Good job!",
                    text: "Log In successful!",
                    icon: "success"
                }).then((result) => {
                    if(result.isConfirmed){
                        localStorage.setItem('userId', findUser.id);
                        console.log(localStorage.getItem('userId'))
                        window.location.href = 'manager.html';
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Something went wrong!"
                });
            }
        })
        .catch(error => console.error('Error fatching data:', error))
    })
});
