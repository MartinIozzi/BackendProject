(() => {  //funcion autoinvocada
  const socket = io();

  const render = async (data) => {
    const messageHtml = document.getElementById('List-Message');
    messageHtml.innerHTML = ""; //SE TIENEN QUE BORRAR

    if (!(data && data.length > 0)) return;
    const containerMessages = document.createElement('div');
    data.forEach(e => {
      const messageElement = document.createElement('div');
      messageElement.innerHTML = `
        <div class="rounded cont-user-message">
          <p class="cont-user">${e.user}</p>
          <p class="cont-message"> ${e.message}</p>
        <div>`;
      containerMessages.append(messageElement);
    });
    messageHtml.appendChild(containerMessages);

  };
  
  socket.on('List-Message', (data) => {
    try {
      render(data);
    } catch (error) {
      console.error('Error during rendering:', error);
    }
  });

  function sendMessage(user, message) {
    //AJAX de mierda
    return new Promise((resolve, reject) => {
      const url = window.location.origin + "/chat" // asignando que la url sea la correspondiente y le agregue "/chat"  //window.location.origin toma lo primero de la url, el localhost

      let data = new URLSearchParams(); //
      data.append("user", user) 
      data.append("message", message)

      let req = new XMLHttpRequest()
      req.open("POST", url)

      req.send(data)
    })
  }

  function messageFunction() {
    let div = document.getElementById('container-message');
    let username = div.getAttribute("name");
    div.removeAttribute("name");
    let message = div.querySelector("#message")

    div.querySelector('#send').addEventListener('click', () => {
      sendMessage(username, message.value)
      message.value = "";
    })
  }

  messageFunction();

})();