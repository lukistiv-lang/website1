(() => {
  "use strict";

  const contactsSection = document.getElementById("contacts");
  const contactsTitle = document.getElementById("contacts-title");

  const scrollToContacts = () => {
    if (!contactsSection) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    contactsSection.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start"
    });

    if (contactsTitle) {
      contactsTitle.focus({ preventScroll: true });
    }
  };

  document.querySelectorAll('[data-scroll-to="contacts"]').forEach((button) => {
    button.addEventListener("click", scrollToContacts);
  });

  const serviceDetails = {
    repair: {
      desc: "Поставлю петли, поменяю ручки, подтяну расшатанную мебель, поправлю полки и мелкие столярные соединения.",
      items: [
        "Замена и регулировка петель",
        "Замена ручек, крючков, направляющих",
        "Подтяжка и укрепление мебели",
        "Мелкие столярные работы"
      ]
    },
    furniture: {
      desc: "Соберу и разберу корпусную мебель: шкафы, комоды, столы, кровати, стеллажи. Приеду со своим инструментом.",
      items: [
        "Сборка шкафов и комодов",
        "Сборка столов, стульев, кроватей",
        "Разборка и перестановка мебели",
        "Навеска фасадов и полок"
      ]
    },
    plumbing: {
      desc: "Заменю смеситель, сифон, сливной бачок, подключу стиральную машину. Работаю аккуратно, с тряпкой и защитой.",
      items: [
        "Замена смесителей и кранов",
        "Замена сифонов и сливных бачков",
        "Установка и подключение унитаза",
        "Подключение бытовой техники"
      ]
    },
    electric: {
      desc: "Поменяю розетки, выключатели, светильники и автоматы. Сначала проверю проводку, чтобы не было сюрпризов.",
      items: [
        "Замена розеток и выключателей",
        "Установка светильников и люстр",
        "Замена автоматов и пробок",
        "Мелкий ремонт проводки"
      ]
    },
    wall: {
      desc: "Повешу телевизор, зеркало, полку или карниз. Подберу крепёж под бетон, кирпич или гипсокартон.",
      items: [
        "Навеска телевизоров и кронштейнов",
        "Установка зеркал и полок",
        "Монтаж карнизов и жалюзи",
        "Подбор крепежа под основание"
      ]
    },
    locks: {
      desc: "Заменю замок, ручку или доводчик, отрегулирую дверь, чтобы она закрывалась без усилий и не скрипела.",
      items: [
        "Замена дверных замков",
        "Замена и регулировка ручек",
        "Установка доводчиков",
        "Регулировка дверных полотен"
      ]
    }
  };

  const dialog = document.getElementById("service-dialog");

  if (dialog && typeof dialog.showModal === "function") {
    const dialogTitle = document.getElementById("dialog-title");
    const dialogPrice = document.getElementById("dialog-price");
    const dialogDesc = document.getElementById("dialog-desc");
    const dialogList = document.getElementById("dialog-list");
    const dialogIconUse = document.getElementById("dialog-icon-use");
    const dialogCta = dialog.querySelector("[data-dialog-cta]");

    let currentService = "";
    let lastTrigger = null;

    const openService = (id, trigger) => {
      const card = document.querySelector(`.service[data-service="${id}"]`);
      const details = serviceDetails[id];

      if (!card || !details || !dialogTitle || !dialogPrice || !dialogDesc || !dialogList) {
        return;
      }

      currentService = id;
      lastTrigger = trigger;

      dialogTitle.textContent = card.querySelector("h3").textContent;
      dialogPrice.innerHTML = card.querySelector(".service-price").innerHTML;
      dialogDesc.textContent = details.desc;

      if (dialogIconUse) {
        dialogIconUse.setAttribute("href", `#icon-${id}`);
      }

      dialogList.replaceChildren(
        ...details.items.map((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          return li;
        })
      );

      document.body.classList.add("modal-open");
      dialog.showModal();
    };

    document.querySelectorAll("[data-service-open]").forEach((button) => {
      button.addEventListener("click", () => {
        openService(button.dataset.serviceOpen, button);
      });
    });

    dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    dialog.addEventListener("close", () => {
      document.body.classList.remove("modal-open");

      if (lastTrigger) {
        lastTrigger.focus();
        lastTrigger = null;
      }
    });

    if (dialogCta) {
      dialogCta.addEventListener("click", () => {
        const chip = document.querySelector(`.chip input[data-service="${currentService}"]`);

        if (chip) {
          chip.checked = true;
          chip.dispatchEvent(new Event("input", { bubbles: true }));
        }

        lastTrigger = null;
        document.body.classList.remove("modal-open");
        dialog.close();
        scrollToContacts();
      });
    }
  }

  const form = document.getElementById("contact-form");

  if (!form) {
    return;
  }

  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const phoneError = document.getElementById("phone-error");
  const emailError = document.getElementById("email-error");
  const status = document.getElementById("form-status");

  const normalizePhone = (value) => {
    let digits = value.replace(/\D/g, "");

    if (!digits) {
      return "";
    }

    if (digits[0] === "8") {
      digits = "7" + digits.slice(1);
    } else if (digits.length === 10 && digits[0] !== "7") {
      digits = "7" + digits;
    }

    return digits.slice(0, 11);
  };

  const formatPhone = (digits) => {
    if (!digits || digits[0] !== "7") {
      return digits;
    }

    let result = "+7";

    if (digits.length > 1) {
      result += " (" + digits.slice(1, 4);
    }

    if (digits.length === 4) {
      result += ")";
    } else if (digits.length > 4) {
      result += ") " + digits.slice(4, 7);
    }

    if (digits.length > 7) {
      result += "-" + digits.slice(7, 9);
    }

    if (digits.length > 9) {
      result += "-" + digits.slice(9, 11);
    }

    return result;
  };

  const setError = (input, node, message) => {
    node.textContent = message;

    if (message) {
      input.setAttribute("aria-invalid", "true");
    } else {
      input.removeAttribute("aria-invalid");
    }
  };

  const isCompletePhone = (digits) => digits.length === 11 && digits[0] === "7";

  const validatePhone = () => {
    const digits = normalizePhone(phoneInput.value);
    const valid = isCompletePhone(digits);

    setError(phoneInput, phoneError, valid ? "" : "Введите номер полностью: 11 цифр.");
    return valid;
  };

  const validateEmail = () => {
    const value = emailInput.value.trim();
    const valid = !value || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

    setError(emailInput, emailError, valid ? "" : "Проверьте адрес: похоже, в нём опечатка.");
    return valid;
  };

  phoneInput.addEventListener("blur", () => {
    const digits = normalizePhone(phoneInput.value);

    if (isCompletePhone(digits)) {
      phoneInput.value = formatPhone(digits);
    }

    if (phoneInput.getAttribute("aria-invalid") === "true") {
      validatePhone();
    }
  });

  phoneInput.addEventListener("input", () => {
    if (phoneInput.getAttribute("aria-invalid") === "true") {
      validatePhone();
    }
  });

  emailInput.addEventListener("blur", () => {
    if (emailInput.value.trim()) {
      validateEmail();
    }
  });

  emailInput.addEventListener("input", () => {
    if (emailInput.getAttribute("aria-invalid") === "true") {
      validateEmail();
    }
  });

  form.addEventListener("input", () => {
    if (status.textContent) {
      status.textContent = "";
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    const phoneValid = validatePhone();
    const emailValid = validateEmail();

    if (!phoneValid || !emailValid) {
      (phoneValid ? emailInput : phoneInput).focus();
      return;
    }

    phoneInput.value = formatPhone(normalizePhone(phoneInput.value));

    const selectedServices = [...form.querySelectorAll('input[name="service"]:checked')]
      .map((input) => input.value.charAt(0).toLowerCase() + input.value.slice(1));

    // Демо-режим: заявка никуда не отправляется.
    // Для реальной отправки замените этот блок на fetch к Formspree или своему API.
    status.textContent = selectedServices.length
      ? `Заявка отправлена: ${selectedServices.join(", ")}. Перезвоню в течение дня.`
      : "Заявка отправлена. Перезвоню в течение дня.";
    form.reset();
    setError(phoneInput, phoneError, "");
    setError(emailInput, emailError, "");
  });
})();
