const socket = io();

socket.on ('send', () => {
  try {
    let botonesEliminar = document.getElementsByClassName("btn-eliminar");
    botonesEliminar = Array.from(botonesEliminar)
    botonesEliminar.forEach(botonEliminar => {
    botonEliminar.addEventListener('click', () => {
      const productId = botonEliminar.id;
        socket.emit ('delete', productId);
    });
  });
  } catch (error) {
    console.log(error);
  }
});