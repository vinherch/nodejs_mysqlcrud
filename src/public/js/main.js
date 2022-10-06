const btnUpdate = document.querySelectorAll(".btn-update");
const btnDelete = document.querySelectorAll(".btn-delete");
const userImg = document.querySelector(".user-img");
const userImgUpload = document.getElementById("user-img-upload");
const userImgMessage = document.getElementById("user-img-message");

//Update user data - Ajax
btnUpdate.forEach((btn) =>
  btn.addEventListener("click", async (e) => {
    //Get selected user data
    const record = btn.parentElement.parentElement;
    const id = btn.parentElement.parentElement.querySelector(".user-id").innerHTML;
    const email = btn.parentElement.parentElement.querySelector(".user-email").innerHTML;
    const firstname = btn.parentElement.parentElement.querySelector(".user-fn").innerHTML;
    const lastname = btn.parentElement.parentElement.querySelector(".user-ln").innerHTML;
    const updated = btn.parentElement.parentElement.querySelector(".user-updated");
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
        record.classList.add("record-error");
        record.addEventListener("animationend", () => {
          record.classList.remove("record-error");
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
btnDelete.forEach((btn) =>
  btn.addEventListener("click", async (e) => {
    //Get selected user ID
    const record = btn.parentElement.parentElement;
    const id = btn.parentElement.parentElement.querySelector(".user-id").innerHTML;
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

//User profile image select
userImgUpload.addEventListener("change", userImgFileHandler);

function userImgFileHandler(event) {
  //Check if a file has been selected
  if (event.target.files.length === 0) return;
  //Get selected image. Check data type
  const profileImg = event.target.files[0];

  if (!checkFileType(event.target.files[0].type)) {
    userImgMessage.textContent = "Please select an image file.";
    return;
  }

  //Check size
  if (profileImg.size > 200000) {
    userImgMessage.textContent = "Max supported image size: < 200Kb.";
    return;
  }
  //Select & remove default avatar
  const avatar = document.querySelector(".avatar");
  if (avatar) avatar.remove();
  //Create image

  const image = document.createElement("img");
  image.src = URL.createObjectURL(profileImg);
  userImg.appendChild(image);
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
