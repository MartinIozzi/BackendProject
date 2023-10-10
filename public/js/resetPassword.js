const submitButton = document.getElementById('submit-button');

submitButton.addEventListener('click', () => {
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirm-password');

    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    if (password === confirmPassword) {

        document.getElementById('reset-form').submit();
    } else {
        swal ( "¡Las contraseñas no coinciden! " , " ...¡Por favor, inténtelo nuevamente! ", "error")  ;
    }
});