const contactForm = document.getElementById("contact-form");
    const contactStatus = document.getElementById("contact-status");
    const contactSubmit = document.getElementById("contact-submit");

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      contactStatus.textContent = "";
      contactStatus.className = "contact-status";
      contactSubmit.disabled = true;
      contactSubmit.textContent = "Sending...";

      const payload = {
        name: contactForm.name.value.trim(),
        email: contactForm.email.value.trim(),
        subject: contactForm.subject.value.trim(),
        message: contactForm.message.value.trim()
      };

      try {
        const response = await fetch("/.netlify/functions/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {
          throw new Error(result.error || "Unable to send message.");
        }

        contactForm.reset();
        contactStatus.textContent = "Your message has been send to us. Please also check your Spam folder";
        contactStatus.classList.add("is-success");
      } catch (error) {
        contactStatus.textContent = "Something went wrong. Please try again.";
        contactStatus.classList.add("is-error");
      } finally {
        contactSubmit.disabled = false;
        contactSubmit.textContent = "Send Message";
      }
    });
