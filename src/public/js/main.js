const btnUpdate = document.querySelectorAll(".btn-update");
const btnDelete = document.querySelectorAll(".btn-delete");

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

//Update user data
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

//Delete user data
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
