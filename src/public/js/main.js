const usersBtnDelete = document.querySelectorAll(".users-btn-delete");
const crtUserImgUpload = document.getElementById("crt-user-img-upload");
const crtUserImg = document.getElementById("crt-user-img");
const crtUserForm = document.querySelector(".crt-user-form");
const crtUserFormSubmit = document.querySelector(".crt-user-submit button");
const updateUserFormSubmit = document.querySelector(".update-user-submit button");
const userImgMessage = document.getElementById("crt-user-img-msg");
const mobileUserCards = document.querySelectorAll(".mb-user-card");
const btnDeleteMobileCard = document.querySelectorAll(".mb-user-card-btn-delete");
const crtUserEmail = document.querySelector("#crt-user-email");
const crtUserFirstname = document.querySelector("#crt-user-firstname");
const crtUserLastname = document.querySelector("#crt-user-lastname");
const userID = document.querySelector("#user-id");
const errorMessageContainerBtn = document.querySelector(".error-msg-container button");

/* Create new user - User Form */
if (crtUserFormSubmit)
  crtUserFormSubmit.addEventListener("click", () => {
    crtUserForm.method = "post";
    crtUserForm.action = "/users/create";
    crtUserForm.submit();
    crtUserForm.reset();
  });

/* Update existing user - User Form */
if (updateUserFormSubmit)
  updateUserFormSubmit.addEventListener("click", () => {
    crtUserForm.method = "post";
    crtUserForm.action = `/users/update/${userID.textContent}`;
    crtUserForm.submit();
    crtUserForm.reset();
  });

/* User Form - Check for valid email - Input EventListener */
if (crtUserEmail)
  crtUserEmail.addEventListener("focusout", (e) => {
    if (!checkEmail(e.target.value)) {
      crtUserEmail.classList.add("error-input");
      return;
    }
    crtUserEmail.classList.remove("error-input");
  });

/* Check for valid email */
const checkEmail = (value) => {
  const regex = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
  if (regex.test(value)) {
    return true;
  }
  return false;
};

/* User Form - Check input values */
if (crtUserFirstname)
  crtUserFirstname.addEventListener("focusout", (e) => {
    if (e.target.value === "") {
      crtUserFirstname.classList.add("error-input");
      return;
    }
    crtUserFirstname.classList.remove("error-input");
  });

if (crtUserLastname)
  crtUserLastname.addEventListener("focusout", (e) => {
    if (e.target.value === "") {
      crtUserLastname.classList.add("error-input");
      return;
    }
    crtUserLastname.classList.remove("error-input");
  });

/* Handling delete user - Desktop View */
usersBtnDelete.forEach((btn) =>
  btn.addEventListener("click", async (e) => {
    const record = btn.parentElement.parentElement;
    const id = record.querySelector(".users-th-id").innerHTML;
    await deleteUser(id)
      .then((response) => {
        if (response.ok) {
          record.remove();
          location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  })
);

/* Handling delete user - Mobile View */
btnDeleteMobileCard.forEach((btn) =>
  btn.addEventListener("click", async (e) => {
    const userCard = btn.parentElement.parentElement.parentElement;
    const id = userCard.querySelector("#mb-user-card-id").innerHTML;
    await deleteUser(id)
      .then((response) => {
        if (response.ok) {
          userCard.remove();
          location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  })
);

async function deleteUser(id) {
  // Delete confirmation
  if (window.confirm("Do you really want to delete this user?")) {
    try {
      const response = await fetch(`/users/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      return response;
    } catch (error) {
      return error;
    }
  }
}

/* Handling user image select */
if (crtUserImgUpload) crtUserImgUpload.addEventListener("change", userImgFileHandler);

function userImgFileHandler(event) {
  //Check if a file has been selected
  if (event.target.files.length === 0) return;
  //Get selected image. Check data type
  const userImg = event.target.files[0];
  if (!checkFileType(event.target.files[0].type)) {
    userImgMessage.textContent = "Please select an image file.";
    return;
  }
  //Check file size
  if (userImg.size > 200000) {
    window.alert("Max supported image size: < 200Kb.");
    return;
  }
  //Remove default avatar if an image has been selected
  const avatar = document.querySelector(".crt-user-avatar");
  if (avatar) avatar.remove();
  //Create image
  const image = document.createElement("img");
  image.src = URL.createObjectURL(userImg);
  crtUserImg.appendChild(image);
}

/* File handling for user image select */
function checkFileType(type) {
  const fileTypes = ["image/apng", "image/bmp", "image/jpg", "image/gif", "image/jpeg", "image/pjpeg", "image/png", "image/svg+xml", "image/tiff", "image/webp", "image/x-icon"];
  return fileTypes.includes(type);
}

/* Control User Edit - Mobile View */
mobileUserCards.forEach((element) => {
  element.addEventListener("click", (ev) => {
    element.children[0].classList.toggle("mb-user-card-control-expand");
    element.children[1].classList.toggle("blurred");
  });
});

/* Handling Error Message - Close message */
if (errorMessageContainerBtn)
  errorMessageContainerBtn.addEventListener("click", (e) => {
    e.target.parentElement.remove();
  });
