document.addEventListener("DOMContentLoaded", function () {
  // Use buttons to toggle between views
  document
    .querySelector("#inbox")
    .addEventListener("click", () => load_mailbox("inbox"));
  document
    .querySelector("#sent")
    .addEventListener("click", () => load_mailbox("sent"));
  document
    .querySelector("#archived")
    .addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  // configure the compose form
  document.querySelector("#compose-form").onsubmit = send_email;

  // By default, load the inbox
  load_mailbox("inbox");
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector("#emails-view").style.display = "none";
  document.querySelector("#compose-view").style.display = "block";

  // Clear out composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector("#emails-view").style.display = "block";
  document.querySelector("#compose-view").style.display = "none";
  document.querySelector("#email-view").style.display = "none";

  // Show the mailbox name
  emails_container = document.querySelector("#emails-view");
  emails_container.innerHTML = `<h3>${
    mailbox.charAt(0).toUpperCase() + mailbox.slice(1)
  }</h3>`;

  fetch(`/emails/${mailbox}`)
    .then((response) => response.json())
    .then((emails) => {
      emails.forEach((email) => {
        const emailDiv = document.createElement("div");
        emailDiv.className = "email";
        emailDiv.dataset.id = `${email.id}`;
        emailDiv.innerHTML = `<p>${email.sender}</p>
        <p>${email.subject}</p>
        <p>${email.timestamp}</p>`;
        email.read === true
          ? (emailDiv.style.backgroundColor = "gray")
          : (emailDiv.style.backgroundColor = "white");
        emailDiv.addEventListener("click", () => show_email(email.id));
        emails_container.append(emailDiv);
      });
    });
}

function send_email() {
  // store the required attributes of the email

  const recipients = document.querySelector("#compose-recipients").value;
  const subject = document.querySelector("#compose-subject").value;
  const body = document.querySelector("#compose-body").value;

  // send email
  fetch("/emails", {
    method: "POST",
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    }),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });

  // load the sent mailbox
  load_mailbox("sent");
}

function show_email(email_id) {
  email_container = document.querySelector("#email-view");
  console.log("fetching email");
  fetch(`/emails/${email_id}`)
    .then((response) => response.json())
    .then((email) => {
      document.querySelector("#email-viewTopLeft").innerHTML = `
      <p>From: ${email.sender}</p>
      <small>To: ${email.recipients}</small>`;
      document.querySelector("#email-viewTopRight").innerHTML = `
      <small>${email.timestamp}</small>`;
      document.querySelector("#email-viewSubject").innerHTML = `
      <h5>${email.subject}</h5>`;
      document.querySelector("#email-viewBody").innerHTML = `
      <h6>${email.body}</h6>`;

      document.querySelector("#compose-view").style.display = "none";
      document.querySelector("#emails-view").style.display = "none";
      document.querySelector("#email-view").style.display = "block";
    });
}
