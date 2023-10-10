const deleteUser = document.querySelectorAll(".userDelete")

deleteUser.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const userId = e.target.dataset.userId;
        async function userDelete() {
            const response = await fetch(`/api/users/deleteuser/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }})
            if (response.ok) {
                swal("Eliminación Exitosa", "El usuario se eliminó exitosamente.", "success");
                setTimeout(2000);
            } else {
                swal("Error", "Hubo un problema al eliminar el usuario.", "error");
            }
        }
        userDelete()
    });
});

const updUser = document.querySelectorAll(".changeRol");

updUser.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const userId = e.target.dataset.userId;
        async function changeRol() {
            const response = await fetch(`/api/users/updaterol/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }});
            if (response.ok) {
                swal("Cambio de rol exitoso", "El rol del usuario fue actualizado exitosamente, reinicia la página para ver los cambios.", "success");
                setTimeout(2000);
            } else {
                swal("Error", "Error al actualizar el rol del usuario", "error");
            }
        }
        changeRol()
    });
});