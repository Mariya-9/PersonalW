//contact form
$("#contact-form").submit(function () {
  var action = $(this).attr("action");

  $("#message").slideUp(750, function () {
    $("#message").hide();

    $("#submit").before("").attr("disabled", "disabled");

    $.post(
      action,
      {
        name: $("#name").val(),
        email: $("#email").val(),
        comments: $("#comments").val(),
      },
      function (data) {
        document.getElementById("message").innerHTML = data;
        $("#message").slideDown("slow");
        $("#cform img.contact-loader").fadeOut("slow", function () {
          $(this).remove();
        });
        $("#submit").removeAttr("disabled");
        if (data.match("success") != null) $("#cform").slideUp("slow");
      }
    );
  });

  return false;
});

document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const action = this.getAttribute("action");
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const comments = document.getElementById("comments").value;

    document.getElementById("message").slideUp(750, function () {
      document.getElementById("message").hide();

      const submitButton = document.getElementById("submit");
      submitButton.before("").setAttribute("disabled", "disabled");

      fetch(action, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `name=${name}&email=${email}&comments=${comments}`,
      })
        .then((response) => response.text())
        .then((data) => {
          document.getElementById("message").innerHTML = data;
          document.getElementById("message").slideDown("slow");
          const loader = document.querySelector("#cform img.contact-loader");
          loader.fadeOut("slow", function () {
            loader.remove();
          });
          submitButton.removeAttribute("disabled");
          if (data.match("success") !== null) {
            document.getElementById("cform").slideUp("slow");
          }
        });
    });
  });
