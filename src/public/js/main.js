const usersBtnUpdate = document.querySelectorAll(".users-btn-update");
const usersBtnDelete = document.querySelectorAll(".users-btn-delete");

const crtUserImgUpload = document.getElementById("crt-user-img-upload");
const crtUserImg = document.getElementById("crt-user-img");
const userImgMessage = document.getElementById("crt-user-img-msg");
const mobileUserCards = document.querySelectorAll(".mb-user-card");

//User overview - update user data
usersBtnUpdate.forEach((btn) =>
  btn.addEventListener("click", async (e) => {
    const record = btn.parentElement.parentElement;
    const id = btn.parentElement.parentElement.querySelector(".users-th-id").innerHTML;
    const email = btn.parentElement.parentElement.querySelector(".users-td-email").innerHTML;
    const firstname = btn.parentElement.parentElement.querySelector(".users-td-firstname").innerHTML;
    const lastname = btn.parentElement.parentElement.querySelector(".users-td-lastname").innerHTML;
    const updated = btn.parentElement.parentElement.querySelector(".users-td-updated");
    //Ajax request
    await updateUser({ id, email, firstname, lastname })
      .then((response) => {
        //Check response code
        if (response.ok) {
          //Success animation
          record.classList.add("record-success");
          record.addEventListener("animationend", () => {
            record.classList.remove("record-success");
          });
          //Extract data
          response.json().then((data) => {
            //Update Form timestamp
            updated.innerHTML = data[0].updated;
          });
        }
      })
      .catch((error) => {
        console.log(error);
        //Error animation
        record.classList.add("users-record-error");
        record.addEventListener("animationend", () => {
          record.classList.remove("users-record-error");
        });
      });
  })
);

async function updateUser(user) {
  try {
    const response = await fetch(`/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    return response;
  } catch (error) {
    return error;
  }
}

//Delete user data - Ajax
usersBtnDelete.forEach((btn) =>
  btn.addEventListener("click", async (e) => {
    //Get user
    const record = btn.parentElement.parentElement;
    const id = btn.parentElement.parentElement.querySelector(".users-th-id").innerHTML;
    //Ajax request
    await deleteUser(id)
      .then((response) => {
        //Check response code - remove user record
        if (response.ok) {
          record.remove();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  })
);

async function deleteUser(id) {
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

//User image select
crtUserImgUpload.addEventListener("change", userImgFileHandler);

function userImgFileHandler(event) {
  //Check if a file has been selected
  if (event.target.files.length === 0) return;
  //Get selected image. Check data type
  const userImg = event.target.files[0];

  if (!checkFileType(event.target.files[0].type)) {
    userImgMessage.textContent = "Please select an image file.";
    return;
  }

  //Check size
  if (userImg.size > 200000) {
    userImgMessage.textContent = "Max supported image size: < 200Kb.";
    return;
  }
  //Select & remove default avatar
  const avatar = document.querySelector(".crt-user-avatar");
  if (avatar) avatar.remove();
  //Create image
  const image = document.createElement("img");
  image.src = URL.createObjectURL(userImg);
  crtUserImg.appendChild(image);
}

//Check file type for user profile image
function checkFileType(type) {
  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/jpg",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];
  return fileTypes.includes(type);
}

//Mobile View User Edit
mobileUserCards.forEach((element) => {
  element.addEventListener("click", (ev) => {
    element.children[0].classList.toggle("mb-user-card-control-expand");
    element.children[1].classList.toggle("blurred");
  });
});
