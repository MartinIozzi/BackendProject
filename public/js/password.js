document.getElementById('resetPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/users/mail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email }) // Envía el email como parte del cuerpo de la solicitud
        });

        const data = await response.json(); // Lee la respuesta JSON del servidor

        if (response.ok) {
            swal("Email enviado", "El mail de restablecimiento de contraseña fue enviado correctamente. Revise su bandeja de entrada.", "success");
        } else {
            swal("Error de email", `El mail de restablecimiento de contraseña no se envió correctamente: ${data.error}`, "error");
        }
    } catch (error) {
        console.error('Error de servidor', error);
    }
});
