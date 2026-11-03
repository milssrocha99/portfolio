import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getFirestore,collection,addDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey:
        "AIzaSyD_flf15XxxojXOK6KDQeawjKPHkh6GlKY",
    authDomain:
        "portfolio-ec359.firebaseapp.com",
    projectId:
        "portfolio-ec359",
    storageBucket:
        "portfolio-ec359.firebasestorage.app",
    messagingSenderId:
        "516288439185",
    appId:
        "1:516288439185:web:68cf4127f6439806cd7030"
};
const app =
    initializeApp(
        firebaseConfig
    );
const db =
    getFirestore(
        app
    );
const contactMessages = {
    en: {
        sending: "SENDING...",
        sent: "MESSAGE SENT ✓",
        error: "ERROR SENDING",
        send: "SEND MESSAGE"
    },
    pt: {
        sending: "ENVIANDO...",
        sent: "MENSAGEM ENVIADA ✓",
        error: "ERRO AO ENVIAR",
        send: "ENVIAR MENSAGEM"
    }
};
function getCurrentLanguage() {
    return (
        localStorage.getItem(
            "portfolioLanguage"
        ) || "en"
    );
}
function getContactMessage(key) {
    const lang =
        getCurrentLanguage();
    return (
        contactMessages[lang]?.[key] ||
        contactMessages.en[key]
    );
}
const contactForm =
    document.getElementById(
        "contactForm"
    );
if (contactForm) {
    contactForm.addEventListener(
        "submit",
        async event => {
            event.preventDefault();
            const nameInput =
                document.getElementById(
                    "contactName"
                );
            const emailInput =
                document.getElementById(
                    "contactEmail"
                );
            const messageInput =
                document.getElementById(
                    "contactMessage"
                );
            const sendButton =
                contactForm.querySelector(
                    ".send-button"
                );
            const sendButtonText =
                sendButton.querySelector(
                    "span:first-child"
                );
            const name =
                nameInput.value.trim();
            const email =
                emailInput.value.trim();
            const message =
                messageInput.value.trim();
            if (
                !name ||
                !email ||
                !message
            ) {
                return;
            }
            const originalText =
                sendButtonText.textContent;
            sendButton.disabled =
                true;
            sendButtonText.textContent =
                getContactMessage("sending");
            try {
                await addDoc(
                    collection(
                        db,
                        "messages"
                    ),
                    {
                        name:
                            name,
                        email:
                            email,
                        message:
                            message,
                        createdAt:
                            serverTimestamp(),
                        status:
                            "new"
                    }
                );
                sendButtonText.textContent =
                    getContactMessage("sent");
                contactForm.reset();
                setTimeout(
                    () => {
                        sendButtonText.textContent =
                            originalText;
                    },
                    3000
                );
            }
            catch (error) {
                console.error(
                    "Error sending message:",
                    error
                );
                sendButtonText.textContent =
                    "ERROR";
                setTimeout(
                    () => {
                        sendButtonText.textContent =
                            getContactMessage("send");
                    },
                    3000
                );
            }
            finally {
                sendButton.disabled =
                    false;
            }
        }
    );
}