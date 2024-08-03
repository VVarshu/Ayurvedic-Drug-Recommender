document.addEventListener("DOMContentLoaded", function () {
    const chatWindow = document.getElementById("chat-window");
    const userInput = document.getElementById("user-input");
  
    // Initial message
    displayMessage("Welcome! Please ask about an Ayurvedic medicine.", "bot");
  
    // Fetch medicines data from server
    fetch("/api/diseases")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch diseases");
        }
        return response.json();
      })
      .then((data) => {
        window.diseases = data;
        displayMessage(
          "Data has been loaded. You can now ask about Ayurvedic medicines.",
          "bot"
        );
      })
      .catch((error) => {
        console.error("Error fetching diseases:", error);
        displayMessage("Sorry, something went wrong while fetching data.", "bot");
      });
  
    function sendMessage() {
      const userInputValue = userInput.value.trim().toLowerCase();
  
      if (userInputValue.length === 0) {
        return;
      }
  
      // Display user input in the chat window
      displayMessage(userInputValue, "user");
  
      // Fetch data based on user input from server
      fetch(`/api/diseases/${userInputValue}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Disease not found");
          }
          return response.json();
        })
        .then((medicines) => {
          if (medicines.length === 0) {
            displayMessage(
              `No specific treatments found for ${userInputValue}.`,
              "bot"
            );
          } else {
            medicines.forEach((medicine) => {
              displayMessage(formatMedicineDetails(medicine), "bot");
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching medicines:", error);
          displayMessage(
            `I'm sorry, I don't understand that. Please ask about a specific Ayurvedic medicine or treatment.`,
            "bot"
          );
        });
  
      // Clear input field after sending message
      userInput.value = "";
    }
  
    function displayMessage(message, sender) {
      const messageDiv = document.createElement("div");
      messageDiv.className = "message " + sender + "-message";
      messageDiv.innerHTML = message;
      chatWindow.appendChild(messageDiv);
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }
  
    function formatMedicineDetails(medicine) {
      let googleSearchLink = `https://www.google.com/search?q=${encodeURIComponent(
        medicine.name + " Ayurvedic medicine"
      )}`;
      let properties = medicine.properties
        .map((prop) => `<li>${prop}</li>`)
        .join("");
      let uses = medicine.uses.map((use) => `<li>${use}</li>`).join("");
      let treatments = medicine.treatments
        .map((t) => `<li><strong>${t.disease}:</strong> ${t.details}</li>`)
        .join("");
  
      return `
              <div>
                  <h3>${medicine.name} <a href="${googleSearchLink}" target="_blank">(More details)</a></h3>
                  <p><strong>Properties:</strong></p>
                  <ul>${properties}</ul>
                  <p><strong>Uses:</strong></p>
                  <ul>${uses}</ul>
                  <p><strong>Treatments:</strong></p>
                  <ul>${treatments}</ul>
              </div>
          `;
    }
  
    // Event listener for send button
    const sendButton = document.getElementById("sendButton");
    sendButton.addEventListener("click", sendMessage);
  
    // Optional: Handle enter key press in the input field
    userInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        sendMessage();
      }
    });
  });
  