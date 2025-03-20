// Google Apps Script URL (replace with your deployed URL)
const scriptUrl =
  "https://script.google.com/macros/s/AKfycbxJBLKuW06lja2TAqZySKREd6kqjng0FtVrXTHkvB73DgqrjzG-afJF8pP25nkN4atn/exec";

// Typing Animation for "Ask Your Question"
const typingText = document.getElementById("typing-text");
const text = "Ask Your Question";
let index = 0;

function type() {
  if (index < text.length) {
    typingText.textContent += text.charAt(index);
    index++;
    setTimeout(type, 100); // Adjust typing speed here
  }
}

type();

// Function to fetch Q&A from Google Sheet
async function fetchQAList() {
  try {
    const response = await fetch(`${scriptUrl}?action=get`);
    const qaList = await response.json();
    const qaListContainer = document.getElementById("qa-list");
    qaListContainer.innerHTML = qaList
      .filter((qa1) => qa1.answer != "")
      .map(
        (qa) => `
          <div class="qa-item">
            <p><strong>Q:</strong> ${qa.question}</p>
            ${qa.answer ? `<p><strong>A:</strong> ${qa.answer}</p>` : ""}
          </div>
        `
      )
      .join("");
  } catch (error) {
    console.error("Error fetching Q&A:", error);
  }
}

// Function to send question to Google Sheet
async function sendQuestion(name, question) {
  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify({ question: `${name}: ${question}` }),
    });
    if (response.ok) {
      alert(
        `Thank you, ${name}! Question sent successfully. We will answer your question shortly.`
      );
      fetchQAList(); // Refresh Q&A list
    }
  } catch (error) {
    console.error("Error sending question:", error);
  }
}

// Form Submission Handling
document
  .getElementById("question-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const question = document.getElementById("question").value;
    sendQuestion(name, question);
    // Format the message
    const message = `Hi, I'm ${name}. My question is: ${question}`;

    // Encode the message for WhatsApp
    const encodedMessage = encodeURIComponent(message);

    // Replace with your WhatsApp number
    const whatsappUrl = `https://wa.me/9527526222?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    document.getElementById("question-form").reset();
  });

// Fetch Q&A on page load
fetchQAList();
