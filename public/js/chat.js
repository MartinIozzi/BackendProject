const socket = io();

const render = async (data) => {
  const messageHtml = document.getElementById('List-Message');
  if (!(data && data.length > 0)) return;
  const containerMessages = document.createElement('div')
  data.forEach(e => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `
      <div class="bg-white rounded">
        <p style="color: rgb(0, 0, 190);">${e.user} : ${e.message}</p>
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